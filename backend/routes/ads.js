const express = require('express');
const router = express.Router();
const multer = require('multer');
const passport = require('passport');
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

// Protected Admin routes
router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  createAd
);

router.put(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  updateAd
);

router.delete(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  deleteAd
);

router.post(
  '/upload',
  passport.authenticate('jwt', { session: false }),
  upload.single('image'),
  uploadImage
);

module.exports = router;
