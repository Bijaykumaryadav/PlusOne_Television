import CommonForm from "@/components/common/form";
import { toast } from "sonner";
import { registerFormControls } from "@/config";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";

const initialState = {
  userName: "",
  email: "",
  password: "",
  phoneNumber: "",
  role: "admin",
};

function AdminRegister() {
  const [formData, setFormData] = useState(initialState);
  const navigate = useNavigate();

  async function onSubmit(event) {
    event.preventDefault();

    // 🚀 Temporary frontend-only simulation
    if (!formData.userName || !formData.email || !formData.password) {
      toast.error("Please fill all required fields", {
        duration: 3000,
      });
      return;
    }

    toast.success("Registration successful! (Frontend Only)", {
      duration: 3000,
    });

    // Redirect to login page
    setTimeout(() => {
      navigate("/auth/admin/login");
    }, 1500);
  }

  return (
    <div className="mx-auto w-full max-w-md space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          to="/"
          className="text-[#2260FF] hover:text-[#2260FF]/90 transition-colors"
        >
          <ChevronLeft className="w-6 h-6 lg:hidden" />
        </Link>

        <h1 className="font-['League_Spartan'] font-semibold text-2xl text-[#2260FF] mx-auto">
          Admin Sign Up
        </h1>
      </div>

      {/* Welcome Section */}
      <div className="space-y-2">
        <h2 className="font-['League_Spartan'] font-semibold text-2xl text-[#2260FF]">
          Welcome
        </h2>
        <p className="font-['League_Spartan'] text-sm text-gray-600">
          Please enter your details for admin registration
        </p>
      </div>

      {/* Form */}
      <CommonForm
        formControls={registerFormControls}
        buttonText="Sign Up"
        formData={formData}
        setFormData={setFormData}
        onSubmit={onSubmit}
        isBtnDisabled={false}
      />

      {/* Social Login UI Only */}
      <div className="space-y-4">
        <p className="font-['League_Spartan'] text-sm text-gray-600 text-center">
          or sign up with
        </p>

        <div className="flex justify-center gap-4">
          <button className="w-[40px] h-[40px] rounded-full bg-[#CAD6FF] hover:bg-[#CAD6FF]/80 flex items-center justify-center transition-colors">
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#2260FF"
                d="M21.35 11.1h-9.17v2.73h6.51c-.33 3.81-3.5 5.44-6.5 5.44C8.36 19.27 5 16.25 5 12c0-4.1 3.2-7.27 7.2-7.27 3.09 0 4.9 1.97 4.9 1.97L19 4.72S16.56 2 12.1 2C6.42 2 2.03 6.8 2.03 12c0 5.05 4.13 10 10.22 10 5.35 0 9.25-3.67 9.25-9.09 0-1.15-.15-1.81-.15-1.81Z"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Sign In Link */}
      <div className="text-center">
        <span className="font-['League_Spartan'] text-sm text-gray-600">
          Already have an account?{" "}
        </span>

        <Link
          to="/auth/admin/login"
          className="font-['League_Spartan'] font-medium text-sm text-[#2260FF] hover:text-[#2260FF]/90 transition-colors"
        >
          Sign In
        </Link>
      </div>
    </div>
  );
}

export default AdminRegister;
