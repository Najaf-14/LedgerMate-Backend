const supplierServices = require("../services/supplierService");

const createSupplier = async (req, res) => {
  try {
    const { name, phoneNo, email, address } = req.body;

    if (!name?.trim()) {
      throw new Error("Supplier name is required");
    }

    if (!phoneNo?.trim()) {
      throw new Error("Phone number is required");
    }

    if (email && !email.trim()) {
      throw new Error("Email cannot be empty");
    }
    const supplier = await supplierServices.createSupplier(
      req.body,
      req.user.id,
    );

    res.status(201).json({
      success: true,
      message: "Supplier created successfully",
      supplier,
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message,
    });
  }
};

const getSuppliers = async (req, res) => {
  try {
    const supplier = await supplierServices.getSuppliers(req.user.id);

    res.status(200).json({
      success: true,
      message: "All Suppliers",
      supplier,
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message,
    });
  }
};

const getSupplier = async (req, res) => {
  try {
    const supplier = await supplierServices.getSupplier(
      req.params.id,
      req.user.id,
    );

    res.status(200).json({
      success: true,
      message: "Supplier Details",
      supplier,
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message,
    });
  }
};

const searchSuppliers = async (req, res) => {
  try {
    const { name } = req.query;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Name is required",
      });
    }

    const suppliers = await supplierServices.searchSuppliers(name, req.user.id);

    res.status(200).json({
      success: true,
      count: suppliers.length,
      suppliers,
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateSupplier = async (req, res) => {
  try {
    const { name, phoneNo, email, address } = req.body;

    if (!name?.trim()) {
      throw new Error("Supplier name is required");
    }

    if (!phoneNo?.trim()) {
      throw new Error("Phone number is required");
    }

    if (email && !email.trim()) {
      throw new Error("Email cannot be empty");
    }

    const supplier = await supplierServices.updateSupplier(
      req.params.id,
      req.body,
      req.user.id,
    );

    res.status(200).json({
      success: true,
      message: "Supplier updated successfully",
      supplier,
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: true,
      message: error.message,
    });
  }
};

const deleteSupplier = async (req, res) => {
  try {
    await supplierServices.deleteSupplier(req.params.id, req.user.id);

    res.status(200).json({
      success: true,
      message: "Suppleier deleted successfully",
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createSupplier,
  getSuppliers,
  getSupplier,
  searchSuppliers,
  updateSupplier,
  deleteSupplier,
};
