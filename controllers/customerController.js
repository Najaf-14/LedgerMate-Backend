const { model } = require("mongoose");
const customerServices = require("../services/customerServices");

const createCustomer = async (req, res) => {
  try {
    const customer = await customerServices.createCustomer(req.body);

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
    const customer = await customerServices.getCustomers();

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
    const customer = await customerServices.getCustomer(req.params.id);

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

const updateCustomer = async (req, res) => {
  try {
    const customer = await updateCustomer(req.params.id, req.body);

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
    await customerServices.deleteCustomer(req.params.id);

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
  updateCustomer,
  deleteCustomer,
};
