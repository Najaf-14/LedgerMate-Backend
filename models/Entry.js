const mongoose = require("mongoose");

const entrySchema = mongoose.Schema(
  {
    business: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Business",
      required: [true, "Business is required"],
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
    },
    supplier: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Supplier",
    },
    entryType: {
      type: String,
      enum: ["sale", "purchase"],
      required: [true, "Entry type must be either Sale or Purchase"],
    },
    itemsDescription: {
      type: String,
      required: [true, "Items/Products description is required"],
      trim: true,
    },
    manualTotalPrice: {
      type: Number,
      required: [true, "Total price must be entered manually"],
      min: [0, "Price cannot be negative"],
    },
    transactionDate: {
      type: Date,
      required: [true, "Transaction date is required"],
      default: Date.now,
    },
    notes: {
      type: String,
      maxLength: [200, "Notes cannot exceed 200 characters"],
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

entrySchema.pre("validate", function () {
  if (this.entryType === "sale" && !this.customer) {
    throw new Error("Customer is required for sale entries.");
  }

  if (this.entryType === "purchase" && !this.supplier) {
    throw new Error("Supplier is required for purchase entries.");
  }
});

const Entry = mongoose.model("Entry", entrySchema);

module.exports = Entry;
