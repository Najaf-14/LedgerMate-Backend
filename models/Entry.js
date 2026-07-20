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
    },
    itemsDescription: {
      type: String,
      trim: true,
    },
    manualTotalPrice: {
      type: Number,
      min: [0, "Price cannot be negative"],
    },
    products: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        name: {
          type: String,
          required: true,
        },
        price: {
          type: Number,
          required: true,
          min: 0,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
        total: {
          type: Number,
          required: true,
          min: 0,
        },
      },
    ],
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
