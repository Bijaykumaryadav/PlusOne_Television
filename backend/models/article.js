const mongoose = require("mongoose");

const ArticleSchema = new mongoose.Schema(
  {
    image: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    summary: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
      enum: [
        "breaking",
        "politics",
        "business",
        "technology",
        "sports",
        "entertainment",
        "health",
        "world",
      ],
    },
    author: {
      type: String,
      required: true,
      trim: true,
    },
    tags: {
      type: String,
      default: "",
    },
    featured: {
      type: String,
      enum: ["yes", "no"],
      default: "no",
    },
    views: {
      type: Number,
      default: 0,
    },
    publishedDate: {
      type: Date,
      default: Date.now,
    },
    updatedDate: {
      type: Date,
    },
    status: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "published",
    },
    likes: [
      {
        userId: {
          type: String,
          required: true,
        },
        userEmail: {
          type: String,
        },
        likedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    likeCount: {
      type: Number,
      default: 0,
    },
    shareCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
ArticleSchema.index({ category: 1, publishedDate: -1 });
ArticleSchema.index({ featured: 1, publishedDate: -1 });
ArticleSchema.index({ title: "text", content: "text" });

module.exports = mongoose.model("Article", ArticleSchema);