const mongoose = require("mongoose");

const siteContentSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      enum: ["about", "career"],
      required: true,
      unique: true,
    },
    content: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("SiteContent", siteContentSchema);