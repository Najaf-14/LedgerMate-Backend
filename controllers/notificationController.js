const { sendNotification } = require("../services/notificationService");

const snedNotification = async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: "FCM token is required",
      });
    }

    await sendNotification(
      token,
      "LedgerMate Test",
      "Push notifications are working!",
      {
        type: "TEST",
      },
    );

    res.json({
      success: true,
      message: "Notification sent successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to send notification",
      error: error.message,
    });
  }
};

module.exports = { sendNotification };
