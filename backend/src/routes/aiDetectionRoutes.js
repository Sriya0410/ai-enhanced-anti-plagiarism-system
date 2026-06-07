const express = require("express");

const {
  getAIContentReports,
  getAIContentReportBySubmission,
  getAIContentReportById
} = require("../controllers/aiDetectionController");

const { protect } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");
const { USER_ROLES } = require("../config/constants");

const router = express.Router();

router.use(protect);

router.get(
  "/",
  authorizeRoles(USER_ROLES.ADMIN, USER_ROLES.TEACHER, USER_ROLES.STUDENT),
  getAIContentReports
);

router.get(
  "/submission/:submissionId",
  authorizeRoles(USER_ROLES.ADMIN, USER_ROLES.TEACHER, USER_ROLES.STUDENT),
  getAIContentReportBySubmission
);

router.get(
  "/:id",
  authorizeRoles(USER_ROLES.ADMIN, USER_ROLES.TEACHER, USER_ROLES.STUDENT),
  getAIContentReportById
);

module.exports = router;