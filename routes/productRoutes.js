const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();
const {
  createProduct,
  getProducts,
  searchProducts,
  getProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");

router.use(authMiddleware);

router.post("/", createProduct);
router.get("/", getProducts);
router.get("/search", searchProducts);
router.get("/:id", getProduct);
router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);

module.exports = router;
