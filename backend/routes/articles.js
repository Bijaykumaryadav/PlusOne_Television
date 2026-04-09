const express = require('express');
const router = express.Router();
const {
  getAllArticles,
  getArticleById,
  searchArticles,
  getFeaturedArticles,
  likeArticle,
  unlikeArticle,
  trackShare,
} = require('../controllers/admins/article-controller');

// Public article endpoints for frontend
router.get('/', getAllArticles);
router.get('/featured', getFeaturedArticles);
router.get('/search', searchArticles);
router.get('/:id', getArticleById);
router.post('/:id/like', likeArticle);
router.delete('/:id/like', unlikeArticle);
router.post('/:id/share', trackShare);

module.exports = router;
