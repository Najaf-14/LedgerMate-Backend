const Customer = require("../models/Customer");
const Business = require("../models/Business");
const PLAN_LIMITS = require("../config/planLimits");

const createCustomer = async (data, userId) => {
  const business = await Business.findOne({ userId });

  if (!business) {
    const error = new Error("Business not found");
    error.statusCode = 404;
    throw error;
  }

  const customerCount = await Customer.countDocuments({
    business: business._id,
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
    business: business._id,
    phoneNo: data.phoneNo,
  });

  if (customerExists) {
    const error = new Error("Customer already exists");
    error.statusCode = 400;
    throw error;
  }

  return await Customer.create({
    ...data,
    business: business._id,
  });
};

const getCustomers = async (userId) => {
  const business = await Business.findOne({ userId });

  if (!business) {
    const error = new Error("Business not found");
    error.statusCode = 404;
    throw error;
  }

  return await Customer.find({
    business: business._id,
  }).sort({ createdAt: -1 });
};

const searchCustomers = async (query, userId) => {
  const business = await Business.findOne({ userId });

  if (!business) {
    const error = new Error("Business not found");
    error.statusCode = 404;
    throw error;
  }

  return await Customer.find({
    business: business._id,
    name: {
      $regex: query,
      $options: "i",
    },
  }).sort({ createdAt: -1 });
};

const getCustomer = async (id, userId) => {
  const business = await Business.findOne({ userId });

  if (!business) {
    const error = new Error("Business not found");
    error.statusCode = 404;
    throw error;
  }

  const customer = await Customer.findOne({
    _id: id,
    business: business._id,
  });

  if (!customer) {
    const error = new Error("Customer not found");
    error.statusCode = 404;
    throw error;
  }

  return customer;
};

const updateCustomer = async (id, data, userId) => {
  const business = await Business.findOne({ userId });

  if (!business) {
    const error = new Error("Business not found");
    error.statusCode = 404;
    throw error;
  }

  const customer = await Customer.findOneAndUpdate(
    {
      _id: id,
      business: business._id,
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

const deleteCustomer = async (id, userId) => {
  const business = await Business.findOne({ userId });

  if (!business) {
    const error = new Error("Business not found");
    error.statusCode = 404;
    throw error;
  }

  const customer = await Customer.findOne({
    _id: id,
    business: business._id,
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
