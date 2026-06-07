const express = require("express");

const {
  getStudentDashboard,
  getMyAssignments,
  getStudentAssignmentById,
  getMySubmissions,
  getMySubmissionById,
  getMyReports,
  getMyFeedback
} = require("../controllers/studentController");

const { protect } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");
const { USER_ROLES } = require("../config/constants");

const router = express.Router();

router.use(protect);
router.use(authorizeRoles(USER_ROLES.STUDENT));

router.get("/dashboard", getStudentDashboard);

router.get("/assignments", getMyAssignments);
router.get("/assignments/:id", getStudentAssignmentById);

router.get("/submissions", getMySubmissions);
router.get("/submissions/:id", getMySubmissionById);

router.get("/reports", getMyReports);
router.get("/feedback", getMyFeedback);

module.exports = router;