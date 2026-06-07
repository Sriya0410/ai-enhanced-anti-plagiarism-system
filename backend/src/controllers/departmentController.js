const Department = require("../models/Department");
const Subject = require("../models/Subject");
const StudentProfile = require("../models/StudentProfile");
const TeacherProfile = require("../models/TeacherProfile");

const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/apiError");
const apiResponse = require("../utils/apiResponse");

const getDepartments = asyncHandler(async (req, res) => {
  const departments = await Department.find()
    .sort({ name: 1 });

  return apiResponse(res, 200, "Departments fetched successfully.", {
    departments
  });
});

const getActiveDepartments = asyncHandler(async (req, res) => {
  const departments = await Department.find({ isActive: true })
    .sort({ name: 1 });

  return apiResponse(res, 200, "Active departments fetched successfully.", {
    departments
  });
});

const getDepartmentById = asyncHandler(async (req, res) => {
  const department = await Department.findById(req.params.id);

  if (!department) {
    throw new ApiError(404, "Department not found.");
  }

  return apiResponse(res, 200, "Department fetched successfully.", {
    department
  });
});

const createDepartment = asyncHandler(async (req, res) => {
  const { name, code, description, isActive } = req.body;

  if (!name || !code) {
    throw new ApiError(400, "Department name and code are required.");
  }

  const departmentExists = await Department.findOne({
    code: code.toUpperCase()
  });

  if (departmentExists) {
    throw new ApiError(400, "Department code already exists.");
  }

  const department = await Department.create({
    name,
    code,
    description,
    isActive
  });

  return apiResponse(res, 201, "Department created successfully.", {
    department
  });
});

const updateDepartment = asyncHandler(async (req, res) => {
  const { name, code, description, isActive } = req.body;

  const department = await Department.findById(req.params.id);

  if (!department) {
    throw new ApiError(404, "Department not found.");
  }

  if (code && code.toUpperCase() !== department.code) {
    const codeExists = await Department.findOne({
      code: code.toUpperCase()
    });

    if (codeExists) {
      throw new ApiError(400, "Department code already exists.");
    }

    department.code = code;
  }

  if (name !== undefined) department.name = name;
  if (description !== undefined) department.description = description;
  if (isActive !== undefined) department.isActive = isActive;

  await department.save();

  return apiResponse(res, 200, "Department updated successfully.", {
    department
  });
});

const deleteDepartment = asyncHandler(async (req, res) => {
  const department = await Department.findById(req.params.id);

  if (!department) {
    throw new ApiError(404, "Department not found.");
  }

  const subjectCount = await Subject.countDocuments({ department: department._id });
  const studentCount = await StudentProfile.countDocuments({ department: department._id });
  const teacherCount = await TeacherProfile.countDocuments({ department: department._id });

  if (subjectCount > 0 || studentCount > 0 || teacherCount > 0) {
    throw new ApiError(
      400,
      "Cannot delete department because it is linked with subjects, students, or teachers. You can deactivate it instead."
    );
  }

  await Department.deleteOne({ _id: department._id });

  return apiResponse(res, 200, "Department deleted successfully.");
});

module.exports = {
  getDepartments,
  getActiveDepartments,
  getDepartmentById,
  createDepartment,
  updateDepartment,
  deleteDepartment
};