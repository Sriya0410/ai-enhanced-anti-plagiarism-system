const express = require("express");

const {
  getDepartments,
  getActiveDepartments,
  getDepartmentById,
  createDepartment,
  updateDepartment,
  deleteDepartment
} = require("../controllers/departmentController");

const { protect } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");
const { USER_ROLES } = require("../config/constants");

const router = express.Router();

/*
  Public GET because register page needs department dropdown
*/
router.get("/", getDepartments);
router.get("/active", getActiveDepartments);
router.get("/:id", getDepartmentById);

/*
  Admin-only write operations
*/
router.post("/", protect, authorizeRoles(USER_ROLES.ADMIN), createDepartment);
router.put("/:id", protect, authorizeRoles(USER_ROLES.ADMIN), updateDepartment);
router.delete("/:id", protect, authorizeRoles(USER_ROLES.ADMIN), deleteDepartment);

module.exports = router;