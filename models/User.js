const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: 3,
      maxlength: 50,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
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
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6,
      maxlength: 100,
    },
    confirmPassword: {
      type: String,
      required: [true, "Confirm password is required"],
    },
  },
  {
    timestamps: true,
  },
);
