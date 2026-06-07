const PlagiarismReport = require("../models/PlagiarismReport");
const Submission = require("../models/Submission");

const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/apiError");
const apiResponse = require("../utils/apiResponse");
const { USER_ROLES } = require("../config/constants");

const getPlagiarismReports = asyncHandler(async (req, res) => {
  const filter = {};

  if (req.user.role === USER_ROLES.STUDENT) {
    filter.student = req.user._id;
  }

  const reports = await PlagiarismReport.find(filter)
    .populate("submission", "fileName originalFileName plagiarismScore status submittedAt")
    .populate("assignment", "title maxMarks")
    .populate("student", "name email")
    .populate("matchedSubmissions.student", "name email")
    .sort({ createdAt: -1 });

  if (req.user.role === USER_ROLES.TEACHER) {
    const teacherSubmissions = await Submission.find({
      teacher: req.user._id
    }).select("_id");

    const submissionIds = teacherSubmissions.map((item) => item._id);

    const teacherReports = reports.filter((report) =>
      submissionIds.some((id) => String(id) === String(report.submission?._id))
    );

    return apiResponse(res, 200, "Plagiarism reports fetched successfully.", {
      reports: teacherReports
    });
  }

  return apiResponse(res, 200, "Plagiarism reports fetched successfully.", {
    reports
  });
});

const getPlagiarismReportBySubmission = asyncHandler(async (req, res) => {
  const submission = await Submission.findById(req.params.submissionId);

  if (!submission) {
    throw new ApiError(404, "Submission not found.");
  }

  if (
    req.user.role === USER_ROLES.STUDENT &&
    String(submission.student) !== String(req.user._id)
  ) {
    throw new ApiError(403, "You can view only your own plagiarism report.");
  }

  if (
    req.user.role === USER_ROLES.TEACHER &&
    String(submission.teacher) !== String(req.user._id)
  ) {
    throw new ApiError(403, "You can view only your assignment plagiarism reports.");
  }

  const report = await PlagiarismReport.findOne({
    submission: submission._id
  })
    .populate("submission", "fileName originalFileName plagiarismScore status submittedAt")
    .populate("assignment", "title maxMarks")
    .populate("student", "name email")
    .populate("matchedSubmissions.student", "name email");

  if (!report) {
    throw new ApiError(404, "Plagiarism report pending.");
  }

  return apiResponse(res, 200, "Plagiarism report fetched successfully.", {
    report
  });
});

const getPlagiarismReportById = asyncHandler(async (req, res) => {
  const report = await PlagiarismReport.findById(req.params.id)
    .populate("submission", "fileName originalFileName plagiarismScore status submittedAt")
    .populate("assignment", "title maxMarks")
    .populate("student", "name email")
    .populate("matchedSubmissions.student", "name email");

  if (!report) {
    throw new ApiError(404, "Plagiarism report not found.");
  }

  const submission = await Submission.findById(report.submission?._id || report.submission);

  if (
    req.user.role === USER_ROLES.STUDENT &&
    String(report.student?._id || report.student) !== String(req.user._id)
  ) {
    throw new ApiError(403, "You can view only your own plagiarism report.");
  }

  if (
    req.user.role === USER_ROLES.TEACHER &&
    submission &&
    String(submission.teacher) !== String(req.user._id)
  ) {
    throw new ApiError(403, "You can view only your assignment plagiarism reports.");
  }

  return apiResponse(res, 200, "Plagiarism report fetched successfully.", {
    report
  });
});

module.exports = {
  getPlagiarismReports,
  getPlagiarismReportBySubmission,
  getPlagiarismReportById
};