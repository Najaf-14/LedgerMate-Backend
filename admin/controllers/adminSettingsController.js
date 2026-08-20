const adminSettingsService = require("../services/adminSettingsService");

const getProfile = async (req, res) => {
  try {
    const user = await adminSettingsService.getAdminProfile(req.user._id);

    return res.status(200).json({
      success: true,
      message: "Admin profile fetched successfully",
      result: {
        user,
      },
    });
  } catch (error) {
    console.error("Get admin profile error:", error);

    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Failed to fetch admin profile",
    });
  }
};

const updateProfile = async (req, res) => {
  try {
    const user = await adminSettingsService.updateAdminProfile(
      req.user._id,
      req.body,
    );

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      result: {
        user,
      },
    });
  } catch (error) {
    console.error("Update admin profile error:", error);

    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Failed to update profile",
    });
  }
};

const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    await adminSettingsService.changeAdminPassword(
      req.user._id,
      currentPassword,
      newPassword,
    );

    return res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    console.error("Change admin password error:", error);

    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Failed to change password",
    });
  }
};

const getSystemInfo = async (req, res) => {
  try {
    const systemInfo = adminSettingsService.getSystemInfo();

    return res.status(200).json({
      success: true,
      message: "System information fetched successfully",
      result: systemInfo,
    });
  } catch (error) {
    console.error("Get system info error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch system information",
    });
  }
};

module.exports = {
  getProfile,
  updateProfile,
  changePassword,
  getSystemInfo,
};
