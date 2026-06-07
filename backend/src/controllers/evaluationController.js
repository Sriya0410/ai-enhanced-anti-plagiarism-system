const Evaluation = require("../models/Evaluation");
const Submission = require("../models/Submission");

const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/apiError");
const apiResponse = require("../utils/apiResponse");
const { USER_ROLES, SUBMISSION_STATUS } = require("../config/constants");
const { createNotification } = require("../services/notificationService");

const createOrUpdateEvaluation = asyncHandler(async (req, res) => {
  const { submissionId, marks, feedback } = req.body;

  if (!submissionId || marks === undefined || !feedback) {
    throw new ApiError(400, "Submission ID, marks, and feedback are required.");
  }

  const submission = await Submission.findById(submissionId).populate(
    "assignment",
    "title maxMarks"
  );

  if (!submission) {
    throw new ApiError(404, "Submission not found.");
  }

  if (String(submission.teacher) !== String(req.user._id)) {
    throw new ApiError(403, "You can evaluate only your own assignment submissions.");
  }

  if (Number(marks) < 0 || Number(marks) > Number(submission.assignment.maxMarks)) {
    throw new ApiError(
      400,
      `Marks must be between 0 and ${submission.assignment.maxMarks}.`
    );
  }

  const evaluation = await Evaluation.findOneAndUpdate(
    { submission: submission._id },
    {
      submission: submission._id,
      assignment: submission.assignment._id,
      student: submission.student,
      teacher: req.user._id,
      marks,
      feedback
    },
    {
      new: true,
      upsert: true,
      runValidators: true
    }
  )
    .populate("assignment", "title maxMarks")
    .populate("student", "name email")
    .populate("teacher", "name email");

  submission.marks = marks;
  submission.feedback = feedback;
  submission.status = SUBMISSION_STATUS.EVALUATED;
  await submission.save();

  await createNotification({
    recipient: submission.student,
    title: "Assignment Evaluated",
    message: `Your assignment "${submission.assignment.title}" has been evaluated.`,
    type: "EVALUATION_DONE"
  });

  return apiResponse(res, 200, "Evaluation saved successfully.", {
    evaluation
  });
});

const getEvaluations = asyncHandler(async (req, res) => {
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

  const evaluations = await Evaluation.find(filter)
    .populate("submission", "fileName originalFileName marks feedback status submittedAt")
    .populate("assignment", "title maxMarks")
    .populate("student", "name email")
    .populate("teacher", "name email")
    .sort({ createdAt: -1 });

  return apiResponse(res, 200, "Evaluations fetched successfully.", {
    evaluations
  });
});

const getEvaluationBySubmission = asyncHandler(async (req, res) => {
  const submission = await Submission.findById(req.params.submissionId);

  if (!submission) {
    throw new ApiError(404, "Submission not found.");
  }

  if (
    req.user.role === USER_ROLES.STUDENT &&
    String(submission.student) !== String(req.user._id)
  ) {
    throw new ApiError(403, "You can view only your own evaluation.");
  }

  if (
    req.user.role === USER_ROLES.TEACHER &&
    String(submission.teacher) !== String(req.user._id)
  ) {
    throw new ApiError(403, "You can view only your assignment evaluation.");
  }

  const evaluation = await Evaluation.findOne({
    submission: submission._id
  })
    .populate("submission", "fileName originalFileName marks feedback status submittedAt")
    .populate("assignment", "title maxMarks")
    .populate("student", "name email")
    .populate("teacher", "name email");

  if (!evaluation) {
    throw new ApiError(404, "Feedback pending.");
  }

  return apiResponse(res, 200, "Evaluation fetched successfully.", {
    evaluation
  });
});

const getEvaluationById = asyncHandler(async (req, res) => {
  const evaluation = await Evaluation.findById(req.params.id)
    .populate("submission", "fileName originalFileName marks feedback status submittedAt")
    .populate("assignment", "title maxMarks")
    .populate("student", "name email")
    .populate("teacher", "name email");

  if (!evaluation) {
    throw new ApiError(404, "Evaluation not found.");
  }

  if (
    req.user.role === USER_ROLES.STUDENT &&
    String(evaluation.student?._id || evaluation.student) !== String(req.user._id)
  ) {
    throw new ApiError(403, "You can view only your own evaluation.");
  }

  if (
    req.user.role === USER_ROLES.TEACHER &&
    String(evaluation.teacher?._id || evaluation.teacher) !== String(req.user._id)
  ) {
    throw new ApiError(403, "You can view only your assignment evaluation.");
  }

  return apiResponse(res, 200, "Evaluation fetched successfully.", {
    evaluation
  });
});

module.exports = {
  createOrUpdateEvaluation,
  getEvaluations,
  getEvaluationBySubmission,
  getEvaluationById
};