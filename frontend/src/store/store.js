import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/admin/auth-slice";
import { injectStore } from "../services/axiosInstance";
import paymentReducer from "../features/users/Paymentslice";
import articlesReducer from "../features/articles/articlesSlice";


export const store = configureStore({
  reducer: {
    adminAuth: authReducer,
    payment: paymentReducer,
    articles: articlesReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
  devTools: process.env.NODE_ENV !== "production",
});
injectStore(store);
export default store;
