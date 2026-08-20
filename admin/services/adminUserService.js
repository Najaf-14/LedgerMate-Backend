const User = require("../../models/User");

const getUsers = async ({ page = 1, limit = 10, search = "", role = "" }) => {
  const currentPage = Math.max(Number(page) || 1, 1);
  const currentLimit = Math.min(Math.max(Number(limit) || 10, 1), 100);

  const skip = (currentPage - 1) * currentLimit;

  const query = {};

  if (search.trim()) {
    const searchRegex = new RegExp(search.trim(), "i");

    query.$or = [
      { name: searchRegex },
      { email: searchRegex },
      { phoneNo: searchRegex },
    ];
  }

  if (role && ["user", "admin", "super_admin"].includes(role)) {
    query.role = role;
  }

  const [users, totalUsers] = await Promise.all([
    User.find(query)
      .select("-password -resetPasswordToken -resetPasswordExpires -fcmTokens")
      .sort({ createdAt: -1, _id: -1 })
      .skip(skip)
      .limit(currentLimit)
      .lean(),

    User.countDocuments(query),
  ]);

  const totalPages = Math.ceil(totalUsers / currentLimit);

  return {
    users,

    pagination: {
      currentPage,
      limit: currentLimit,
      totalUsers,
      totalPages,
      hasNextPage: currentPage < totalPages,
      hasPreviousPage: currentPage > 1,
    },
  };
};

const getUserById = async (userId) => {
  const user = await User.findById(userId)
    .select("-password -resetPasswordToken -resetPasswordExpires -fcmTokens")
    .lean();

  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  return user;
};

const updateUserRole = async (userId, role, loggedInAdminId) => {
  if (!["user", "super_admin"].includes(role)) {
    const error = new Error("Invalid role");
    error.statusCode = 400;
    throw error;
  }

  if (userId === loggedInAdminId.toString()) {
    const error = new Error("You cannot change your own role");
    error.statusCode = 400;
    throw error;
  }

  const user = await User.findById(userId);

  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { role },
    {
      new: true,
      runValidators: true,
    },
  )
    .select("-password -resetPasswordToken -resetPasswordExpires -fcmTokens")
    .lean();

  return updatedUser;
};

const deleteUser = async (userId, loggedInAdminId) => {
  if (userId === loggedInAdminId.toString()) {
    const error = new Error("You cannot delete your own account");
    error.statusCode = 400;
    throw error;
  }

  const user = await User.findById(userId);

  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  if (user.role === "super_admin") {
    const error = new Error("Super admin users cannot be deleted");
    error.statusCode = 403;
    throw error;
  }

  await User.findByIdAndDelete(userId);

  return {
    deletedUserId: userId,
  };
};

module.exports = {
  getUsers,
  getUserById,
  updateUserRole,
  deleteUser,
};
