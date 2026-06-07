const express = require("express");
const articlesRoute = require("./articles/articles-route");
const adsRoute = require("./ads/ads-route");

const router = express.Router();

router.use("/articles", articlesRoute);
router.use("/ads", adsRoute);

module.exports = router