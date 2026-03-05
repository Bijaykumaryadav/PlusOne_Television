// src/store/slices/paymentSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  initiateKhaltiPayment,
  verifyKhaltiPayment,
  getPaymentByPidx,
  getAllPayments,
  getPaymentStats,
} from "../../services/khaltiService";

// ─── Async Thunks ─────────────────────────────────────────────────────────────

export const initiatePayment = createAsyncThunk(
  "payment/initiate",
  async ({ type, amount, customer }, { rejectWithValue }) => {
    try {
      const data = await initiateKhaltiPayment({ type, amount, customer });
      return data;
    } catch (err) {
      const msg = err.response?.data?.error || err.message || "Payment initiation failed.";
      return rejectWithValue(typeof msg === "object" ? JSON.stringify(msg) : msg);
    }
  }
);

export const verifyPayment = createAsyncThunk(
  "payment/verify",
  async (pidx, { rejectWithValue }) => {
    try {
      const data = await verifyKhaltiPayment(pidx);
      return data;
    } catch (err) {
      const msg = err.response?.data?.error || err.message || "Payment verification failed.";
      return rejectWithValue(typeof msg === "object" ? JSON.stringify(msg) : msg);
    }
  }
);

export const fetchPaymentByPidx = createAsyncThunk(
  "payment/fetchByPidx",
  async (pidx, { rejectWithValue }) => {
    try {
      const data = await getPaymentByPidx(pidx);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || err.message);
    }
  }
);

export const fetchAllPayments = createAsyncThunk(
  "payment/fetchAll",
  async (params = {}, { rejectWithValue }) => {
    try {
      const data = await getAllPayments(params);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || err.message);
    }
  }
);

export const fetchPaymentStats = createAsyncThunk(
  "payment/fetchStats",
  async (_, { rejectWithValue }) => {
    try {
      const data = await getPaymentStats();
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || err.message);
    }
  }
);

// ─── Slice ────────────────────────────────────────────────────────────────────

const initialState = {
  // Initiation
  initiating: false,
  initiateError: null,
  paymentUrl: null,
  pidx: null,
  orderId: null,

  // Verification
  verifying: false,
  verifyError: null,
  verifiedPayment: null,   // full payment object after verify
  verifySuccess: false,

  // Current payment record (by pidx lookup)
  currentPayment: null,
  currentLoading: false,
  currentError: null,

  // Admin: all payments list
  payments: [],
  total: 0,
  totalPages: 0,
  page: 1,
  listLoading: false,
  listError: null,

  // Admin: stats
  stats: null,
  byType: [],
  statsLoading: false,
  statsError: null,
};

const paymentSlice = createSlice({
  name: "payment",
  initialState,
  reducers: {
    resetInitiate(state) {
      state.initiating = false;
      state.initiateError = null;
      state.paymentUrl = null;
      state.pidx = null;
      state.orderId = null;
    },
    resetVerify(state) {
      state.verifying = false;
      state.verifyError = null;
      state.verifiedPayment = null;
      state.verifySuccess = false;
    },
    clearErrors(state) {
      state.initiateError = null;
      state.verifyError = null;
      state.currentError = null;
      state.listError = null;
      state.statsError = null;
    },
  },
  extraReducers: (builder) => {
    // ── Initiate ──
    builder
      .addCase(initiatePayment.pending, (state) => {
        state.initiating = true;
        state.initiateError = null;
        state.paymentUrl = null;
      })
      .addCase(initiatePayment.fulfilled, (state, action) => {
        state.initiating = false;
        state.paymentUrl = action.payload.payment_url;
        state.pidx = action.payload.pidx;
        state.orderId = action.payload.order_id;
      })
      .addCase(initiatePayment.rejected, (state, action) => {
        state.initiating = false;
        state.initiateError = action.payload;
      });

    // ── Verify ──
    builder
      .addCase(verifyPayment.pending, (state) => {
        state.verifying = true;
        state.verifyError = null;
        state.verifySuccess = false;
      })
      .addCase(verifyPayment.fulfilled, (state, action) => {
        state.verifying = false;
        state.verifySuccess = action.payload.success;
        state.verifiedPayment = action.payload.payment || null;
      })
      .addCase(verifyPayment.rejected, (state, action) => {
        state.verifying = false;
        state.verifyError = action.payload;
        state.verifySuccess = false;
      });

    // ── Fetch by pidx ──
    builder
      .addCase(fetchPaymentByPidx.pending, (state) => {
        state.currentLoading = true;
        state.currentError = null;
      })
      .addCase(fetchPaymentByPidx.fulfilled, (state, action) => {
        state.currentLoading = false;
        state.currentPayment = action.payload.payment;
      })
      .addCase(fetchPaymentByPidx.rejected, (state, action) => {
        state.currentLoading = false;
        state.currentError = action.payload;
      });

    // ── Fetch all ──
    builder
      .addCase(fetchAllPayments.pending, (state) => {
        state.listLoading = true;
        state.listError = null;
      })
      .addCase(fetchAllPayments.fulfilled, (state, action) => {
        state.listLoading = false;
        state.payments = action.payload.payments;
        state.total = action.payload.total;
        state.totalPages = action.payload.totalPages;
        state.page = action.payload.page;
      })
      .addCase(fetchAllPayments.rejected, (state, action) => {
        state.listLoading = false;
        state.listError = action.payload;
      });

    // ── Stats ──
    builder
      .addCase(fetchPaymentStats.pending, (state) => {
        state.statsLoading = true;
        state.statsError = null;
      })
      .addCase(fetchPaymentStats.fulfilled, (state, action) => {
        state.statsLoading = false;
        state.stats = action.payload.stats;
        state.byType = action.payload.by_type;
      })
      .addCase(fetchPaymentStats.rejected, (state, action) => {
        state.statsLoading = false;
        state.statsError = action.payload;
      });
  },
});



export const { resetInitiate, resetVerify, clearErrors } = paymentSlice.actions;
export default paymentSlice.reducer;