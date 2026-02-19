const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema(
  {
    user: { type: mongoose.ObjectId, ref: "User" },
    otp: { type: Number },
    createdAt: { type: Date, default: Date.now, expires: 300 }, // Expire after 5 minutes (300 seconds)
  },
  { timestamps: true }
);

const Otp = mongoose.model("Otp", otpSchema);

module.exports = Otp;