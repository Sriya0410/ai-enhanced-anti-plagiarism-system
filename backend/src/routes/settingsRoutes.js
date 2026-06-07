const express = require("express");

const {
  getSettings,
  getSettingByKey,
  createOrUpdateSetting,
  deleteSetting
} = require("../controllers/settingsController");

const { protect } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");
const { USER_ROLES } = require("../config/constants");

const router = express.Router();

router.use(protect);
router.use(authorizeRoles(USER_ROLES.ADMIN));

router.get("/", getSettings);
router.get("/:key", getSettingByKey);
router.post("/", createOrUpdateSetting);
router.delete("/:key", deleteSetting);

module.exports = router;