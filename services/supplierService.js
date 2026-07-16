const Supplier = require("../models/Supplier");
const Business = require("../models/Business");
const PLAN_LIMITS = require("../config/planLimits");
const getBusinessByUserId = require("../utils/getBusiness");

const createSupplier = async (data, userId) => {
  const business = await getBusinessByUserId(userId);

  const supplierCount = await Supplier.countDocuments({
    business: business._id,
  });

  const limit = PLAN_LIMITS[business.mode].suppliers;

  if (supplierCount >= limit) {
    const error = new Error(
      "Supplier limit reached. Upgrade to Premium to continue.",
    );
    error.statusCode = 403;
    throw error;
  }

  const supplierExists = await Supplier.findOne({
    business: business._id,
    phoneNo: data.phoneNo,
  });

  if (supplierExists) {
    const error = new Error("Supplier already exists");
    error.statusCode = 400;
    throw error;
  }

  return await Supplier.create({
    ...data,
    business: business._id,
  });
};

const getSuppliers = async (userId) => {
  const business = await getBusinessByUserId(userId);

  return await Supplier.find({
    business: business._id,
  }).sort({ createdAt: -1 });
};

const searchSuppliers = async (query, userId) => {
  const business = await getBusinessByUserId(userId);

  return await Supplier.find({
    business: business._id,
    name: {
      $regex: query,
      $options: "i",
    },
  }).sort({ createdAt: -1 });
};

const getSupplier = async (id, userId) => {
  const business = await getBusinessByUserId(userId);

  const supplier = await Supplier.findOne({
    _id: id,
    business: business._id,
  });

  if (!supplier) {
    const error = new Error("Supplier not found");
    error.statusCode = 404;
    throw error;
  }

  return supplier;
};

const updateSupplier = async (id, data, userId) => {
  const business = await getBusinessByUserId(userId);

  const supplier = await Supplier.findOneAndUpdate(
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

  if (!supplier) {
    const error = new Error("Supplier not found");
    error.statusCode = 404;
    throw error;
  }

  return supplier;
};

const deleteSupplier = async (id, userId) => {
  const business = await getBusinessByUserId(userId);

  const supplier = await Supplier.findOne({
    _id: id,
    business: business._id,
  });

  if (!supplier) {
    const error = new Error("Supplier not found");
    error.statusCode = 404;
    throw error;
  }

  await supplier.deleteOne();
};

module.exports = {
  createSupplier,
  getSuppliers,
  searchSuppliers,
  getSupplier,
  updateSupplier,
  deleteSupplier,
};
