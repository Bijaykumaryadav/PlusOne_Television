const express = require("express");
const router = express.Router();
const Contact = require("../models/Contact");
const passport = require("passport");

// Create new contact submission (public)
router.post("/", async (req, res) => {
  try {
    const { name, email, phone, subject, message, adType, budget } = req.body;

    // Validate required fields
    if (!name || !email || !phone || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      });
    }

    // Create new contact
    const contact = new Contact({
      name,
      email,
      phone,
      subject,
      message,
      adType: adType || undefined,
      budget: budget || undefined,
    });

    await contact.save();

    res.status(201).json({
      success: true,
      message: "Contact form submitted successfully",
      data: contact,
    });
  } catch (error) {
    console.error("Error creating contact:", error);
    res.status(500).json({
      success: false,
      message: "Error submitting contact form",
      error: error.message,
    });
  }
});

// Get all contacts (admin only)
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const { status, subject, page = 1, limit = 10 } = req.query;
      const skip = (page - 1) * limit;

      // Build filter
      const filter = {};
      if (status) filter.status = status;
      if (subject) filter.subject = subject;

      const contacts = await Contact.find(filter)
        .sort({ submittedAt: -1 })
        .skip(skip)
        .limit(parseInt(limit));

      const total = await Contact.countDocuments(filter);

      res.json({
        success: true,
        data: contacts,
        total,
        pages: Math.ceil(total / limit),
        currentPage: page,
      });
    } catch (error) {
      console.error("Error fetching contacts:", error);
      res.status(500).json({
        success: false,
        message: "Error fetching contacts",
        error: error.message,
      });
    }
  }
);

// Get single contact (admin only)
router.get(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const contact = await Contact.findById(req.params.id);

      if (!contact) {
        return res.status(404).json({
          success: false,
          message: "Contact not found",
        });
      }

      res.json({
        success: true,
        data: contact,
      });
    } catch (error) {
      console.error("Error fetching contact:", error);
      res.status(500).json({
        success: false,
        message: "Error fetching contact",
        error: error.message,
      });
    }
  }
);

// Update contact status (admin only)
router.put(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const { status, adminNotes } = req.body;
      const contact = await Contact.findByIdAndUpdate(
        req.params.id,
        {
          status,
          adminNotes,
          updatedAt: Date.now(),
        },
        { new: true }
      );

      if (!contact) {
        return res.status(404).json({
          success: false,
          message: "Contact not found",
        });
      }

      res.json({
        success: true,
        message: "Contact updated successfully",
        data: contact,
      });
    } catch (error) {
      console.error("Error updating contact:", error);
      res.status(500).json({
        success: false,
        message: "Error updating contact",
        error: error.message,
      });
    }
  }
);

// Delete contact (admin only)
router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const contact = await Contact.findByIdAndDelete(req.params.id);

      if (!contact) {
        return res.status(404).json({
          success: false,
          message: "Contact not found",
        });
      }

      res.json({
        success: true,
        message: "Contact deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting contact:", error);
      res.status(500).json({
        success: false,
        message: "Error deleting contact",
        error: error.message,
      });
    }
  }
);

// Get contact statistics (admin only)
router.get(
  "/stats/overview",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const stats = await Contact.aggregate([
        {
          $group: {
            _id: "$status",
            count: { $sum: 1 },
          },
        },
      ]);

      const subjectStats = await Contact.aggregate([
        {
          $group: {
            _id: "$subject",
            count: { $sum: 1 },
          },
        },
      ]);

      res.json({
        success: true,
        data: {
          byStatus: stats,
          bySubject: subjectStats,
          total: await Contact.countDocuments(),
        },
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
      res.status(500).json({
        success: false,
        message: "Error fetching statistics",
        error: error.message,
      });
    }
  }
);

module.exports = router;
