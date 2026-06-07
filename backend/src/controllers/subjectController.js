const Subject = require("../models/Subject");
const Department = require("../models/Department");
const User = require("../models/User");

const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/apiError");
const apiResponse = require("../utils/apiResponse");
const { USER_ROLES } = require("../config/constants");

const getSubjects = asyncHandler(async (req, res) => {
  const filter = {};

  if (req.query.department) {
    filter.department = req.query.department;
  }

  if (req.query.teacher) {
    filter.teacher = req.query.teacher;
  }

  if (req.query.isActive !== undefined) {
    filter.isActive = req.query.isActive === "true";
  }

  const subjects = await Subject.find(filter)
    .populate("department", "name code")
    .populate("teacher", "name email")
    .sort({ createdAt: -1 });

  return apiResponse(res, 200, "Subjects fetched successfully.", {
    subjects
  });
});

const getMyTeacherSubjects = asyncHandler(async (req, res) => {
  const subjects = await Subject.find({
    teacher: req.user._id,
    isActive: true
  })
    .populate("department", "name code")
    .populate("teacher", "name email")
    .sort({ name: 1 });

  return apiResponse(res, 200, "Teacher assigned subjects fetched successfully.", {
    subjects
  });
});

const getSubjectById = asyncHandler(async (req, res) => {
  const subject = await Subject.findById(req.params.id)
    .populate("department", "name code")
    .populate("teacher", "name email");

  if (!subject) {
    throw new ApiError(404, "Subject not found.");
  }

  return apiResponse(res, 200, "Subject fetched successfully.", {
    subject
  });
});

const createSubject = asyncHandler(async (req, res) => {
  const {
    name,
    code,
    department,
    teacher,
    semester,
    description,
    isActive
  } = req.body;

  if (!name || !code || !department || !semester) {
    throw new ApiError(400, "Name, code, department, and semester are required.");
  }

  const departmentExists = await Department.findById(department);

  if (!departmentExists) {
    throw new ApiError(404, "Department not found.");
  }

  const codeExists = await Subject.findOne({ code: code.toUpperCase().trim() });

  if (codeExists) {
    throw new ApiError(400, "Subject code already exists.");
  }

  if (teacher) {
    const teacherExists = await User.findOne({
      _id: teacher,
      role: USER_ROLES.TEACHER
    });

    if (!teacherExists) {
      throw new ApiError(404, "Teacher not found.");
    }
  }

  const subject = await Subject.create({
    name: name.trim(),
    code: code.toUpperCase().trim(),
    department,
    teacher: teacher || null,
    semester,
    description,
    isActive
  });

  const populatedSubject = await Subject.findById(subject._id)
    .populate("department", "name code")
    .populate("teacher", "name email");

  return apiResponse(res, 201, "Subject created successfully.", {
    subject: populatedSubject
  });
});

const updateSubject = asyncHandler(async (req, res) => {
  const {
    name,
    code,
    department,
    teacher,
    semester,
    description,
    isActive
  } = req.body;

  const subject = await Subject.findById(req.params.id);

  if (!subject) {
    throw new ApiError(404, "Subject not found.");
  }

  if (code && code.toUpperCase().trim() !== subject.code) {
    const codeExists = await Subject.findOne({ code: code.toUpperCase().trim() });

    if (codeExists) {
      throw new ApiError(400, "Subject code already exists.");
    }

    subject.code = code.toUpperCase().trim();
  }

  if (department) {
    const departmentExists = await Department.findById(department);

    if (!departmentExists) {
      throw new ApiError(404, "Department not found.");
    }

    subject.department = department;
  }

  if (teacher) {
    const teacherExists = await User.findOne({
      _id: teacher,
      role: USER_ROLES.TEACHER
    });

    if (!teacherExists) {
      throw new ApiError(404, "Teacher not found.");
    }

    subject.teacher = teacher;
  }

  if (teacher === null || teacher === "") {
    subject.teacher = null;
  }

  if (name !== undefined) subject.name = name.trim();
  if (semester !== undefined) subject.semester = semester;
  if (description !== undefined) subject.description = description;
  if (isActive !== undefined) subject.isActive = isActive;

  await subject.save();

  const populatedSubject = await Subject.findById(subject._id)
    .populate("department", "name code")
    .populate("teacher", "name email");

  return apiResponse(res, 200, "Subject updated successfully.", {
    subject: populatedSubject
  });
});

const deleteSubject = asyncHandler(async (req, res) => {
  const subject = await Subject.findById(req.params.id);

  if (!subject) {
    throw new ApiError(404, "Subject not found.");
  }

  await Subject.deleteOne({ _id: subject._id });

  return apiResponse(res, 200, "Subject deleted successfully.");
});

module.exports = {
  getSubjects,
  getMyTeacherSubjects,
  getSubjectById,
  createSubject,
  updateSubject,
  deleteSubject
};