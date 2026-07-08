const Entry = require("../models/Entry");
const Customer = require("../models/Customer");

const createEntry = async (data, businessId) => {
  const customer = await Customer.findOne({
    _id: data.customer,
    business: businessId,
  });

  if (!customer) {
    const error = new Error("Customer not found");
    error.statusCode = 404;
    throw error;
  }

  return await Entry.create({
    ...data,
    business: businessId,
  });
};

const getEntries = async (businessId) => {
  return await Entry.find({ business: businessId })
    .populate("customer")
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
    }
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