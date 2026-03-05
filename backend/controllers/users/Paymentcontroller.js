const axios = require("axios");
const Payment = require("../../models/Payment");

// ─── Helpers ────────────────────────────────────────────────────────────────

const KHALTI_BASE_URL = process.env.KHALTI_BASE_URL || "https://a.khalti.com/api/v2";
// For sandbox/testing use: https://dev.khalti.com/api/v2

const khaltiHeaders = {
  Authorization: `Key ${process.env.KHALTI_SECRET_KEY}`,
  "Content-Type": "application/json",
};

const generateOrderId = () =>
  `ORDER-${Date.now()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;

// ─── INITIATE PAYMENT ────────────────────────────────────────────────────────
// POST /api/payment/initiate
// Body: { type, amount?, customer: { name, email, phone } }
// `amount` is optional for premium/advertiser (hardcoded prices), required for general

const PLAN_PRICES = {
  premium: 99,      // NPR 99/month
  advertiser: 999,  // NPR 999/package
};

exports.initiatePayment = async (req, res) => {
  try {
    const { type = "general", amount, customer = {} } = req.body;

    // Resolve amount
    let resolvedAmount =
      type === "premium"
        ? PLAN_PRICES.premium
        : type === "advertiser"
        ? PLAN_PRICES.advertiser
        : parseFloat(amount);

    if (!resolvedAmount || isNaN(resolvedAmount) || resolvedAmount <= 0) {
      return res.status(400).json({ error: "Invalid or missing amount." });
    }

    const purchase_order_id = generateOrderId();
    const purchase_order_name =
      type === "premium"
        ? "Premium Subscription"
        : type === "advertiser"
        ? "Advertisement Package"
        : "General Payment";

    // Build Khalti payload (amount in paisa)
    const khaltiPayload = {
      return_url: `${process.env.FRONTEND_URL}/payment/verify`,
      website_url: process.env.FRONTEND_URL,
      amount: Math.round(resolvedAmount * 100), // NPR → paisa
      purchase_order_id,
      purchase_order_name,
      customer_info: {
        name: customer.name || "Customer",
        email: customer.email || "",
        phone: customer.phone || "",
      },
    };

    // Call Khalti
    const { data: khaltiData } = await axios.post(
      `${KHALTI_BASE_URL}/epayment/initiate/`,
      khaltiPayload,
      { headers: khaltiHeaders }
    );

    // Save to DB
    const payment = await Payment.create({
      pidx: khaltiData.pidx,
      purchase_order_id,
      purchase_order_name,
      amount: resolvedAmount,
      type,
      customer,
      status: "initiated",
      payment_url: khaltiData.payment_url,
      raw_response: khaltiData,
    });

    return res.status(200).json({
      success: true,
      payment_url: khaltiData.payment_url,
      pidx: khaltiData.pidx,
      order_id: purchase_order_id,
      payment_id: payment._id,
    });
  } catch (error) {
    const err = error.response?.data || error.message;
    console.error("Khalti initiate error:", err);
    return res.status(500).json({ error: err });
  }
};

// ─── VERIFY PAYMENT ──────────────────────────────────────────────────────────
// POST /api/payment/verify
// Body: { pidx }

exports.verifyPayment = async (req, res) => {
  try {
    const { pidx } = req.body;

    if (!pidx) {
      return res.status(400).json({ error: "pidx is required." });
    }

    // Lookup on Khalti
    const { data: khaltiData } = await axios.post(
      `${KHALTI_BASE_URL}/epayment/lookup/`,
      { pidx },
      { headers: khaltiHeaders }
    );

    // Find & update our DB record
    const payment = await Payment.findOneAndUpdate(
      { pidx },
      {
        status: khaltiData.status === "Completed" ? "completed" : "failed",
        transaction_id: khaltiData.transaction_id || null,
        fee: khaltiData.fee_amount ? khaltiData.fee_amount / 100 : 0,
        raw_response: khaltiData,
      },
      { new: true }
    );

    if (!payment) {
      return res.status(404).json({ error: "Payment record not found." });
    }

    if (khaltiData.status === "Completed") {
      return res.status(200).json({
        success: true,
        message: "Payment verified successfully.",
        payment: {
          _id: payment._id,
          transaction_id: payment.transaction_id,
          amount: payment.amount,
          purchase_order_id: payment.purchase_order_id,
          purchase_order_name: payment.purchase_order_name,
          type: payment.type,
          status: payment.status,
          customer: payment.customer,
          createdAt: payment.createdAt,
        },
      });
    } else {
      return res.status(400).json({
        success: false,
        message: `Payment not completed. Khalti status: ${khaltiData.status}`,
        status: khaltiData.status,
      });
    }
  } catch (error) {
    const err = error.response?.data || error.message;
    console.error("Khalti verify error:", err);
    return res.status(500).json({ error: err });
  }
};

// ─── GET ALL PAYMENTS (admin) ────────────────────────────────────────────────
// GET /api/payment/all?page=1&limit=10&status=completed&type=premium

exports.getAllPayments = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, type } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (type) filter.type = type;

    const payments = await Payment.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .select("-raw_response"); // don't expose raw Khalti data

    const total = await Payment.countDocuments(filter);

    return res.status(200).json({
      success: true,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / limit),
      payments,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// ─── GET SINGLE PAYMENT ──────────────────────────────────────────────────────
// GET /api/payment/:id

exports.getPaymentById = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id).select("-raw_response");
    if (!payment) return res.status(404).json({ error: "Payment not found." });
    return res.status(200).json({ success: true, payment });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// ─── GET PAYMENT BY PIDX ─────────────────────────────────────────────────────
// GET /api/payment/pidx/:pidx

exports.getPaymentByPidx = async (req, res) => {
  try {
    const payment = await Payment.findOne({ pidx: req.params.pidx }).select(
      "-raw_response"
    );
    if (!payment) return res.status(404).json({ error: "Payment not found." });
    return res.status(200).json({ success: true, payment });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// ─── GET PAYMENT STATS (admin dashboard) ─────────────────────────────────────
// GET /api/payment/stats

exports.getPaymentStats = async (req, res) => {
  try {
    const [stats] = await Payment.aggregate([
      {
        $group: {
          _id: null,
          total_revenue: { $sum: { $cond: [{ $eq: ["$status", "completed"] }, "$amount", 0] } },
          total_payments: { $sum: 1 },
          completed: { $sum: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] } },
          failed: { $sum: { $cond: [{ $eq: ["$status", "failed"] }, 1, 0] } },
          pending: { $sum: { $cond: [{ $eq: ["$status", "initiated"] }, 1, 0] } },
        },
      },
    ]);

    const byType = await Payment.aggregate([
      { $match: { status: "completed" } },
      { $group: { _id: "$type", revenue: { $sum: "$amount" }, count: { $sum: 1 } } },
    ]);

    return res.status(200).json({
      success: true,
      stats: stats || { total_revenue: 0, total_payments: 0, completed: 0, failed: 0, pending: 0 },
      by_type: byType,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};