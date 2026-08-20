const express = require("express");

const router = express.Router();

const authMiddleware = require("../../middleware/authMiddleware");
const adminMiddleware = require("../../middleware/adminMiddleware");

const {
  getAdminPayments,
  getAdminPaymentById,
} = require("../controllers/adminPaymentController");

router.get("/", authMiddleware, adminMiddleware, getAdminPayments);
router.get("/:id", authMiddleware, adminMiddleware, getAdminPaymentById);

module.exports = router;
