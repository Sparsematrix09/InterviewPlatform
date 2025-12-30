// lib/utils.js
export function getDifficultyBadgeClass(difficulty) {
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
}