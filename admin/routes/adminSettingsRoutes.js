const express = require("express");

const router = express.Router();

const authMiddleware = require("../../middleware/authMiddleware");
const adminMiddleware = require("../../middleware/adminMiddleware");

const {
  getProfile,
  updateProfile,
  changePassword,
  getSystemInfo,
} = require("../controllers/adminSettingsController");

router.use(authMiddleware, adminMiddleware);

router.get("/profile", getProfile);
router.patch("/profile", updateProfile);
router.patch("/password", changePassword);
router.get("/system", getSystemInfo);

module.exports = router;
