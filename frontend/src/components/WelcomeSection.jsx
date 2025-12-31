import { useUser } from "@clerk/clerk-react";
import { ArrowRight, Sparkles, Zap } from "lucide-react";

function WelcomeSection({ onCreateSession }) {
  const { user } = useUser();

  return (
    <div className="bg-gray-900 border-b border-gray-800 pt-20">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          {/* Left content */}
          <div className="flex items-center gap-4">
            <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 p-3 rounded-xl">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">
                Welcome back, <span className="text-emerald-400">{user?.firstName || "Coder"}</span>!
              </h1>
              <p className="text-gray-400 mt-1">
                Ready to practice your interview skills?
              </p>
            </div>
          </div>

          {/* Right button */}
          <button
            onClick={onCreateSession}
            className="group bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
          >
            <div className="p-1.5 bg-white/20 rounded-md">
              <Zap className="w-4 h-4" />
            </div>
            Create Session
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default WelcomeSection;