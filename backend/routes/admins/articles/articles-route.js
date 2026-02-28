
const express = require("express");
const router = express.Router();
const {
  getAllArticles,
  getArticleById,
  createArticle,
  updateArticle,
  deleteArticle,
  searchArticles,
  getFeaturedArticles,
  uploadImage,
} = require("../../../controllers/admins/article-controller");

// Middleware for authentication (implement based on your auth system)
// const { protect, admin } = require("../middleware/authMiddleware");

// Public routes
router.get("/", getAllArticles);
router.get("/featured", getFeaturedArticles);
router.get("/search", searchArticles);
router.get("/:id", getArticleById);

// Protected routes (Admin only)
// Add your authentication middleware here
router.post("/", createArticle); // Add: protect, admin
router.put("/:id", updateArticle); // Add: protect, admin
router.delete("/:id", deleteArticle); // Add: protect, admin

// Image upload endpoint
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage });
const passport = require('passport');

router.post('/upload', passport.authenticate('jwt', { session: false }), upload.single('image'), uploadImage);

module.exports = router;