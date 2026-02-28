const express = require('express');
const router = express.Router();
const {
  getAllArticles,
  getArticleById,
  searchArticles,
  getFeaturedArticles,
} = require('../controllers/admins/article-controller');

// Public article endpoints for frontend
router.get('/', getAllArticles);
router.get('/featured', getFeaturedArticles);
router.get('/search', searchArticles);
router.get('/:id', getArticleById);

module.exports = router;
