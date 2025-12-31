// In lib/utils.js, ensure you have:
export function getDifficultyBadgeClass(difficulty) {
  if (!difficulty) return 'bg-gray-500 text-gray-100';
  
  const lowerDiff = difficulty.toLowerCase();
  switch (lowerDiff) {
    case 'easy':
      return 'bg-green-500/20 text-green-400 border border-green-500/30';
    case 'medium':
      return 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30';
    case 'hard':
      return 'bg-red-500/20 text-red-400 border border-red-500/30';
    default:
      return 'bg-gray-500/20 text-gray-400 border border-gray-500/30';
  }
}