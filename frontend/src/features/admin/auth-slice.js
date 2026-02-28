import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { publicClient } from "../../services/axiosInstance";
import privateClient from "../../services/axiosInstance";

// ─── Async Thunks ─────────────────────────────────────────────────────────────

export const registerUser = createAsyncThunk(
  "users/signup",
  async ({ userName, email, password }, { rejectWithValue }) => {
    try {
      // Backend expects `name` (not userName) and does not return an access token on signup.
      const { data } = await publicClient.post("/users/signup", {
        name: userName,
        email,
        password,
      });

      // Return the raw response data (message / email). Registration does not authenticate the user.
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const loginUser = createAsyncThunk(
  "users/signin",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const { data } = await publicClient.post("/users/signin", {
        email,
        password,
      });

      // Backend returns { token } on successful signin. Use the token to fetch user details
      const token = data.token;

      // Attach token for this immediate call and fetch user details
      privateClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      const meResp = await privateClient.get("/users/auth");

      // Persist token so user remains logged in across page reloads
      try {
        localStorage.setItem("accessToken", token);
      } catch (err) {
        // ignore storage errors
      }

      return {
        user: meResp.data.user || null,
        accessToken: token,
      };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const logoutUser = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      // Server clears the httpOnly refresh token cookie
      await publicClient.post("/auth/logout");
      try {
        localStorage.removeItem("accessToken");
      } catch (e) {}
    } catch (error) {
      // Clear local state regardless of server response
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Called on app mount to silently restore session using the httpOnly refresh token cookie
export const restoreSession = createAsyncThunk(
  "auth/restoreSession",
  async (_, { rejectWithValue, dispatch }) => {
    try {
      // First, try to restore from localStorage access token (fast path)
      const persisted = (() => {
        try {
          return localStorage.getItem("accessToken");
        } catch (e) {
          return null;
        }
      })();

      if (persisted) {
        // Optimistically load token into the store so the UI remains logged in on refresh.
        dispatch({ type: "auth/setAccessToken", payload: persisted });
        // Also set header for verification call
        privateClient.defaults.headers.common["Authorization"] = `Bearer ${persisted}`;

        // Verify token by fetching user details. If this fails, clear token and reject.
        try {
          const { data } = await privateClient.get("/users/auth");
          return { user: data.user, accessToken: persisted };
        } catch (err) {
          // token invalid/expired => clear persisted token and fail
          try { localStorage.removeItem("accessToken"); } catch (e) {}
          dispatch({ type: "auth/logout" });
          return rejectWithValue("No active session");
        }
      }

      // Fallback: attempt refresh via httpOnly cookie (if backend supports it)
      const { data } = await publicClient.post("/auth/refresh").catch(() => null);
      if (data && data.accessToken) {
        return {
          user: data.user,
          accessToken: data.accessToken,
        };
      }

      return rejectWithValue("No active session");
    } catch (error) {
      // No valid refresh token cookie — user is simply not logged in
      return rejectWithValue("No active session");
    }
  }
);

export const getMe = createAsyncThunk(
  "auth/getMe",
  async (_, { rejectWithValue }) => {
    try {
      // Backend exposes the protected user details at GET /apis/v1/users/auth
      const { data } = await privateClient.get("/users/auth");
      return data.user;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// ─── Slice ────────────────────────────────────────────────────────────────────

const initialState = {
  user: null,
  accessToken: null,   // lives ONLY in memory — never persisted
  isAuthenticated: false,
  isLoading: false,
  isSessionRestoring: true, // true on mount until restoreSession settles
  admins: [],
  error: null,
};

// Verify signup OTP
export const verifyUser = createAsyncThunk(
  "users/verify",
  async ({ otp }, { rejectWithValue }) => {
    try {
      const { data } = await publicClient.post("/users/verify", { otp });
      return data; // message
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Resend signup OTP
export const resendSignupOtp = createAsyncThunk(
  "users/resendSignupOtp",
  async ({ email }, { rejectWithValue }) => {
    try {
      const { data } = await publicClient.post("/users/resend-signupotp", { email });
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Resend reset OTP (used by forget password flow)
export const resendResetOtp = createAsyncThunk(
  "users/resendResetOtp",
  async ({ email }, { rejectWithValue }) => {
    try {
      const { data } = await publicClient.post("/users/resend-resetotp", { email });
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const fetchAdmins = createAsyncThunk(
  "admin/fetchAdmins",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await privateClient.get("/users/admins");
      return data.admins;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // Used by axios interceptor to update token after silent refresh
    setAccessToken: (state, action) => {
      state.accessToken = action.payload;
      state.isAuthenticated = true;
      try {
        localStorage.setItem("accessToken", action.payload);
      } catch (e) {}
    },
    // Synchronous logout (called by interceptor on refresh failure)
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.isAuthenticated = false;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // ── Register ────────────────────────────────────────────────────────────
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        // Registration succeeded. Backend does not authenticate the user here,
        // so we don't set an access token or authenticated user.
        state.isLoading = false;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
      })

      // ── Login ───────────────────────────────────────────────────────────────
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
      })

      // ── Logout ──────────────────────────────────────────────────────────────
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.accessToken = null;
        state.isAuthenticated = false;
        state.error = null;
      })
      .addCase(logoutUser.rejected, (state) => {
        // Still wipe local state even if server call failed
        state.user = null;
        state.accessToken = null;
        state.isAuthenticated = false;
      })

      // ── Restore Session (app mount) ─────────────────────────────────────────
      .addCase(restoreSession.pending, (state) => {
        state.isSessionRestoring = true;
      })
      .addCase(restoreSession.fulfilled, (state, action) => {
        state.isSessionRestoring = false;
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        state.isAuthenticated = true;
      })
      .addCase(restoreSession.rejected, (state) => {
        state.isSessionRestoring = false;
        state.isAuthenticated = false;
        state.user = null;
        state.accessToken = null;
      })

      // ── Get Me ──────────────────────────────────────────────────────────────
      .addCase(getMe.fulfilled, (state, action) => {
        state.user = action.payload;
      });

    builder.addCase(fetchAdmins.fulfilled, (state, action) => {
      state.admins = action.payload || [];
    });
  },
});

export const { setAccessToken, logout, clearError } = authSlice.actions;
export default authSlice.reducer;

export const authSelector = (state) => state.adminAuth;