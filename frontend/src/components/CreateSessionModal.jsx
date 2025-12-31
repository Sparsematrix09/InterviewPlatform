import { Code2, Loader2, Plus, X } from "lucide-react";
import { PROBLEMS } from "../data/problems";

function CreateSessionModal({
  isOpen,
  onClose,
  roomConfig,
  setRoomConfig,
  onCreateRoom,
  isCreating,
}) {
  const problems = Object.values(PROBLEMS);

  if (!isOpen) return null;

  // Get difficulty badge color
  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case 'easy': return 'text-emerald-400 bg-emerald-900/30 border-emerald-700';
      case 'medium': return 'text-yellow-400 bg-yellow-900/30 border-yellow-700';
      case 'hard': return 'text-red-400 bg-red-900/30 border-red-700';
      default: return 'text-gray-400 bg-gray-900/30 border-gray-700';
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div 
          className="bg-gray-900 border border-gray-800 rounded-xl w-full max-w-md"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Modal Header */}
          <div className="flex items-center justify-between p-5 border-b border-gray-800">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 p-2 rounded-lg">
                <Code2 className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl font-bold text-white">Create Session</h2>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Modal Content */}
          <div className="p-5">
            <div className="space-y-5">
              {/* Problem Selection */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-gray-300">
                    Select Problem
                  </label>
                  <span className="text-xs text-red-400">Required</span>
                </div>
                
                <select
                  className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  value={roomConfig.problem}
                  onChange={(e) => {
                    const selectedProblem = problems.find((p) => p.title === e.target.value);
                    setRoomConfig({
                      difficulty: selectedProblem?.difficulty || "",
                      problem: e.target.value,
                    });
                  }}
                >
                  <option value="" className="text-gray-500" disabled>
                    Choose a coding problem...
                  </option>
                  {problems.map((problem) => (
                    <option key={problem.id} value={problem.title} className="text-gray-300">
                      {problem.title} ({problem.difficulty})
                    </option>
                  ))}
                </select>
              </div>

              {/* Room Summary */}
              {roomConfig.problem && (
                <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-emerald-900/30 rounded-lg">
                      <Code2 className="w-4 h-4 text-emerald-400" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-emerald-300 mb-2">Session Summary</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Problem:</span>
                          <span className="text-white font-medium">{roomConfig.problem}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Difficulty:</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(roomConfig.difficulty)}`}>
                            {roomConfig.difficulty}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Participants:</span>
                          <span className="text-white font-medium">2 (1-on-1)</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Modal Footer */}
          <div className="flex justify-end gap-2 p-5 border-t border-gray-800">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              onClick={onCreateRoom}
              disabled={isCreating || !roomConfig.problem}
              className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 ${
                isCreating || !roomConfig.problem
                  ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white'
              }`}
            >
              {isCreating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  Create Session
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default CreateSessionModal;