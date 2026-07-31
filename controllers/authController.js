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
    res.status(400).json({
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
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const getMe = async (req, res) => {
  try {
    const result = await authService.getMe(req.user.id);

    res.status(200).json({
      success: true,
      result,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const result = await authService.forgotPassword(req.body.email);

    return res.status(result.statusCode).json({
      success: result.success,
      message: result.message,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const resetPassword = async (req, res) => {
  try {
    const result = await authService.resetPassword(
      req.body.token,
      req.body.password,
    );

    return res.status(result.statusCode).json({
      success: result.success,
      message: result.message,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    const result = await authService.changePassword(
      req.user?._id || req.user?.id,
      oldPassword,
      newPassword,
    );

    return res.status(result.statusCode).json(result);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  signup,
  login,
  getMe,
  forgotPassword,
  resetPassword,
  changePassword,
};
