const Assignment = require("../models/Assignment");
const Submission = require("../models/Submission");
const StudentProfile = require("../models/StudentProfile");
const PlagiarismReport = require("../models/PlagiarismReport");
const AIContentReport = require("../models/AIContentReport");
const Evaluation = require("../models/Evaluation");

const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/apiError");
const apiResponse = require("../utils/apiResponse");

const { USER_ROLES, SUBMISSION_STATUS } = require("../config/constants");

const { buildUploadedFileData } = require("../services/fileService");
const { extractTextFromFile } = require("../services/textExtractService");
const { checkPlagiarism } = require("../services/plagiarismService");
const { detectAIContent } = require("../services/aiDetectionService");
const {
  createOrUpdatePlagiarismReport,
  createOrUpdateAIContentReport,
  updateSubmissionAfterReports
} = require("../services/reportService");
const { createNotification } = require("../services/notificationService");

const submitAssignment = asyncHandler(async (req, res) => {
  const { assignmentId } = req.body;

  if (!assignmentId) {
    throw new ApiError(400, "Assignment ID is required.");
  }

  if (!req.file) {
    throw new ApiError(400, "Assignment file is required.");
  }

  const assignment = await Assignment.findOne({
    _id: assignmentId,
    status: "PUBLISHED",
    isActive: true
  });

  if (!assignment) {
    throw new ApiError(404, "Published assignment not found.");
  }

  const studentProfile = await StudentProfile.findOne({
    user: req.user._id
  });

  if (!studentProfile) {
    throw new ApiError(404, "Student profile not found.");
  }

if (String(studentProfile.department) !== String(assignment.department)) {
  throw new ApiError(
    403,
    "This assignment is not assigned to your department."
  );
}

if (String(studentProfile.year) !== String(assignment.year)) {
  throw new ApiError(
    403,
    "This assignment is not assigned to your year."
  );
}

  const alreadySubmitted = await Submission.findOne({
    assignment: assignment._id,
    student: req.user._id
  });

  if (alreadySubmitted) {
    throw new ApiError(400, "You have already submitted this assignment.");
  }

  const uploadedFileData = buildUploadedFileData(req.file);

  const extractedText = await extractTextFromFile(
    uploadedFileData.filePath,
    req.file.originalname
  );

  const isLate = new Date() > new Date(assignment.dueDate);

  let submission = await Submission.create({
    assignment: assignment._id,
    student: req.user._id,
    teacher: assignment.teacher,
    department: assignment.department,
    subject: assignment.subject,
    fileName: uploadedFileData.fileName,
    originalFileName: uploadedFileData.originalFileName,
    fileUrl: uploadedFileData.fileUrl,
    fileType: uploadedFileData.fileType,
    fileSize: uploadedFileData.fileSize,
    extractedText,
    status: SUBMISSION_STATUS.SUBMITTED,
    isLate
  });

  const plagiarismResult = await checkPlagiarism({
    assignmentId: assignment._id,
    currentSubmissionId: submission._id,
    extractedText
  });

  const plagiarismReport = await createOrUpdatePlagiarismReport({
    submission: submission._id,
    assignment: assignment._id,
    student: req.user._id,
    similarityScore: plagiarismResult.similarityScore,
    level: plagiarismResult.level,
    matchedSubmissions: plagiarismResult.matchedSubmissions,
    summary: plagiarismResult.summary
  });

  const aiResult = await detectAIContent(extractedText);

  const aiContentReport = await createOrUpdateAIContentReport({
    submission: submission._id,
    assignment: assignment._id,
    student: req.user._id,
    aiScore: aiResult.aiScore,
    level: aiResult.level,
    summary: aiResult.summary
  });

  submission = await updateSubmissionAfterReports({
    submissionId: submission._id,
    plagiarismScore: plagiarismResult.similarityScore,
    aiScore: aiResult.aiScore
  });

  await createNotification({
    recipient: assignment.teacher,
    title: "New Submission Received",
    message: `${req.user.name} submitted assignment: ${assignment.title}`,
    type: "SUBMISSION_CHECKED"
  });

  return apiResponse(res, 201, "Assignment submitted and checked successfully.", {
    submission,
    plagiarismReport,
    aiContentReport
  });
});

