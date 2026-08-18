const productService = require("../services/productServices");
const { sendNotification } = require("../services/notificationService");

const createProduct = async (req, res) => {
  try {
    const product = await productService.createProduct(req.body, req.user.id);

    if (product.stock < 5) {
      try {
        const tokens = (req.user.fcmTokens || []).filter(Boolean);

        for (const token of tokens) {
          await sendNotification(
            token,
            "Low Stock Alert",
            `${product.name} is low in stock. Only ${product.stock} left.`,
            {
              type: "LOW_STOCK",
              productId: product._id.toString(),
            },
          );
        }
      } catch (notificationError) {
        console.error(
          "Low stock notification failed:",
          notificationError.message,
        );
      }
    }

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message,
    });
  }
};

const getProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const products = await productService.getProducts(req.user.id, page, limit);

    res.status(200).json({
      success: true,
      totalProduct: products.length,
      products,
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message,
    });
  }
};

const searchProducts = async (req, res) => {
  try {
    const { name } = req.query;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "name is required",
      });
    }

    const products = await productService.searchProducts(name, req.user.id);

    res.status(200).json({
      success: true,
      products,
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message,
    });
  }
};

const getProduct = async (req, res) => {
  try {
    const product = await productService.getProduct(req.params.id, req.user.id);

    res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateProduct = async (req, res) => {
  try {
    const product = await productService.updateProduct(
      req.params.id,
      req.body,
      req.user.id,
    );

    // Low stock notification
    if (product.stock < 5) {
      try {
        const tokens = (req.user.fcmTokens || []).filter(Boolean);

        for (const token of tokens) {
          await sendNotification(
            token,
            "Low Stock Alert",
            `${product.name} is low in stock. Only ${product.stock} left.`,
            {
              type: "LOW_STOCK",
              productId: product._id.toString(),
            },
          );
        }
      } catch (notificationError) {
        console.error(
          "Low stock notification failed:",
          notificationError.message,
        );
      }
    }

    res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message,
    });
  }
};

const deleteProduct = async (req, res) => {
  try {
    await productService.deleteProduct(req.params.id, req.user.id);

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createProduct,
  getProducts,
  searchProducts,
  getProduct,
  updateProduct,
  deleteProduct,
};
