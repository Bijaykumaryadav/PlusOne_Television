import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/admin/auth-slice";
import { injectStore } from "../services/axiosInstance";

export const store = configureStore({
  reducer: {
    adminAuth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
  devTools: process.env.NODE_ENV !== "production",
});
injectStore(store);
export default store;
