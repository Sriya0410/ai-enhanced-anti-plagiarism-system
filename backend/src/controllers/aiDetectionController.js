const AIContentReport = require("../models/AIContentReport");
const Submission = require("../models/Submission");

const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/apiError");
const apiResponse = require("../utils/apiResponse");
const { USER_ROLES } = require("../config/constants");

const getAIContentReports = asyncHandler(async (req, res) => {
  const filter = {};

  if (req.user.role === USER_ROLES.STUDENT) {
    filter.student = req.user._id;
  }

  const reports = await AIContentReport.find(filter)
    .populate("submission", "fileName originalFileName aiScore status submittedAt")
    .populate("assignment", "title maxMarks")
    .populate("student", "name email")
    .sort({ createdAt: -1 });

  if (req.user.role === USER_ROLES.TEACHER) {
    const teacherSubmissions = await Submission.find({
      teacher: req.user._id
    }).select("_id");

    const submissionIds = teacherSubmissions.map((item) => item._id);

    const teacherReports = reports.filter((report) =>
      submissionIds.some((id) => String(id) === String(report.submission?._id))
    );

    return apiResponse(res, 200, "AI content reports fetched successfully.", {
      reports: teacherReports
    });
  }

  return apiResponse(res, 200, "AI content reports fetched successfully.", {
    reports
  });
});

const getAIContentReportBySubmission = asyncHandler(async (req, res) => {
  const submission = await Submission.findById(req.params.submissionId);

  if (!submission) {
    throw new ApiError(404, "Submission not found.");
  }

  if (
    req.user.role === USER_ROLES.STUDENT &&
    String(submission.student) !== String(req.user._id)
  ) {
    throw new ApiError(403, "You can view only your own AI content report.");
  }

  if (
    req.user.role === USER_ROLES.TEACHER &&
    String(submission.teacher) !== String(req.user._id)
  ) {
    throw new ApiError(403, "You can view only your assignment AI content reports.");
  }

  const report = await AIContentReport.findOne({
    submission: submission._id
  })
    .populate("submission", "fileName originalFileName aiScore status submittedAt")
    .populate("assignment", "title maxMarks")
    .populate("student", "name email");

  if (!report) {
    throw new ApiError(404, "AI content report pending.");
  }

  return apiResponse(res, 200, "AI content report fetched successfully.", {
    report
  });
});

const getAIContentReportById = asyncHandler(async (req, res) => {
  const report = await AIContentReport.findById(req.params.id)
    .populate("submission", "fileName originalFileName aiScore status submittedAt")
    .populate("assignment", "title maxMarks")
    .populate("student", "name email");

  if (!report) {
    throw new ApiError(404, "AI content report not found.");
  }

  const submission = await Submission.findById(report.submission?._id || report.submission);

  if (
    req.user.role === USER_ROLES.STUDENT &&
    String(report.student?._id || report.student) !== String(req.user._id)
  ) {
    throw new ApiError(403, "You can view only your own AI content report.");
  }

  if (
    req.user.role === USER_ROLES.TEACHER &&
    submission &&
    String(submission.teacher) !== String(req.user._id)
  ) {
    throw new ApiError(403, "You can view only your assignment AI content reports.");
  }

  return apiResponse(res, 200, "AI content report fetched successfully.", {
    report
  });
});

module.exports = {
  getAIContentReports,
  getAIContentReportBySubmission,
  getAIContentReportById
};