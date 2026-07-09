const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  createSupplier,
  getSuppliers,
  getSupplier,
  searchSuppliers,
  updateSupplier,
  deleteSupplier,
} = require("../controllers/SupplierController"); 

router.use(authMiddleware);

router.post("/", createSupplier);
router.get("/", getSuppliers);
router.get("/search", searchSuppliers);
router.get("/:id", getSupplier);
router.put("/:id", updateSupplier);
router.delete("/:id", deleteSupplier);

module.exports = router;