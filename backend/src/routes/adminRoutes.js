const express = require("express");

const {
  getAdminDashboard,
  createUserByAdmin,
  getAllUsers,
  getAllStudents,
  getAllTeachers,
  getUserById,
  updateUserByAdmin,
  deleteUserByAdmin,
  toggleUserStatus
} = require("../controllers/adminController");

const { protect } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");
const { USER_ROLES } = require("../config/constants");

const router = express.Router();

router.use(protect);
router.use(authorizeRoles(USER_ROLES.ADMIN));

router.get("/dashboard", getAdminDashboard);

router.post("/users", createUserByAdmin);
router.get("/users", getAllUsers);
router.get("/users/:id", getUserById);
router.put("/users/:id", updateUserByAdmin);
router.delete("/users/:id", deleteUserByAdmin);
router.patch("/users/:id/toggle-status", toggleUserStatus);

router.get("/students", getAllStudents);
router.get("/teachers", getAllTeachers);

module.exports = router;