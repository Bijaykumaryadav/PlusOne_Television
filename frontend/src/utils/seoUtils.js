/**
 * Structured Data (JSON-LD) Generator for SEO
 * Use this utility to generate schema markup for articles and pages
 */

export const makeSeoSlug = (title = "") => {
  if (!title) return "";

  return String(title)
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\p{L}\p{N}\s-]/gu, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
};

export const makeEnglishSeoSlug = (title = "") => {
  if (!title) return "";

  return String(title)
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\p{L}\p{N}\s-]/gu, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
};

export const getArticleSeoKeywords = (article = {}) => {
  const title = String(article.title || "").trim();
  const routeTitle = String(
    article.routeTitleEn ||
    article.routeTitleNe ||
    article.slugEn ||
    article.slug ||
    title || ""
  ).trim();
  const category = String(article.category || "News").trim();
  const rawTags = Array.isArray(article.tags)
    ? article.tags
    : String(article.tags || "")
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean);

  const keywordPool = [
    title,
    routeTitle,
    `${category} news`,
    `${category} Nepal`,
    `${category} latest news`,
    "Nepal news",
    "breaking news Nepal",
    "latest Nepal news",
    "Kathmandu news",
    "Nepal politics news",
    "Nepal business news",
    "Nepal sports news",
    "world news Nepal",
    ...rawTags,
  ];

  return [...new Set(
    keywordPool
      .map((value) => String(value || "").replace(/\s+/g, " ").trim())
      .filter(Boolean)
      .filter((value) => value.length > 2)
  )].slice(0, 18);
};

export const buildArticleUrl = (article) => {
  if (!article) return "/articles";

  if (typeof article === "string") {
    const rawValue = article.trim();
    if (!rawValue) return "/articles/article";
    return `/articles/${encodeURIComponent(rawValue)}`;
  }

  const routeSource =
    article.routeTitleEn ||
    article.routeTitleNe ||
    article.slugEn ||
    article.slug ||
    article.title ||
    "";

  const preferredSlug =
    makeEnglishSeoSlug(routeSource) ||
    makeSeoSlug(routeSource) ||
    String(routeSource).trim();

  if (!preferredSlug) return `/articles/${article._id || "article"}`;

  return `/articles/${encodeURIComponent(preferredSlug)}`;
};

/**
 * Generate Article Schema
 * @param {Object} article - Article data
 * @returns {Object} JSON-LD schema object
 */
export const generateArticleSchema = (article) => {
  const articleUrl = `https://sidhareporting.com${buildArticleUrl(article)}`;
  const sourceTags = Array.isArray(article.tags)
    ? article.tags
    : String(article.tags || "").split(",").map((tag) => tag.trim()).filter(Boolean);
  const seoKeywords = getArticleSeoKeywords(article);

  return {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    "headline": article.title,
    "description": article.summary || article.title,
    "image": article.image || "https://sidhareporting.com/logofinal.png",
    "datePublished": article.publishedDate || new Date().toISOString(),
    "dateModified": article.updatedDate || article.publishedDate || new Date().toISOString(),
    "author": {
      "@type": "Person",
      "name": article.author || "Sidha Reporting",
    },
    "publisher": {
      "@type": "Organization",
      "name": "Sidha Reporting",
      "logo": {
        "@type": "ImageObject",
        "url": "https://sidhareporting.com/logofinal.png",
      },
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": articleUrl,
    },
    "articleSection": article.category || "News",
    "keywords": [...new Set([...sourceTags, ...seoKeywords])].join(", "),
    "articleBody": article.content || article.summary || article.title,
    "inLanguage": "en",
    "isPartOf": {
      "@type": "WebSite",
      "name": "Sidha Reporting",
      "url": "https://sidhareporting.com",
    },
    "url": articleUrl,
    "wordCount": article.content ? article.content.split(/\s+/).length : undefined,
  };
};

/**
 * Generate Organization Schema
 * @returns {Object} JSON-LD schema object
 */
export const generateOrganizationSchema = () => {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Sidha Reporting",
    "url": "https://sidhareporting.com",
    "logo": "https://sidhareporting.com/logofinal.png",
    "description": "Nepal news, breaking news, politics, business, sports, technology and world updates from Sidha Reporting.",
    "sameAs": [
      "https://facebook.com/sidha-reporting",
      "https://twitter.com/sidha_reporting",
      "https://instagram.com/sidha_reporting",
    ],
    "contact": {
      "@type": "ContactPoint",
      "contactType": "Customer Support",
      "email": "support@sidhareporting.com",
    },
    "areaServed": "Nepal",
    "knowsAbout": [
      "Nepal news",
      "breaking news Nepal",
      "Nepal politics",
      "Nepal business news",
      "Nepal sports news",
      "technology news Nepal",
      "world news Nepal"
    ]
  };
};

