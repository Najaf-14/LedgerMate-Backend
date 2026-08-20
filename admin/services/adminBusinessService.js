const Business = require("../../models/Business");

const getBusinesses = async ({
  page = 1,
  limit = 10,
  search = "",
  mode = "",
}) => {
  const currentPage = Math.max(Number(page) || 1, 1);

  const currentLimit = Math.min(Math.max(Number(limit) || 10, 1), 100);

  const skip = (currentPage - 1) * currentLimit;

  const query = {};

  /*
   * Mode filter
   */
  if (mode && ["simple", "advanced"].includes(mode)) {
    query.mode = mode;
  }

  /*
   * Search
   */
  if (search.trim()) {
    const searchRegex = new RegExp(search.trim(), "i");

    query.$or = [
      { businessName: searchRegex },
      { ownerName: searchRegex },
      { phoneNo: searchRegex },
      { businessType: searchRegex },
    ];
  }

  /*
   * Fetch businesses + total count
   */
  const [businesses, totalBusinesses] = await Promise.all([
    Business.find(query)
      .populate("userId", "name email phoneNo role")
      .sort({ createdAt: -1, _id: -1 })
      .skip(skip)
      .limit(currentLimit)
      .lean(),

    Business.countDocuments(query),
  ]);

  const totalPages = Math.ceil(totalBusinesses / currentLimit);

  return {
    businesses,

    pagination: {
      currentPage,
      limit: currentLimit,
      totalBusinesses,
      totalPages,
      hasNextPage: currentPage < totalPages,
      hasPreviousPage: currentPage > 1,
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
