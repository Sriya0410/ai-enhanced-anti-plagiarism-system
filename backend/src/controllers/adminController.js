const User = require("../models/User");
const AdminProfile = require("../models/AdminProfile");
const TeacherProfile = require("../models/TeacherProfile");
const StudentProfile = require("../models/StudentProfile");
const Department = require("../models/Department");
const Subject = require("../models/Subject");
const Assignment = require("../models/Assignment");
const Submission = require("../models/Submission");
const PlagiarismReport = require("../models/PlagiarismReport");
const AIContentReport = require("../models/AIContentReport");
const Evaluation = require("../models/Evaluation");

const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/apiError");
const apiResponse = require("../utils/apiResponse");
const { USER_ROLES } = require("../config/constants");
const { buildCombinedUser } = require("./authController");

const generateEmployeeId = async () => {
  let count = await TeacherProfile.countDocuments();
  let employeeId = "";

  while (true) {
    count += 1;
    employeeId = `TCH${String(count).padStart(3, "0")}`;

    const existing = await TeacherProfile.findOne({ employeeId });

    if (!existing) {
      return employeeId;
    }
  }
};

const getAdminDashboard = asyncHandler(async (req, res) => {
  const [
    totalStudents,
    totalTeachers,
    totalDepartments,
    totalSubjects,
    totalAssignments,
    totalSubmissions,
    totalPlagiarismReports,
    totalAIReports,
    checkedSubmissions,
    evaluatedSubmissions,
    totalEvaluations,
    recentAssignments,
    recentSubmissions
  ] = await Promise.all([
    User.countDocuments({ role: USER_ROLES.STUDENT }),
    User.countDocuments({ role: USER_ROLES.TEACHER }),
    Department.countDocuments(),
    Subject.countDocuments(),
    Assignment.countDocuments(),
    Submission.countDocuments(),
    PlagiarismReport.countDocuments(),
    AIContentReport.countDocuments(),
    Submission.countDocuments({ status: "CHECKED" }),
    Submission.countDocuments({ status: "EVALUATED" }),
    Evaluation.countDocuments(),

    Assignment.find()
      .populate("teacher", "name email")
      .populate("department", "name code")
      .populate("subject", "name code")
      .sort({ createdAt: -1 })
      .limit(5),

    Submission.find()
      .populate("student", "name email")
      .populate("teacher", "name email")
      .populate("assignment", "title maxMarks")
      .populate("department", "name code")
      .populate("subject", "name code")
      .sort({ createdAt: -1 })
      .limit(5)
  ]);

  return apiResponse(res, 200, "Admin dashboard fetched successfully.", {
    stats: {
      totalStudents,
      totalTeachers,
      totalDepartments,
      totalSubjects,
      totalAssignments,
      totalSubmissions,
      totalPlagiarismReports,
      totalAIReports,
      checkedSubmissions,
      evaluatedSubmissions,
      totalEvaluations
    },
    recentAssignments,
    recentSubmissions
  });
});

