const {
  getBusinesses,
  getBusinessById,
  updateBusinessMode,
  deleteBusiness,
} = require("../services/adminBusinessService");

const getAllBusinesses = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "", mode = "" } = req.query;

    const result = await getBusinesses({
      page: Number(page),
      limit: Number(limit),
      search,
      mode,
    });

    return res.status(200).json({
      success: true,
      message: "Businesses fetched successfully",
      result,
    });
  } catch (error) {
    console.error("Get businesses error:", error);

    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Failed to fetch businesses",
    });
  }
};

const getBusiness = async (req, res) => {
  try {
    const business = await getBusinessById(req.params.id);

    return res.status(200).json({
      success: true,
      message: "Business fetched successfully",
      result: {
        business,
      },
    });
  } catch (error) {
    console.error("Get business error:", error);

    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Failed to fetch business",
    });
  }
};

const changeBusinessMode = async (req, res) => {
  try {
    const { mode } = req.body;

    if (!mode) {
      return res.status(400).json({
        success: false,
        message: "Mode is required",
      });
    }

    const business = await updateBusinessMode(req.params.id, mode);

    return res.status(200).json({
      success: true,
      message: "Business mode updated successfully",
      result: {
        business,
      },
    });
  } catch (error) {
    console.error("Update business mode error:", error);

    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Failed to update business mode",
    });
  }
};

const removeBusiness = async (req, res) => {
  try {
    await deleteBusiness(req.params.id);

    return res.status(200).json({
      success: true,
      message: "Business deleted successfully",
    });
  } catch (error) {
    console.error("Delete business error:", error);

    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Failed to delete business",
    });
  }
};

module.exports = {
  getAllBusinesses,
  getBusiness,
  changeBusinessMode,
  removeBusiness,
};
