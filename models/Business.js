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
      required: true,
      trim: true,
    },

    ownerName: {
      type: String,
      required: true,
      trim: true,
    },

    phoneNumber: {
      type: String,
      required: true,
    },

    address: {
      type: String,
    },

    businessType: {
      type: String,
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
