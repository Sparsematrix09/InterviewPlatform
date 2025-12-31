import { chatClient, streamClient } from "../lib/stream.js";
import Session from "../models/Session.js";

export async function createSession(req, res) {
  try {
    const { problem, difficulty } = req.body;
    const userId = req.user._id;
    const clerkId = req.user.clerkId;

    if (!problem || !difficulty) {
      return res.status(400).json({ message: "Problem and difficulty are required" });
    }

    // Convert difficulty to lowercase to match enum
    const normalizedDifficulty = difficulty.toLowerCase();
    
    // Validate it's one of the allowed values
    const validDifficulties = ['easy', 'medium', 'hard'];
    if (!validDifficulties.includes(normalizedDifficulty)) {
      return res.status(400).json({ 
        message: `Invalid difficulty. Must be one of: ${validDifficulties.join(', ')}` 
      });
    }

    // generate a unique call id for stream video
    const callId = `session_${Date.now()}_${Math.random().toString(36).substring(7)}`;

    // create session in db
    const session = await Session.create({ 
      problem, 
      difficulty: normalizedDifficulty,
      host: userId, 
      callId 
    });

    // create stream video call
    await streamClient.video.call("default", callId).getOrCreate({
      data: {
        created_by_id: clerkId,
        custom: { 
          problem, 
          difficulty: normalizedDifficulty, 
          sessionId: session._id.toString() 
        },
      },
    });

    // chat messaging
    const channel = chatClient.channel("messaging", callId, {
      name: `${problem} Session`,
      created_by_id: clerkId,
      members: [clerkId],
    });

    await channel.create();

    // Get populated session to return
    const populatedSession = await Session.findById(session._id)
      .populate("host", "name email profileImage clerkId");

    res.status(201).json({ session: populatedSession });
  } catch (error) {
    console.log("Error in createSession controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function getActiveSessions(_, res) {
  try {
    console.log("=== BACKEND DEBUG: getActiveSessions ===");
    console.log("Querying for status: 'Ongoing'");
    
    // Check if sessions have host populated
    const sessions = await Session.find({ status: "Ongoing" })
      .populate("host", "name profileImage email clerkId")
      .populate("participant", "name profileImage email clerkId")
      .sort({ createdAt: -1 })
      .limit(20);

    console.log("Final result count:", sessions.length);
    console.log("=== END DEBUG ===");

    res.status(200).json({ sessions });
  } catch (error) {
    console.log("Error in getActiveSessions controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function getMyRecentSessions(req, res) {
  try {
    console.log("=== BACKEND DEBUG: getMyRecentSessions ===");
    console.log("User from request:", req.user);
    console.log("User ID:", req.user?._id);
    console.log("User clerkId:", req.user?.clerkId);
    
    const userId = req.user._id;

    // Get sessions where user is either host or participant
    const sessions = await Session.find({
      $or: [{ host: userId }, { participant: userId }],
    })
      .populate("host", "name profileImage email clerkId")
      .populate("participant", "name profileImage email clerkId")
      .sort({ createdAt: -1 })
      .limit(20);

    console.log(`Found ${sessions.length} sessions for user`);
    console.log("=== END DEBUG ===");
    
    res.status(200).json({ sessions });
  } catch (error) {
    console.log("Error in getMyRecentSessions controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function getSessionById(req, res) {
  try {
    const { id } = req.params;

    const session = await Session.findById(id)
      .populate("host", "name email profileImage clerkId")
      .populate("participant", "name email profileImage clerkId");

    if (!session) return res.status(404).json({ message: "Session not found" });

    res.status(200).json({ session });
  } catch (error) {
    console.log("Error in getSessionById controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function joinSession(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    const clerkId = req.user.clerkId;

    console.log(`🔔 joinSession called for session ${id} by user ${clerkId}`);

    // Find session without populate first
    const session = await Session.findById(id);
    
    if (!session) {
      console.log(`❌ Session ${id} not found`);
      return res.status(404).json({ message: "Session not found" });
    }

    // Check if session is ongoing
    if (session.status !== "Ongoing") {
      console.log(`❌ Session ${id} is not Ongoing, status is: ${session.status}`);
      return res.status(400).json({ message: "Cannot join a completed session" });
    }

    // Check if user is already the host
    if (session.host.toString() === userId.toString()) {
      console.log(`❌ User ${clerkId} is already the host of session ${id}`);
      return res.status(400).json({ 
        message: "Host cannot join their own session as participant",
        session: await Session.findById(id)
          .populate("host", "name email profileImage clerkId")
          .populate("participant", "name email profileImage clerkId")
      });
    }

    // Check if session already has a participant
    if (session.participant) {
      // If the participant is the same user, return success
      if (session.participant.toString() === userId.toString()) {
        console.log(`✅ User ${clerkId} is already a participant in session ${id}`);
        const populatedSession = await Session.findById(id)
          .populate("host", "name email profileImage clerkId")
          .populate("participant", "name email profileImage clerkId");
        
        return res.status(200).json({ 
          session: populatedSession,
          message: "Already a participant in this session"
        });
      }
      
      console.log(`❌ Session ${id} already has participant: ${session.participant}`);
      return res.status(409).json({ message: "Session is full" });
    }

    console.log(`✅ Adding user ${clerkId} as participant to session ${id}`);
    
    // Update session with participant
    session.participant = userId;
    await session.save();

    // Add user to Stream video call
    try {
      const call = streamClient.video.call("default", session.callId);
      await call.update({
        data: {
          custom: {
            ...(call.custom || {}),
            participants: [session.host.toString(), userId.toString()]
          }
        }
      });
    } catch (streamError) {
      console.log("Warning: Could not update Stream call:", streamError.message);
    }

    // Add user to chat channel
    try {
      const channel = chatClient.channel("messaging", session.callId);
      await channel.addMembers([clerkId]);
    } catch (chatError) {
      console.log("Warning: Could not add user to chat channel:", chatError.message);
    }

    // Get the updated session with populated fields
    const populatedSession = await Session.findById(id)
      .populate("host", "name email profileImage clerkId")
      .populate("participant", "name email profileImage clerkId");

    console.log(`✅ User ${clerkId} successfully joined session ${id}`);
    
    res.status(200).json({ 
      session: populatedSession,
      message: "Successfully joined the session!"
    });
    
  } catch (error) {
    console.log("❌ Error in joinSession controller:", error.message);
    console.log("Error stack:", error.stack);
    
    // Check if it's a validation error
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      console.log("Validation errors:", errors);
      
      // If it's a difficulty validation error, fix it
      if (error.errors.difficulty) {
        try {
          // Try to fix the session difficulty
          const session = await Session.findById(req.params.id);
          if (session) {
            const validDifficulties = ['easy', 'medium', 'hard'];
            if (session.difficulty && !validDifficulties.includes(session.difficulty.toLowerCase())) {
              session.difficulty = session.difficulty.toLowerCase();
              await session.save();
              
              // Retry the join operation
              return joinSession(req, res);
            }
          }
        } catch (fixError) {
          console.log("Could not auto-fix difficulty:", fixError.message);
        }
      }
      
      return res.status(400).json({ 
        message: "Validation error",
        errors 
      });
    }
    
    res.status(500).json({ 
      message: "Internal Server Error",
      error: error.message 
    });
  }
}

export async function endSession(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const session = await Session.findById(id);

    if (!session) return res.status(404).json({ message: "Session not found" });

    // check if user is the host
    if (session.host.toString() !== userId.toString()) {
      return res.status(403).json({ message: "Only the host can end the session" });
    }

    // check if session is already completed
    if (session.status === "Completed") {
      return res.status(400).json({ message: "Session is already completed" });
    }

    // delete stream video call
    try {
      const call = streamClient.video.call("default", session.callId);
      await call.delete({ hard: true });
    } catch (streamError) {
      console.log("Warning: Could not delete Stream call:", streamError.message);
    }

    // delete stream chat channel
    try {
      const channel = chatClient.channel("messaging", session.callId);
      await channel.delete();
    } catch (chatError) {
      console.log("Warning: Could not delete chat channel:", chatError.message);
    }

    session.status = "Completed";
    await session.save();

    // Get populated session
    const populatedSession = await Session.findById(id)
      .populate("host", "name email profileImage clerkId")
      .populate("participant", "name email profileImage clerkId");

    res.status(200).json({ 
      session: populatedSession, 
      message: "Session ended successfully" 
    });
  } catch (error) {
    console.log("Error in endSession controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}