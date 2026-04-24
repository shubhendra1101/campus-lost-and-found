exports.extractKeywords = (text) => {
  if (!text) return [];
  const cleanText = text.toLowerCase().replace(/[^\w\s]/gi, "");
  return cleanText.split(/\s+/).filter((word) => word.length > 2);
};
