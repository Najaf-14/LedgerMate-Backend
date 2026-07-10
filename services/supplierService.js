const Supplier = require("../models/Supplier");

const createSupplier = async (data, businessId) => {
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
