const express = require("express");
const app = express();
const dbConnection = require("./config/db");
const passport = require("passport");
const session = require("express-session");
require("./middleware/passport-google-strategy");
require("./middleware/passport-jwt-strategy");
const cors = require("cors");
const Article = require("./models/article");
const path = require("path");
// index.js – relevant excerpt
let port;
if (process.env.NODE_ENV === 'development') {
  port = 8000;      // always use 8000 locally
} else {
  port = process.env.PORT || 8000;
}

const escapeHtml = (value = "") => String(value)
  .replace(/&/g, "&amp;")
  .replace(/</g, "&lt;")
  .replace(/>/g, "&gt;")
  .replace(/\"/g, "&quot;")
  .replace(/'/g, "&#039;");

const isCrawlerRequest = (req) => {
  const userAgent = (req.get("user-agent") || "").toLowerCase();
  return /(facebookexternalhit|twitterbot|linkedinbot|whatsapp|telegram|slackbot|googlebot|bingbot|duckduckbot|baiduspider|yandex|facebot|embedly|crawler|spider)/i.test(userAgent);
};

const buildSocialMetaPage = (article) => {
  const title = article.title || "Sidha Reporting";
  const description = article.summary || "Read the latest update from Sidha Reporting.";
  const image = article.image
    ? (/^https?:\/\//i.test(article.image) ? article.image : `https://sidhareporting.com${article.image.startsWith("/") ? article.image : `/${article.image}`}`)
    : "https://sidhareporting.com/logofinal.png";
    const slug = article.slugEn || article.slug || encodeURIComponent(title);
    const url = `https://sidhareporting.com/articles/${encodeURIComponent(slug)}`;
    const publishedDate = article.publishedDate ? new Date(article.publishedDate).toISOString() : "";
    const tags = Array.isArray(article.tags)
      ? article.tags
      : String(article.tags || "").split(",").map((tag) => tag.trim()).filter(Boolean);
    const keywords = [...new Set([
      title,
      article.routeTitleEn,
      article.routeTitleNe,
      article.category,
      ...tags,
      "Nepal news",
      "breaking news Nepal",
    ].filter(Boolean))].join(", ");

  return `<!doctype html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>${escapeHtml(title)} | Sidha Reporting</title>
      <meta name="description" content="${escapeHtml(description)}" />
        <meta name="keywords" content="${escapeHtml(keywords)}" />
        <meta name="news_keywords" content="${escapeHtml(keywords)}" />
      <meta name="robots" content="index, follow" />
      <meta property="og:title" content="${escapeHtml(title)}" />
      <meta property="og:description" content="${escapeHtml(description)}" />
      <meta property="og:type" content="article" />
      <meta property="og:url" content="${escapeHtml(url)}" />
      <meta property="og:image" content="${escapeHtml(image)}" />
      <meta property="og:image:secure_url" content="${escapeHtml(image)}" />
      <meta property="og:image:alt" content="${escapeHtml(title)}" />
      <meta property="og:site_name" content="Sidha Reporting" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="${escapeHtml(title)}" />
      <meta name="twitter:description" content="${escapeHtml(description)}" />
      <meta name="twitter:image" content="${escapeHtml(image)}" />
      <meta name="twitter:image:alt" content="${escapeHtml(title)}" />
      <link rel="canonical" href="${escapeHtml(url)}" />
    </head>
    <body></body>
  </html>`;
};


app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      process.env.FRONTEND_URL || "http://localhost:5173",
      "https://sidhareporting.com",
      "https://www.sidhareporting.com",
      "http://localhost:5173",
      "http://localhost:3000", 
      // For development only
      "http://72.60.223.137:5173",
      "http://72.60.223.137:3000"
    ];
    
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE"],
  optionsSuccessStatus: 200,
  exposedHeaders: ["Content-Disposition", "Content-Type"],
  allowedHeaders: ["Authorization", "Content-Type"],
  credentials: true,
};

app.use(cors(corsOptions));

// ✅ Add express-session BEFORE passport middleware
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === "production", // true only in production (HTTPS)
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// ✅ Passport middleware AFTER session
app.use(passport.initialize());
app.use(passport.session());

dbConnection(); 

app.get("/articles/:slug", async (req, res) => {
  try {
    if (!isCrawlerRequest(req)) {
      return res.status(404).send("Not found");
    }

    const slug = decodeURIComponent(req.params.slug || "");
    const article = await Article.findOne({
      $or: [
          { slug: slug },
          { slugEn: slug },
          { routeTitleNe: slug },
          { routeTitleEn: slug },
          { title: slug },
      ],
      status: "published",
    }).lean();

      if (!article) {
        const articles = await Article.find({ status: "published" })
          .select("_id title routeTitleNe routeTitleEn slug slugEn")
          .lean();
        const normalizedSlug = slug.toLowerCase();
        const matched = articles.find((candidate) => [
          candidate.slug,
          candidate.slugEn,
          candidate.routeTitleNe,
          candidate.routeTitleEn,
          candidate.title,
        ].some((value) => String(value || "").trim().toLowerCase() === normalizedSlug));

        if (matched) {
          const fullArticle = await Article.findById(matched._id).lean();
          return res.type("html").send(buildSocialMetaPage(fullArticle));
        }
      }

    if (!article) {
      return res.status(404).send("Article not found");
    }

    res.type("html");
    res.send(buildSocialMetaPage(article));
  } catch (error) {
    console.error("Social metadata route error:", error);
    res.status(500).send("Error generating social metadata");
  }
});

app.use("/apis/v1", require("./routes"));

app.listen(port, "0.0.0.0", () => {
  console.log(`Server is running on port ${port}`);
});