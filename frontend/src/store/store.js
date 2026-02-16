import { configureStore } from "@reduxjs/toolkit";
import adminAuthReducer from "../features/admin/auth-slice";

export const store = configureStore({
  reducer: {
    adminAuth: adminAuthReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
  devTools: process.env.NODE_ENV !== "production",
});

export default store;
