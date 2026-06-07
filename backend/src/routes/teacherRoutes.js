const express = require("express");

const {
  getTeacherDashboard,
  getTeacherAnalytics
} = require("../controllers/teacherController");

const { protect } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");
const { USER_ROLES } = require("../config/constants");

const router = express.Router();

router.use(protect);
router.use(authorizeRoles(USER_ROLES.TEACHER));

router.get("/dashboard", getTeacherDashboard);
router.get("/analytics", getTeacherAnalytics);

module.exports = router;