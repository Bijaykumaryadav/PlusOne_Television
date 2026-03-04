import { Routes, Route, useNavigate, useLocation } from "react-router-dom";

// Pages
import NotFound from "@/pages/not-found";
import ArticlesList from "@/pages/articles";
import ArticleDetail from "@/pages/articles/[id]";
import PaymentPage from "@/pages/payment";
// import Header from "@/components/home/Header";
// import Hero from "@/components/home/Hero";
// import Footer from "@/components/home/Footer";
import AdminLayout from "@/components/admin-view/admin-layout";
import AdminDashboard from "@/pages/admin-view/admin-dashboard";
import ProtectedRoute from "@/utils/protectedRoute";
import AdminAuthLayout from "./components/admin-auth/layout";
import AdminLogin from "@/pages/admin-auth/login";
import AdminRegister from "@/pages/admin-auth/register";
import AdminVerifyOtp from "@/pages/admin-auth/verify-otp";
import AdminArticles from "./pages/admin-view/admin-article";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { restoreSession, authSelector } from "./features/admin/auth-slice";
import UsersDashboard from "./pages/users-view/users-dashboard";

function App() {
  const dispatch = useDispatch();
  const { isSessionRestoring, isAuthenticated } = useSelector(authSelector);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    dispatch(restoreSession());
  }, [dispatch]);
  // If the session has finished restoring and the user is not authenticated,
  // redirect them to the admin login page only when they're on an admin route.
  useEffect(() => {
    if (!isSessionRestoring && !isAuthenticated && location.pathname.startsWith("/admin")) {
      navigate("/auth/admin/login", { replace: true });
    }
  }, [isSessionRestoring, isAuthenticated, location.pathname, navigate]);

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
        <Route path="/" element={<UsersDashboard />} />
        <Route path="/articles" element={<ArticlesList />} />
        <Route path="/articles/:id" element={<ArticleDetail />} />
        <Route path="/payment" element={<PaymentPage />} />

        <Route path="/auth/admin" element={<AdminAuthLayout />}>
          <Route path="login" element={<AdminLogin />} />
          <Route path="register" element={<AdminRegister />} />
          <Route path="verify-otp" element={<AdminVerifyOtp />} />
        </Route>

        {/* Admin Routes */}
        <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="articles" element={<AdminArticles/>} />
          </Route>
        </Route>

        {/* Fallback Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;

function HomeShell() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-7xl mx-auto p-4">
        <Hero />
      </main>
      <Footer />
    </div>
  );
}
