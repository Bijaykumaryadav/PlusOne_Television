import CommonForm from "@/components/common/form";
import { toast } from "sonner";
import { loginFormControls } from "@/config";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { motion } from "framer-motion";

function AdminLogin() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  async function onSubmit(event) {
    event.preventDefault();

    // 🔹 Frontend-only simulation
    if (!formData.email || !formData.password) {
      toast.error("Please fill all required fields", { duration: 3000 });
      return;
    }

    toast.success("Login successful! (Frontend Only)", { duration: 2000 });

    // Redirect to admin dashboard after 1s
    setTimeout(() => {
      navigate("/admin/dashboard");
    }, 1000);
  }

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
          isBtnDisabled={false}
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