/**
 * Generate WebSite Schema (for homepage)
 * @returns {Object} JSON-LD schema object
 */
export const generateWebsiteSchema = () => {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Sidha Reporting",
    "url": "https://sidhareporting.com",
    "description": "Latest Nepal news, breaking stories, politics, business, sports, technology and world updates from Sidha Reporting.",
    "inLanguage": ["en", "ne"],
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": "https://sidhareporting.com/articles?q={search_term_string}",
      },
      "query-input": "required name=search_term_string",
    },
    "publisher": {
      "@type": "Organization",
      "name": "Sidha Reporting",
      "logo": "https://sidhareporting.com/logofinal.png"
    }
  };
};

/**
 * Generate Breadcrumb Schema
 * @param {Array} breadcrumbs - Array of breadcrumb items
 * @returns {Object} JSON-LD schema object
 */
export const generateBreadcrumbSchema = (breadcrumbs) => {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbs.map((crumb, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": crumb.label,
      "item": crumb.url,
    })),
  };
};

/**
 * Insert JSON-LD script into document head
 * @param {Object} schema - JSON-LD schema object
 * @param {string} id - Optional ID for the script tag
 */
export const insertSchemaScript = (schema, id = "schema-script") => {
  // Remove existing schema script if it exists
  const existing = document.getElementById(id);
  if (existing) {
    existing.remove();
  }

  // Create and insert new schema script
  const script = document.createElement("script");
  script.type = "application/ld+json";
  script.id = id;
  script.innerHTML = JSON.stringify(schema);
  document.head.appendChild(script);
};

/**
 * Update Document Meta Tags
 * @param {Object} metadata - Object containing meta information
 */
export const updateMetaTags = (metadata) => {
  // Update title
  if (metadata.title) {
    document.title = metadata.title;
  }

  // Update or create meta tags
  const updateMetaTag = (name, content) => {
    let tag = document.querySelector(`meta[name="${name}"]`) ||
              document.querySelector(`meta[property="${name}"]`);
    
    if (!tag) {
      tag = document.createElement("meta");
      tag.setAttribute(name.includes("og:") ? "property" : "name", name);
      document.head.appendChild(tag);
    }
    tag.setAttribute("content", content);
  };

  if (metadata.description) {
    updateMetaTag("description", metadata.description);
  }

  if (metadata.keywords) {
    updateMetaTag("keywords", metadata.keywords);
  }

  if (metadata.ogTitle) {
    updateMetaTag("og:title", metadata.ogTitle);
  }

  if (metadata.ogDescription) {
    updateMetaTag("og:description", metadata.ogDescription);
  }

  if (metadata.ogImage) {
    updateMetaTag("og:image", metadata.ogImage);
  }

  if (metadata.twitterTitle) {
    updateMetaTag("twitter:title", metadata.twitterTitle);
  }

  if (metadata.twitterDescription) {
    updateMetaTag("twitter:description", metadata.twitterDescription);
  }

  if (metadata.twitterImage) {
    updateMetaTag("twitter:image", metadata.twitterImage);
  }

  // Update canonical URL
  if (metadata.canonical) {
    let canonical = document.querySelector("link[rel='canonical']");
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }
    canonical.href = metadata.canonical;
  }
};

/**
 * Setup SEO for Article Page
 * Call this in useEffect on article detail page
 */
export const setPageSEO = ({
  title,
  description,
  keywords,
  canonical,
  ogTitle,
  ogDescription,
  ogImage = "https://sidhareporting.com/logofinal.png",
}) => {
  const metadata = {
    title,
    description,
    keywords,
    ogTitle: ogTitle || title,
    ogDescription: ogDescription || description,
    ogImage,
    twitterTitle: ogTitle || title,
    twitterDescription: ogDescription || description,
    twitterImage: ogImage,
    canonical: canonical || "https://sidhareporting.com",
  };

  updateMetaTags(metadata);
};

