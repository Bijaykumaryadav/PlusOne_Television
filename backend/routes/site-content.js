const express = require("express");
const passport = require("passport");
const SiteContent = require("../models/SiteContent");

const router = express.Router();
const contentKeys = ["about", "career"];

router.get("/:key", async (req, res) => {
  if (!contentKeys.includes(req.params.key)) {
    return res.status(404).json({ success: false, message: "Content not found" });
  }

  try {
    const record = await SiteContent.findOne({ key: req.params.key }).lean();
    return res.json({
      success: true,
      exists: Boolean(record),
      data: record?.content || null,
    });
  } catch (error) {
    console.error("Error fetching site content:", error);
    return res.status(500).json({ success: false, message: "Error fetching site content" });
  }
});

router.put(
  "/:key",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    if (req.user?.role !== "admin") {
      return res.status(403).json({ success: false, message: "Forbidden" });
    }
    if (!contentKeys.includes(req.params.key)) {
      return res.status(404).json({ success: false, message: "Content not found" });
    }
    if (!req.body || typeof req.body !== "object" || Array.isArray(req.body)) {
      return res.status(400).json({ success: false, message: "Content must be an object" });
    }

    try {
      const record = await SiteContent.findOneAndUpdate(
        { key: req.params.key },
        { $set: { content: req.body } },
        { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
      ).lean();
      return res.json({ success: true, data: record.content });
    } catch (error) {
      console.error("Error saving site content:", error);
      return res.status(500).json({ success: false, message: "Error saving site content" });
    }
  }
);

module.exports = router;