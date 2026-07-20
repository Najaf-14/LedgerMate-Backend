const Entry = require("../models/Entry");
const Customer = require("../models/Customer");
const Supplier = require("../models/Supplier");
const Product = require("../models/Product");
const getBusinessByUserId = require("../utils/getBusiness");

const createEntry = async (data, userId) => {
  const business = await getBusinessByUserId(userId);

  const { entryType, customer, supplier } = data;

  if (entryType === "sale") {
    const customerExists = await Customer.findOne({
      _id: customer,
      business: business._id,
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
      business: business._id,
    });

    if (!supplierExists) {
      const error = new Error("Supplier not found");
      error.statusCode = 404;
      throw error;
    }
  }

  if (business.mode === "simple") {
    const entry = await Entry.create({
      business: business._id,
      customer: entryType === "sale" ? customer : undefined,
      supplier: entryType === "purchase" ? supplier : undefined,
      entryType,
      itemsDescription: data.itemsDescription,
      manualTotalPrice: data.manualTotalPrice,
      transactionDate: data.transactionDate,
      notes: data.notes,
    });

    return entry;
  }

  let subTotal = 0;
  const products = [];

  for (const item of data.products) {
    const product = await Product.findOne({
      _id: item.product,
      business: business._id,
    });

    if (!product) {
      const error = new Error("Product not found");
      error.statusCode = 404;
      throw error;
    }

    if (entryType === "sale" && product.stock < item.quantity) {
      const error = new Error(
        `${product.name} has only ${product.stock} items available in stock`,
      );
      error.statusCode = 400;
      throw error;
    }

    const total = product.price * item.quantity;

    subTotal += total;

    products.push({
      product: product._id,
      name: product.name,
      price: product.price,
      quantity: item.quantity,
      total,
    });

    if (entryType === "sale") {
      product.stock -= item.quantity;
    } else {
      product.stock += item.quantity;
    }

    await product.save();
  }

  const discount = data.discount || 0;
  const totalAmount = subTotal - discount;

  const entry = await Entry.create({
    business: business._id,
    customer: entryType === "sale" ? customer : undefined,
    supplier: entryType === "purchase" ? supplier : undefined,
    entryType,
    products,
    subtotal: subTotal,
    discount,
    totalAmount,
    transactionDate: data.transactionDate,
    notes: data.notes,
  });

  return entry;
};

const getEntries = async (userId, page = 1, limit = 20) => {
  const business = await getBusinessByUserId(userId);

  const skip = (page - 1) * limit;

  const entries = await Entry.find({
    business: business._id,
  })
    .populate("customer")
    .populate("supplier")
    .sort({ transactionDate: -1, _id: -1 })
    .skip(skip)
    .limit(limit);

  const totalEntries = await Entry.countDocuments({
    business: business._id,
  });

  return {
    entries,
    currentPage: page,
    totalPages: Math.ceil(totalEntries / limit),
    totalEntries,
  };
};

const getEntry = async (id, userId) => {
  const business = await getBusinessByUserId(userId);

  const entry = await Entry.findOne({
    _id: id,
    business: business._id,
  }).populate("customer");

  if (!entry) {
    const error = new Error("Entry not found");
    error.statusCode = 404;
    throw error;
  }

  return entry;
};

const updateEntry = async (id, data, userId) => {
  const business = await getBusinessByUserId(userId);

  const entry = await Entry.findOneAndUpdate(
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

  if (!entry) {
    const error = new Error("Entry not found");
    error.statusCode = 404;
    throw error;
  }

  return entry;
};

const deleteEntry = async (id, userId) => {
  const business = await getBusinessByUserId(userId);

  const entry = await Entry.findOne({
    _id: id,
    business: business._id,
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
