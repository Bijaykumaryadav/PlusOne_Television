// src/services/khaltiService.js
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://72.60.223.137:8000/apis/v1/",
  headers: { "Content-Type": "application/json" },
});

/**
 * Initiate a Khalti payment
 * @param {{ type: "premium"|"advertiser"|"general", amount?: number, customer: { name, email, phone } }} payload
 * @returns {{ payment_url, pidx, order_id, payment_id }}
 */
export const initiateKhaltiPayment = async (payload) => {
  const { data } = await api.post("/payment/initiate", payload);
  return data;
};

/**
 * Verify a Khalti payment after redirect
 * @param {string} pidx
 * @returns {{ success, message, payment }}
 */
export const verifyKhaltiPayment = async (pidx) => {
  const { data } = await api.post("/payment/verify", { pidx });
  return data;
};

/**
 * Get a payment record by pidx (for receipt page)
 * @param {string} pidx
 */
export const getPaymentByPidx = async (pidx) => {
  const { data } = await api.get(`/payment/pidx/${pidx}`);
  return data;
};

/**
 * Get all payments (admin)
 * @param {{ page, limit, status, type }} params
 */
export const getAllPayments = async (params = {}) => {
  const { data } = await api.get("/payment/all", { params });
  return data;
};

/**
 * Get payment stats (admin dashboard)
 */
export const getPaymentStats = async () => {
  const { data } = await api.get("/payment/stats");
  return data;
};