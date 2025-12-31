import {
  CallControls,
  CallingState,
  SpeakerLayout,
  useCallStateHooks,
} from "@stream-io/video-react-sdk";
import { Loader2Icon, MessageSquareIcon, UsersIcon, XIcon } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Channel, Chat, MessageInput, MessageList, Thread, Window } from "stream-chat-react";

import "@stream-io/video-react-sdk/dist/css/styles.css";
import "stream-chat-react/dist/css/v2/index.css";

function VideoCallUI({ chatClient, channel }) {
  const navigate = useNavigate();
  const { useCallCallingState, useParticipants, useLocalParticipant } = useCallStateHooks();
  const callingState = useCallCallingState();
  const participants = useParticipants();
  const localParticipant = useLocalParticipant();
  const [isChatOpen, setIsChatOpen] = useState(false);
  
  // Filter out duplicate participants and count unique remote participants
  const [uniqueParticipantCount, setUniqueParticipantCount] = useState(1); // Start with 1 for local user
  
  useEffect(() => {
    if (!participants || !localParticipant) return;
    
    // Create a Set of unique user IDs to remove duplicates
    const uniqueUserIds = new Set();
    
    // Add local participant
    if (localParticipant.userId) {
      uniqueUserIds.add(localParticipant.userId);
    }
    
    // Add remote participants, excluding any that match local user ID
    participants.forEach(participant => {
      if (participant.userId && participant.userId !== localParticipant.userId) {
        uniqueUserIds.add(participant.userId);
      }
    });
    
    // Update the count
    setUniqueParticipantCount(uniqueUserIds.size);
    
    // Debug log to help identify duplicates
    console.log('Participants debug:', {
      totalParticipants: participants.length,
      uniqueUserIds: Array.from(uniqueUserIds),
      uniqueCount: uniqueUserIds.size,
      localUserId: localParticipant.userId,
      participantIds: participants.map(p => p.userId)
    });
    
  }, [participants, localParticipant]);

  if (callingState === CallingState.JOINING || callingState === CallingState.RECONNECTING) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <Loader2Icon className="w-12 h-12 mx-auto animate-spin text-primary mb-4" />
          <p className="text-lg">
            {callingState === CallingState.JOINING ? "Joining call..." : "Reconnecting..."}
          </p>
        </div>
      </div>
    );
  }

  if (callingState !== CallingState.JOINED) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 mx-auto animate-spin rounded-full border-4 border-primary border-t-transparent mb-4" />
          <p className="text-lg">Connecting to call...</p>
          <p className="text-sm text-gray-400 mt-2">Status: {callingState}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex gap-3 relative str-video">
      <div className="flex-1 flex flex-col gap-3">
        {/* Participants count badge and Chat Toggle */}
        <div className="flex items-center justify-between gap-2 bg-base-100 p-3 rounded-lg shadow">
          <div className="flex items-center gap-2">
            <UsersIcon className="w-5 h-5 text-primary" />
            <span className="font-semibold">
              {uniqueParticipantCount} {uniqueParticipantCount === 1 ? "participant" : "participants"}
            </span>
            <span className="text-xs text-gray-500 ml-2">
              ({participants.length + 1} total connections)
            </span>
          </div>
          {chatClient && channel && (
            <button
              onClick={() => setIsChatOpen(!isChatOpen)}
              className={`btn btn-sm gap-2 ${isChatOpen ? "btn-primary" : "btn-ghost"}`}
              title={isChatOpen ? "Hide chat" : "Show chat"}
            >
              <MessageSquareIcon className="size-4" />
              Chat
            </button>
          )}
        </div>

        <div className="flex-1 bg-base-300 rounded-lg overflow-hidden relative">
          <SpeakerLayout />
        </div>

        <div className="bg-base-100 p-3 rounded-lg shadow flex justify-center">
          <CallControls onLeave={() => navigate("/dashboard")} />
        </div>
      </div>

      {/* CHAT SECTION */}
      {chatClient && channel && (
        <div
          className={`flex flex-col rounded-lg shadow overflow-hidden bg-[#272a30] transition-all duration-300 ease-in-out ${
            isChatOpen ? "w-80 opacity-100" : "w-0 opacity-0"
          }`}
        >
          {isChatOpen && (
            <>
              <div className="bg-[#1c1e22] p-3 border-b border-[#3a3d44] flex items-center justify-between">
                <h3 className="font-semibold text-white">Session Chat</h3>
                <button
                  onClick={() => setIsChatOpen(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                  title="Close chat"
                >
                  <XIcon className="size-5" />
                </button>
              </div>
              <div className="flex-1 overflow-hidden stream-chat-dark">
                <Chat client={chatClient} theme="str-chat__theme-dark">
                  <Channel channel={channel}>
                    <Window>
                      <MessageList />
                      <MessageInput />
                    </Window>
                    <Thread />
                  </Channel>
                </Chat>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default VideoCallUI;