const Assignment = require("../models/Assignment");
const Subject = require("../models/Subject");
const TeacherProfile = require("../models/TeacherProfile");
const Submission = require("../models/Submission");

const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/apiError");
const apiResponse = require("../utils/apiResponse");
const { USER_ROLES, ASSIGNMENT_STATUS } = require("../config/constants");

const canTeacherAccessSubject = async (teacherId, subject) => {
  if (!subject) {
    return false;
  }

  const assignedTeacher =
    subject.teacher && String(subject.teacher) === String(teacherId);

  return Boolean(assignedTeacher);
};

const getAssignments = asyncHandler(async (req, res) => {
  const filter = {};

  if (req.user.role === USER_ROLES.TEACHER) {
    const assignedSubjects = await Subject.find({
      teacher: req.user._id
    }).select("_id");

    const assignedSubjectIds = assignedSubjects.map((subject) => subject._id);

    filter.$or = [
      { teacher: req.user._id },
      { subject: { $in: assignedSubjectIds } }
    ];
  }

  if (req.query.department) {
    filter.department = req.query.department;
  }

  if (req.query.subject) {
    filter.subject = req.query.subject;
  }

  if (req.query.year) {
    filter.year = req.query.year;
  }

  if (req.query.status) {
    filter.status = req.query.status;
  }

  const assignments = await Assignment.find(filter)
    .populate("subject", "name code semester teacher department")
    .populate("department", "name code")
    .populate("teacher", "name email")
    .sort({ createdAt: -1 });

  return apiResponse(res, 200, "Assignments fetched successfully.", {
    assignments
  });
});

const getAssignmentById = asyncHandler(async (req, res) => {
  const assignment = await Assignment.findById(req.params.id)
    .populate("subject", "name code semester teacher department")
    .populate("department", "name code")
    .populate("teacher", "name email");

  if (!assignment) {
    throw new ApiError(404, "Assignment not found.");
  }

  if (req.user.role === USER_ROLES.TEACHER) {
    const isCreator =
      String(assignment.teacher._id || assignment.teacher) ===
      String(req.user._id);

    const canAccess = await canTeacherAccessSubject(
      req.user._id,
      assignment.subject
    );

    if (!canAccess && !isCreator) {
      throw new ApiError(403, "You can view only your assigned assignments.");
    }
  }

  return apiResponse(res, 200, "Assignment fetched successfully.", {
    assignment
  });
});

const createAssignment = asyncHandler(async (req, res) => {
  const {
    title,
    description,
    subject,
    year,
    dueDate,
    maxMarks,
    status
  } = req.body;

  if (!title || !description || !subject || !year || !dueDate || !maxMarks) {
    throw new ApiError(
      400,
      "Title, description, subject, year, due date, and max marks are required."
    );
  }

  if (!["1", "2", "3", "4"].includes(String(year))) {
    throw new ApiError(400, "Valid year is required.");
  }

  const teacherProfile = await TeacherProfile.findOne({ user: req.user._id });

  if (!teacherProfile) {
    throw new ApiError(404, "Teacher profile not found.");
  }

  const subjectExists = await Subject.findById(subject).populate(
    "department",
    "name code"
  );

  if (!subjectExists || !subjectExists.isActive) {
    throw new ApiError(404, "Valid subject not found.");
  }

  if (String(subjectExists.teacher) !== String(req.user._id)) {
    throw new ApiError(
      403,
      "You can create assignment only for subjects assigned to you."
    );
  }

  const assignment = await Assignment.create({
    title: title.trim(),
    description: description.trim(),
    subject,
    department: subjectExists.department._id || subjectExists.department,
    year: String(year),
    teacher: req.user._id,
    dueDate,
    maxMarks: Number(maxMarks),
    status: status || ASSIGNMENT_STATUS.DRAFT
  });

  const populatedAssignment = await Assignment.findById(assignment._id)
    .populate("subject", "name code semester teacher department")
    .populate("department", "name code")
    .populate("teacher", "name email");

  return apiResponse(res, 201, "Assignment created successfully.", {
    assignment: populatedAssignment
  });
});

