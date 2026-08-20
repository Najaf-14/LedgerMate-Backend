const mongoose = require("mongoose");

const User = require("../../models/User");
const Business = require("../../models/Business");
const Payment = require("../../models/Payment");
const Customer = require("../../models/Customer");
const Supplier = require("../../models/Supplier");
const Product = require("../../models/Product");

const getAdminReports = async ({ from, to }) => {
  const fromDate = new Date(from);
  const toDate = new Date(to);

  // Include the complete "to" date
  toDate.setHours(23, 59, 59, 999);

  /*
   * Basic totals
   */
  const [
    newUsers,
    newBusinesses,
    newCustomers,
    newSuppliers,
    newProducts,
    paymentStats,
  ] = await Promise.all([
    User.countDocuments({
      createdAt: {
        $gte: fromDate,
        $lte: toDate,
      },
    }),

    Business.countDocuments({
      createdAt: {
        $gte: fromDate,
        $lte: toDate,
      },
    }),

    Customer.countDocuments({
      createdAt: {
        $gte: fromDate,
        $lte: toDate,
      },
    }),

    Supplier.countDocuments({
      createdAt: {
        $gte: fromDate,
        $lte: toDate,
      },
    }),

    Product.countDocuments({
      createdAt: {
        $gte: fromDate,
        $lte: toDate,
      },
    }),

    Payment.aggregate([
      {
        $match: {
          paymentDate: {
            $gte: fromDate,
            $lte: toDate,
          },
        },
      },
      {
        $group: {
          _id: null,
          totalPayments: { $sum: 1 },
          totalAmount: { $sum: "$amount" },
        },
      },
    ]),
  ]);

  /*
   * Payment statistics
   */
  const totalPayments = paymentStats[0]?.totalPayments || 0;
  const totalPaymentAmount = paymentStats[0]?.totalAmount || 0;

  /*
   * User roles
   */
  const usersByRole = await User.aggregate([
    {
      $group: {
        _id: "$role",
        count: { $sum: 1 },
      },
    },
    {
      $project: {
        _id: 0,
        role: "$_id",
        count: 1,
      },
    },
    {
      $sort: {
        count: -1,
      },
    },
  ]);

  /*
   * Business modes
   */
  const businessesByMode = await Business.aggregate([
    {
      $group: {
        _id: "$mode",
        count: { $sum: 1 },
      },
    },
    {
      $project: {
        _id: 0,
        mode: "$_id",
        count: 1,
      },
    },
  ]);

  /*
   * Business types
   */
  const businessesByType = await Business.aggregate([
    {
      $match: {
        businessType: {
          $exists: true,
          $ne: "",
        },
      },
    },
    {
      $group: {
        _id: "$businessType",
        count: { $sum: 1 },
      },
    },
    {
      $project: {
        _id: 0,
        businessType: "$_id",
        count: 1,
      },
    },
    {
      $sort: {
        count: -1,
      },
    },
  ]);

  /*
   * User growth
   */
  const userGrowth = await User.aggregate([
    {
      $match: {
        createdAt: {
          $gte: fromDate,
          $lte: toDate,
        },
      },
    },
    {
      $group: {
        _id: {
          $dateToString: {
            format: "%Y-%m-%d",
            date: "$createdAt",
          },
        },
        count: {
          $sum: 1,
        },
      },
    },
    {
      $project: {
        _id: 0,
        date: "$_id",
        count: 1,
      },
    },
    {
      $sort: {
        date: 1,
      },
    },
  ]);

  /*
   * Business growth
   */
  const businessGrowth = await Business.aggregate([
    {
      $match: {
        createdAt: {
          $gte: fromDate,
          $lte: toDate,
        },
      },
    },
    {
      $group: {
        _id: {
          $dateToString: {
            format: "%Y-%m-%d",
            date: "$createdAt",
          },
        },
        count: {
          $sum: 1,
        },
      },
    },
    {
      $project: {
        _id: 0,
        date: "$_id",
        count: 1,
      },
    },
    {
      $sort: {
        date: 1,
      },
    },
  ]);

  /*
   * Payment growth
   */
  const paymentGrowth = await Payment.aggregate([
    {
      $match: {
        paymentDate: {
          $gte: fromDate,
          $lte: toDate,
        },
      },
    },
    {
      $group: {
        _id: {
          $dateToString: {
            format: "%Y-%m-%d",
            date: "$paymentDate",
          },
        },
        count: {
          $sum: 1,
        },
        amount: {
          $sum: "$amount",
        },
      },
    },
    {
      $project: {
        _id: 0,
        date: "$_id",
        count: 1,
        amount: 1,
      },
    },
    {
      $sort: {
        date: 1,
      },
    },
  ]);

  /*
   * Overall totals
   */
  const [
    totalUsers,
    totalBusinesses,
    totalCustomers,
    totalSuppliers,
    totalProducts,
    totalPaymentsCount,
    totalPaymentsAmount,
  ] = await Promise.all([
    User.countDocuments(),
    Business.countDocuments(),
    Customer.countDocuments(),
    Supplier.countDocuments(),
    Product.countDocuments(),
    Payment.countDocuments(),

    Payment.aggregate([
      {
        $group: {
          _id: null,
          total: {
            $sum: "$amount",
          },
        },
      },
    ]),
  ]);

  return {
    period: {
      from: fromDate,
      to: toDate,
    },

    overview: {
      newUsers,
      newBusinesses,
      newCustomers,
      newSuppliers,
      newProducts,
      totalPayments,
      totalPaymentAmount,
    },

    totals: {
      users: totalUsers,
      businesses: totalBusinesses,
      customers: totalCustomers,
      suppliers: totalSuppliers,
      products: totalProducts,
      payments: totalPaymentsCount,
      paymentAmount: totalPaymentsAmount[0]?.total || 0,
    },

    users: {
      byRole: usersByRole,
      growth: userGrowth,
    },

    businesses: {
      byMode: businessesByMode,
      byType: businessesByType,
      growth: businessGrowth,
    },

    payments: {
      growth: paymentGrowth,
    },
  };
};

module.exports = {
  getAdminReports,
};
