const mongoose = require("mongoose");
const Payment = require("../models/Payment");
const Entry = require("../models/Entry");
const Customer = require("../models/Customer");
const Supplier = require("../models/Supplier");

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

const getSupplierOutstanding = async (businessId, supplierId) => {
  const [purchasesAgg, paymentsAgg] = await Promise.all([
    Entry.aggregate([
      {
        $match: {
          business: new mongoose.Types.ObjectId(businessId),
          supplier: new mongoose.Types.ObjectId(supplierId),
          entryType: "purchase",
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$totalAmount" },
        },
      },
    ]),

    Payment.aggregate([
      {
        $match: {
          business: new mongoose.Types.ObjectId(businessId),
          supplier: new mongoose.Types.ObjectId(supplierId),
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$amount" },
        },
      },
    ]),
  ]);

  const totalPurchases = purchasesAgg[0]?.total || 0;
  const totalPaid = paymentsAgg[0]?.total || 0;

  const outstanding = Math.round((totalPurchases - totalPaid) * 100) / 100;

  return {
    totalPurchases,
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
  const { customer, supplier, amount, note, paymentDate } = payload;

  if (!amount || amount <= 0) {
    const error = new Error("Amount must be greater than 0");
    error.statusCode = 400;
    throw error;
  }

  if (customer) {
    const customerDoc = await Customer.findOne({
      _id: customer,
      business: businessId,
    });

    if (!customerDoc) {
      const error = new Error("Customer not found");
      error.statusCode = 404;
      throw error;
    }

    const entries = await Entry.find({
      business: businessId,
      customer,
      entryType: "sale",
      remainingAmount: { $gt: 0 },
    }).sort({
      transactionDate: 1,
      _id: 1,
    });

    const totalOutstanding = entries.reduce(
      (sum, entry) => sum + entry.remainingAmount,
      0,
    );

    if (amount > totalOutstanding) {
      const error = new Error(
        `Amount (${amount}) cannot exceed outstanding balance (${totalOutstanding})`,
      );
      error.statusCode = 400;
      throw error;
    }

    const payment = await Payment.create({
      business: businessId,
      customer,
      amount,
      note,
      paymentDate: paymentDate || Date.now(),
    });

    let remainingPayment = amount;

    for (const entry of entries) {
      if (remainingPayment <= 0) {
        break;
      }

      const entryOutstanding = entry.remainingAmount;

      const amountToApply = Math.min(remainingPayment, entryOutstanding);

      entry.paidAmount += amountToApply;

      entry.remainingAmount = entry.totalAmount - entry.paidAmount;

      entry.remainingAmount = Math.round(entry.remainingAmount * 100) / 100;

      if (entry.remainingAmount === 0) {
        entry.paymentStatus = "paid";
      } else if (entry.paidAmount > 0) {
        entry.paymentStatus = "partial";
      } else {
        entry.paymentStatus = "unpaid";
      }

      await entry.save();

      remainingPayment -= amountToApply;
    }

    const balance = await getCustomerOutstanding(businessId, customer);

    return {
      payment,
      balance,
    };
  }

  if (supplier) {
    const supplierDoc = await Supplier.findOne({
      _id: supplier,
      business: businessId,
    });

    if (!supplierDoc) {
      const error = new Error("Supplier not found");
      error.statusCode = 404;
      throw error;
    }

    const entries = await Entry.find({
      business: businessId,
      supplier,
      entryType: "purchase",
      remainingAmount: { $gt: 0 },
    }).sort({
      transactionDate: 1,
      _id: 1,
    });

    const totalOutstanding = entries.reduce(
      (sum, entry) => sum + entry.remainingAmount,
      0,
    );

    if (amount > totalOutstanding) {
      const error = new Error(
        `Amount (${amount}) cannot exceed outstanding balance (${totalOutstanding})`,
      );
      error.statusCode = 400;
      throw error;
    }

    const payment = await Payment.create({
      business: businessId,
      supplier,
      amount,
      note,
      paymentDate: paymentDate || Date.now(),
    });

    let remainingPayment = amount;

    for (const entry of entries) {
      if (remainingPayment <= 0) {
        break;
      }

      const entryOutstanding = entry.remainingAmount;

      const amountToApply = Math.min(remainingPayment, entryOutstanding);

      entry.paidAmount += amountToApply;

      entry.remainingAmount = entry.totalAmount - entry.paidAmount;

      entry.remainingAmount = Math.round(entry.remainingAmount * 100) / 100;

      if (entry.remainingAmount === 0) {
        entry.paymentStatus = "paid";
      } else if (entry.paidAmount > 0) {
        entry.paymentStatus = "partial";
      } else {
        entry.paymentStatus = "unpaid";
      }

      await entry.save();

      remainingPayment -= amountToApply;
    }

    const balance = await getSupplierOutstanding(businessId, supplier);

    return {
      payment,
      balance,
    };
  }

  const error = new Error("Either customer or supplier is required");
  error.statusCode = 400;
  throw error;
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

const getAllPayments = async (businessId, { page = 1, limit = 20 }) => {
  const skip = (page - 1) * limit;
  const businessObjectId = new mongoose.Types.ObjectId(businessId);

  const [payments, total] = await Promise.all([
    Payment.find({ business: businessObjectId })
      .populate("customer", "name phoneNo")
      .sort({ paymentDate: -1 })
      .skip(skip)
      .limit(limit),
    Payment.countDocuments({ business: businessObjectId }),
  ]);

  const customerIds = [
    ...new Set(
      payments
        .map((payment) => payment.customer?._id?.toString())
        .filter(Boolean),
    ),
  ].map((id) => new mongoose.Types.ObjectId(id));

  const entries = customerIds.length
    ? await Entry.find({
        business: businessObjectId,
        customer: { $in: customerIds },
        entryType: "sale",
      }).sort({ transactionDate: 1, _id: 1 })
    : [];

  const entriesByCustomer = entries.reduce((map, entry) => {
    const key = entry.customer.toString();
    if (!map[key]) map[key] = [];
    map[key].push(entry);
    return map;
  }, {});

  const result = payments.map((payment) => {
    const paymentObj = payment.toObject();
    const customerKey = payment.customer?._id?.toString();

    return {
      ...paymentObj,
      entries: customerKey ? entriesByCustomer[customerKey] || [] : [],
    };
  });

  return {
    payments: result,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

module.exports = {
  getCustomerOutstanding,
  getSupplierOutstanding,
  getCustomerBalanceSummary,
  createPayment,
  getPaymentsByCustomer,
  getPaymentById,
  deletePayment,
  getAllPayments,
};
