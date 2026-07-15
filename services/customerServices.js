const Customer = require("../models/Customer");
const Business = require("../models/Business");

const createCustomer = async (data, businessId) => {
  const business = await Business.findById(businessId);

  if (!business) {
    const error = new Error("Business not found");
    error.statusCode = 404;
    throw error;
  }

  const customerCount = await Customer.countDocuments({
    business: businessId,
  });

  const limit = PLAN_LIMITS[business.mode].customers;

  if (customerCount >= limit) {
    const error = new Error(
      "Customer limit reached. Upgrade to Premium to continue.",
    );
    error.statusCode = 403;
    throw error;
  }

  const customerExists = await Customer.findOne({
    business: businessId,
    phoneNo: data.phoneNo,
  });

  if (customerExists) {
    const error = new Error("Customer already exists");
    error.statusCode = 400;
    throw error;
  }

  return await Customer.create({
    ...data,
    business: businessId,
  });
};

const getCustomers = async (businessId) => {
  return await Customer.find({
    business: businessId,
  }).sort({ createdAt: -1 });
};

const searchCustomers = async (query, businessId) => {
  return await Customer.find({
    business: businessId,
    name: {
      $regex: query,
      $options: "i",
    },
  }).sort({ createdAt: -1 });
};

const getCustomer = async (id, businessId) => {
  const customer = await Customer.findOne({
    _id: id,
    business: businessId,
  });

  if (!customer) {
    const error = new Error("Customer not found");
    error.statusCode = 404;
    throw error;
  }

  return customer;
};

const updateCustomer = async (id, data, businessId) => {
  const customer = await Customer.findOneAndUpdate(
    {
      _id: id,
      business: businessId,
    },
    data,
    {
      new: true,
      runValidators: true,
    },
  );

  if (!customer) {
    const error = new Error("Customer not found");
    error.statusCode = 404;
    throw error;
  }

  return customer;
};

const deleteCustomer = async (id, businessId) => {
  const customer = await Customer.findOne({
    _id: id,
    business: businessId,
  });

  if (!customer) {
    const error = new Error("Customer not found");
    error.statusCode = 404;
    throw error;
  }

  await customer.deleteOne();
};

module.exports = {
  createCustomer,
  getCustomers,
  getCustomer,
  searchCustomers,
  updateCustomer,
  deleteCustomer,
};
