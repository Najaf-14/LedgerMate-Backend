const businessService = require("../services/businessService");

const createBusiness = async (req, res) => {
  try {
    const {
      businessName,
      ownerName,
      phoneNo,
      address,
      businessType,
      mode,
      currency,
    } = req.body;

    if (
      !businessName?.trim() ||
      !ownerName?.trim() ||
      !phoneNo?.trim() ||
      !address?.trim() ||
      !businessType?.trim() ||
      !mode?.trim() ||
      !currency?.trim()
    ) {
      throw new Error("All fields are required");
    }

    const business = await businessService.createBusiness(
      req.user._id,
      req.body,
    );

    res.status(201).json({
      success: true,
      message: "Business created successfully.",
      business,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const getBusiness = async (req, res) => {
  try {
    const business = await businessService.getBusiness(req.user._id);

    res.status(200).json({
      success: true,
      business,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

const updateBusiness = async (req, res) => {
  const {
    businessName,
    ownerName,
    phoneNo,
    address,
    businessType,
    mode,
    currency,
  } = req.body;

  if (
    !businessName?.trim() ||
    !ownerName?.trim() ||
    !phoneNo?.trim() ||
    !address?.trim() ||
    !businessType?.trim() ||
    !mode?.trim() ||
    !currency?.trim()
  ) {
    throw new Error("All fields are required");
  }
  try {
    const business = await businessService.updateBusiness(
      req.user._id,
      req.body,
    );

    res.status(200).json({
      success: true,
      message: "Business updated successfully.",
      business,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createBusiness,
  getBusiness,
  updateBusiness,
};
