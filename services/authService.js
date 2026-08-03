const User = require("../models/User");
const Business = require("../models/Business");
const bcrypt = require("bcryptjs");
const generateToken = require("../utils/generateToken");
const crypto = require("crypto");

const sendEmail = require("../utils/sendEmail");

const signup = async (userData) => {
  const { name, email, phoneNo, password, confirmPassword } = userData;

  if (
    !name?.trim() ||
    !email?.trim() ||
    !phoneNo?.trim() ||
    !password?.trim() ||
    !confirmPassword?.trim()
  ) {
    throw new Error("All fields are required");
  }

  if (password !== confirmPassword) {
    throw new Error("Passwords do not match");
  }

  const emailExists = await User.findOne({ email });
  if (emailExists) {
    throw new Error("Email already exists");
  }

  const phoneNoExists = await User.findOne({ phoneNo });
  if (phoneNoExists) {
    throw new Error("Phone number already exists");
  }

  const user = await User.create({
    name,
    email,
    phoneNo,
    password,
  });

  const token = generateToken(user._id);

  return { user, token };
};

const login = async (loginData) => {
  const { emailORphoneNo, password } = loginData;

  if (!emailORphoneNo?.trim() || !password?.trim()) {
    throw new Error("All fields are required");
  }

  const user = await User.findOne({
    $or: [{ email: emailORphoneNo }, { phoneNo: emailORphoneNo }],
  });
  if (!user) {
    throw new Error("User does not exist");
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new Error("Invalid password");
  }

  const business = await Business.findOne({ userId: user._id });

  if (!business) {
    throw new Error("Business details not found");
  }

  const token = generateToken(user._id);

  return {
    token,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      phoneNo: user.phoneNo,
      role: user.role,
    },
    business: {
      _id: business._id,
      businessName: business.businessName,
      mode: business.mode,
      currency: business.currency,
    },
  };
};

const getMe = async (userId) => {
  const user = await User.findById(userId).select("-password");

  if (!user) {
    throw new Error("User not found");
  }

  const business = await Business.findOne({ userId });

  if (!business) {
    throw new Error("Business not found");
  }

  return {
    user,
    business,
  };
};

const forgotPassword = async (email) => {
  const user = await User.findOne({ email });

  if (!user) {
    return {
      success: true,
      statusCode: 200,
      message:
        "If an account with that email exists, a reset link has been sent.",
    };
  }

  const resetToken = crypto.randomBytes(32).toString("hex");

  const hashedToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  user.resetPasswordToken = hashedToken;
  user.resetPasswordExpires = Date.now() + 15 * 60 * 1000;

  await user.save({ validateBeforeSave: false });

  // const resetLink = `http://localhost:8000/reset-password?token=${resetToken}`;

  const resetLink = `https://recopy-turbulent-provolone.ngrok-free.dev/api/auth/reset-password?token=${resetToken}`;

  await sendEmail({
    to: user.email,
    subject: "Reset Your LedgerMate Password",
    html: `
        <h2>LedgerMate Password Reset</h2>

        <p>You requested to reset your password.</p>

        <p>
            <a href="${resetLink}">
                Reset Password
            </a>
        </p>

        <p>This link expires in 15 minutes.</p>

        <p>If you didn't request this, ignore this email.</p>
    `,
  });

  return {
    success: true,
    statusCode: 200,
    message:
      "If an account with that email exists, a reset link has been sent.",
  };
};

const resetPassword = async (token, newPassword) => {
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpires: { $gt: Date.now() },
  });

  if (!user) {
    throw new Error("Invalid or expired reset token");
  }

  user.password = newPassword;

  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;

  await user.save();

  return {
    success: true,
    statusCode: 200,
    message: "Password reset successfully",
  };
};

const changePassword = async (userId, oldPassword, newPassword) => {
  if (!userId) {
    return {
      success: false,
      statusCode: 401,
      message: "Authentication required",
    };
  }

  if (!oldPassword?.trim() || !newPassword?.trim()) {
    return {
      success: false,
      statusCode: 400,
      message: "Old and new password are required",
    };
  }

  const user = await User.findById(userId);

  if (!user) {
    return {
      success: false,
      statusCode: 404,
      message: "User not found",
    };
  }

  const isMatch = await bcrypt.compare(oldPassword, user.password);

  if (!isMatch) {
    return {
      success: false,
      statusCode: 400,
      message: "Current password is incorrect",
    };
  }

  const isSamePassword = await bcrypt.compare(newPassword, user.password);

  if (isSamePassword) {
    return {
      success: false,
      statusCode: 400,
      message: "New password must be different from the current password",
    };
  }

  user.password = newPassword;

  await user.save();

  return {
    success: true,
    statusCode: 200,
    message: "Password changed successfully",
  };
};

module.exports = {
  signup,
  login,
  getMe,
  forgotPassword,
  resetPassword,
  changePassword,
};
