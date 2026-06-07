const { getWords, normalizeText } = require("./textCleaner");

const calculateJaccardSimilarity = (textA = "", textB = "") => {
  const wordsA = new Set(getWords(textA));
  const wordsB = new Set(getWords(textB));

  if (wordsA.size === 0 || wordsB.size === 0) {
    return 0;
  }

  const intersection = new Set([...wordsA].filter((word) => wordsB.has(word)));
  const union = new Set([...wordsA, ...wordsB]);

  return Number(((intersection.size / union.size) * 100).toFixed(2));
};

const calculatePhraseSimilarity = (textA = "", textB = "") => {
  const cleanA = normalizeText(textA);
  const cleanB = normalizeText(textB);

  if (!cleanA || !cleanB) {
    return 0;
  }

  const wordsA = cleanA.split(" ");
  const wordsB = cleanB.split(" ");

  if (wordsA.length < 5 || wordsB.length < 5) {
    return calculateJaccardSimilarity(textA, textB);
  }

  const phrasesA = new Set();
  const phrasesB = new Set();

  for (let i = 0; i <= wordsA.length - 5; i += 1) {
    phrasesA.add(wordsA.slice(i, i + 5).join(" "));
  }

  for (let i = 0; i <= wordsB.length - 5; i += 1) {
    phrasesB.add(wordsB.slice(i, i + 5).join(" "));
  }

  if (phrasesA.size === 0 || phrasesB.size === 0) {
    return 0;
  }

  const intersection = new Set([...phrasesA].filter((phrase) => phrasesB.has(phrase)));
  const union = new Set([...phrasesA, ...phrasesB]);

  return Number(((intersection.size / union.size) * 100).toFixed(2));
};

const calculateFinalSimilarity = (textA = "", textB = "") => {
  const jaccardScore = calculateJaccardSimilarity(textA, textB);
  const phraseScore = calculatePhraseSimilarity(textA, textB);

  const finalScore = jaccardScore * 0.4 + phraseScore * 0.6;

  return Number(finalScore.toFixed(2));
};

const getRiskLevel = (score = 0) => {
  if (score >= 70) {
    return "HIGH";
  }

  if (score >= 35) {
    return "MEDIUM";
  }

  return "LOW";
};

module.exports = {
  calculateJaccardSimilarity,
  calculatePhraseSimilarity,
  calculateFinalSimilarity,
  getRiskLevel
};