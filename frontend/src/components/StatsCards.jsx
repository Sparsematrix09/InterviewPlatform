import { Trophy, Users } from "lucide-react";

function StatsCards({ activeSessionsCount, recentSessionsCount }) {
  return (
    <div className="lg:col-span-1">
      <div className="grid grid-cols-2 gap-4">
        {/* Active Sessions Card */}
        <div className="bg-gray-900/50 border border-emerald-800/30 hover:border-emerald-700/50 rounded-xl p-5 transition-colors">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2.5 bg-emerald-900/30 rounded-lg">
              <Users className="w-5 h-5 text-emerald-400" />
            </div>
            <span className="px-2 py-1 bg-emerald-900/30 text-emerald-400 text-xs font-medium rounded-full">
              Live
            </span>
          </div>
          <div className="text-2xl font-bold text-white mb-1">{activeSessionsCount}</div>
          <h3 className="text-sm font-medium text-gray-400">Active Sessions</h3>
          <p className="text-xs text-gray-500 mt-1">Currently running</p>
        </div>

        {/* Total Sessions Card */}
        <div className="bg-gray-900/50 border border-blue-800/30 hover:border-blue-700/50 rounded-xl p-5 transition-colors">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2.5 bg-blue-900/30 rounded-lg">
              <Trophy className="w-5 h-5 text-blue-400" />
            </div>
          </div>
          <div className="text-2xl font-bold text-white mb-1">{activeSessionsCount + recentSessionsCount}</div>
          <h3 className="text-sm font-medium text-gray-400">Total Sessions</h3>
          <p className="text-xs text-gray-500 mt-1">All time participation</p>
        </div>
      </div>
    </div>
  );
}

export default StatsCards;