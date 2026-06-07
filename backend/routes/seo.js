const express = require('express');
const Article = require('../models/article');

const router = express.Router();

/**
 * @route GET /sitemap.xml
 * @desc Generate XML sitemap for SEO
 * @access Public
 */
router.get('/sitemap.xml', async (req, res) => {
  try {
    res.header('Content-Type', 'application/xml');

    const baseUrl = process.env.FRONTEND_URL || 'https://sdhareporting.com';

    // Get all published articles
    const articles = await Article.find({
      status: 'published'
    })
      .select('_id publishedDate updatedDate')
      .sort({ publishedDate: -1 })
      .lean();

    // Build XML
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0">\n';

    // Static pages
    const staticPages = [
      { url: '/', freq: 'daily', priority: '1.0' },
      { url: '/articles', freq: 'hourly', priority: '0.9' },
      { url: '/articles?category=breaking', freq: 'hourly', priority: '0.8' },
      { url: '/articles?category=politics', freq: 'daily', priority: '0.8' },
      { url: '/articles?category=business', freq: 'daily', priority: '0.8' },
      { url: '/articles?category=sports', freq: 'daily', priority: '0.8' },
      { url: '/articles?category=technology', freq: 'daily', priority: '0.8' },
      { url: '/articles?category=entertainment', freq: 'daily', priority: '0.8' },
      { url: '/articles?category=health', freq: 'daily', priority: '0.8' },
      { url: '/articles?category=world', freq: 'daily', priority: '0.8' },
      { url: '/payment', freq: 'weekly', priority: '0.7' },
    ];

    staticPages.forEach(page => {
      const lastMod = new Date().toISOString().split('T')[0];
      xml += '  <url>\n';
      xml += `    <loc>${baseUrl}${page.url}</loc>\n`;
      xml += `    <lastmod>${lastMod}</lastmod>\n`;
      xml += `    <changefreq>${page.freq}</changefreq>\n`;
      xml += `    <priority>${page.priority}</priority>\n`;
      xml += '    <mobile:mobile/>\n';
      xml += '  </url>\n';
    });

    // Add article URLs
    articles.forEach(article => {
      const lastMod = (article.updatedDate || article.publishedDate)
        .toISOString()
        .split('T')[0];
      xml += '  <url>\n';
      xml += `    <loc>${baseUrl}/articles/${article._id}</loc>\n`;
      xml += `    <lastmod>${lastMod}</lastmod>\n`;
      xml += '    <changefreq>weekly</changefreq>\n';
      xml += '    <priority>0.7</priority>\n';
      xml += '    <mobile:mobile/>\n';
      xml += '  </url>\n';
    });

    xml += '</urlset>';

    res.send(xml);
  } catch (error) {
    console.error('Error generating sitemap:', error);
    res.status(500).json({
      success: false,
      message: 'Error generating sitemap',
      error: error.message,
    });
  }
});

module.exports = router;
