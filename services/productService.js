const Product = require("../models/Product");

const createProduct = async (productData, userId) => {
  const createProduct = await Product.create({
    ...productData,
    userId,
  });

  return createProduct;
};

const getAllProducts = async (userId) => {
  return await Product.find({ userId, isActive: true });
};

const getProductById = async (productId, userId) => {
  return await Prduct.findOne({
    _id: productId,
    userId,
    isActice: true,
  });
};

const updateProduct = async (productId, productData, userId) => {
  const product = await Product.findOneAndUpdate(
    { _id: productId, userId, isActive: true },
    productData,
    { new: true, runValidators: true },
  );
  if (!product) {
    throw new Error("Product not found");
  }
  return product;
};

const deleteProduct = async (productId, userId) => {
  const product = await Product.findOneAndUpdate(
    { _id: productId, userId, isActice: true },
    { isActive: false },
    { new: true },
  );
  if (!product) {
    throw new Error("Product not found");
  }
  return product;
};

module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};
