const productService = require("../services/productService");

const createProduct = async (req, res) => {
  try {
    const result = await productService.createProduct(req.body, req.user._id);

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error creating product",
      error: error.message,
    });
  }
};

const getAllProducts = async (req, res) => {
  try {
    const result = await productService.getAllProducts(req.user._id);

    res.status(200).json({
      success: true,
      message: "Products retrieved successfully",
      result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error retrieving products",
      error: error.message,
    });
  }
};

const getProductById = async (req, res) => {
  try {
    const id = req.params.id;
    const result = await productService.getProductById(id, req.user._id);

    res.status(200).json({
      success: true,
      message: "Product retrieved successfully",
      result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error retrieving product",
      error: error.message,
    });
  }
};

const updateProduct = async (req, res) => {
  try {
    const id = req.params.id;
    const result = await productService.updateProduct(
      id,
      req.body,
      req.user._id,
    );

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating product",
      error: error.message,
    });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const id = req.params.id;
    const result = await productService.deleteProduct(id, req.user._id);

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
      result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting product",
      error: error.message,
    });
  }
};

module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};
