const Entry = require("../models/Entry")
const Customer = require("../models/Customer")
const Supplier = require("../models/Supplier")

const createEntry = async (data, businessId) => {
  const { entryType, customer, supplier } = data;

  if (entryType === "sale") {
    const customerExists = await Customer.findOne({
      _id: customer,
      business: businessId,
    });

    if (!customerExists) {
      const error = new Error("Customer not found");
      error.statusCode = 404;
      throw error;
    }
  }

  if (entryType === "purchase") {
    const supplierExists = await Supplier.findOne({
      _id: supplier,
      business: businessId,
    });

    if (!supplierExists) {
      const error = new Error("Supplier not found");
      error.statusCode = 404;
      throw error;
    }
  }

  const entry = await Entry.create({
    business: businessId,
    customer: entryType === "sale" ? customer : undefined,
    supplier: entryType === "purchase" ? supplier : undefined,
    entryType,
    itemsDescription: data.itemsDescription,
    manualTotalPrice: data.manualTotalPrice,
    transactionDate: data.transactionDate,
    notes: data.notes,
  });

  return entry;
};

const getEntries = async (businessId) => {
  return await Entry.find({ business: businessId })
    .populate("customer")
    .populate("supplier")
    .sort({ transactionDate: -1 });
};

const getEntry = async (id, businessId) => {
  const entry = await Entry.findOne({
    _id: id,
    business: businessId,
  }).populate("customer");

  if (!entry) {
    const error = new Error("Entry not found");
    error.statusCode = 404;
    throw error;
  }

  return entry;
};

const updateEntry = async (id, data, businessId) => {
  const entry = await Entry.findOneAndUpdate(
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

  if (!entry) {
    const error = new Error("Entry not found");
    error.statusCode = 404;
    throw error;
  }

  return entry;
};

const deleteEntry = async (id, businessId) => {
  const entry = await Entry.findOne({
    _id: id,
    business: businessId,
  });

  if (!entry) {
    const error = new Error("Entry not found");
    error.statusCode = 404;
    throw error;
  }

  await entry.deleteOne();
};

module.exports = {
  createEntry,
  getEntries,
  getEntry,
  updateEntry,
  deleteEntry,
};
