const express = require("express");
const articlesRoute = require("./articles/articles-route");

const router = express.Router();

router.use("/articles",articlesRoute);

module.exports = router