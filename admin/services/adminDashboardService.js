const User = require("../../models/User");
const Business = require("../../models/Business");
const Customer = require("../../models/Customer");
const Supplier = require("../../models/Supplier");
const Product = require("../../models/Product");
const Payment = require("../../models/Payment");

const getDashboardStats = async () => {
  const [
    totalUsers,
    totalBusinesses,
    totalCustomers,
    totalSuppliers,
    totalProducts,
    totalPayments,
  ] = await Promise.all([
    User.countDocuments({}),
    Business.countDocuments({}),
    Customer.countDocuments({}),
    Supplier.countDocuments({}),
    Product.countDocuments({}),
    Payment.countDocuments({}),
  ]);

  return {
    totalUsers,
    totalBusinesses,
    totalCustomers,
    totalSuppliers,
    totalProducts,
    totalPayments,
  };
};

module.exports = {
  getDashboardStats,
};
