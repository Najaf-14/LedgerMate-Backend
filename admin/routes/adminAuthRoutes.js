const express = require("express");

const router = express.Router();

const { adminLogin } = require("../controllers/adminAuthController");

const { authLimiter } = require("../../middleware/rateLimiter");

router.post("/login", authLimiter, adminLogin);

module.exports = router;
