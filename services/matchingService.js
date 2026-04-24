exports.calculateMatchScore = (item1, item2) => {
  const keywords1 = item1.keywords || [];
  const keywords2 = item2.keywords || [];

  if (keywords1.length === 0 || keywords2.length === 0) return 0;

  const set1 = new Set(keywords1);
  let matchCount = 0;

  keywords2.forEach((word) => {
    if (set1.has(word)) {
      matchCount++;
    }
  });

  let score = matchCount / Math.max(keywords1.length, keywords2.length);

  if (item1.category === item2.category) score += 0.5;
  if (item1.location === item2.location) score += 0.3;

  return score;
};
