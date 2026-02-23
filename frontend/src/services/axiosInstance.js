import axios from "axios";
// import { store } from "../store/store";
import { setAccessToken, logout } from "../features/admin/auth-slice";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/apis/v1/";

let store;

export const injectStore = (_store) => {
  store = _store;
};

// ─── Public client (no auth) ──────────────────────────────────────────────────
// Used for login, register, refresh — endpoints that don't need a token
export const publicClient = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // send httpOnly refresh token cookie
});

// ─── Private client (authenticated) ───────────────────────────────────────────
// Used for all protected API calls
const privateClient = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

// ─── Request interceptor ───────────────────────────────────────────────────────
// Attach the in-memory access token to every request
privateClient.interceptors.request.use(
  (config) => {
  const accessToken = store.getState().adminAuth.accessToken;
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ─── Response interceptor ─────────────────────────────────────────────────────
// On 401, silently refresh the access token and retry the original request
let isRefreshing = false;
let failedQueue = []; // queue requests that came in while refreshing

const processQueue = (error, token = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error);
    else resolve(token);
  });
  failedQueue = [];
};

privateClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If 401 and we haven't already retried this request
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // Queue this request while a refresh is already in progress
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return privateClient(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Hit refresh endpoint — server reads httpOnly cookie and returns new access token
        const { data } = await publicClient.post("/auth/refresh");
        const newToken = data.accessToken;

        store.dispatch(setAccessToken(newToken));
        processQueue(null, newToken);

        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return privateClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        store.dispatch(logout());
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default privateClient;