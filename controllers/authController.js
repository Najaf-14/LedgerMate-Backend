const authService = require("../services/authService");

const signup = async (req, res) => {
  try {
    const result = await authService.signup(req.body);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const login = async (req, res) => {
  try {
    const result = await authService.login(req.body);

    res.status(200).json({
      success: true,
      message: "User logged in successfully",
      result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = { signup, login };
