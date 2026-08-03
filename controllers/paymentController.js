const paymentService = require("../services/paymentService");
const getBusinessByUserId = require("../utils/getBusiness");

const getCustomerBalance = async (req, res) => {
  try {
    const business = await getBusinessByUserId(req.user.id);
    const { customerId } = req.params;

    const summary = await paymentService.getCustomerBalanceSummary(
      business._id,
      customerId,
    );

    res.status(200).json({ success: true, data: summary });
  } catch (error) {
    res
      .status(error.statusCode || 500)
      .json({ success: false, message: error.message });
  }
};

const createPayment = async (req, res) => {
  try {
    const business = await getBusinessByUserId(req.user.id);

    const payment = await paymentService.createPayment(business._id, req.body);

    res.status(201).json({ success: true, data: payment });
  } catch (error) {
    res
      .status(error.statusCode || 500)
      .json({ success: false, message: error.message });
  }
};

const getPaymentsByCustomer = async (req, res) => {
  try {
    const business = await getBusinessByUserId(req.user.id);
    const { customerId } = req.params;
    const { page, limit } = req.query;

    const result = await paymentService.getPaymentsByCustomer(
      business._id,
      customerId,
      {
        page: Number(page) || 1,
        limit: Number(limit) || 10,
      },
    );

    res.status(200).json({ success: true, data: result });
  } catch (error) {
    res
      .status(error.statusCode || 500)
      .json({ success: false, message: error.message });
  }
};

const getPaymentById = async (req, res) => {
  try {
    const business = await getBusinessByUserId(req.user.id);

    const payment = await paymentService.getPaymentById(
      business._id,
      req.params.id,
    );

    res.status(200).json({ success: true, data: payment });
  } catch (error) {
    res
      .status(error.statusCode || 500)
      .json({ success: false, message: error.message });
  }
};

const deletePayment = async (req, res) => {
  try {
    const business = await getBusinessByUserId(req.user.id);

    await paymentService.deletePayment(business._id, req.params.id);

    res
      .status(200)
      .json({ success: true, message: "Payment deleted successfully" });
  } catch (error) {
    res
      .status(error.statusCode || 500)
      .json({ success: false, message: error.message });
  }
};

module.exports = {
  getCustomerBalance,
  createPayment,
  getPaymentsByCustomer,
  getPaymentById,
  deletePayment,
};