const updateAssignment = asyncHandler(async (req, res) => {
  const {
    title,
    description,
    subject,
    year,
    dueDate,
    maxMarks,
    status,
    isActive
  } = req.body;

  const assignment = await Assignment.findOne({
    _id: req.params.id,
    teacher: req.user._id
  });

  if (!assignment) {
    throw new ApiError(404, "Assignment not found.");
  }

  if (subject) {
    const subjectExists = await Subject.findById(subject).populate(
      "department",
      "name code"
    );

    if (!subjectExists || !subjectExists.isActive) {
      throw new ApiError(404, "Valid subject not found.");
    }

    if (String(subjectExists.teacher) !== String(req.user._id)) {
      throw new ApiError(
        403,
        "You can update assignment only with subjects assigned to you."
      );
    }

    assignment.subject = subject;
    assignment.department = subjectExists.department._id || subjectExists.department;
  }

  if (year !== undefined) {
    if (!["1", "2", "3", "4"].includes(String(year))) {
      throw new ApiError(400, "Valid year is required.");
    }

    assignment.year = String(year);
  }

  if (title !== undefined) assignment.title = title.trim();
  if (description !== undefined) assignment.description = description.trim();
  if (dueDate !== undefined) assignment.dueDate = dueDate;
  if (maxMarks !== undefined) assignment.maxMarks = Number(maxMarks);
  if (status !== undefined) assignment.status = status;
  if (isActive !== undefined) assignment.isActive = isActive;

  await assignment.save();

  const populatedAssignment = await Assignment.findById(assignment._id)
    .populate("subject", "name code semester teacher department")
    .populate("department", "name code")
    .populate("teacher", "name email");

  return apiResponse(res, 200, "Assignment updated successfully.", {
    assignment: populatedAssignment
  });
});

const deleteAssignment = asyncHandler(async (req, res) => {
  const assignment = await Assignment.findOne({
    _id: req.params.id,
    teacher: req.user._id
  });

  if (!assignment) {
    throw new ApiError(404, "Assignment not found.");
  }

  const submissionCount = await Submission.countDocuments({
    assignment: assignment._id
  });

  if (submissionCount > 0) {
    throw new ApiError(
      400,
      "Cannot delete assignment because submissions already exist. You can deactivate it instead."
    );
  }

  await Assignment.deleteOne({ _id: assignment._id });

  return apiResponse(res, 200, "Assignment deleted successfully.");
});

const publishAssignment = asyncHandler(async (req, res) => {
  const assignment = await Assignment.findOne({
    _id: req.params.id,
    teacher: req.user._id
  });

  if (!assignment) {
    throw new ApiError(404, "Assignment not found.");
  }

  if (!assignment.year) {
    throw new ApiError(400, "Please set year before publishing assignment.");
  }

  assignment.status = ASSIGNMENT_STATUS.PUBLISHED;
  await assignment.save();

  const populatedAssignment = await Assignment.findById(assignment._id)
    .populate("subject", "name code semester teacher department")
    .populate("department", "name code")
    .populate("teacher", "name email");

  return apiResponse(res, 200, "Assignment published successfully.", {
    assignment: populatedAssignment
  });
});

const closeAssignment = asyncHandler(async (req, res) => {
  const assignment = await Assignment.findOne({
    _id: req.params.id,
    teacher: req.user._id
  });

  if (!assignment) {
    throw new ApiError(404, "Assignment not found.");
  }

  assignment.status = ASSIGNMENT_STATUS.CLOSED;
  await assignment.save();

  const populatedAssignment = await Assignment.findById(assignment._id)
    .populate("subject", "name code semester teacher department")
    .populate("department", "name code")
    .populate("teacher", "name email");

  return apiResponse(res, 200, "Assignment closed successfully.", {
    assignment: populatedAssignment
  });
});

module.exports = {
  getAssignments,
  getAssignmentById,
  createAssignment,
  updateAssignment,
  deleteAssignment,
  publishAssignment,
  closeAssignment
};