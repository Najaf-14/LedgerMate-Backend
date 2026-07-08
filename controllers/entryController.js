const entryServices = require("../services/entryServices");

const createEntry = async (req, res) => {
  try {
    const {
      name,
      entryType,
      itemsDescription,
      manualTotalPrice,
      transactionDate,
      paymentType,
    } = req.body;

    if (!name?.trim()) {
      throw new Error("Customer name is required");
    }

    if (!entryType?.trim()) {
      throw new Error("Entry type is required");
    }

    if (!itemsDescription?.trim()) {
      throw new Error("Items description is required");
    }

    if (manualTotalPrice === undefined || manualTotalPrice === null) {
      throw new Error("Total price is required");
    }

    if (!transactionDate) {
      throw new Error("Transaction date is required");
    }

    const entry = await entryServices.createEntry(req.body, req.user.id);

    res.status(201).json({
      success: true,
      message: "Entry created successfully",
      entry,
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message,
    });
  }
};

const getEntries = async (req, res) => {
  try {
    const entries = await entryServices.getEntries(req.user.id);

    res.status(200).json({
      success: true,
      message: "All entries",
      entries,
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message,
    });
  }
};

const getEntry = async (req, res) => {
  try {
    const entry = await entryServices.getEntry(req.params.id, req.user.id);

    res.status(200).json({
      success: true,
      entry,
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateEntry = async (req, res) => {
  try {
    if (Object.keys(req.body).length === 0) {
      throw new Error("No data provided for update");
    }

    const entry = await entryServices.updateEntry(
      req.params.id,
      req.body,
      req.user.id,
    );

    res.status(200).json({
      success: true,
      message: "Entry updated successfully",
      entry,
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message,
    });
  }
};

const deleteEntry = async (req, res) => {
  try {
    await entryServices.deleteEntry(req.params.id, req.user.id);

    res.status(200).json({
      success: true,
      message: "Entry deleted successfully",
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createEntry,
  getEntries,
  getEntry,
  updateEntry,
  deleteEntry,
};
