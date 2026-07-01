const productService = require("../services/productService");

const createProduct = async (req, res) => {
  try {
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        message: "Error creating product",
        error: error.message,
      });
  }
};

const getAllProducts = async (req, res) => {};

const getProductById = async (req, res) => {};

const updateProduct = async (req, res) => {};

const deleteProduct = async (req, res) => {};

module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};
