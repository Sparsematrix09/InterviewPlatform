// Add ChevronDown to imports
import { ChevronLeft, ChevronRight, BookOpen, AlertCircle, CheckCircle, ChevronDown } from "lucide-react";
import { getDifficultyBadgeClass } from "../lib/utils";

function ProblemDescription({ problem, currentProblemId, onProblemChange, allProblems }) {
  const currentIndex = allProblems.findIndex(p => p.id === currentProblemId);
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < allProblems.length - 1;

  return (
    <div className="h-full overflow-y-auto bg-gray-900 text-gray-100">
      {/* HEADER SECTION */}
      <div className="p-6 bg-gray-800 border-b border-gray-700">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">{problem.title}</h1>
            <p className="text-emerald-400 font-medium">{problem.category}</p>
          </div>
          <span className={`px-4 py-2 rounded-full font-semibold border ${getDifficultyBadgeClass(problem.difficulty)}`}>
            {problem.difficulty}
          </span>
        </div>

        {/* Navigation Controls */}
        <div className="flex items-center justify-between mt-6">
          <div className="flex items-center gap-2">
            <button
              onClick={() => hasPrev && onProblemChange(allProblems[currentIndex - 1].id)}
              disabled={!hasPrev}
              className={`p-2 rounded-lg ${hasPrev ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' : 'bg-gray-800 text-gray-600 cursor-not-allowed'}`}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="text-sm text-gray-400 px-3">
              {currentIndex + 1} of {allProblems.length}
            </span>
            <button
              onClick={() => hasNext && onProblemChange(allProblems[currentIndex + 1].id)}
              disabled={!hasNext}
              className={`p-2 rounded-lg ${hasNext ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' : 'bg-gray-800 text-gray-600 cursor-not-allowed'}`}
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Problem Selector */}
          <div className="relative">
            <select
              className="bg-gray-700 border border-gray-600 text-gray-300 rounded-lg px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent appearance-none"
              value={currentProblemId}
              onChange={(e) => onProblemChange(e.target.value)}
            >
              {allProblems.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.title} - {p.difficulty}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* PROBLEM DESCRIPTION */}
        <div className="bg-gray-800/50 rounded-xl border border-gray-700 p-5">
          <div className="flex items-center gap-2 mb-4">
            <BookOpen className="w-5 h-5 text-emerald-400" />
            <h2 className="text-xl font-bold text-white">Description</h2>
          </div>

          <div className="space-y-4 text-gray-300 leading-relaxed">
            <p className="text-gray-300">{problem.description.text}</p>
            {problem.description.notes && problem.description.notes.length > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-700">
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className="w-4 h-4 text-yellow-500" />
                  <h3 className="font-semibold text-yellow-400">Notes:</h3>
                </div>
                <ul className="space-y-2">
                  {problem.description.notes.map((note, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-emerald-400 mt-1">•</span>
                      <span className="text-gray-400">{note}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* EXAMPLES SECTION */}
        <div className="bg-gray-800/50 rounded-xl border border-gray-700 p-5">
          <h2 className="text-xl font-bold mb-4 text-white">Examples</h2>
          <div className="space-y-4">
            {problem.examples.map((example, idx) => (
              <div key={idx}>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-900/50 border border-emerald-700 flex items-center justify-center">
                    <span className="text-emerald-300 font-bold text-sm">{idx + 1}</span>
                  </div>
                  <p className="font-semibold text-gray-300">Example {idx + 1}</p>
                </div>
                <div className="bg-gray-900 rounded-lg p-4 font-mono space-y-3">
                  <div className="flex gap-3">
                    <span className="text-emerald-400 font-bold min-w-[70px]">Input:</span>
                    <code className="text-gray-300 bg-gray-800 px-3 py-1 rounded flex-1">
                      {example.input}
                    </code>
                  </div>
                  <div className="flex gap-3">
                    <span className="text-emerald-400 font-bold min-w-[70px]">Output:</span>
                    <code className="text-gray-300 bg-gray-800 px-3 py-1 rounded flex-1">
                      {example.output}
                    </code>
                  </div>
                  {example.explanation && (
                    <div className="pt-3 border-t border-gray-800 mt-3">
                      <div className="flex gap-2">
                        <span className="text-emerald-400 font-bold min-w-[70px]">Explanation:</span>
                        <span className="text-gray-400">{example.explanation}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CONSTRAINTS */}
        <div className="bg-gray-800/50 rounded-xl border border-gray-700 p-5">
          <h2 className="text-xl font-bold mb-4 text-white">Constraints</h2>
          <ul className="space-y-3">
            {problem.constraints.map((constraint, idx) => (
              <li key={idx} className="flex gap-3 items-start">
                <div className="mt-1.5">
                  <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                </div>
                <code className="text-gray-300 bg-gray-900 px-3 py-1.5 rounded-lg text-sm">
                  {constraint}
                </code>
              </li>
            ))}
          </ul>
        </div>

        {/* HINT */}
        <div className="bg-emerald-900/20 border border-emerald-800/50 rounded-xl p-5">
          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-emerald-300 mb-1">Hint</h3>
              <p className="text-emerald-200 text-sm">
                Try to solve the problem before checking the expected output. Use the examples to test your solution.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProblemDescription;