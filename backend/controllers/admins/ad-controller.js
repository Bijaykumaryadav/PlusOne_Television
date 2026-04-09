const Ad = require("../../models/Ad");
const cloudinary = require("../../config/cloudinary");
const streamifier = require('streamifier');

// @desc    Get all active ads
// @route   GET /api/ads
// @access  Public
const getAllAds = async (req, res) => {
  try {
    const ads = await Ad.find({
      isActive: true,
      endDate: { $gte: new Date() }
    }).sort({ priority: 1, createdAt: -1 });

    res.status(200).json({
      success: true,
      data: ads,
    });
  } catch (error) {
    console.error("Error fetching ads:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching ads",
      error: error.message,
    });
  }
};

// @desc    Get ads by position
// @route   GET /api/ads/position/:position
// @access  Public
const getAdsByPosition = async (req, res) => {
  try {
    const { position } = req.params;
    const ads = await Ad.find({
      isActive: true,
      position,
      endDate: { $gte: new Date() }
    }).sort({ priority: 1 });

    res.status(200).json({
      success: true,
      data: ads,
    });
  } catch (error) {
    console.error("Error fetching ads by position:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching ads",
      error: error.message,
    });
  }
};

// @desc    Create new ad
// @route   POST /api/ads
// @access  Private/Admin
const createAd = async (req, res) => {
  try {
    const {
      title,
      description,
      imageUrl,
      linkUrl,
      bannerText,
      position,
      isActive,
      endDate,
      priority,
    } = req.body;

    // Validation
    if (!title || !imageUrl || !linkUrl) {
      return res.status(400).json({
        success: false,
        message: "Please provide required fields: title, imageUrl, linkUrl",
      });
    }

    const ad = await Ad.create({
      title,
      description,
      imageUrl,
      linkUrl,
      bannerText,
      position: position || "sidebar",
      isActive: isActive !== false,
      endDate,
      priority: priority || 1,
    });

    res.status(201).json({
      success: true,
      message: "Ad created successfully",
      data: ad,
    });
  } catch (error) {
    console.error("Error creating ad:", error);
    res.status(500).json({
      success: false,
      message: "Error creating ad",
      error: error.message,
    });
  }
};

// @desc    Update ad
// @route   PUT /api/ads/:id
// @access  Private/Admin
const updateAd = async (req, res) => {
  try {
    const ad = await Ad.findById(req.params.id);

    if (!ad) {
      return res.status(404).json({
        success: false,
        message: "Ad not found",
      });
    }

    // Update fields
    ad.title = req.body.title || ad.title;
    ad.description = req.body.description || ad.description;
    ad.imageUrl = req.body.imageUrl || ad.imageUrl;
    ad.linkUrl = req.body.linkUrl || ad.linkUrl;
    ad.bannerText = req.body.bannerText || ad.bannerText;
    ad.position = req.body.position || ad.position;
    ad.isActive = req.body.isActive !== undefined ? req.body.isActive : ad.isActive;
    ad.endDate = req.body.endDate || ad.endDate;
    ad.priority = req.body.priority !== undefined ? req.body.priority : ad.priority;

    await ad.save();

    res.status(200).json({
      success: true,
      message: "Ad updated successfully",
      data: ad,
    });
  } catch (error) {
    console.error("Error updating ad:", error);
    res.status(500).json({
      success: false,
      message: "Error updating ad",
      error: error.message,
    });
  }
};

// @desc    Delete ad
// @route   DELETE /api/ads/:id
// @access  Private/Admin
const deleteAd = async (req, res) => {
  try {
    const ad = await Ad.findById(req.params.id);

    if (!ad) {
      return res.status(404).json({
        success: false,
        message: "Ad not found",
      });
    }

    await ad.deleteOne();

    res.status(200).json({
      success: true,
      message: "Ad deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting ad:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting ad",
      error: error.message,
    });
  }
};

// @desc    Record ad click
// @route   PUT /api/ads/:id/click
// @access  Public
const recordAdClick = async (req, res) => {
  try {
    const ad = await Ad.findByIdAndUpdate(
      req.params.id,
      { $inc: { clicks: 1, views: 1 } },
      { new: true }
    );

    if (!ad) {
      return res.status(404).json({
        success: false,
        message: "Ad not found",
      });
    }

    res.status(200).json({
      success: true,
      data: ad,
    });
  } catch (error) {
    console.error("Error recording ad click:", error);
    res.status(500).json({
      success: false,
      message: "Error recording click",
      error: error.message,
    });
  }
};

// @desc    Record ad view
// @route   PUT /api/ads/:id/view
// @access  Public
const recordAdView = async (req, res) => {
  try {
    const ad = await Ad.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true }
    );

    if (!ad) {
      return res.status(404).json({
        success: false,
        message: "Ad not found",
      });
    }

    res.status(200).json({
      success: true,
      data: ad,
    });
  } catch (error) {
    console.error("Error recording ad view:", error);
    res.status(500).json({
      success: false,
      message: "Error recording view",
      error: error.message,
    });
  }
};

// Upload image via Cloudinary (multer memory storage)
const uploadImage = (req, res) => {
  if (!req.file) return res.status(400).json({ success: false, message: 'No file provided' });

  const uploadStream = cloudinary.uploader.upload_stream(
    { folder: 'ads' },
    (error, result) => {
      if (error) return res.status(500).json({ success: false, message: 'Upload failed', error });
      return res.status(200).json({ success: true, url: result.secure_url });
    }
  );

  streamifier.createReadStream(req.file.buffer).pipe(uploadStream);
};

module.exports = {
  getAllAds,
  getAdsByPosition,
  createAd,
  updateAd,
  deleteAd,
  recordAdClick,
  recordAdView,
  uploadImage,
};
