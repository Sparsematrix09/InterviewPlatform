import { useState, useEffect, useRef } from "react";
import { StreamChat } from "stream-chat";
import toast from "react-hot-toast";
import { initializeStreamClient, disconnectStreamClient } from "../lib/stream";
import { sessionApi } from "../api/sessions";

function useStreamClient(session, loadingSession, isHost, isParticipant) {
  const [streamClient, setStreamClient] = useState(null);
  const [call, setCall] = useState(null);
  const [chatClient, setChatClient] = useState(null);
  const [channel, setChannel] = useState(null);
  const [isInitializingCall, setIsInitializingCall] = useState(true);
  
  // Use refs to track initialization state and prevent duplicates
  const isInitializedRef = useRef(false);
  const callIdRef = useRef(null);

  useEffect(() => {
    let videoCall = null;
    let chatClientInstance = null;

    const initCall = async () => {
      // Prevent duplicate initialization
      if (isInitializedRef.current && callIdRef.current === session?.callId) {
        setIsInitializingCall(false);
        return;
      }
      
      if (!session?.callId) return;
      if (!isHost && !isParticipant) return;
      if (session.status === "completed") return;

      try {
        setIsInitializingCall(true);
        
        const { token, userId, userName, userImage } = await sessionApi.getStreamToken();

        const client = await initializeStreamClient(
          {
            id: userId,
            name: userName,
            image: userImage,
          },
          token
        );

        setStreamClient(client);

        videoCall = client.call("default", session.callId);
        
        // Check if call already exists before joining
        try {
          await videoCall.get();
          // Call exists, join it
          await videoCall.join();
        } catch (error) {
          // Call doesn't exist, create it with proper member data
          await videoCall.join({ 
            create: true,
            data: {
              // Set custom data to help identify participants
              custom: {
                sessionId: session.id,
                hostId: session.host?.clerkId,
                participantId: session.participant?.clerkId,
              },
              // Explicitly set members to prevent duplication
              members: [
                { 
                  user_id: userId, 
                  role: isHost ? "host" : "user" 
                }
              ]
            }
          });
        }
        
        setCall(videoCall);
        callIdRef.current = session.callId;

        const apiKey = import.meta.env.VITE_STREAM_API_KEY;
        
        // Get existing StreamChat instance or create new one
        chatClientInstance = StreamChat.getInstance(apiKey);
        
        // Only connect if not already connected
        if (!chatClientInstance.userID) {
          await chatClientInstance.connectUser(
            {
              id: userId,
              name: userName,
              image: userImage,
            },
            token
          );
        }
        
        setChatClient(chatClientInstance);

        const chatChannel = chatClientInstance.channel("messaging", session.callId);
        
        // Ensure channel has proper member data
        if (!chatChannel.data?.members?.some(m => m.user_id === userId)) {
          await chatChannel.create();
        }
        
        await chatChannel.watch();
        setChannel(chatChannel);
        
        isInitializedRef.current = true;
        
      } catch (error) {
        console.error("Error initializing call:", error);
        toast.error("Failed to join video call");
      } finally {
        setIsInitializingCall(false);
      }
    };

    if (session && !loadingSession) {
      initCall();
    } else {
      setIsInitializingCall(false);
    }

    // cleanup - performance reasons
    return () => {
      // Only cleanup if we're not just updating the same call
      if (callIdRef.current !== session?.callId) {
        (async () => {
          try {
            if (videoCall) {
              await videoCall.leave().catch(console.error);
            }
            if (chatClientInstance) {
              await chatClientInstance.disconnectUser().catch(console.error);
            }
            await disconnectStreamClient().catch(console.error);
            
            // Reset refs
            isInitializedRef.current = false;
            callIdRef.current = null;
          } catch (error) {
            console.error("Cleanup error:", error);
          }
        })();
      }
    };
  }, [session, loadingSession, isHost, isParticipant]);

  return {
    streamClient,
    call,
    chatClient,
    channel,
    isInitializingCall,
  };
}

export default useStreamClient;