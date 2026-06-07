const User = require("../models/User");
const StudentProfile = require("../models/StudentProfile");
const TeacherProfile = require("../models/TeacherProfile");
const AdminProfile = require("../models/AdminProfile");
const Department = require("../models/Department");

const generateToken = require("../utils/generateToken");
const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/apiError");
const apiResponse = require("../utils/apiResponse");
const { USER_ROLES } = require("../config/constants");

const buildCombinedUser = async (user) => {
  const baseUser = {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    profileImage: user.profileImage,
    isActive: user.isActive
  };

  if (user.role === USER_ROLES.STUDENT) {
    const profile = await StudentProfile.findOne({ user: user._id }).populate(
      "department",
      "name code"
    );

    return {
      ...baseUser,
      profileId: profile?._id || null,
      department: profile?.department || null,
      rollNumber: profile?.rollNumber || "",
      year: profile?.year || "",
      section: profile?.section || "",
      phone: profile?.phone || ""
    };
  }

  if (user.role === USER_ROLES.TEACHER) {
    const profile = await TeacherProfile.findOne({ user: user._id }).populate(
      "department",
      "name code"
    );

    return {
      ...baseUser,
      profileId: profile?._id || null,
      department: profile?.department || null,
      employeeId: profile?.employeeId || "",
      phone: profile?.phone || "",
      qualification: profile?.qualification || "",
      experience: profile?.experience || "",
      designation: profile?.designation || ""
    };
  }

  if (user.role === USER_ROLES.ADMIN) {
    const profile = await AdminProfile.findOne({ user: user._id });

    return {
      ...baseUser,
      profileId: profile?._id || null,
      phone: profile?.phone || "",
      designation: profile?.designation || "",
      permissions: profile?.permissions || []
    };
  }

  return baseUser;
};

const registerStudent = asyncHandler(async (req, res) => {
  const {
    name,
    email,
    password,
    department,
    rollNumber,
    year,
    section,
    phone
  } = req.body;

  if (
    !name ||
    !email ||
    !password ||
    !department ||
    !rollNumber ||
    !year ||
    !section
  ) {
    throw new ApiError(
      400,
      "Name, email, password, department, roll number, year, and section are required."
    );
  }

  const cleanEmail = email.toLowerCase().trim();
  const cleanRollNumber = rollNumber.toUpperCase().trim();
  const cleanSection = section.toUpperCase().trim();

  const departmentExists = await Department.findById(department);

  if (!departmentExists || !departmentExists.isActive) {
    throw new ApiError(404, "Valid department not found.");
  }

  const existingUser = await User.findOne({ email: cleanEmail });

  if (existingUser) {
    throw new ApiError(400, "Email already exists.");
  }

  const existingRollNumber = await StudentProfile.findOne({
    rollNumber: cleanRollNumber
  });

  if (existingRollNumber) {
    throw new ApiError(400, "Roll number already exists.");
  }

  let user = null;

  try {
    user = await User.create({
      name: name.trim(),
      email: cleanEmail,
      password,
      role: USER_ROLES.STUDENT
    });

    await StudentProfile.create({
      user: user._id,
      department,
      rollNumber: cleanRollNumber,
      year: String(year),
      section: cleanSection,
      phone: phone || ""
    });

    const safeUser = await User.findById(user._id).select("-password");
    const combinedUser = await buildCombinedUser(safeUser);
    const token = generateToken(user._id, user.role);

    return apiResponse(res, 201, "Student registered successfully.", {
      user: combinedUser,
      token
    });
  } catch (error) {
    if (user?._id) {
      await User.findByIdAndDelete(user._id);
    }

    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern || {})[0];

      if (field === "email") {
        throw new ApiError(400, "Email already exists.");
      }

      if (field === "rollNumber") {
        throw new ApiError(400, "Roll number already exists.");
      }

      throw new ApiError(400, "Duplicate value already exists.");
    }

    throw error;
  }
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, "Email and password are required.");
  }

  const user = await User.findOne({
    email: email.toLowerCase().trim()
  }).select("+password");

  if (!user) {
    throw new ApiError(401, "Invalid email or password.");
  }

  if (!user.isActive) {
    throw new ApiError(403, "Your account is inactive. Please contact admin.");
  }

  const isPasswordMatched = await user.matchPassword(password);

  if (!isPasswordMatched) {
    throw new ApiError(401, "Invalid email or password.");
  }

  const safeUser = await User.findById(user._id).select("-password");
  const combinedUser = await buildCombinedUser(safeUser);
  const token = generateToken(user._id, user.role);

  return apiResponse(res, 200, "Login successful.", {
    user: combinedUser,
    token
  });
});

const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");

  if (!user) {
    throw new ApiError(404, "User not found.");
  }

  const combinedUser = await buildCombinedUser(user);

  return apiResponse(res, 200, "User profile fetched successfully.", {
    user: combinedUser
  });
});

const updateMyProfile = asyncHandler(async (req, res) => {
  const {
    name,
    phone,
    profileImage,
    qualification,
    experience,
    designation,
    year,
    section
  } = req.body;

  const user = await User.findById(req.user._id);

  if (!user) {
    throw new ApiError(404, "User not found.");
  }

  if (name) {
    user.name = name.trim();
  }

  if (profileImage !== undefined) {
    user.profileImage = profileImage;
  }

  await user.save();

  if (user.role === USER_ROLES.STUDENT) {
    await StudentProfile.findOneAndUpdate(
      { user: user._id },
      {
        ...(phone !== undefined && { phone }),
        ...(year !== undefined && { year }),
        ...(section !== undefined && { section: section.toUpperCase() })
      },
      { new: true, runValidators: true }
    );
  }

  if (user.role === USER_ROLES.TEACHER) {
    await TeacherProfile.findOneAndUpdate(
      { user: user._id },
      {
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
        ...(designation !== undefined && { designation })
      },
      { new: true, runValidators: true }
    );
  }

  const updatedUser = await User.findById(user._id).select("-password");
  const combinedUser = await buildCombinedUser(updatedUser);

  return apiResponse(res, 200, "Profile updated successfully.", {
    user: combinedUser
  });
});

const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    throw new ApiError(400, "Current password and new password are required.");
  }

  if (newPassword.length < 6) {
    throw new ApiError(400, "New password must be at least 6 characters.");
  }

  const user = await User.findById(req.user._id).select("+password");

  if (!user) {
    throw new ApiError(404, "User not found.");
  }

  const isMatched = await user.matchPassword(currentPassword);

  if (!isMatched) {
    throw new ApiError(400, "Current password is incorrect.");
  }

  user.password = newPassword;
  await user.save();

  return apiResponse(res, 200, "Password changed successfully.");
});

module.exports = {
  registerStudent,
  loginUser,
  getMe,
  updateMyProfile,
  changePassword,
  buildCombinedUser
};