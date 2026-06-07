const express = require("express");

const {
  submitAssignment,
  getSubmissions,
  getSubmissionById,
  getSubmissionsByAssignment,
  getAllReportsForSubmission
} = require("../controllers/submissionController");

const { protect } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");
const { uploadSubmission } = require("../middleware/uploadMiddleware");
const { USER_ROLES } = require("../config/constants");

const router = express.Router();

router.use(protect);

router.post(
  "/",
  authorizeRoles(USER_ROLES.STUDENT),
  uploadSubmission.single("file"),
  submitAssignment
);

router.get(
  "/",
  authorizeRoles(USER_ROLES.ADMIN, USER_ROLES.TEACHER, USER_ROLES.STUDENT),
  getSubmissions
);

router.get(
  "/assignment/:assignmentId",
  authorizeRoles(USER_ROLES.ADMIN, USER_ROLES.TEACHER),
  getSubmissionsByAssignment
);

router.get(
  "/:id/reports",
  authorizeRoles(USER_ROLES.ADMIN, USER_ROLES.TEACHER, USER_ROLES.STUDENT),
  getAllReportsForSubmission
);

router.get(
  "/:id",
  authorizeRoles(USER_ROLES.ADMIN, USER_ROLES.TEACHER, USER_ROLES.STUDENT),
  getSubmissionById
);

module.exports = router;