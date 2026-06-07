const PlagiarismReport = require("../models/PlagiarismReport");
const AIContentReport = require("../models/AIContentReport");
const Submission = require("../models/Submission");
const { SUBMISSION_STATUS } = require("../config/constants");

const createOrUpdatePlagiarismReport = async ({
  submission,
  assignment,
  student,
  similarityScore,
  level,
  matchedSubmissions,
  summary
}) => {
  const report = await PlagiarismReport.findOneAndUpdate(
    { submission },
    {
      submission,
      assignment,
      student,
      similarityScore,
      level,
      matchedSubmissions,
      summary
    },
    {
      new: true,
      upsert: true,
      runValidators: true
    }
  );

  return report;
};

const createOrUpdateAIContentReport = async ({
  submission,
  assignment,
  student,
  aiScore,
  level,
  summary
}) => {
  const report = await AIContentReport.findOneAndUpdate(
    { submission },
    {
      submission,
      assignment,
      student,
      aiScore,
      level,
      summary
    },
    {
      new: true,
      upsert: true,
      runValidators: true
    }
  );

  return report;
};

const updateSubmissionAfterReports = async ({
  submissionId,
  plagiarismScore,
  aiScore
}) => {
  const submission = await Submission.findByIdAndUpdate(
    submissionId,
    {
      plagiarismScore,
      aiScore,
      status: SUBMISSION_STATUS.CHECKED
    },
    {
      new: true,
      runValidators: true
    }
  );

  return submission;
};

module.exports = {
  createOrUpdatePlagiarismReport,
  createOrUpdateAIContentReport,
  updateSubmissionAfterReports
};