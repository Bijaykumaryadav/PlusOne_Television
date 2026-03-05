// src/pages/PaymentPage.jsx
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { initiatePayment, resetInitiate } from "@/features/users/Paymentslice";
import {
  selectInitiating,
  selectInitiateError,
  selectPaymentUrl,
} from "@/store/selectors/paymentSelectors";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  Star,
  Megaphone,
  CreditCard,
  ShieldCheck,
  Loader2,
  AlertCircle,
  CheckCircle,
  User,
  Mail,
  Phone,
} from "lucide-react";

// ─── Plan Config ─────────────────────────────────────────────────────────────
const PLANS = {
  premium: {
    label: "Premium Subscription",
    price: 99,
    currency: "NPR / month",
    icon: Star,
    color: "from-amber-500 to-orange-500",
    features: [
      "Unlimited article access",
      "Zero advertisements",
      "Early access to breaking news",
      "Exclusive journalist Q&As",
      "Download articles offline",
    ],
  },
  advertiser: {
    label: "Advertisement Package",
    price: 999,
    currency: "NPR / package",
    icon: Megaphone,
    color: "from-blue-600 to-indigo-600",
    features: [
      "Homepage banner (7 days)",
      "Article sidebar ads",
      "25,000+ monthly impressions",
      "Analytics dashboard access",
      "Dedicated support",
    ],
  },
  general: {
    label: "General Payment",
    price: null,
    currency: "NPR",
    icon: CreditCard,
    color: "from-red-600 to-rose-600",
    features: [],
  },
};

