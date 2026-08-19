const express = require("express");

const router = express.Router();

const authMiddleware = require("../../middleware/authMiddleware");
const adminMiddleware = require("../../middleware/adminMiddleware");

const { getAdminMe } = require("../controllers/adminController");

const adminUserRoutes = require("./adminUserRoutes");

router.get("/me", authMiddleware, adminMiddleware, getAdminMe);
router.use("/users", adminUserRoutes);

module.exports = router;
