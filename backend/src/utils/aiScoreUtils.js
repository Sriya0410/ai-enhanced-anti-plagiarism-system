const { normalizeText } = require("./textCleaner");

const calculateAIScore = (text = "") => {
  const cleanText = normalizeText(text);

  if (!cleanText) {
    return 0;
  }

  const words = cleanText.split(" ");
  const sentences = text
    .split(/[.!?]+/)
    .map((sentence) => sentence.trim())
    .filter(Boolean);

  if (words.length < 30) {
    return 10;
  }

  const averageSentenceLength =
    sentences.length > 0 ? words.length / sentences.length : words.length;

  const uniqueWords = new Set(words);
  const lexicalDiversity = uniqueWords.size / words.length;

  const aiLikePhrases = [
    "in conclusion",
    "it is important to note",
    "furthermore",
    "moreover",
    "overall",
    "this essay discusses",
    "as we can see",
    "plays a crucial role",
    "significant impact",
    "in today's world",
    "there are several"
  ];

  let phraseHits = 0;

  aiLikePhrases.forEach((phrase) => {
    if (cleanText.includes(phrase)) {
      phraseHits += 1;
    }
  });

  let score = 0;

  if (averageSentenceLength >= 18) {
    score += 20;
  }

  if (averageSentenceLength >= 25) {
    score += 15;
  }

  if (lexicalDiversity < 0.45) {
    score += 20;
  }

  if (phraseHits > 0) {
    score += phraseHits * 12;
  }

  if (words.length > 150 && lexicalDiversity < 0.55) {
    score += 15;
  }

  return Math.min(100, Math.max(0, Number(score.toFixed(2))));
};

const getAILevel = (score = 0) => {
  if (score >= 70) {
    return "HIGH";
  }

  if (score >= 35) {
    return "MEDIUM";
  }

  return "LOW";
};

const getAISummary = (score = 0) => {
  if (score >= 70) {
    return "High AI-like writing patterns detected. The text contains repetitive structure, formal transitions, and predictable sentence flow.";
  }

  if (score >= 35) {
    return "Moderate AI-like writing patterns detected. Some parts may appear machine-generated or highly template-based.";
  }

  return "Low AI-like writing patterns detected. The writing appears mostly natural based on available checks.";
};

module.exports = {
  calculateAIScore,
  getAILevel,
  getAISummary
};