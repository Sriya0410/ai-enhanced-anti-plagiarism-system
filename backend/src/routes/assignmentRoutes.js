const express = require("express");

const {
  getAssignments,
  getAssignmentById,
  createAssignment,
  updateAssignment,
  deleteAssignment,
  publishAssignment,
  closeAssignment
} = require("../controllers/assignmentController");

const { protect } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");
const { USER_ROLES } = require("../config/constants");

const router = express.Router();

router.use(protect);

router.get(
  "/",
  authorizeRoles(USER_ROLES.ADMIN, USER_ROLES.TEACHER),
  getAssignments
);

router.get(
  "/:id",
  authorizeRoles(USER_ROLES.ADMIN, USER_ROLES.TEACHER),
  getAssignmentById
);

router.post(
  "/",
  authorizeRoles(USER_ROLES.TEACHER),
  createAssignment
);

router.put(
  "/:id",
  authorizeRoles(USER_ROLES.TEACHER),
  updateAssignment
);

router.delete(
  "/:id",
  authorizeRoles(USER_ROLES.TEACHER),
  deleteAssignment
);

router.patch(
  "/:id/publish",
  authorizeRoles(USER_ROLES.TEACHER),
  publishAssignment
);

router.patch(
  "/:id/close",
  authorizeRoles(USER_ROLES.TEACHER),
  closeAssignment
);

module.exports = router;