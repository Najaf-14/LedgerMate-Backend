const User = require("../../models/User");
const bcrypt = require("bcryptjs");
const generateToken = require("../../utils/generateToken");

const adminLogin = async (loginData) => {
  const { email, password } = loginData;

  if (!email?.trim() || !password?.trim()) {
    throw new Error("Email and password are required");
  }

  const user = await User.findOne({
    email: email.toLowerCase().trim(),
  });

  if (!user) {
    throw new Error("Invalid email or password");
  }

  if (user.role !== "admin" && user.role !== "super_admin") {
    throw new Error("Admin access required");
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw new Error("Invalid email or password");
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
  };
};

module.exports = {
  adminLogin,
};
