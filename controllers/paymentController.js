const { sendNotification } = require("../services/notificationService");
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

    res.status(200).json({
      success: true,
      data: summary,
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message,
    });
  }
};

const getSupplierBalance = async (req, res, next) => {
  try {
    const businessId = req.user.business;
    const { supplierId } = req.params;

    const balance = await paymentService.getSupplierOutstanding(
      businessId,
      supplierId,
    );

    res.status(200).json({
      success: true,
      data: balance,
    });
  } catch (error) {
    next(error);
  }
};

const createPayment = async (req, res) => {
  try {
    const business = await getBusinessByUserId(req.user.id);

    const paymentPayload = {
      ...req.body,
      amount: req.body.amount ?? req.body.amountReceived,
    };

    const payment = await paymentService.createPayment(
      business._id,
      paymentPayload,
    );

    // Send notification after payment is successfully created
    try {
      const tokens = (req.user.fcmTokens || []).filter(Boolean);

      for (const token of tokens) {
        await sendNotification(
          token,
          "Payment Recorded",
          `Payment of Rs. ${payment.payment.amount} has been recorded successfully.`,
          {
            type: "PAYMENT_CREATED",
            paymentId: payment.payment._id.toString(),
          },
        );
      }
    } catch (notificationError) {
      console.error("Payment notification failed:", notificationError.message);
    }

    res.status(201).json({
      success: true,
      data: payment,
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message,
    });
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

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message,
    });
  }
};

const getPaymentById = async (req, res) => {
  try {
    const business = await getBusinessByUserId(req.user.id);

    const payment = await paymentService.getPaymentById(
      business._id,
      req.params.id,
    );

    res.status(200).json({
      success: true,
      data: payment,
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message,
    });
  }
};

const deletePayment = async (req, res) => {
  try {
    const business = await getBusinessByUserId(req.user.id);

    await paymentService.deletePayment(business._id, req.params.id);

    res.status(200).json({
      success: true,
      message: "Payment deleted successfully",
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message,
    });
  }
};

const getAllPayments = async (req, res) => {
  try {
    const business = await getBusinessByUserId(req.user.id);

    const { page = 1, limit = 20 } = req.query;

    const result = await paymentService.getAllPayments(business._id, {
      page: Number(page),
      limit: Number(limit),
    });

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getCustomerBalance,
  getSupplierBalance,
  createPayment,
  getPaymentsByCustomer,
  getPaymentById,
  deletePayment,
  getAllPayments,
};
