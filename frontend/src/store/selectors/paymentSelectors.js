// src/store/selectors/paymentSelectors.js
// Use these in components with useSelector for clean, readable access

// ── Initiation ──
export const selectInitiating = (state) => state.payment.initiating;
export const selectInitiateError = (state) => state.payment.initiateError;
export const selectPaymentUrl = (state) => state.payment.paymentUrl;
export const selectPidx = (state) => state.payment.pidx;
export const selectOrderId = (state) => state.payment.orderId;

// ── Verification ──
export const selectVerifying = (state) => state.payment.verifying;
export const selectVerifyError = (state) => state.payment.verifyError;
export const selectVerifySuccess = (state) => state.payment.verifySuccess;
export const selectVerifiedPayment = (state) => state.payment.verifiedPayment;

// ── Current payment (by pidx) ──
export const selectCurrentPayment = (state) => state.payment.currentPayment;
export const selectCurrentLoading = (state) => state.payment.currentLoading;
export const selectCurrentError = (state) => state.payment.currentError;

// ── Admin: payments list ──
export const selectPayments = (state) => state.payment.payments;
export const selectPaymentsTotal = (state) => state.payment.total;
export const selectPaymentsTotalPages = (state) => state.payment.totalPages;
export const selectPaymentsPage = (state) => state.payment.page;
export const selectListLoading = (state) => state.payment.listLoading;
export const selectListError = (state) => state.payment.listError;

// ── Admin: stats ──
export const selectStats = (state) => state.payment.stats;
export const selectStatsByType = (state) => state.payment.byType;
export const selectStatsLoading = (state) => state.payment.statsLoading;
export const selectStatsError = (state) => state.payment.statsError;