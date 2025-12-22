const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    employeeId: {
      type: String,
      required: true,
      unique: true,
    },

    designation: { type: String },

    phone: {
      type: String,
      required: true,
      match: [/^\d{10}$/, "Phone must be 10 digits"],
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ["SUPER_ADMIN", "ADMIN", "HR", "EMPLOYEE"],
      default: "EMPLOYEE",
    },

    refreshToken: { type: String },

    preboardingCompleted: {
      type: Boolean,
      default: false,
    },

  },
  { timestamps: true }

);

module.exports = mongoose.model("User", userSchema);
