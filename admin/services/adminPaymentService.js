const mongoose = require("mongoose");
const Payment = require("../../models/Payment");

const getAllPayments = async ({
  page = 1,
  limit = 10,
  search = "",
  type = "",
  fromDate = "",
  toDate = "",
}) => {
  page = Number(page) || 1;
  limit = Number(limit) || 10;

  const skip = (page - 1) * limit;

  const filter = {};

  if (type === "customer") {
    filter.customer = { $exists: true, $ne: null };
  }

  if (type === "supplier") {
    filter.supplier = { $exists: true, $ne: null };
  }

  if (fromDate || toDate) {
    filter.paymentDate = {};

    if (fromDate) {
      filter.paymentDate.$gte = new Date(`${fromDate}T00:00:00.000Z`);
    }

    if (toDate) {
      filter.paymentDate.$lte = new Date(`${toDate}T23:59:59.999Z`);
    }
  }

  let payments = await Payment.find(filter)
    .populate("business", "businessName ownerName")
    .populate("customer", "name phoneNo")
    .populate("supplier", "name phoneNo")
    .sort({ paymentDate: -1 })
    .lean();

  if (search.trim()) {
    const searchTerm = search.trim().toLowerCase();

    payments = payments.filter((payment) => {
      const customerName = payment.customer?.name?.toLowerCase() || "";
      const customerPhone = payment.customer?.phoneNo?.toLowerCase() || "";

      const supplierName = payment.supplier?.name?.toLowerCase() || "";
      const supplierPhone = payment.supplier?.phoneNo?.toLowerCase() || "";

      const businessName = payment.business?.businessName?.toLowerCase() || "";

      return (
        customerName.includes(searchTerm) ||
        customerPhone.includes(searchTerm) ||
        supplierName.includes(searchTerm) ||
        supplierPhone.includes(searchTerm) ||
        businessName.includes(searchTerm)
      );
    });
  }

  const total = payments.length;

  const paginatedPayments = payments.slice(skip, skip + limit);

  return {
    payments: paginatedPayments,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      hasNextPage: page < Math.ceil(total / limit),
      hasPreviousPage: page > 1,
    },
  };
};

const getPaymentById = async (paymentId) => {
  if (!mongoose.Types.ObjectId.isValid(paymentId)) {
    const error = new Error("Invalid payment ID");
    error.statusCode = 400;
    throw error;
  }

  const payment = await Payment.findById(paymentId)
    .populate("business", "businessName ownerName phoneNo address")
    .populate("customer", "name phoneNo email")
    .populate("supplier", "name phoneNo email")
    .lean();

  if (!payment) {
    const error = new Error("Payment not found");
    error.statusCode = 404;
    throw error;
  }

  return payment;
};

module.exports = {
  getAllPayments,
  getPaymentById,
};
