const Assignment = require("../models/Assignment");
const Submission = require("../models/Submission");
const StudentProfile = require("../models/StudentProfile");
const Evaluation = require("../models/Evaluation");
const PlagiarismReport = require("../models/PlagiarismReport");
const AIContentReport = require("../models/AIContentReport");

const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/apiError");
const apiResponse = require("../utils/apiResponse");

const getStudentDashboard = asyncHandler(async (req, res) => {
  const studentProfile = await StudentProfile.findOne({
    user: req.user._id
  }).populate("department", "name code");

  if (!studentProfile) {
    throw new ApiError(404, "Student profile not found.");
  }

  const departmentId = studentProfile.department?._id || studentProfile.department;

  const assignmentFilter = {
    department: departmentId,
    year: studentProfile.year,
    status: "PUBLISHED",
    isActive: true
  };

  const [
    totalAssignments,
    totalSubmissions,
    checkedSubmissions,
    evaluatedSubmissions
  ] = await Promise.all([
    Assignment.countDocuments(assignmentFilter),
    Submission.countDocuments({ student: req.user._id }),
    Submission.countDocuments({ student: req.user._id, status: "CHECKED" }),
    Submission.countDocuments({ student: req.user._id, status: "EVALUATED" })
  ]);

  const submittedAssignments = await Submission.find({
    student: req.user._id
  }).select("assignment");

  const submittedAssignmentIds = submittedAssignments.map((item) =>
    String(item.assignment)
  );

  const pendingAssignments = await Assignment.countDocuments({
    ...assignmentFilter,
    _id: { $nin: submittedAssignmentIds }
  });

  const recentAssignments = await Assignment.find(assignmentFilter)
    .populate("subject", "name code semester")
    .populate("department", "name code")
    .populate("teacher", "name email")
    .sort({ createdAt: -1 })
    .limit(5);

  const recentSubmissions = await Submission.find({
    student: req.user._id
  })
    .populate("assignment", "title maxMarks dueDate year")
    .populate("student", "name email")
    .populate("teacher", "name email")
    .populate("department", "name code")
    .populate("subject", "name code")
    .sort({ submittedAt: -1, createdAt: -1 })
    .limit(5);

  return apiResponse(res, 200, "Student dashboard fetched successfully.", {
    stats: {
      totalAssignments,
      totalSubmissions,
      checkedSubmissions,
      evaluatedSubmissions,
      pendingAssignments
    },
    recentAssignments,
    recentSubmissions
  });
});

const getMyAssignments = asyncHandler(async (req, res) => {
  const studentProfile = await StudentProfile.findOne({
    user: req.user._id
  }).populate("department", "name code");

  if (!studentProfile) {
    throw new ApiError(404, "Student profile not found.");
  }

  const departmentId = studentProfile.department?._id || studentProfile.department;

  const assignments = await Assignment.find({
    department: departmentId,
    year: studentProfile.year,
    status: "PUBLISHED",
    isActive: true
  })
    .populate("subject", "name code semester")
    .populate("department", "name code")
    .populate("teacher", "name email")
    .sort({ dueDate: 1 });

  const submissions = await Submission.find({
    student: req.user._id
  }).select("assignment status plagiarismScore aiScore marks");

  const submittedAssignmentIds = new Map(
    submissions.map((submission) => [
      String(submission.assignment),
      {
        submissionId: submission._id,
        status: submission.status,
        plagiarismScore: submission.plagiarismScore,
        aiScore: submission.aiScore,
        marks: submission.marks
      }
    ])
  );

  const assignmentsWithStatus = assignments.map((assignment) => {
    const submissionInfo = submittedAssignmentIds.get(String(assignment._id));

    return {
      ...assignment.toObject(),
      submission: submissionInfo || null,
      isSubmitted: Boolean(submissionInfo)
    };
  });

  return apiResponse(res, 200, "Student assignments fetched successfully.", {
    assignments: assignmentsWithStatus
  });
});

