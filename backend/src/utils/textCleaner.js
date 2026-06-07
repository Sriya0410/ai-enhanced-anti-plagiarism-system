const cleanText = (text = "") => {
  return text
    .toString()
    .replace(/\s+/g, " ")
    .replace(/[^\w\s.,!?;:'"()-]/g, "")
    .trim();
};

const normalizeText = (text = "") => {
  return text
    .toString()
    .toLowerCase()
    .replace(/[^\w\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
};

const getWords = (text = "") => {
  const normalized = normalizeText(text);

  if (!normalized) {
    return [];
  }

  return normalized
    .split(" ")
    .filter((word) => word.length > 2);
};

module.exports = {
  cleanText,
  normalizeText,
  getWords
};