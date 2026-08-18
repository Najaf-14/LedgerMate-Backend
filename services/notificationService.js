const { getMessaging } = require("firebase-admin/messaging");
const User = require("../models/User");

const sendNotification = async (token, title, body, data = {}) => {
  try {
    const message = {
      token,
      notification: {
        title,
        body,
      },
      data,
    };

    const response = await getMessaging().send(message);
    console.log("Notification sent:", response);

    return response;
  } catch (error) {
    console.error("Notification error:", error);

    if (
      error.code === "messaging/registration-token-not-registered" ||
      error.code === "messaging/invalid-registration-token"
    ) {
      await User.updateMany(
        { fcmTokens: token },
        {
          $pull: {
            fcmTokens: token,
          },
        },
      );

      console.log("🗑️ Invalid FCM token removed");
    }

    throw error;
  }
};

const sendNotificationToUser = async (userId, title, body, data = {}) => {
  try {
    const user = await User.findById(userId).select("fcmTokens");

    if (!user || !user.fcmTokens?.length) {
      console.log("No FCM tokens found for user:", userId);
      return;
    }

    const tokens = user.fcmTokens.filter(Boolean);

    for (const token of tokens) {
      try {
        await sendNotification(token, title, body, data);
      } catch (error) {
        console.error("Failed to send notification to token:", error.message);
      }
    }
  } catch (error) {
    console.error("sendNotificationToUser error:", error.message);
  }
};

module.exports = {
  sendNotification,
  sendNotificationToUser,
};
