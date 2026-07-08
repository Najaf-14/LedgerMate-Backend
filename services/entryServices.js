const Entry = require("../models/Entry");
const Customer = require("../models/Customer");

const createEntry = async (data, businessId) => {
  const customer = await Customer.findOne({
    business: businessId,
    name: data.name,
  });

  if (!customer) {
    const error = new Error("Customer not found");
    error.statusCode = 404;
    throw error;
  }

  return await Entry.create({
    business: businessId,
    customer: customer._id,
    entryType: data.entryType,
    itemsDescription: data.itemsDescription,
    manualTotalPrice: data.manualTotalPrice,
    transactionDate: data.transactionDate,
    notes: data.notes,
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
