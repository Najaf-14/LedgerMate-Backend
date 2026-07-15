// * Helper function for customer and supplier

const Business = require("../models/Business");

const getBusinessByUserId = async (userId) => {
  const business = await Business.findOne({ userId });

  if (!business) {
    const error = new Error("Business not found");
    error.statusCode = 404;
    throw error;
  }

  return business;
};

module.exports = getBusinessByUserId;
