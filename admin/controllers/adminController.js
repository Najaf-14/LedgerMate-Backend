const getAdminMe = async (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Admin authenticated successfully",
    result: {
      user: req.user,
    },
  });
};

module.exports = {
  getAdminMe,
};
