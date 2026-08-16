const express = require("express");
const { model } = require("mongoose");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");

const {
  signup,
  login,
  getMe,
  forgotPassword,
  resetPassword,
  changePassword,
  openResetPassword,
} = require("../controllers/authController");
const { authLimiter } = require("../middleware/rateLimiter");

router.post("/signup", signup);
router.post("/login", authLimiter, login);
router.get("/me", authMiddleware, getMe);
router.post("/change-password", authMiddleware, changePassword);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.get("/reset-password", openResetPassword);

module.exports = router;
