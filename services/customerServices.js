const Customer = require("../models/Customer");
const getBusinessByUserId = require("../utils/getBusiness");
const PLAN_LIMITS = require("../config/planLimits");

const createCustomer = async (data, userId) => {
  const { name, phoneNo, email, address } = data;

  const business = await getBusinessByUserId(userId);

  const customerCount = await Customer.countDocuments({
    business: business._id,
  });

  const limit = PLAN_LIMITS[business.mode]?.customers;

  if (limit !== undefined && customerCount >= limit) {
    const error = new Error(
      `Customer limit reached. Your ${business.mode} plan allows ${limit} customers.`,
    );

    error.statusCode = 403;
    throw error;
  }

  const existingCustomer = await Customer.findOne({
    business: business._id,
    phoneNo,
  });

  if (existingCustomer) {
    const error = new Error("Customer with this phone number already exists");

    error.statusCode = 409;
    throw error;
  }

  const customer = await Customer.create({
    business: business._id,
    name: name.trim(),
    phoneNo: phoneNo.trim(),
    email: email?.trim() || undefined,
    address: address?.trim() || "",
  });

  return customer;
};

const getCustomers = async (userId) => {
  const business = await getBusinessByUserId(userId);

  return await Customer.find({
    business: business._id,
  }).sort({ createdAt: -1 });
};

const searchCustomers = async (query, userId) => {
  const business = await getBusinessByUserId(userId);

  return await Customer.find({
    business: business._id,
    name: {
      $regex: query,
      $options: "i",
    },
  }).sort({ createdAt: -1 });
};

const getCustomer = async (id, userId) => {
  const business = await getBusinessByUserId(userId);

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
  const business = await getBusinessByUserId(userId);

  // If phone number is being changed,
  // check whether another customer already has it
  if (data.phoneNo) {
    const existingCustomer = await Customer.findOne({
      business: business._id,
      phoneNo: data.phoneNo.trim(),
      _id: { $ne: id },
    });

    if (existingCustomer) {
      const error = new Error(
        "Another customer with this phone number already exists",
      );

      error.statusCode = 409;
      throw error;
    }
  }

  const updateData = {
    ...data,
  };

  if (updateData.name) {
    updateData.name = updateData.name.trim();
  }

  if (updateData.phoneNo) {
    updateData.phoneNo = updateData.phoneNo.trim();
  }

  if (updateData.email) {
    updateData.email = updateData.email.trim();
  }

  if (updateData.address) {
    updateData.address = updateData.address.trim();
  }

  const customer = await Customer.findOneAndUpdate(
    {
      _id: id,
      business: business._id,
    },
    updateData,
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
  const business = await getBusinessByUserId(userId);

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

  return customer;
};

module.exports = {
  createCustomer,
  getCustomers,
  getCustomer,
  searchCustomers,
  updateCustomer,
  deleteCustomer,
};
