const express = require("express");

const {
  getPlagiarismReports,
  getPlagiarismReportBySubmission,
  getPlagiarismReportById
} = require("../controllers/plagiarismController");

const { protect } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");
const { USER_ROLES } = require("../config/constants");

const router = express.Router();

router.use(protect);

router.get(
  "/",
  authorizeRoles(USER_ROLES.ADMIN, USER_ROLES.TEACHER, USER_ROLES.STUDENT),
  getPlagiarismReports
);

router.get(
  "/submission/:submissionId",
  authorizeRoles(USER_ROLES.ADMIN, USER_ROLES.TEACHER, USER_ROLES.STUDENT),
  getPlagiarismReportBySubmission
);

router.get(
  "/:id",
  authorizeRoles(USER_ROLES.ADMIN, USER_ROLES.TEACHER, USER_ROLES.STUDENT),
  getPlagiarismReportById
);

module.exports = router;