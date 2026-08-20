const adminPaymentService = require("../services/adminPaymentService");

const getAdminPayments = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = "",
      type = "",
      fromDate = "",
      toDate = "",
    } = req.query;

    if (!["", "customer", "supplier"].includes(type)) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment type",
      });
    }

    const result = await adminPaymentService.getAllPayments({
      page,
      limit,
      search,
      type,
      fromDate,
      toDate,
    });

    return res.status(200).json({
      success: true,
      result,
    });
  } catch (error) {
    console.error("Admin payments error:", error);

    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Failed to fetch payments",
    });
  }
};

const getAdminPaymentById = async (req, res) => {
  try {
    const payment = await adminPaymentService.getPaymentById(req.params.id);

    return res.status(200).json({
      success: true,
      result: {
        payment,
      },
    });
  } catch (error) {
    console.error("Admin payment details error:", error);

    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Failed to fetch payment",
    });
  }
};

module.exports = {
  getAdminPayments,
  getAdminPaymentById,
};