const getSubmissions = asyncHandler(async (req, res) => {
  const filter = {};

  if (req.user.role === USER_ROLES.TEACHER) {
    filter.teacher = req.user._id;
  }

  if (req.user.role === USER_ROLES.STUDENT) {
    filter.student = req.user._id;
  }

  if (req.query.assignment) {
    filter.assignment = req.query.assignment;
  }

  if (req.query.status) {
    filter.status = req.query.status;
  }

  const submissions = await Submission.find(filter)
    .populate("assignment", "title maxMarks dueDate")
    .populate("student", "name email")
    .populate("teacher", "name email")
    .populate("department", "name code")
    .populate("subject", "name code")
    .sort({ submittedAt: -1, createdAt: -1 });

  return apiResponse(res, 200, "Submissions fetched successfully.", {
    submissions
  });
});

const getSubmissionById = asyncHandler(async (req, res) => {
  const filter = { _id: req.params.id };

  if (req.user.role === USER_ROLES.TEACHER) {
    filter.teacher = req.user._id;
  }

  if (req.user.role === USER_ROLES.STUDENT) {
    filter.student = req.user._id;
  }

  const submission = await Submission.findOne(filter)
    .populate("assignment", "title description maxMarks dueDate")
    .populate("student", "name email")
    .populate("teacher", "name email")
    .populate("department", "name code")
    .populate("subject", "name code");

  if (!submission) {
    throw new ApiError(404, "Submission not found.");
  }

  const plagiarismReport = await PlagiarismReport.findOne({
    submission: submission._id
  }).populate("matchedSubmissions.student", "name email");

  const aiContentReport = await AIContentReport.findOne({
    submission: submission._id
  });

  const evaluation = await Evaluation.findOne({
    submission: submission._id
  }).populate("teacher", "name email");

  return apiResponse(res, 200, "Submission fetched successfully.", {
    submission,
    plagiarismReport,
    aiContentReport,
    evaluation
  });
});

const getSubmissionsByAssignment = asyncHandler(async (req, res) => {
  const { assignmentId } = req.params;

  if (!assignmentId || assignmentId === "undefined") {
    throw new ApiError(400, "Assignment ID is required.");
  }

  const assignment = await Assignment.findById(assignmentId);

  if (!assignment) {
    throw new ApiError(404, "Assignment not found.");
  }

  if (
    req.user.role === USER_ROLES.TEACHER &&
    String(assignment.teacher) !== String(req.user._id)
  ) {
    throw new ApiError(
      403,
      "You can view only your own assignment submissions."
    );
  }

  const submissions = await Submission.find({
    assignment: assignmentId
  })
    .populate("assignment", "title maxMarks dueDate")
    .populate("student", "name email")
    .populate("teacher", "name email")
    .populate("department", "name code")
    .populate("subject", "name code")
    .sort({ submittedAt: -1, createdAt: -1 });

  return apiResponse(res, 200, "Assignment submissions fetched successfully.", {
    submissions
  });
});

const getAllReportsForSubmission = asyncHandler(async (req, res) => {
  const submission = await Submission.findById(req.params.id);

  if (!submission) {
    throw new ApiError(404, "Submission not found.");
  }

  if (
    req.user.role === USER_ROLES.STUDENT &&
    String(submission.student) !== String(req.user._id)
  ) {
    throw new ApiError(403, "You can view only your own reports.");
  }

  if (
    req.user.role === USER_ROLES.TEACHER &&
    String(submission.teacher) !== String(req.user._id)
  ) {
    throw new ApiError(403, "You can view only your own assignment reports.");
  }

  const plagiarismReport = await PlagiarismReport.findOne({
    submission: submission._id
  }).populate("matchedSubmissions.student", "name email");

  const aiContentReport = await AIContentReport.findOne({
    submission: submission._id
  });

  return apiResponse(res, 200, "Submission reports fetched successfully.", {
    plagiarismReport,
    aiContentReport
  });
});

module.exports = {
  submitAssignment,
  getSubmissions,
  getSubmissionById,
  getSubmissionsByAssignment,
  getAllReportsForSubmission
};