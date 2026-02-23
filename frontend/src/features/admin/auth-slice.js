import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { publicClient } from "../../services/axiosInstance";
import privateClient from "../../services/axiosInstance";

// ─── Async Thunks ─────────────────────────────────────────────────────────────

export const registerUser = createAsyncThunk(
  "auth/register",
  async ({ userName, email, password, role }, { rejectWithValue }) => {
    try {
      const { data } = await publicClient.post("/auth/register", {
        userName,
        email,
        password,
  
        role: role || "user",
      });

      // Server sets httpOnly refresh token cookie automatically
      // We only store the short-lived access token in memory
      return {
        user: data.user,
        accessToken: data.accessToken,
      };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const loginUser = createAsyncThunk(
  "auth/login",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const { data } = await publicClient.post("/auth/login", {
        email,
        password,
      });

      // Server sets httpOnly refresh token cookie automatically
      // Access token lives only in Redux memory — never in localStorage
      return {
        user: data.user,
        accessToken: data.accessToken,
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
    } catch (error) {
      // Clear local state regardless of server response
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Called on app mount to silently restore session using the httpOnly refresh token cookie
export const restoreSession = createAsyncThunk(
  "auth/restoreSession",
  async (_, { rejectWithValue }) => {
    try {
      // Hits /auth/refresh — server reads the httpOnly cookie and returns a new access token
      const { data } = await publicClient.post("/auth/refresh");
      return {
        user: data.user,
        accessToken: data.accessToken,
      };
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
      const { data } = await privateClient.get("/auth/me");
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
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // Used by axios interceptor to update token after silent refresh
    setAccessToken: (state, action) => {
      state.accessToken = action.payload;
      state.isAuthenticated = true;
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
        state.isLoading = false;
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        state.isAuthenticated = true;
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
  },
});

export const { setAccessToken, logout, clearError } = authSlice.actions;
export default authSlice.reducer;

export const authSelector = (state) => state.adminAuth;