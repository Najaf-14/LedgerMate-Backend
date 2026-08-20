const express = require("express");

const router = express.Router();

const authMiddleware = require("../../middleware/authMiddleware");
const adminMiddleware = require("../../middleware/adminMiddleware");

const { getAdminReports } = require("../controllers/adminReportController");

router.get("/", authMiddleware, adminMiddleware, getAdminReports);

module.exports = router;
