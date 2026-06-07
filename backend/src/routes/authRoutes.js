const express = require("express");

const {
  registerStudent,
  loginUser,
  getMe,
  updateMyProfile,
  changePassword
} = require("../controllers/authController");

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register", registerStudent);
router.post("/login", loginUser);

router.get("/me", protect, getMe);
router.put("/profile", protect, updateMyProfile);
router.put("/change-password", protect, changePassword);

module.exports = router;