const createUserByAdmin = asyncHandler(async (req, res) => {
  const {
    name,
    email,
    password,
    role,
    department,
    rollNumber,
    year,
    section,
    phone,
    employeeId,
    qualification,
    experience,
    designation,
    permissions
  } = req.body;

  if (!name || !email || !password || !role) {
    throw new ApiError(400, "Name, email, password, and role are required.");
  }

  if (!Object.values(USER_ROLES).includes(role)) {
    throw new ApiError(400, "Invalid role.");
  }

  const cleanName = name.trim();
  const cleanEmail = email.toLowerCase().trim();

  const existingUser = await User.findOne({ email: cleanEmail });

  if (existingUser) {
    throw new ApiError(400, "Email already exists.");
  }

  if (
    (role === USER_ROLES.STUDENT || role === USER_ROLES.TEACHER) &&
    department
  ) {
    const departmentExists = await Department.findById(department);

    if (!departmentExists || !departmentExists.isActive) {
      throw new ApiError(404, "Valid department not found.");
    }
  }

  if (role === USER_ROLES.STUDENT) {
    if (!department || !rollNumber || !year || !section) {
      throw new ApiError(
        400,
        "Department, roll number, year, and section are required for student."
      );
    }

    const cleanRollNumber = rollNumber.toUpperCase().trim();

    const existingRollNumber = await StudentProfile.findOne({
      rollNumber: cleanRollNumber
    });

    if (existingRollNumber) {
      throw new ApiError(400, "Roll number already exists.");
    }
  }

  if (role === USER_ROLES.TEACHER) {
    if (!department) {
      throw new ApiError(400, "Department is required for teacher.");
    }

    if (employeeId) {
      const existingEmployeeId = await TeacherProfile.findOne({
        employeeId: employeeId.toUpperCase().trim()
      });

      if (existingEmployeeId) {
        throw new ApiError(400, "Employee ID already exists.");
      }
    }
  }

  let user = null;

  try {
    user = await User.create({
      name: cleanName,
      email: cleanEmail,
      password,
      role
    });

    if (role === USER_ROLES.ADMIN) {
      await AdminProfile.create({
        user: user._id,
        phone: phone || "",
        designation: designation || "System Administrator",
        permissions: permissions || []
      });
    }

    if (role === USER_ROLES.TEACHER) {
      const finalEmployeeId = employeeId
        ? employeeId.toUpperCase().trim()
        : await generateEmployeeId();

      await TeacherProfile.create({
        user: user._id,
        department,
        employeeId: finalEmployeeId,
        phone: phone || "",
        qualification: qualification || "",
        experience: experience || "",
        designation: designation || "Assistant Professor"
      });
    }

    if (role === USER_ROLES.STUDENT) {
      await StudentProfile.create({
        user: user._id,
        department,
        rollNumber: rollNumber.toUpperCase().trim(),
        year: String(year),
        section: section.toUpperCase().trim(),
        phone: phone || ""
      });
    }

    const safeUser = await User.findById(user._id).select("-password");
    const combinedUser = await buildCombinedUser(safeUser);

    return apiResponse(res, 201, `${role} created successfully.`, {
      user: combinedUser
    });
  } catch (error) {
    if (user?._id) {
      await User.findByIdAndDelete(user._id);
      await AdminProfile.deleteOne({ user: user._id });
      await TeacherProfile.deleteOne({ user: user._id });
      await StudentProfile.deleteOne({ user: user._id });
    }

    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern || {})[0];

      if (field === "email") {
        throw new ApiError(400, "Email already exists.");
      }

      if (field === "rollNumber") {
        throw new ApiError(400, "Roll number already exists.");
      }

      if (field === "employeeId") {
        throw new ApiError(400, "Employee ID already exists.");
      }

      throw new ApiError(400, "Duplicate value already exists.");
    }

    throw error;
  }
});

const getAllStudents = asyncHandler(async (req, res) => {
  const students = await User.find({ role: USER_ROLES.STUDENT })
    .select("-password")
    .sort({ createdAt: -1 });

  const combinedStudents = await Promise.all(
    students.map((student) => buildCombinedUser(student))
  );

  return apiResponse(res, 200, "Students fetched successfully.", {
    students: combinedStudents
  });
});

const getAllTeachers = asyncHandler(async (req, res) => {
  const teachers = await User.find({ role: USER_ROLES.TEACHER })
    .select("-password")
    .sort({ createdAt: -1 });

  const combinedTeachers = await Promise.all(
    teachers.map((teacher) => buildCombinedUser(teacher))
  );

  return apiResponse(res, 200, "Teachers fetched successfully.", {
    teachers: combinedTeachers
  });
});

const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select("-password").sort({ createdAt: -1 });

  const combinedUsers = await Promise.all(
    users.map((user) => buildCombinedUser(user))
  );

  return apiResponse(res, 200, "Users fetched successfully.", {
    users: combinedUsers
  });
});

const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");

  if (!user) {
    throw new ApiError(404, "User not found.");
  }

  const combinedUser = await buildCombinedUser(user);

  return apiResponse(res, 200, "User fetched successfully.", {
    user: combinedUser
  });
});

