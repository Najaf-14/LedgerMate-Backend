const mongoose = require("mongoose");
const Payment = require("../models/Payment");
const Entry = require("../models/Entry");
const Customer = require("../models/Customer");

const getCustomerOutstanding = async (businessId, customerId) => {
  const [salesAgg, paymentsAgg] = await Promise.all([
    Entry.aggregate([
      {
        $match: {
          business: new mongoose.Types.ObjectId(businessId),
          customer: new mongoose.Types.ObjectId(customerId),
          entryType: "sale",
        },
      },
      { $group: { _id: null, total: { $sum: "$totalAmount" } } },
    ]),
    Payment.aggregate([
      {
        $match: {
          business: new mongoose.Types.ObjectId(businessId),
          customer: new mongoose.Types.ObjectId(customerId),
        },
      },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]),
  ]);

  const totalSales = salesAgg[0]?.total || 0;
  const totalPaid = paymentsAgg[0]?.total || 0;

  const outstanding = Math.round((totalSales - totalPaid) * 100) / 100;

  return {
    totalSales,
    totalPaid,
    outstanding: outstanding < 0 ? 0 : outstanding,
  };
};

const getCustomerBalanceSummary = async (businessId, customerId) => {
  const customer = await Customer.findOne({
    _id: customerId,
    business: businessId,
  });

  if (!customer) {
    const error = new Error("Customer not found");
    error.statusCode = 404;
    throw error;
  }

  const { totalSales, totalPaid, outstanding } = await getCustomerOutstanding(
    businessId,
    customerId,
  );

  return {
    customer,
    totalSales,
    totalPaid,
    outstanding,
  };
};

const createPayment = async (businessId, payload) => {
  const { applicantId, amount, note, paymentDate, allowOverpayment } = payload;

  const customerDoc = await Customer.findOne({
    _id: applicantId,
    business: businessId,
  });
  if (!customerDoc) {
    const error = new Error("Customer not found");
    error.statusCode = 404;
    throw error;
  }

  if (!amount || amount <= 0) {
    const error = new Error("Amount must be greater than 0");
    error.statusCode = 400;
    throw error;
  }

  const { outstanding } = await getCustomerOutstanding(businessId, applicantId);

  if (!allowOverpayment && amount > outstanding) {
    const error = new Error(
      `Amount (${amount}) cannot exceed outstanding balance (${outstanding})`,
    );
    error.statusCode = 400;
    throw error;
  }

  const payment = await Payment.create({
    business: businessId,
    customer: applicantId,
    amount,
    note,
    paymentDate: paymentDate || Date.now(),
  });

  return payment;
};

const getPaymentsByCustomer = async (
  businessId,
  customerId,
  { page = 1, limit = 10 } = {},
) => {
  const skip = (page - 1) * limit;

  const [payments, total] = await Promise.all([
    Payment.find({ business: businessId, customer: customerId })
      .sort({ paymentDate: -1 })
      .skip(skip)
      .limit(limit),
    Payment.countDocuments({ business: businessId, customer: customerId }),
  ]);

  return {
    payments,
    pagination: {
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / limit),
    },
  };
};

const getPaymentById = async (businessId, paymentId) => {
  const payment = await Payment.findOne({
    _id: paymentId,
    business: businessId,
  }).populate("customer", "name phoneNo");
  if (!payment) {
    const error = new Error("Payment not found");
    error.statusCode = 404;
    throw error;
  }
  return payment;
};

const deletePayment = async (businessId, paymentId) => {
  const payment = await Payment.findOneAndDelete({
    _id: paymentId,
    business: businessId,
  });
  if (!payment) {
    const error = new Error("Payment not found");
    error.statusCode = 404;
    throw error;
  }
  return payment;
};

module.exports = {
  getCustomerOutstanding,
  getCustomerBalanceSummary,
  createPayment,
  getPaymentsByCustomer,
  getPaymentById,
  deletePayment,
};
