const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  getCustomerBalance,
  createPayment,
  getPaymentsByCustomer,
  getPaymentById,
  deletePayment,
  getAllPayments,
} = require("../controllers/paymentController");

router.use(authMiddleware);

router.get("/customer/:customerId/balance", getCustomerBalance);
router.get("/customer/:customerId", getPaymentsByCustomer);
router.post("/", createPayment);
router.get("/:id", getPaymentById);
router.delete("/:id", deletePayment);
router.get("/", getAllPayments);

module.exports = router;
