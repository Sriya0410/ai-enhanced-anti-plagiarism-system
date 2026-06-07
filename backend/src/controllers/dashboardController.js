const User = require("../models/User");
const Department = require("../models/Department");
const Assignment = require("../models/Assignment");
const Submission = require("../models/Submission");
const PlagiarismReport = require("../models/PlagiarismReport");
const AIContentReport = require("../models/AIContentReport");
const Evaluation = require("../models/Evaluation");
const StudentProfile = require("../models/StudentProfile");

const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/apiError");
const apiResponse = require("../utils/apiResponse");
const { USER_ROLES } = require("../config/constants");

const getDashboard = asyncHandler(async (req, res) => {
  if (req.user.role === USER_ROLES.ADMIN) {
    const [
      students,
      teachers,
      departments,
      assignments,
      submissions,
      plagiarismReports,
      aiReports,
      evaluations,
      recentAssignments,
      recentSubmissions
    ] = await Promise.all([
      User.countDocuments({ role: USER_ROLES.STUDENT }),
      User.countDocuments({ role: USER_ROLES.TEACHER }),
      Department.countDocuments(),
      Assignment.countDocuments(),
      Submission.countDocuments(),
      PlagiarismReport.countDocuments(),
      AIContentReport.countDocuments(),
      Evaluation.countDocuments(),

      Assignment.find()
        .populate("subject", "name code semester")
        .populate("department", "name code")
        .populate("teacher", "name email")
        .sort({ createdAt: -1 })
        .limit(5),

      Submission.find()
        .populate("assignment", "title maxMarks dueDate")
        .populate("student", "name email")
        .populate("teacher", "name email")
        .populate("department", "name code")
        .populate("subject", "name code")
        .sort({ submittedAt: -1, createdAt: -1 })
        .limit(5)
    ]);

    return apiResponse(res, 200, "Dashboard fetched successfully.", {
      role: USER_ROLES.ADMIN,
      stats: {
        students,
        teachers,
        departments,
        assignments,
        submissions,
        plagiarismReports,
        aiReports,
        evaluations
      },
      recentAssignments,
      recentSubmissions
    });
  }

  if (req.user.role === USER_ROLES.TEACHER) {
    const [
      assignments,
      submissions,
      checkedSubmissions,
      evaluatedSubmissions,
      recentSubmissions
    ] = await Promise.all([
      Assignment.countDocuments({ teacher: req.user._id }),
      Submission.countDocuments({ teacher: req.user._id }),
      Submission.countDocuments({ teacher: req.user._id, status: "CHECKED" }),
      Submission.countDocuments({ teacher: req.user._id, status: "EVALUATED" }),

      Submission.find({ teacher: req.user._id })
        .populate("assignment", "title maxMarks dueDate")
        .populate("student", "name email")
        .populate("teacher", "name email")
        .populate("department", "name code")
        .populate("subject", "name code")
        .sort({ submittedAt: -1, createdAt: -1 })
        .limit(5)
    ]);

    return apiResponse(res, 200, "Dashboard fetched successfully.", {
      role: USER_ROLES.TEACHER,
      stats: {
        assignments,
        submissions,
        checkedSubmissions,
        evaluatedSubmissions
      },
      recentSubmissions
    });
  }

  if (req.user.role === USER_ROLES.STUDENT) {
    const studentProfile = await StudentProfile.findOne({
      user: req.user._id
    }).populate("department", "name code");

    if (!studentProfile) {
      throw new ApiError(404, "Student profile not found.");
    }

    const departmentId = studentProfile.department?._id || studentProfile.department;

    const [
      assignments,
      submissions,
      checkedSubmissions,
      evaluatedSubmissions,
      recentAssignments,
      recentSubmissions
    ] = await Promise.all([
      Assignment.countDocuments({
        department: departmentId,
        status: "PUBLISHED",
        isActive: true
      }),
      Submission.countDocuments({ student: req.user._id }),
      Submission.countDocuments({ student: req.user._id, status: "CHECKED" }),
      Submission.countDocuments({ student: req.user._id, status: "EVALUATED" }),

      Assignment.find({
        department: departmentId,
        status: "PUBLISHED",
        isActive: true
      })
        .populate("subject", "name code semester")
        .populate("department", "name code")
        .populate("teacher", "name email")
        .sort({ createdAt: -1 })
        .limit(5),

      Submission.find({ student: req.user._id })
        .populate("assignment", "title maxMarks dueDate")
        .populate("student", "name email")
        .populate("teacher", "name email")
        .populate("department", "name code")
        .populate("subject", "name code")
        .sort({ submittedAt: -1, createdAt: -1 })
        .limit(5)
    ]);

    return apiResponse(res, 200, "Dashboard fetched successfully.", {
      role: USER_ROLES.STUDENT,
      stats: {
        assignments,
        submissions,
        checkedSubmissions,
        evaluatedSubmissions
      },
      recentAssignments,
      recentSubmissions
    });
  }

  throw new ApiError(403, "Invalid role.");
});

const getSystemAnalytics = asyncHandler(async (req, res) => {
  const submissions = await Submission.find()
    .populate("assignment", "title")
    .populate("student", "name email")
    .populate("teacher", "name email")
    .populate("department", "name code")
    .populate("subject", "name code");

  const plagiarismHigh = submissions.filter(
    (item) => Number(item.plagiarismScore || 0) >= 70
  ).length;

  const plagiarismMedium = submissions.filter((item) => {
    const score = Number(item.plagiarismScore || 0);
    return score >= 35 && score < 70;
  }).length;

  const plagiarismLow = submissions.filter(
    (item) => Number(item.plagiarismScore || 0) < 35
  ).length;

  const aiHigh = submissions.filter(
    (item) => Number(item.aiScore || 0) >= 70
  ).length;

  const aiMedium = submissions.filter((item) => {
    const score = Number(item.aiScore || 0);
    return score >= 35 && score < 70;
  }).length;

  const aiLow = submissions.filter(
    (item) => Number(item.aiScore || 0) < 35
  ).length;

  const departments = await Department.find().select("name code");

  const departmentStats = await Promise.all(
    departments.map(async (department) => {
      const totalStudents = await StudentProfile.countDocuments({
        department: department._id
      });

      const totalAssignments = await Assignment.countDocuments({
        department: department._id
      });

      const totalSubmissions = await Submission.countDocuments({
        department: department._id
      });

      return {
        department,
        totalStudents,
        totalAssignments,
        totalSubmissions
      };
    })
  );

  return apiResponse(res, 200, "System analytics fetched successfully.", {
    analytics: {
      totalSubmissions: submissions.length,
      plagiarism: {
        high: plagiarismHigh,
        medium: plagiarismMedium,
        low: plagiarismLow
      },
      aiContent: {
        high: aiHigh,
        medium: aiMedium,
        low: aiLow
      },
      departmentStats
    }
  });
});

module.exports = {
  getDashboard,
  getSystemAnalytics
};