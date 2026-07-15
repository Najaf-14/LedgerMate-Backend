const Supplier = require("../models/Supplier");
const Business = require("../models/Business");

const createSupplier = async (data, businessId) => {
  const business = await Business.findById(businessId);

  if (!business) {
    const error = new Error("Business not found");
    error.statusCode = 404;
    throw error;
  }

  const supplierCount = await Supplier.countDocuments({
    business: businessId,
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
    business: businessId,
    phoneNo: data.phoneNo,
  });

  if (supplierExists) {
    const error = new Error("Supplier already exists");
    error.statusCode = 400;
    throw error;
  }

  return await Supplier.create({
    ...data,
    business: businessId,
  });
};

const getSuppliers = async (businessId) => {
  return await Supplier.find({
    business: businessId,
  }).sort({ createdAt: -1 });
};

const searchSuppliers = async (query, businessId) => {
  return await Supplier.find({
    business: businessId,
    name: {
      $regex: query,
      $options: "i",
    },
  }).sort({ createdAt: -1 });
};

const getSupplier = async (id, businessId) => {
  const supplier = await Supplier.findOne({
    _id: id,
    business: businessId,
  });

  if (!supplier) {
    const error = new Error("Supplier not found");
    error.statusCode = 404;
    throw error;
  }

  return supplier;
};

const updateSupplier = async (id, data, businessId) => {
  const supplier = await Supplier.findOneAndUpdate(
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

  if (!supplier) {
    const error = new Error("Supplier not found");
    error.statusCode = 404;
    throw error;
  }

  return supplier;
};

const deleteSupplier = async (id, businessId) => {
  const supplier = await Supplier.findOne({
    _id: id,
    business: businessId,
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
  getSupplier,
  searchSuppliers,
  updateSupplier,
  deleteSupplier,
};
