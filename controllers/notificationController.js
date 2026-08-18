const { sendNotification } = require("../services/notificationService");

const saveFcmToken = async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: "FCM token is required",
      });
    }

    if (!req.user.fcmTokens.includes(token)) {
      req.user.fcmTokens.push(token);
      await req.user.save();
    }

    res.json({
      success: true,
      message: "FCM token saved successfully",
    });
  } catch (error) {
    console.error("Save FCM token error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to save FCM token",
      error: error.message,
    });
  }
};

const sendTestNotification = async (req, res) => {
  try {
    const tokens = req.user.fcmTokens;

    if (!tokens || tokens.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No FCM token found for this user",
      });
    }

    // Remove empty tokens
    const validTokens = tokens.filter((token) => token);

    if (validTokens.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No valid FCM token found for this user",
      });
    }

    for (const token of validTokens) {
      await sendNotification(
        token,
        "LedgerMate Test",
        "Push notifications are working!",
        {
          type: "TEST",
        },
      );
    }

    res.json({
      success: true,
      message: "Notification sent successfully",
    });
  } catch (error) {
    console.error("Send notification error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to send notification",
      error: error.message,
    });
  }
};

module.exports = {
  sendTestNotification,
  saveFcmToken,
};
