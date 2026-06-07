const Assignment = require("../models/Assignment");
const Submission = require("../models/Submission");
const PlagiarismReport = require("../models/PlagiarismReport");
const AIContentReport = require("../models/AIContentReport");

const asyncHandler = require("../utils/asyncHandler");
const apiResponse = require("../utils/apiResponse");

const getTeacherDashboard = asyncHandler(async (req, res) => {
  const teacherId = req.user._id;

  const [
    totalAssignments,
    publishedAssignments,
    totalSubmissions,
    checkedSubmissions,
    evaluatedSubmissions,
    plagiarismReports,
    aiReports
  ] = await Promise.all([
    Assignment.countDocuments({ teacher: teacherId }),
    Assignment.countDocuments({ teacher: teacherId, status: "PUBLISHED" }),
    Submission.countDocuments({ teacher: teacherId }),
    Submission.countDocuments({ teacher: teacherId, status: "CHECKED" }),
    Submission.countDocuments({ teacher: teacherId, status: "EVALUATED" }),
    PlagiarismReport.countDocuments({ teacher: teacherId }),
    AIContentReport.countDocuments({ teacher: teacherId })
  ]);

  const recentSubmissions = await Submission.find({
    teacher: teacherId
  })
    .populate("assignment", "title maxMarks dueDate")
    .populate("student", "name email")
    .populate("teacher", "name email")
    .populate("department", "name code")
    .populate("subject", "name code")
    .sort({ submittedAt: -1, createdAt: -1 })
    .limit(5);

  return apiResponse(res, 200, "Teacher dashboard fetched successfully.", {
    stats: {
      totalAssignments,
      publishedAssignments,
      totalSubmissions,
      checkedSubmissions,
      evaluatedSubmissions,
      plagiarismReports,
      aiReports
    },
    recentSubmissions
  });
});

const getTeacherAnalytics = asyncHandler(async (req, res) => {
  const teacherId = req.user._id;

  const submissions = await Submission.find({
    teacher: teacherId
  })
    .populate("assignment", "title")
    .populate("student", "name email")
    .populate("teacher", "name email")
    .populate("department", "name code")
    .populate("subject", "name code")
    .sort({ createdAt: -1 });

  const highPlagiarism = submissions.filter(
    (item) => Number(item.plagiarismScore || 0) >= 70
  ).length;

  const mediumPlagiarism = submissions.filter((item) => {
    const score = Number(item.plagiarismScore || 0);
    return score >= 35 && score < 70;
  }).length;

  const lowPlagiarism = submissions.filter(
    (item) => Number(item.plagiarismScore || 0) < 35
  ).length;

  const highAI = submissions.filter(
    (item) => Number(item.aiScore || 0) >= 70
  ).length;

  const mediumAI = submissions.filter((item) => {
    const score = Number(item.aiScore || 0);
    return score >= 35 && score < 70;
  }).length;

  const lowAI = submissions.filter(
    (item) => Number(item.aiScore || 0) < 35
  ).length;

  return apiResponse(res, 200, "Teacher analytics fetched successfully.", {
    analytics: {
      totalSubmissions: submissions.length,
      plagiarism: {
        high: highPlagiarism,
        medium: mediumPlagiarism,
        low: lowPlagiarism
      },
      aiContent: {
        high: highAI,
        medium: mediumAI,
        low: lowAI
      }
    }
  });
});

module.exports = {
  getTeacherDashboard,
  getTeacherAnalytics
};