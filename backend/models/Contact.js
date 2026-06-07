const mongoose = require("mongoose");

const ContactSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    subject: {
      type: String,
      required: true,
      enum: ["ad-inquiry", "partnership", "other"],
      default: "ad-inquiry",
    },
    message: {
      type: String,
      required: true,
    },
    adType: {
      type: String,
      enum: ["sidebar", "header", "footer", "popup", "other"],
    },
    budget: {
      type: String,
      enum: ["low", "medium", "high", "flexible"],
    },
    status: {
      type: String,
      enum: ["new", "contacted", "in-progress", "completed", "rejected"],
      default: "new",
    },
    adminNotes: {
      type: String,
      default: "",
    },
    submittedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
ContactSchema.index({ email: 1 });
ContactSchema.index({ status: 1 });
ContactSchema.index({ createdAt: -1 });
ContactSchema.index({ subject: 1 });

module.exports = mongoose.model("Contact", ContactSchema);
