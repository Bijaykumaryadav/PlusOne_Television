import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";
import { ChevronLeft } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import CommonForm from "@/components/common/form";
import { authSelector, verifyUser, resendSignupOtp } from "@/features/admin/auth-slice";

function VerifyOtp() {
  const [otp, setOtp] = useState("");
  const location = useLocation();
  const [email, setEmail] = useState(location.state?.email || "");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const auth = useSelector(authSelector);

  async function onSubmit(e) {
    e.preventDefault();
    if (!otp) return toast.error("Please enter OTP");

    try {
      await dispatch(verifyUser({ otp })).unwrap();
      toast.success("Verification successful", { duration: 2000 });
      navigate("/auth/admin/login");
    } catch (err) {
      toast.error(err || "Verification failed", { duration: 3000 });
    }
  }

  async function onResend() {
    if (!email) return toast.error("Please enter email to resend OTP");
    try {
      await dispatch(resendSignupOtp({ email })).unwrap();
      toast.success("OTP resent", { duration: 2000 });
    } catch (err) {
      toast.error(err || "Resend failed", { duration: 3000 });
    }
  }

  useEffect(() => {
    if (auth.error) toast.error(auth.error, { duration: 3000 });
  }, [auth.error]);

  return (
    <div className="mx-auto w-full max-w-md space-y-6">
      <div className="flex items-center gap-4">
        <Link to="/" className="text-[#2260FF] hover:text-[#2260FF]/90">
          <ChevronLeft className="w-6 h-6" />
        </Link>
        <h1 className="text-2xl font-semibold text-[#2260FF] mx-auto">Verify Account</h1>
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            placeholder="Enter your email to resend OTP"
            type="email"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">OTP</label>
          <input
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            placeholder="Enter OTP"
            type="text"
          />
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded"
            disabled={auth.isLoading}
          >
            Verify
          </button>

          <button
            type="button"
            onClick={onResend}
            className="px-4 py-2 bg-gray-200 rounded"
            disabled={auth.isLoading}
          >
            Resend OTP
          </button>
        </div>
      </form>
    </div>
  );
}

export default VerifyOtp;
