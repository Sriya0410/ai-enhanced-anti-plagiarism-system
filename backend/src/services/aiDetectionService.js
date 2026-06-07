const {
  calculateAIScore,
  getAILevel,
  getAISummary
} = require("../utils/aiScoreUtils");

const detectAIContent = async (text = "") => {
  const aiScore = calculateAIScore(text);
  const level = getAILevel(aiScore);
  const summary = getAISummary(aiScore);

  return {
    aiScore,
    level,
    summary
  };
};

module.exports = {
  detectAIContent
};