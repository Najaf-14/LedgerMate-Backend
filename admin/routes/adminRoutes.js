const express = require("express");

const router = express.Router();

const authMiddleware = require("../../middleware/authMiddleware");
const adminMiddleware = require("../../middleware/adminMiddleware");

const { getAdminMe } = require("../controllers/adminController");

router.get("/me", authMiddleware, adminMiddleware, getAdminMe);

module.exports = router;
