const { model } = require("mongoose");
const customerServices = require("../services/customerServices");

const createCustomer = async (req, res) => {  
  try {
    const customer = await customerServices.createCustomer(req.body, req.user.id);

    res.status(201).json({
      success: true,
      message: "Customer created successfully",
      customer,
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message,
    });
  }
};

const getCustomers = async (req, res) => {
  try {
    const customer = await customerServices.getCustomers(req.user.id);

    res.status(200).json({
      success: true,
      message: "Customer details",
      customer,
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message,
    });
  }
};

const getCustomer = async (req, res) => {
  try {
    const customer = await customerServices.getCustomer(req.params.id, req.user.id);

    res.status(200).json({
      success: true,
      message: "All customers",
      customer,
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message,
    });
  }
};

const searchCustomers = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({
        success: false,
        message: "Search query is required",
      });
    }

    const customers = await customerServices.searchCustomers(query, req.user.id);

    res.status(200).json({
      success: true,
      count: customers.length,
      customers,
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateCustomer = async (req, res) => {
  try {
    const customer = await customerServices.updateCustomer(req.params.id, req.body, req.user.id);

    res.status(200).json({
      success: true,
      message: "Customer updated successfully",
      customer,
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: true,
      message: error.message,
    });
  }
};

const deleteCustomer = async (req, res) => {
  try {
    await customerServices.deleteCustomer(req.params.id, req.user.id);

    res.status(200).json({
      success: true,
      message: "Customer deleted successfully",
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createCustomer,
  getCustomers,
  getCustomer,
  searchCustomers,
  updateCustomer,
  deleteCustomer,
};
