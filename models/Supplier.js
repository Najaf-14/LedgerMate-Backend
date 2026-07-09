const mongoose = require("mongoose");

const supplierSchema = mongoose.Schema(
  {
    business: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Business",
      required: [true, "Business is required"],
    },
    name: {
      type: String,
      required: [true, "Customer is required"],
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/,
        "Please enter a valid email address",
      ],
    },
    phoneNo: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
      match: [/^03\d{9}$/, "Phone number must be in format 03XXXXXXXXX"],
    },
    address: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true },
);

supplierSchema.index({ business: 1, phoneNo: 1 }, { unique: true });

const Supplier = mongoose.model("Supplier", supplierSchema);

module.exports = Supplier;