const getStudentAssignmentById = asyncHandler(async (req, res) => {
  const studentProfile = await StudentProfile.findOne({
    user: req.user._id
  }).populate("department", "name code");

  if (!studentProfile) {
    throw new ApiError(404, "Student profile not found.");
  }

  const departmentId = studentProfile.department?._id || studentProfile.department;

  const assignment = await Assignment.findOne({
    _id: req.params.id,
    department: departmentId,
    year: studentProfile.year,
    status: "PUBLISHED",
    isActive: true
  })
    .populate("subject", "name code semester")
    .populate("department", "name code")
    .populate("teacher", "name email");

  if (!assignment) {
    throw new ApiError(404, "Assignment not found for your year.");
  }

  const submission = await Submission.findOne({
    assignment: assignment._id,
    student: req.user._id
  })
    .populate("student", "name email")
    .populate("teacher", "name email")
    .populate("department", "name code")
    .populate("subject", "name code");

  return apiResponse(res, 200, "Assignment fetched successfully.", {
    assignment,
    submission
  });
});

const getMySubmissions = asyncHandler(async (req, res) => {
  const submissions = await Submission.find({
    student: req.user._id
  })
    .populate("assignment", "title maxMarks dueDate")
    .populate("student", "name email")
    .populate("teacher", "name email")
    .populate("department", "name code")
    .populate("subject", "name code")
    .sort({ submittedAt: -1, createdAt: -1 });

  return apiResponse(res, 200, "Student submissions fetched successfully.", {
    submissions
  });
});

const getMySubmissionById = asyncHandler(async (req, res) => {
  const submission = await Submission.findOne({
    _id: req.params.id,
    student: req.user._id
  })
    .populate("assignment", "title description maxMarks dueDate")
    .populate("student", "name email")
    .populate("teacher", "name email")
    .populate("department", "name code")
    .populate("subject", "name code");

  if (!submission) {
    throw new ApiError(404, "Submission not found.");
  }

  const plagiarismReport = await PlagiarismReport.findOne({
    submission: submission._id,
    student: req.user._id
  }).populate("matchedSubmissions.student", "name email");

  const aiContentReport = await AIContentReport.findOne({
    submission: submission._id,
    student: req.user._id
  });

  const evaluation = await Evaluation.findOne({
    submission: submission._id,
    student: req.user._id
  }).populate("teacher", "name email");

  return apiResponse(res, 200, "Submission details fetched successfully.", {
    submission,
    plagiarismReport,
    aiContentReport,
    evaluation
  });
});

const getMyReports = asyncHandler(async (req, res) => {
  const plagiarismReports = await PlagiarismReport.find({
    student: req.user._id
  })
    .populate(
      "submission",
      "fileName originalFileName plagiarismScore aiScore status submittedAt"
    )
    .populate("assignment", "title maxMarks")
    .sort({ createdAt: -1 });

  const aiContentReports = await AIContentReport.find({
    student: req.user._id
  })
    .populate(
      "submission",
      "fileName originalFileName plagiarismScore aiScore status submittedAt"
    )
    .populate("assignment", "title maxMarks")
    .sort({ createdAt: -1 });

  return apiResponse(res, 200, "Student reports fetched successfully.", {
    plagiarismReports,
    aiContentReports
  });
});

const getMyFeedback = asyncHandler(async (req, res) => {
  const evaluations = await Evaluation.find({
    student: req.user._id
  })
    .populate("submission", "fileName originalFileName marks feedback status submittedAt")
    .populate("assignment", "title maxMarks")
    .populate("teacher", "name email")
    .sort({ createdAt: -1 });

  return apiResponse(res, 200, "Student feedback fetched successfully.", {
    evaluations
  });
});

module.exports = {
  getStudentDashboard,
  getMyAssignments,
  getStudentAssignmentById,
  getMySubmissions,
  getMySubmissionById,
  getMyReports,
  getMyFeedback
};