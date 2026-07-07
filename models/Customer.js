const mongoose = require("mongoose");

const customerSchema = mongoose.Schema(
  {
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
      unique: true,
      trim: true,
      match: [/^03\d{9}$/, "Phone number must be in format 03XXXXXXXXX"],
    },
    address: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

const Customer = mongoose.model("Customer", customerSchema);

module.exports = Customer;
