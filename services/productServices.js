const Product = require("../models/Product");
const getBusinessByUserId = require("../utils/getBusiness");

const createProduct = async (data, userId) => {
  const { name, price, stocks, category } = data;

  if (!name || name.trim() === "") {
    const error = new Error("Product name is required");
    error.statusCode = 400;
    throw error;
  }

  if (price === undefined || price === null) {
    const error = new Error("Price is required");
    error.statusCode = 400;
    throw error;
  }

  if (price < 0) {
    const error = new Error("Price cannot be negative");
    error.statusCode = 400;
    throw error;
  }

  if (stocks !== undefined && stocks < 0) {
    const error = new Error("Stock cannot be negative");
    error.statusCode = 400;
    throw error;
  }

  const business = await getBusinessByUserId(userId);

  if (business.mode === "simple") {
    const error = new Error(
      "Products are available only for Premium users. Upgrade your plan.",
    );
    error.statusCode = 403;
    throw error;
  }

  const productExists = await Product.findOne({
    business: business._id,
    name: name.trim(),
  });

  if (productExists) {
    const error = new Error("Product already exists");
    error.statusCode = 400;
    throw error;
  }

  return await Product.create({
    business: business._id,
    name: name.trim(),
    price,
    stocks,
    category,
  });
};

const getProducts = async (userId) => {
  const business = await getBusinessByUserId(userId);

  if (business.mode === "simple") {
    const error = new Error("Products are available only for Premium users.");
    error.statusCode = 403;
    throw error;
  }

  return await Product.find({
    business: business._id,
  }).sort({ createdAt: -1 });
};

const searchProducts = async (query, userId) => {
  const business = await getBusinessByUserId(userId);

  if (business.mode === "simple") {
    const error = new Error("Products are available only for Premium users.");
    error.statusCode = 403;
    throw error;
  }

  return await Product.find({
    business: business._id,
    name: {
      $regex: query,
      $options: "i",
    },
  }).sort({ createdAt: -1 });
};

const getProduct = async (id, userId) => {
  const business = await getBusinessByUserId(userId);

  if (business.mode === "simple") {
    const error = new Error("Products are available only for Premium users.");
    error.statusCode = 403;
    throw error;
  }

  const product = await Product.findOne({
    _id: id,
    business: business._id,
  });

  if (!product) {
    const error = new Error("Product not found");
    error.statusCode = 404;
    throw error;
  }

  return product;
};

const updateProduct = async (id, data, userId) => {
  if (data.name !== undefined && data.name.trim() === "") {
    const error = new Error("Product name is required");
    error.statusCode = 400;
    throw error;
  }

  if (data.price !== undefined && data.price < 0) {
    const error = new Error("Price cannot be negative");
    error.statusCode = 400;
    throw error;
  }

  if (data.stocks !== undefined && data.stocks < 0) {
    const error = new Error("Stock cannot be negative");
    error.statusCode = 400;
    throw error;
  }

  const business = await getBusinessByUserId(userId);

  if (business.mode === "simple") {
    const error = new Error("Products are available only for Premium users.");
    error.statusCode = 403;
    throw error;
  }

  const product = await Product.findOneAndUpdate(
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

  if (!product) {
    const error = new Error("Product not found");
    error.statusCode = 404;
    throw error;
  }

  return product;
};

const deleteProduct = async (id, userId) => {
  const business = await getBusinessByUserId(userId);

  if (business.mode === "simple") {
    const error = new Error("Products are available only for Premium users.");
    error.statusCode = 403;
    throw error;
  }

  const product = await Product.findOne({
    _id: id,
    business: business._id,
  });

  if (!product) {
    const error = new Error("Product not found");
    error.statusCode = 404;
    throw error;
  }

  await product.deleteOne();
};

module.exports = {
  createProduct,
  getProducts,
  searchProducts,
  getProduct,
  updateProduct,
  deleteProduct,
};
