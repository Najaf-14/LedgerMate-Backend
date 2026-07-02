const mongoose = require("mongoose");

const businessSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    businessName: {
      type: String,
      required: [true, "Business name is required"],
      trim: true,
    },
    ownerName: {
      type: String,
      required: [true, "Owner name is required"],
      trim: true,
    },
    phoneNo: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
      minlength: 10,
      maxlength: 15,
    },
    address: {
      type: String,
      trim: true,
    },
    businessType: {
      type: String,
      trim: true,
    },
    mode: {
      type: String,
      enum: ["simple", "advanced"],
      default: "simple",
    },
    currency: {
      type: String,
      default: "PKR",
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Business", businessSchema);
