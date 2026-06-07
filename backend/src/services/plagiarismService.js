const Submission = require("../models/Submission");
const {
  calculateFinalSimilarity,
  getRiskLevel
} = require("../utils/similarityUtils");

const checkPlagiarism = async ({ assignmentId, currentSubmissionId, extractedText }) => {
  const previousSubmissions = await Submission.find({
    assignment: assignmentId,
    _id: { $ne: currentSubmissionId },
    extractedText: { $exists: true, $ne: "" }
  }).populate("student", "name email");

  const matchedSubmissions = [];
  let highestScore = 0;

  previousSubmissions.forEach((submission) => {
    const similarity = calculateFinalSimilarity(extractedText, submission.extractedText);

    if (similarity > highestScore) {
      highestScore = similarity;
    }

    if (similarity >= 20) {
      matchedSubmissions.push({
        submission: submission._id,
        student: submission.student?._id,
        similarity,
        matchedText:
          similarity >= 70
            ? "High overlap found with another submission."
            : similarity >= 35
              ? "Moderate overlap found with another submission."
              : "Low overlap found with another submission."
      });
    }
  });

  const level = getRiskLevel(highestScore);

  let summary = "Low similarity detected.";

  if (level === "HIGH") {
    summary = "High similarity detected. This submission has strong overlap with previous submissions for the same assignment.";
  } else if (level === "MEDIUM") {
    summary = "Moderate similarity detected. Some parts of this submission are similar to previous submissions.";
  }

  return {
    similarityScore: highestScore,
    level,
    matchedSubmissions,
    summary
  };
};

module.exports = {
  checkPlagiarism
};