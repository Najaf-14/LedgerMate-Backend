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
  page = Math.max(Number(page) || 1, 1);
  limit = Math.max(Number(limit) || 10, 1);

  const skip = (page - 1) * limit;

  const match = {};

  // Payment type
  if (type === "customer") {
    match.customer = { $exists: true, $ne: null };
  }

  if (type === "supplier") {
    match.supplier = { $exists: true, $ne: null };
  }

  // Date filter
  if (fromDate || toDate) {
    match.paymentDate = {};

    if (fromDate) {
      match.paymentDate.$gte = new Date(`${fromDate}T00:00:00.000Z`);
    }

    if (toDate) {
      match.paymentDate.$lte = new Date(`${toDate}T23:59:59.999Z`);
    }
  }

  const pipeline = [
    {
      $match: match,
    },

    // Business
    {
      $lookup: {
        from: "businesses",
        localField: "business",
        foreignField: "_id",
        as: "business",
      },
    },

    {
      $unwind: {
        path: "$business",
        preserveNullAndEmptyArrays: true,
      },
    },

    // Customer
    {
      $lookup: {
        from: "customers",
        localField: "customer",
        foreignField: "_id",
        as: "customer",
      },
    },

    {
      $unwind: {
        path: "$customer",
        preserveNullAndEmptyArrays: true,
      },
    },

    // Supplier
    {
      $lookup: {
        from: "suppliers",
        localField: "supplier",
        foreignField: "_id",
        as: "supplier",
      },
    },

    {
      $unwind: {
        path: "$supplier",
        preserveNullAndEmptyArrays: true,
      },
    },
  ];

  if (search.trim()) {
    const searchRegex = new RegExp(search.trim(), "i");

    pipeline.push({
      $match: {
        $or: [
          { "business.businessName": searchRegex },
          { "customer.name": searchRegex },
          { "customer.phoneNo": searchRegex },
          { "supplier.name": searchRegex },
          { "supplier.phoneNo": searchRegex },
        ],
      },
    });
  }

  pipeline.push({
    $facet: {
      payments: [
        {
          $sort: {
            paymentDate: -1,
            _id: -1,
          },
        },

        {
          $skip: skip,
        },

        {
          $limit: limit,
        },

        {
          $project: {
            amount: 1,
            note: 1,
            paymentDate: 1,
            createdAt: 1,
            updatedAt: 1,

            business: {
              _id: "$business._id",
              businessName: "$business.businessName",
              ownerName: "$business.ownerName",
            },

            customer: {
              _id: "$customer._id",
              name: "$customer.name",
              phoneNo: "$customer.phoneNo",
            },

            supplier: {
              _id: "$supplier._id",
              name: "$supplier.name",
              phoneNo: "$supplier.phoneNo",
            },
          },
        },
      ],

      totalCount: [
        {
          $count: "count",
        },
      ],
    },
  });

  const [result] = await Payment.aggregate(pipeline);

  const total = result.totalCount[0]?.count || 0;

  const totalPages = Math.ceil(total / limit);

  return {
    payments: result.payments,

    pagination: {
      total,
      page,
      limit,
      totalPages,
      hasNextPage: page < totalPages,
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
