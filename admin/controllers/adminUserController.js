const {
  getUsers,
  getUserById,
  updateUserRole,
  deleteUser,
} = require("../services/adminUserService");

const getAllUsers = async (req, res) => {
  try {
    const { page, limit, search, role } = req.query;

    const result = await getUsers({
      page,
      limit,
      search,
      role,
    });

    return res.status(200).json({
      success: true,
      message: "Users fetched successfully",
      result,
    });
  } catch (error) {
    console.error("Get users error:", error);

    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Failed to fetch users",
    });
  }
};

const getSingleUser = async (req, res) => {
  try {
    const user = await getUserById(req.params.id);

    return res.status(200).json({
      success: true,
      message: "User fetched successfully",
      result: {
        user,
      },
    });
  } catch (error) {
    console.error("Get user error:", error);

    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Failed to fetch user",
    });
  }
};

const changeUserRole = async (req, res) => {
  try {
    const { role } = req.body;

    if (!role) {
      return res.status(400).json({
        success: false,
        message: "Role is required",
      });
    }

    const user = await updateUserRole(req.params.id, role, req.user._id);

    return res.status(200).json({
      success: true,
      message: "User role updated successfully",
      result: {
        user,
      },
    });
  } catch (error) {
    console.error("Update user role error:", error);

    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Failed to update user role",
    });
  }
};

const removeUser = async (req, res) => {
  try {
    const result = await deleteUser(req.params.id, req.user._id);

    return res.status(200).json({
      success: true,
      message: "User deleted successfully",
      result,
    });
  } catch (error) {
    console.error("Delete user error:", error);

    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Failed to delete user",
    });
  }
};

module.exports = {
  getAllUsers,
  getSingleUser,
  changeUserRole,
  removeUser,
};
