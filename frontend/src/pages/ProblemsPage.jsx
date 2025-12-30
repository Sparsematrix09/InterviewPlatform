import Navbar from "../components/Navbar";
import { PROBLEMS } from "../data/problems";
import { Code2, TrendingUp, BarChart3, Search } from "lucide-react";
import { Link } from "react-router-dom";

function ProblemsPage() {
  const problems = Object.values(PROBLEMS);

  // Difficulty badge color mapping
  const getDifficultyColor = (difficulty) => {
    switch (difficulty.toLowerCase()) {
      case "easy":
        return "text-emerald-400 border-emerald-500/30 bg-emerald-900/20";
      case "medium":
        return "text-yellow-400 border-yellow-500/30 bg-yellow-900/20";
      case "hard":
        return "text-red-400 border-red-500/30 bg-red-900/20";
      default:
        return "text-gray-400 border-gray-500/30 bg-gray-900/20";
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 pt-20">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 p-2 rounded-lg shadow-lg">
              <Code2 className="w-8 h-8 text-white" strokeWidth={2.5} />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white">Coding Problems</h1>
              <p className="text-gray-400 mt-1">Sharpen your skills with our curated collection</p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-5">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-emerald-900/30 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-emerald-400" />
                </div>
                <h3 className="font-bold text-white">Total Problems</h3>
              </div>
              <p className="text-3xl font-bold text-white">{problems.length}</p>
              <p className="text-sm text-gray-400 mt-1">Keep practicing daily</p>
            </div>
            
            <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-5">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-emerald-900/30 rounded-lg">
                  <BarChart3 className="w-5 h-5 text-emerald-400" />
                </div>
                <h3 className="font-bold text-white">Difficulty</h3>
              </div>
              <div className="flex gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-emerald-900/30 text-emerald-400 border border-emerald-500/30">
                  {problems.filter(p => p.difficulty === "Easy").length} Easy
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-yellow-900/30 text-yellow-400 border border-yellow-500/30">
                  {problems.filter(p => p.difficulty === "Medium").length} Medium
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-red-900/30 text-red-400 border border-red-500/30">
                  {problems.filter(p => p.difficulty === "Hard").length} Hard
                </span>
              </div>
            </div>
            
            <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-5">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-emerald-900/30 rounded-lg">
                  <BarChart3 className="w-5 h-5 text-emerald-400" />
                </div>
                <h3 className="font-bold text-white">Categories</h3>
              </div>
              <p className="text-lg font-bold text-white">Array, Hash Table, String, Two Pointers</p>
              <p className="text-sm text-gray-400 mt-1">And many more...</p>
            </div>
          </div>
        </div>

        {/* Problems Table */}
        <div className="bg-gray-900/50 border border-gray-800 rounded-xl overflow-hidden">
          {/* Table Header */}
          <div className="grid grid-cols-12 gap-4 p-5 border-b border-gray-800 bg-gray-900/30 text-gray-400 font-medium">
            <div className="col-span-1 text-center">#</div>
            <div className="col-span-5">Problem</div>
            <div className="col-span-2">Difficulty</div>
            <div className="col-span-2">Category</div>
            <div className="col-span-2 text-center">Action</div>
          </div>

          {/* Problems List */}
          <div className="divide-y divide-gray-800">
            {problems.map((problem, index) => (
              <div 
                key={problem.id} 
                className="grid grid-cols-12 gap-4 p-5 hover:bg-gray-800/30 transition-all duration-300 group"
              >
                {/* Problem Number */}
                <div className="col-span-1 flex items-center justify-center">
                  <span className="text-gray-400 font-mono">{index + 1}</span>
                </div>

                {/* Problem Title and Description */}
                <div className="col-span-5">
                  <div className="flex items-start gap-3">
                    <div className="mt-1">
                      <div className="w-3 h-3 rounded-full bg-emerald-500/50 group-hover:bg-emerald-500 transition-colors"></div>
                    </div>
                    <div>
                      <h3 className="font-bold text-white group-hover:text-emerald-300 transition-colors">
                        {problem.title}
                      </h3>
                      <p className="text-sm text-gray-400 mt-1 line-clamp-2">
                        {problem.description.text.length > 100
                          ? `${problem.description.text.substring(0, 100)}...`
                          : problem.description.text}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Difficulty */}
                <div className="col-span-2 flex items-center">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getDifficultyColor(problem.difficulty)}`}>
                    {problem.difficulty}
                  </span>
                </div>

                {/* Category */}
                <div className="col-span-2 flex items-center">
                  <span className="text-gray-300 font-medium">{problem.category}</span>
                </div>

                {/* Action Button */}
                <div className="col-span-2 flex items-center justify-center">
                  <Link 
                    to={`/problems/${problem.id}`}
                    className="px-6 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white rounded-lg font-medium transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 inline-flex items-center gap-2"
                  >
                    Solve
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Empty State (optional) */}
        {problems.length === 0 && (
          <div className="text-center py-20">
            <div className="inline-flex p-4 bg-gray-900/50 rounded-full mb-4">
              <Code2 className="w-12 h-12 text-gray-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-300 mb-2">No problems found</h3>
            <p className="text-gray-500">Try adjusting your search or filter criteria</p>
          </div>
        )}

        {/* Footer Info */}
        <div className="mt-12 text-center">
          <p className="text-gray-500 text-sm">
            Practice makes perfect. Solve {problems.length} problems to master your skills.
          </p>
          <div className="flex items-center justify-center gap-6 mt-6">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
              <span className="text-sm text-gray-400">Easy</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <span className="text-sm text-gray-400">Medium</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <span className="text-sm text-gray-400">Hard</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default ProblemsPage;