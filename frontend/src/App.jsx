import { Routes, Route } from "react-router-dom";

// Pages
import PlusOneTV from "@/pages/home";
import NotFound from "@/pages/not-found";
import AdminLayout from "@/components/admin-view/admin-layout";
import AdminDashboard from "@/pages/admin-view/admin-dashboard";
import AdminAuthLayout from "./components/admin-auth/layout";
import AdminLogin from "@/pages/admin-auth/login";
import AdminRegister from "@/pages/admin-auth/register";
import AdminArticles from "./pages/admin-view/admin-article";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { restoreSession, authSelector } from "./features/admin/auth-slice";

function App() {
  const dispatch = useDispatch();
  const { isSessionRestoring } = useSelector(authSelector);

  useEffect(() => {
    dispatch(restoreSession());
  }, [dispatch]);

   if (isSessionRestoring) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <span className="loading-spinner" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Routes>
        {/* Home Route */}
        <Route path="/" element={<PlusOneTV />} />

        <Route path="/auth/admin" element={<AdminAuthLayout />}>
          <Route path="login" element={<AdminLogin />} />
          <Route path="register" element={<AdminRegister />} />
        </Route>

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="articles" element={<AdminArticles/>} />
        </Route>

        {/* Fallback Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;
