const User = require("../models/User");
const Business = require("../models/Business");
const bycrypt = require("bcryptjs");
const generateToken = require("../utils/generateToken");

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

  const isPasswordValid = await bycrypt.compare(password, user.password);
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

module.exports = { signup, login, getMe };
