const adminAuthService = require("../services/adminAuthService");

const adminLogin = async (req, res) => {
  try {
    const result = await adminAuthService.adminLogin(req.body);

    return res.status(200).json({
      success: true,
      message: "Admin logged in successfully",
      result,
    });
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  adminLogin,
};
