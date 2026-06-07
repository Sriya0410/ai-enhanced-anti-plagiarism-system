const express = require("express");

const {
  getDashboard,
  getSystemAnalytics
} = require("../controllers/dashboardController");

const { protect } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");
const { USER_ROLES } = require("../config/constants");

const router = express.Router();

router.use(protect);

router.get(
  "/",
  authorizeRoles(USER_ROLES.ADMIN, USER_ROLES.TEACHER, USER_ROLES.STUDENT),
  getDashboard
);

router.get(
  "/analytics",
  authorizeRoles(USER_ROLES.ADMIN),
  getSystemAnalytics
);

module.exports = router;