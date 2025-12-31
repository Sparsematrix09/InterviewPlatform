import {
  ArrowRight,
  Code2,
  Crown,
  Sparkles,
  Users,
  Zap,
  Loader2,
  Circle,
} from "lucide-react";
import { Link } from "react-router-dom";
import { getDifficultyBadgeClass } from "../lib/utils";

function ActiveSessions({ sessions, isLoading, isUserInSession }) {
  return (
    <div className="lg:col-span-2 bg-gray-900/50 border border-gray-800 rounded-xl p-6">
      {/* HEADER SECTION */}
      <div className="flex items-center justify-between mb-6">
        {/* TITLE AND ICON */}
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 p-2 rounded-lg">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-xl font-bold text-white">Live Sessions</h2>
        </div>

        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
          <span className="text-sm font-medium text-emerald-400">
            {sessions.length} active
          </span>
        </div>
      </div>

      {/* SESSIONS LIST */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
          </div>
        ) : sessions.length > 0 ? (
          sessions.map((session) => (
            <div
              key={session._id}
              className="bg-gray-800/50 border border-gray-700 rounded-xl p-5 hover:border-emerald-500/50 transition-colors"
            >
              <div className="flex items-center justify-between gap-4">
                {/* LEFT SIDE */}
                <div className="flex items-center gap-4 flex-1">
                  <div className="relative">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center">
                      <Code2 className="w-6 h-6 text-white" />
                    </div>
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-gray-900"></div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-bold text-white truncate">
                        {session.problem || 'Technical Interview'}
                      </h3>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${getDifficultyBadgeClass(
                          session.difficulty
                        )}`}
                      >
                        {session.difficulty?.charAt(0).toUpperCase() + session.difficulty?.slice(1) || 'Easy'}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-sm text-gray-400">
                      <div className="flex items-center gap-1.5">
                        <Crown className="w-4 h-4" />
                        <span className="font-medium">{session.host?.name || 'Host'}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Users className="w-4 h-4" />
                        <span>{session.participant ? "2/2" : "1/2"}</span>
                      </div>
                      {session.participant && !isUserInSession(session) ? (
                        <span className="px-2 py-1 bg-red-900/30 text-red-400 text-xs font-medium rounded">
                          FULL
                        </span>
                      ) : (
                        <span className="px-2 py-1 bg-emerald-900/30 text-emerald-400 text-xs font-medium rounded">
                          OPEN
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* JOIN BUTTON */}
                {session.participant && !isUserInSession(session) ? (
                  <button 
                    className="px-4 py-2 bg-gray-700 text-gray-400 rounded-lg font-medium cursor-not-allowed"
                    disabled
                  >
                    Full
                  </button>
                ) : (
                  <Link 
                    to={`/session/${session._id}`} 
                    className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white rounded-lg font-medium flex items-center gap-2 transition-all duration-300"
                  >
                    {isUserInSession(session) ? "Rejoin" : "Join"}
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12">
            <div className="inline-flex p-4 bg-gray-800/50 rounded-full mb-4">
              <Sparkles className="w-12 h-12 text-gray-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-300 mb-2">No active sessions</h3>
            <p className="text-gray-500">Be the first to create one!</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ActiveSessions;