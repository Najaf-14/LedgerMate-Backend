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
} = require("../controllers/authController");

router.post("/signup", signup);
router.post("/login", login);
router.get("/me", authMiddleware, getMe);

router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

module.exports = router;
