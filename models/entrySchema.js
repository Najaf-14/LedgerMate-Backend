const mongoose = require("mongoose");

const entrySchema = mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: [true, "An entry must be linked to a customer"],
    },
    entryType: {
      type: String,
      enum: ["Sale", "Purchase"],
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
    discount: {
      type: Number,
      default: 0,
      min: [0, "Discount cannot be negative"],
    },
    finalAmount: {
      type: Number,
      required: true,
    },
    paymentType: {
      type: String,
      required: [true, "Payment type is required"],
      trim: true, // e.g., 'Cash', 'Online', 'Credit'
    },
    notes: {
      type: String,
      maxLength: [200, "Notes cannot exceed 200 characters"],
      trim: true,
    },
    transactionDate: {
      type: Date,
      required: [true, "Transaction date is required"],
      default: Date.now,
    },
  },
  {
    timestamps: true,
  },
);

entrySchema.pre("save", function (next) {
  this.finalAmount = this.manualTotalPrice - this.discount;
  next();
});

const Entry = mongoose.model("Entry", entrySchema);

module.exports = Entry;
