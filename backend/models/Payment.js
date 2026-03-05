const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    pidx: {
      type: String,
      unique: true,
      sparse: true, // only set after initiation
    },
    purchase_order_id: {
      type: String,
      required: true,
      unique: true,
    },
    purchase_order_name: {
      type: String,
      required: true,
    },
    amount: {
      type: Number, // stored in NPR (not paisa)
      required: true,
    },
    type: {
      type: String,
      enum: ["premium", "advertiser", "general"],
      default: "general",
    },
    customer: {
      name: String,
      email: String,
      phone: String,
    },
    status: {
      type: String,
      enum: ["pending", "initiated", "completed", "failed", "refunded"],
      default: "pending",
    },
    transaction_id: {
      type: String,
      default: null,
    },
    fee: {
      type: Number,
      default: 0,
    },
    refunded: {
      type: Boolean,
      default: false,
    },
    payment_url: {
      type: String,
      default: null,
    },
    raw_response: {
      type: mongoose.Schema.Types.Mixed, // store full Khalti response
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Payment", paymentSchema);