export const setupArticleSEO = (article) => {
  if (!article) return;

  const schema = generateArticleSchema(article);
  insertSchemaScript(schema, "article-schema");

  const title = String(article.title || "").trim();
  const routeTitle = String(
    article.routeTitleEn ||
    article.routeTitleNe ||
    article.slugEn ||
    article.slug ||
    title || ""
  ).trim();
  const category = String(article.category || "News").trim();
  const seoKeywords = getArticleSeoKeywords(article);
  const primaryKeyword = routeTitle || title || `${category} news`;
  const description = (article.summary || article.title || "Latest Nepal news and updates")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 165);

  const seoTitle = `${title} | ${primaryKeyword} | Sidha Reporting`;
  const canonicalUrl = `https://sidhareporting.com${buildArticleUrl(article)}`;

  const metadata = {
    title: seoTitle,
    description,
    keywords: seoKeywords.join(", "),
    news_keywords: seoKeywords.join(", "),
    ogTitle: title,
    ogDescription: description,
    ogImage: article.image || "https://sidhareporting.com/logofinal.png",
    twitterTitle: title,
    twitterDescription: description,
    twitterImage: article.image || "https://sidhareporting.com/logofinal.png",
    canonical: canonicalUrl,
  };

  updateMetaTags(metadata);

  const breadcrumbs = [
    { label: "Home", url: "https://sidhareporting.com" },
    { label: "Articles", url: "https://sidhareporting.com/articles" },
    { label: category, url: `https://sidhareporting.com/articles?category=${encodeURIComponent(category)}` },
    { label: title, url: canonicalUrl },
  ];

  const breadcrumbSchema = generateBreadcrumbSchema(breadcrumbs);
  insertSchemaScript(breadcrumbSchema, "breadcrumb-schema");
};

/**
 * Setup SEO for Homepage
 */
export const setupHomepageSEO = () => {
  // Organization schema
  const orgSchema = generateOrganizationSchema();
  insertSchemaScript(orgSchema, "org-schema");

  // Website schema
  const websiteSchema = generateWebsiteSchema();
  insertSchemaScript(websiteSchema, "website-schema");

  // Update meta tags
  const metadata = {
    title: "Sidha Reporting | Nepal News Today, Breaking News & Updates",
    description: "Latest Nepal news, breaking stories, politics news, business news, sports updates, technology and world coverage from Sidha Reporting.",
    keywords: "Nepal news, breaking news Nepal, latest Nepal news, Nepali news, Kathmandu news, Nepal politics news, Nepal business news, Nepal sports news, world news Nepal, Sidha Reporting",
    ogTitle: "Sidha Reporting | Nepal News Today",
    ogDescription: "Breaking news and the latest updates from Nepal on politics, business, sports, technology and world affairs.",
    ogImage: "https://sidhareporting.com/logofinal.png",
    canonical: "https://sidhareporting.com",
  };

  updateMetaTags(metadata);
};

/**
 * Setup SEO for Category Pages
 */
export const setupCategorySEO = (category) => {
  const categoryLabels = {
    breaking: "Breaking News",
    politics: "Politics News",
    business: "Business News",
    sports: "Sports News",
    technology: "Technology News",
    entertainment: "Entertainment News",
    health: "Health News",
    world: "World News",
  };

  const label = categoryLabels[category] || category;
  const keywordTarget = category === "breaking"
    ? "Nepal breaking news"
    : category === "politics"
    ? "Nepal politics news"
    : category === "business"
    ? "Nepal business news"
    : category === "sports"
    ? "Nepal sports news"
    : category === "technology"
    ? "Nepal technology news"
    : category === "health"
    ? "Nepal health news"
    : category === "world"
    ? "Nepal world news"
    : "Nepal news";

  const metadata = {
    title: `${label} | Latest Nepal News | Sidha Reporting`,
    description: `Get the latest ${label.toLowerCase()} from Nepal with in-depth reporting, breaking updates and analysis from Sidha Reporting.`,
    keywords: `${keywordTarget}, ${label}, Nepal news, latest Nepal news, breaking news Nepal, Sidha Reporting`,
    ogTitle: `${label} | Latest Nepal News`,
    ogDescription: `Latest ${label.toLowerCase()} updates from Nepal and around the world.`,
    canonical: `https://sidhareporting.com/articles?category=${category}`,
  };

  updateMetaTags(metadata);
};

export default {
  generateArticleSchema,
  generateOrganizationSchema,
  generateWebsiteSchema,
  generateBreadcrumbSchema,
  insertSchemaScript,
  updateMetaTags,
  setPageSEO,
  setupArticleSEO,
  setupHomepageSEO,
  setupCategorySEO,
};