const updateUserByAdmin = asyncHandler(async (req, res) => {
  const {
    name,
    email,
    role,
    isActive,
    department,
    rollNumber,
    year,
    section,
    phone,
    employeeId,
    qualification,
    experience,
    designation,
    permissions
  } = req.body;

  const user = await User.findById(req.params.id);

  if (!user) {
    throw new ApiError(404, "User not found.");
  }

  if (role && role !== user.role) {
    throw new ApiError(
      400,
      "Changing user role is not allowed. Create a new user for another role."
    );
  }

  if (email && email.toLowerCase().trim() !== user.email) {
    const cleanEmail = email.toLowerCase().trim();

    const emailExists = await User.findOne({
      email: cleanEmail,
      _id: { $ne: user._id }
    });

    if (emailExists) {
      throw new ApiError(400, "Email already exists.");
    }

    user.email = cleanEmail;
  }

  if (name !== undefined) {
    user.name = name.trim();
  }

  if (isActive !== undefined) {
    user.isActive = isActive;
  }

  await user.save();

  if (
    (user.role === USER_ROLES.STUDENT || user.role === USER_ROLES.TEACHER) &&
    department !== undefined
  ) {
    const departmentExists = await Department.findById(department);

    if (!departmentExists || !departmentExists.isActive) {
      throw new ApiError(404, "Valid department not found.");
    }
  }

  if (user.role === USER_ROLES.STUDENT) {
    if (rollNumber) {
      const cleanRollNumber = rollNumber.toUpperCase().trim();

      const existingRollNumber = await StudentProfile.findOne({
        rollNumber: cleanRollNumber,
        user: { $ne: user._id }
      });

      if (existingRollNumber) {
        throw new ApiError(400, "Roll number already exists.");
      }
    }

    await StudentProfile.findOneAndUpdate(
      { user: user._id },
      {
        ...(department !== undefined && { department }),
        ...(rollNumber !== undefined && {
          rollNumber: rollNumber.toUpperCase().trim()
        }),
        ...(year !== undefined && { year: String(year) }),
        ...(section !== undefined && { section: section.toUpperCase().trim() }),
        ...(phone !== undefined && { phone })
      },
      { new: true, runValidators: true }
    );
  }

  if (user.role === USER_ROLES.TEACHER) {
    if (employeeId) {
      const cleanEmployeeId = employeeId.toUpperCase().trim();

      const existingEmployeeId = await TeacherProfile.findOne({
        employeeId: cleanEmployeeId,
        user: { $ne: user._id }
      });

      if (existingEmployeeId) {
        throw new ApiError(400, "Employee ID already exists.");
      }
    }

    await TeacherProfile.findOneAndUpdate(
      { user: user._id },
      {
        ...(department !== undefined && { department }),
        ...(employeeId !== undefined &&
          employeeId && { employeeId: employeeId.toUpperCase().trim() }),
        ...(phone !== undefined && { phone }),
        ...(qualification !== undefined && { qualification }),
        ...(experience !== undefined && { experience }),
        ...(designation !== undefined && { designation })
      },
      { new: true, runValidators: true }
    );
  }

  if (user.role === USER_ROLES.ADMIN) {
    await AdminProfile.findOneAndUpdate(
      { user: user._id },
      {
        ...(phone !== undefined && { phone }),
        ...(designation !== undefined && { designation }),
        ...(permissions !== undefined && { permissions })
      },
      { new: true, runValidators: true }
    );
  }

  const updatedUser = await User.findById(user._id).select("-password");
  const combinedUser = await buildCombinedUser(updatedUser);

  return apiResponse(res, 200, "User updated successfully.", {
    user: combinedUser
  });
});

const deleteUserByAdmin = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    throw new ApiError(404, "User not found.");
  }

  if (String(user._id) === String(req.user._id)) {
    throw new ApiError(400, "You cannot delete your own account.");
  }

  if (user.role === USER_ROLES.ADMIN) {
    await AdminProfile.deleteOne({ user: user._id });
  }

  if (user.role === USER_ROLES.TEACHER) {
    await TeacherProfile.deleteOne({ user: user._id });
  }

  if (user.role === USER_ROLES.STUDENT) {
    await StudentProfile.deleteOne({ user: user._id });
  }

  await User.deleteOne({ _id: user._id });

  return apiResponse(res, 200, "User deleted successfully.");
});

const toggleUserStatus = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    throw new ApiError(404, "User not found.");
  }

  if (String(user._id) === String(req.user._id)) {
    throw new ApiError(400, "You cannot change your own status.");
  }

  user.isActive = !user.isActive;
  await user.save();

  const combinedUser = await buildCombinedUser(user);

  return apiResponse(res, 200, "User status updated successfully.", {
    user: combinedUser
  });
});

module.exports = {
  getAdminDashboard,
  createUserByAdmin,
  getAllUsers,
  getAllStudents,
  getAllTeachers,
  getUserById,
  updateUserByAdmin,
  deleteUserByAdmin,
  toggleUserStatus
};