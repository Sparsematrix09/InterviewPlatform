import { Code2, Clock, Users, Trophy, Loader2 } from "lucide-react";
import { getDifficultyBadgeClass } from "../lib/utils";

function RecentSessions({ sessions, isLoading }) {
  const formatTime = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    
    if (diffHours < 24) {
      return `${diffHours}h ago`;
    }
    
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="mt-8">
      <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg">
            <Clock className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-xl font-bold text-white">Your Past Sessions</h2>
        </div>

        {/* Sessions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {isLoading ? (
            <div className="col-span-full flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
            </div>
          ) : sessions.length > 0 ? (
            sessions.map((session) => (
              <div
                key={session._id}
                className={`bg-gray-800/50 border rounded-xl transition-colors ${
                  session.status === "active"
                    ? "border-emerald-700/50 hover:border-emerald-600 bg-emerald-900/10"
                    : "border-gray-700 hover:border-gray-600"
                }`}
              >
                {session.status === "active" && (
                  <div className="absolute top-3 right-3">
                    <div className="px-2 py-1 bg-emerald-900/30 text-emerald-400 text-xs font-medium rounded-full flex items-center gap-1">
                      <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                      ACTIVE
                    </div>
                  </div>
                )}

                <div className="p-5">
                  <div className="flex items-start gap-3 mb-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      session.status === "active"
                        ? "bg-gradient-to-br from-emerald-500 to-emerald-600"
                        : "bg-gradient-to-br from-gray-700 to-gray-800"
                    }`}>
                      <Code2 className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-white mb-1 truncate">
                        {session.problem || 'Technical Interview'}
                      </h3>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${getDifficultyBadgeClass(session.difficulty)}`}
                      >
                        {session.difficulty || 'Easy'}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-3 text-sm text-gray-400 mb-4">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>{formatTime(session.createdAt)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      <span>
                        {session.participant ? "2" : "1"} participant
                        {session.participant ? "s" : ""}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-gray-700">
                    <span className="text-xs font-medium text-gray-400 uppercase">Completed</span>
                    <span className="text-xs text-gray-500">
                      {formatDate(session.updatedAt || session.createdAt)}
                    </span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <div className="inline-flex p-4 bg-gray-800/50 rounded-full mb-4">
                <Trophy className="w-12 h-12 text-gray-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-300 mb-2">No sessions yet</h3>
              <p className="text-gray-500">Start your coding journey today!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default RecentSessions;