export default function PaymentPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Redux state
  const initiating = useSelector(selectInitiating);
  const initiateError = useSelector(selectInitiateError);
  const paymentUrl = useSelector(selectPaymentUrl);

  const state = location.state || {};
  const type = state.type || state.referrer || "general";
  const plan = PLANS[type] || PLANS.general;
  const PlanIcon = plan.icon;

  const [customer, setCustomer] = useState({ name: "", email: "", phone: "" });
  const [amount, setAmount] = useState(state.amount || plan.price || "");
  const [fieldErrors, setFieldErrors] = useState({});

  // When Redux stores payment_url, redirect
  useEffect(() => {
    if (paymentUrl) {
      window.location.href = paymentUrl;
    }
  }, [paymentUrl]);

  // Cleanup on unmount
  useEffect(() => {
    return () => dispatch(resetInitiate());
  }, [dispatch]);

  const handleChange = (field) => (e) => {
    setCustomer((prev) => ({ ...prev, [field]: e.target.value }));
    setFieldErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validate = () => {
    const errors = {};
    if (!customer.name.trim()) errors.name = "Name is required.";
    if (!customer.email.trim()) errors.email = "Email is required.";
    else if (!/\S+@\S+\.\S+/.test(customer.email))
      errors.email = "Enter a valid email.";
    if (!customer.phone.trim()) errors.phone = "Phone number is required.";
    else if (!/^(98|97)\d{8}$/.test(customer.phone))
      errors.phone = "Enter a valid Nepali phone number (98XXXXXXXX).";
    if (
      type === "general" &&
      (!amount || isNaN(amount) || parseFloat(amount) <= 0)
    )
      errors.amount = "Enter a valid amount.";
    return errors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errors = validate();
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }
    dispatch(
      initiatePayment({
        type,
        amount: type === "general" ? parseFloat(amount) : plan.price,
        customer,
      })
    );
  };

  const resolvedAmount = type === "general" ? amount : plan.price;

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Back */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-8 text-sm font-medium transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Go Back
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* ── Left: Plan card ── */}
          <div className="lg:col-span-2">
            <Card className="sticky top-6 border-0 shadow-md overflow-hidden">
              <div
                className={`bg-gradient-to-br ${plan.color} p-6 text-white`}
              >
                <PlanIcon className="w-10 h-10 mb-3 opacity-90" />
                <h2 className="text-xl font-bold">{plan.label}</h2>
                <div className="mt-3">
                  {type !== "general" ? (
                    <p className="text-3xl font-extrabold">
                      NPR {plan.price.toLocaleString()}
                      <span className="text-sm font-normal opacity-75 ml-1">
                        /{" "}
                        {plan.currency.split(" / ")[1]}
                      </span>
                    </p>
                  ) : (
                    <p className="text-lg opacity-80">Enter amount below</p>
                  )}
                </div>
              </div>

              {plan.features.length > 0 && (
                <CardContent className="p-5">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                    What's included
                  </p>
                  <ul className="space-y-2">
                    {plan.features.map((f, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2 text-sm text-gray-700"
                      >
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              )}

              <div className="px-5 pb-5">
                <Separator className="mb-4" />
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <ShieldCheck className="w-4 h-4 text-green-500" />
                  Secured by Khalti Payment Gateway
                </div>
              </div>
            </Card>
          </div>

          {/* ── Right: Form ── */}
          <div className="lg:col-span-3">
            <Card className="border-0 shadow-md">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl">Your Details</CardTitle>
                <CardDescription>
                  Used for payment receipt and confirmation.
                </CardDescription>
              </CardHeader>

              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Name */}
                  <div className="space-y-1.5">
                    <Label
                      htmlFor="name"
                      className="flex items-center gap-1.5"
                    >
                      <User className="w-3.5 h-3.5 text-gray-400" />
                      Full Name
                    </Label>
                    <Input
                      id="name"
                      placeholder="Ram Prasad Shrestha"
                      value={customer.name}
                      onChange={handleChange("name")}
                      className={fieldErrors.name ? "border-red-400" : ""}
                    />
                    {fieldErrors.name && (
                      <p className="text-xs text-red-500">{fieldErrors.name}</p>
                    )}
                  </div>

                  {/* Email */}
                  <div className="space-y-1.5">
                    <Label
                      htmlFor="email"
                      className="flex items-center gap-1.5"
                    >
                      <Mail className="w-3.5 h-3.5 text-gray-400" />
                      Email Address
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="ram@example.com"
                      value={customer.email}
                      onChange={handleChange("email")}
                      className={fieldErrors.email ? "border-red-400" : ""}
                    />
                    {fieldErrors.email && (
                      <p className="text-xs text-red-500">
                        {fieldErrors.email}
                      </p>
                    )}
                  </div>

                  {/* Phone */}
                  <div className="space-y-1.5">
                    <Label
                      htmlFor="phone"
                      className="flex items-center gap-1.5"
                    >
                      <Phone className="w-3.5 h-3.5 text-gray-400" />
                      Phone Number
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="98XXXXXXXX"
                      value={customer.phone}
                      onChange={handleChange("phone")}
                      className={fieldErrors.phone ? "border-red-400" : ""}
                    />
                    {fieldErrors.phone && (
                      <p className="text-xs text-red-500">
                        {fieldErrors.phone}
                      </p>
                    )}
                  </div>

                  {/* Amount — general only */}
                  {type === "general" && (
                    <div className="space-y-1.5">
                      <Label htmlFor="amount">Amount (NPR)</Label>
                      <Input
                        id="amount"
                        type="number"
                        min="1"
                        step="0.01"
                        placeholder="500.00"
                        value={amount}
                        onChange={(e) => {
                          setAmount(e.target.value);
                          setFieldErrors((p) => ({ ...p, amount: "" }));
                        }}
                        className={fieldErrors.amount ? "border-red-400" : ""}
                      />
                      {fieldErrors.amount && (
                        <p className="text-xs text-red-500">
                          {fieldErrors.amount}
                        </p>
                      )}
                    </div>
                  )}

                  {/* API error from Redux */}
                  {initiateError && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{initiateError}</AlertDescription>
                    </Alert>
                  )}

                  <Separator />

                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500">Total Amount</span>
                    <span className="font-bold text-lg">
                      NPR{" "}
                      {resolvedAmount
                        ? parseFloat(resolvedAmount).toLocaleString()
                        : "—"}
                    </span>
                  </div>

                  <Button
                    type="submit"
                    disabled={initiating}
                    className="w-full h-12 text-base font-semibold bg-purple-600 hover:bg-purple-700 text-white"
                  >
                    {initiating ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Redirecting to Khalti...
                      </>
                    ) : (
                      `Pay NPR ${
                        resolvedAmount
                          ? parseFloat(resolvedAmount).toLocaleString()
                          : ""
                      } with Khalti`
                    )}
                  </Button>

                  <p className="text-xs text-center text-gray-400">
                    You'll be redirected to Khalti's secure payment page. Do not
                    close the browser during payment.
                  </p>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}