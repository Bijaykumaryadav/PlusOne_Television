const mongoose = require("mongoose");

const AdSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    imageUrl: {
      type: String,
      default: "",
    },
    linkUrl: {
      type: String,
      required: true,
    },
    bannerText: {
      type: String,
      trim: true,
    },
    position: {
      type: String,
      enum: ["top", "header", "sidebar", "bottom", "text", "ticker", "marquee"],
      default: "sidebar",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    views: {
      type: Number,
      default: 0,
    },
    clicks: {
      type: Number,
      default: 0,
    },
    startDate: {
      type: Date,
      default: Date.now,
    },
    endDate: {
      type: Date,
    },
    priority: {
      type: Number,
      default: 1, // Lower number = higher priority
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Ad", AdSchema);
