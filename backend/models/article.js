const mongoose = require("mongoose");

const createSeoSlug = (title = "") => {
  if (!title) return "article";

  return String(title)
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\p{L}\p{N}\s-]/gu, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "") || "article";
};

const createEnglishSeoSlug = (title = "") => {
  if (!title) return "article";

  return String(title)
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\p{L}\p{N}\s-]/gu, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "") || "article";
};

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
    routeTitleNe: {
      type: String,
      trim: true,
      default: "",
    },
    routeTitleEn: {
      type: String,
      trim: true,
      default: "",
    },
    slug: {
      type: String,
      unique: true,
      sparse: true,
      lowercase: true,
      trim: true,
    },
    slugEn: {
      type: String,
      unique: true,
      sparse: true,
      lowercase: true,
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

ArticleSchema.pre("validate", async function () {
  const nepaliRouteTitle = (this.routeTitleNe || this.title || "").trim();
  const englishRouteTitle = (this.routeTitleEn || "").trim();

  if (this.isModified("title") || this.isModified("routeTitleNe") || !this.slug) {
    this.slug = createSeoSlug(nepaliRouteTitle || this.title || "");
  }

  if (this.isModified("title") || this.isModified("routeTitleEn") || !this.slugEn) {
    this.slugEn = englishRouteTitle ? createEnglishSeoSlug(englishRouteTitle) : (this.slug || createSeoSlug(this.title || ""));
  }
});

// Index for faster queries
ArticleSchema.index({ category: 1, publishedDate: -1 });
ArticleSchema.index({ featured: 1, publishedDate: -1 });
ArticleSchema.index({ title: "text", content: "text" });

module.exports = mongoose.model("Article", ArticleSchema);