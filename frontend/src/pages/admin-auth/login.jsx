import CommonForm from "@/components/common/form";
import { toast } from "sonner";
import { loginFormControls } from "@/config";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, authSelector } from "@/features/admin/auth-slice";

function AdminLogin() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const navigate = useNavigate();
  const dispatch = useDispatch();           
  const auth = useSelector(authSelector);

  async function onSubmit(event) {
    event.preventDefault();

    if (!formData.email || !formData.password) {
      toast.error("Please fill all required fields", { duration: 3000 });
      return;
    }

    try {
      await dispatch(
        loginUser({ email: formData.email, password: formData.password })
      ).unwrap();

      toast.success("Login successful", { duration: 2000 });
      navigate("/admin/dashboard");
    } catch (err) {
      toast.error(err || "Login failed", { duration: 3000 });
    }
  }

  // Show backend errors from slice
  useEffect(() => {
    if (auth.error) {
      toast.error(auth.error, { duration: 3000 });
    }
  }, [auth.error]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen flex flex-col items-center justify-center px-4 bg-gradient-to-b from-white to-gray-50"
    >
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link
            to="/"
            className="text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-2xl font-semibold text-gray-900">Admin Login</h1>
        </div>

        {/* Welcome Text */}
        <div className="space-y-2">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">
            Welcome back
          </h2>
          <p className="text-sm text-gray-500">
            Please enter your details to access admin dashboard
          </p>
        </div>

        {/* Login Form */}
        <CommonForm
          formControls={loginFormControls}
          buttonText="Sign in"
          formData={formData}
          setFormData={setFormData}
          onSubmit={onSubmit}
          isBtnDisabled={auth.isLoading}
        />

        {/* Sign Up Link */}
        <p className="text-center text-sm text-gray-500">
          Don't have an account?{" "}
          <Link
            to="/auth/admin/register"
            className="font-medium text-primary hover:text-primary/90 transition-colors"
          >
            Sign up
          </Link>
        </p>
      </div>
    </motion.div>
  );
}

export default AdminLogin;
