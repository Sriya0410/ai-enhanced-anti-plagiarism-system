const express = require("express");

const {
  getSubjects,
  getMyTeacherSubjects,
  getSubjectById,
  createSubject,
  updateSubject,
  deleteSubject
} = require("../controllers/subjectController");

const { protect } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");
const { USER_ROLES } = require("../config/constants");

const router = express.Router();

router.get(
  "/teacher/my-subjects",
  protect,
  authorizeRoles(USER_ROLES.TEACHER),
  getMyTeacherSubjects
);

router.get("/", protect, getSubjects);
router.get("/:id", protect, getSubjectById);

router.post("/", protect, authorizeRoles(USER_ROLES.ADMIN), createSubject);
router.put("/:id", protect, authorizeRoles(USER_ROLES.ADMIN), updateSubject);
router.delete("/:id", protect, authorizeRoles(USER_ROLES.ADMIN), deleteSubject);

module.exports = router;