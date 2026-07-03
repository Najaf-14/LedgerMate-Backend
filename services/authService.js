const User = require("../models/User");
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

  if (password.length < 6) {
    throw new Error("Password must be at least 6 characters long");
  }

  const hashedPassword = await bycrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    phoneNo,
    password: hashedPassword,
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

  const token = generateToken(user._id);

  return { user, token };
};

module.exports = { signup, login };
