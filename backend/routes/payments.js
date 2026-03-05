const express = require("express");
const router = express.Router();
const {
  initiatePayment,
  verifyPayment,
  getAllPayments,
  getPaymentById,
  getPaymentByPidx,
  getPaymentStats,
} = require("../controllers/users/Paymentcontroller");

// Public routes
router.post("/initiate", initiatePayment);
router.post("/verify", verifyPayment);

// Admin routes (add your auth middleware here if needed)
// router.use(authMiddleware, adminMiddleware);
router.get("/stats", getPaymentStats);
router.get("/all", getAllPayments);
router.get("/pidx/:pidx", getPaymentByPidx);
router.get("/:id", getPaymentById);

module.exports = router;