const express = require("express");

const router = express.Router();

const {
  sendTestNotification,
  saveFcmToken,
} = require("../controllers/notificationController");

const authMiddleware = require("../middleware/authMiddleware");

router.post("/test", authMiddleware, sendTestNotification);

router.post("/token", authMiddleware, saveFcmToken);

module.exports = router;
