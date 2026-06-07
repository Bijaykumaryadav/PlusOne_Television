/**
 * Structured Data (JSON-LD) Generator for SEO
 * Use this utility to generate schema markup for articles and pages
 */

/**
 * Generate Article Schema
 * @param {Object} article - Article data
 * @returns {Object} JSON-LD schema object
 */
export const generateArticleSchema = (article) => {
  return {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    "headline": article.title,
    "description": article.summary,
    "image": article.image,
    "datePublished": article.publishedDate,
    "dateModified": article.updatedDate || article.publishedDate,
    "author": {
      "@type": "Person",
      "name": article.author,
    },
    "publisher": {
      "@type": "Organization",
      "name": "Sidha Reporting",
      "logo": {
        "@type": "ImageObject",
        "url": "https://sdhareporting.com/logofinal.png",
      },
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://sdhareporting.com/articles/${article._id}`,
    },
    "articleSection": article.category,
    "keywords": article.tags || "",
    "articleBody": article.content,
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
    "url": "https://sdhareporting.com",
    "logo": "https://sdhareporting.com/logofinal.png",
    "description": "Breaking News, Politics, Business, Sports, Technology, Entertainment - Sidha Reporting delivers latest news updates.",
    "sameAs": [
      "https://facebook.com/sidha-reporting",
      "https://twitter.com/sidha_reporting",
      "https://instagram.com/sidha_reporting",
    ],
    "contact": {
      "@type": "ContactPoint",
      "contactType": "Customer Support",
      "email": "support@sdhareporting.com",
    },
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
    "url": "https://sdhareporting.com",
    "description": "Latest news, breaking news, and updates on politics, business, sports, technology, and entertainment.",
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": "https://sdhareporting.com/articles?q={search_term_string}",
      },
      "query-input": "required name=search_term_string",
    },
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
export const setupArticleSEO = (article) => {
  // Generate and insert schema
  const schema = generateArticleSchema(article);
  insertSchemaScript(schema, "article-schema");

  // Update meta tags
  const metadata = {
    title: `${article.title} | Sidha Reporting`,
    description: article.summary.substring(0, 160),
    keywords: article.tags || "news, reporting",
    ogTitle: article.title,
    ogDescription: article.summary,
    ogImage: article.image,
    twitterTitle: article.title,
    twitterDescription: article.summary,
    twitterImage: article.image,
    canonical: `https://sdhareporting.com/articles/${article._id}`,
  };

  updateMetaTags(metadata);

  // Generate breadcrumb schema
  const breadcrumbs = [
    { label: "Home", url: "https://sdhareporting.com" },
    { label: "Articles", url: "https://sdhareporting.com/articles" },
    { label: article.category, url: `https://sdhareporting.com/articles?category=${article.category}` },
    { label: article.title, url: `https://sdhareporting.com/articles/${article._id}` },
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
    title: "Sidha Reporting - Latest News, Breaking News & Updates",
    description: "Breaking News, Politics, Business, Sports, Technology, Entertainment. Get latest news updates from Sidha Reporting.",
    keywords: "news, breaking news, politics, sports, business, technology, entertainment, health, world news",
    ogTitle: "Sidha Reporting - Latest News",
    ogDescription: "Breaking News and latest updates on politics, business, sports, technology and more",
    ogImage: "https://sdhareporting.com/logofinal.png",
    canonical: "https://sdhareporting.com",
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

  const metadata = {
    title: `${label} | Sidha Reporting`,
    description: `Latest ${label} from Sidha Reporting. Stay updated with breaking news and analysis.`,
    keywords: `${category}, news, ${category} news, breaking news`,
    ogTitle: label,
    ogDescription: `Latest ${label} updates`,
    canonical: `https://sdhareporting.com/articles?category=${category}`,
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
  setupArticleSEO,
  setupHomepageSEO,
  setupCategorySEO,
};
