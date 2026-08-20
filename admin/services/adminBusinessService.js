const Business = require("../../models/Business");

const getBusinesses = async ({
  page = 1,
  limit = 10,
  search = "",
  mode = "",
}) => {
  const skip = (page - 1) * limit;

  const query = {};

  if (mode) {
    query.mode = mode;
  }

  if (search.trim()) {
    query.$or = [
      { businessName: { $regex: search.trim(), $options: "i" } },
      { ownerName: { $regex: search.trim(), $options: "i" } },
      { phoneNo: { $regex: search.trim(), $options: "i" } },
      { businessType: { $regex: search.trim(), $options: "i" } },
    ];
  }

  const [businesses, totalBusinesses] = await Promise.all([
    Business.find(query)
      .populate("userId", "name email phoneNo role")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),

    Business.countDocuments(query),
  ]);

  const totalPages = Math.ceil(totalBusinesses / limit);

  return {
    businesses,
    pagination: {
      currentPage: page,
      limit,
      totalBusinesses,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    },
  };
};

const getBusinessById = async (businessId) => {
  const business = await Business.findById(businessId)
    .populate("userId", "name email phoneNo role createdAt")
    .lean();

  if (!business) {
    const error = new Error("Business not found");
    error.statusCode = 404;
    throw error;
  }

  return business;
};

const updateBusinessMode = async (businessId, mode) => {
  if (!["simple", "advanced"].includes(mode)) {
    const error = new Error("Invalid business mode");
    error.statusCode = 400;
    throw error;
  }

  const business = await Business.findById(businessId);

  if (!business) {
    const error = new Error("Business not found");
    error.statusCode = 404;
    throw error;
  }

  business.mode = mode;

  await business.save();

  return await Business.findById(businessId)
    .populate("userId", "name email phoneNo role")
    .lean();
};

const deleteBusiness = async (businessId) => {
  const business = await Business.findById(businessId);

  if (!business) {
    const error = new Error("Business not found");
    error.statusCode = 404;
    throw error;
  }

  await Business.findByIdAndDelete(businessId);

  return business;
};

module.exports = {
  getBusinesses,
  getBusinessById,
  updateBusinessMode,
  deleteBusiness,
};
