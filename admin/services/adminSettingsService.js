const bcrypt = require("bcryptjs");
const User = require("../../models/User");

const getAdminProfile = async (userId) => {
  const user = await User.findById(userId)
    .select("-password -resetPasswordToken -resetPasswordExpires -fcmTokens")
    .lean();

  if (!user) {
    const error = new Error("Admin user not found");
    error.statusCode = 404;
    throw error;
  }

  return user;
};

const updateAdminProfile = async (userId, payload) => {
  const { name, email, phoneNo } = payload;

  const user = await User.findById(userId);

  if (!user) {
    const error = new Error("Admin user not found");
    error.statusCode = 404;
    throw error;
  }

  if (name !== undefined) {
    if (!name.trim()) {
      const error = new Error("Name is required");
      error.statusCode = 400;
      throw error;
    }

    user.name = name.trim();
  }

  if (email !== undefined) {
    const normalizedEmail = email.trim().toLowerCase();

    const existingUser = await User.findOne({
      email: normalizedEmail,
      _id: { $ne: userId },
    });

    if (existingUser) {
      const error = new Error("Email is already in use");
      error.statusCode = 409;
      throw error;
    }

    user.email = normalizedEmail;
  }

  if (phoneNo !== undefined) {
    const normalizedPhone = phoneNo.trim();

    const existingUser = await User.findOne({
      phoneNo: normalizedPhone,
      _id: { $ne: userId },
    });

    if (existingUser) {
      const error = new Error("Phone number is already in use");
      error.statusCode = 409;
      throw error;
    }

    user.phoneNo = normalizedPhone;
  }

  await user.save();

  return await User.findById(userId)
    .select("-password -resetPasswordToken -resetPasswordExpires -fcmTokens")
    .lean();
};

const changeAdminPassword = async (userId, currentPassword, newPassword) => {
  if (!currentPassword || !newPassword) {
    const error = new Error("Current password and new password are required");

    error.statusCode = 400;
    throw error;
  }

  if (currentPassword === newPassword) {
    const error = new Error(
      "New password must be different from current password",
    );

    error.statusCode = 400;
    throw error;
  }

  const user = await User.findById(userId);

  if (!user) {
    const error = new Error("Admin user not found");
    error.statusCode = 404;
    throw error;
  }

  const passwordMatches = await bcrypt.compare(currentPassword, user.password);

  if (!passwordMatches) {
    const error = new Error("Current password is incorrect");
    error.statusCode = 400;
    throw error;
  }

  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^()_\-+=])[A-Za-z\d@$!%*?&#^()_\-+=]{8,}$/;

  if (!passwordRegex.test(newPassword)) {
    const error = new Error(
      "Password must contain at least one uppercase letter, one lowercase letter, one number, one special character and be at least 8 characters long.",
    );

    error.statusCode = 400;
    throw error;
  }

  user.password = newPassword;

  await user.save();

  return true;
};

const getSystemInfo = () => {
  return {
    applicationName: "LedgerMate",
    version: process.env.APP_VERSION || "1.0.0",
    environment: process.env.NODE_ENV || "development",
    nodeVersion: process.version,
  };
};

module.exports = {
  getAdminProfile,
  updateAdminProfile,
  changeAdminPassword,
  getSystemInfo,
};
