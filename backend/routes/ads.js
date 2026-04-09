const express = require('express');
const router = express.Router();
const multer = require('multer');
const {
  getAllAds,
  getAdsByPosition,
  createAd,
  updateAd,
  deleteAd,
  recordAdClick,
  recordAdView,
  uploadImage,
} = require('../controllers/admins/ad-controller');

// Memory storage for multer
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Public routes
router.get('/', getAllAds);
router.get('/position/:position', getAdsByPosition);
router.put('/:id/click', recordAdClick);
router.put('/:id/view', recordAdView);

// Admin routes (will add auth middleware later)
router.post('/', createAd);
router.put('/:id', updateAd);
router.delete('/:id', deleteAd);
router.post('/upload', upload.single('image'), uploadImage);

module.exports = router;
