// src/pages/PaymentVerifyPage.jsx
import { useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { verifyPayment, resetVerify } from "@/features/users/Paymentslice";
import {
  selectVerifying,
  selectVerifySuccess,
  selectVerifyError,
  selectVerifiedPayment,
} from "@/store/selectors/paymentSelectors";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle2,
  XCircle,
  Loader2,
  ArrowLeft,
  Receipt,
  Home,
  RefreshCcw,
} from "lucide-react";

export default function PaymentVerifyPage() {
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();

  // Redux state
  const verifying = useSelector(selectVerifying);
  const verifySuccess = useSelector(selectVerifySuccess);
  const verifyError = useSelector(selectVerifyError);
  const payment = useSelector(selectVerifiedPayment);

  const pidx = searchParams.get("pidx");

  useEffect(() => {
    if (pidx) {
      dispatch(verifyPayment(pidx));
    }
    return () => dispatch(resetVerify());
  }, [pidx, dispatch]);

  const done = !verifying && (verifySuccess !== false || verifyError);
  const isSuccess = verifySuccess && payment?.status === "completed";

  // ── Loading ──
  if (verifying || !done) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 gap-4">
        <Loader2 className="h-14 w-14 animate-spin text-purple-600" />
        <p className="text-lg font-medium text-gray-600">
          Verifying your payment...
        </p>
        <p className="text-sm text-gray-400">Please don't close this tab.</p>
      </div>
    );
  }

  // ── No pidx ──
  if (!pidx) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <Card className="max-w-md w-full text-center shadow-lg border-0">
          <CardHeader>
            <XCircle className="mx-auto text-red-500 w-14 h-14 mb-2" />
            <CardTitle className="text-red-600">Invalid Request</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500">
              No payment reference found. Please don't navigate here directly.
            </p>
          </CardContent>
          <CardFooter className="justify-center">
            <Button asChild variant="outline">
              <Link to="/">
                <Home className="mr-2 w-4 h-4" /> Go Home
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  // ── Result ──
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-10">
      <Card className="max-w-lg w-full shadow-xl border-0 overflow-hidden">
        {/* Banner */}
        <div
          className={`p-8 text-center ${
            isSuccess
              ? "bg-gradient-to-br from-green-50 to-emerald-100"
              : "bg-gradient-to-br from-red-50 to-rose-100"
          }`}
        >
          {isSuccess ? (
            <CheckCircle2 className="mx-auto text-green-500 w-20 h-20 mb-4" />
          ) : (
            <XCircle className="mx-auto text-red-500 w-20 h-20 mb-4" />
          )}
          <h1
            className={`text-2xl font-bold ${
              isSuccess ? "text-green-700" : "text-red-600"
            }`}
          >
            {isSuccess ? "Payment Successful!" : "Payment Failed"}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {isSuccess
              ? "Your transaction was completed successfully."
              : verifyError || "Something went wrong. Please try again."}
          </p>
        </div>

        {/* Details */}
        {payment && (
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-gray-600">
              <Receipt className="w-4 h-4" />
              Transaction Details
            </div>
            <Separator />
            <div className="space-y-3">
              <Row
                label="Transaction ID"
                value={payment.transaction_id || "—"}
                mono
              />
              <Row label="Order ID" value={payment.purchase_order_id} mono />
              <Row label="Order Name" value={payment.purchase_order_name} />
              <Row
                label="Amount Paid"
                value={`NPR ${payment.amount?.toLocaleString()}`}
                bold
              />
              <Row label="Customer" value={payment.customer?.name || "—"} />
              <Row label="Email" value={payment.customer?.email || "—"} />
              <Row
                label="Date"
                value={new Date(payment.createdAt).toLocaleString("en-NP", {
                  dateStyle: "medium",
                  timeStyle: "short",
                })}
              />
              <Row
                label="Status"
                value={
                  <Badge
                    className={
                      isSuccess
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }
                  >
                    {payment.status?.toUpperCase()}
                  </Badge>
                }
              />
            </div>
          </CardContent>
        )}

        <CardFooter className="p-6 pt-0 gap-3 flex-col sm:flex-row">
          {isSuccess ? (
            <Button asChild className="w-full bg-green-600 hover:bg-green-700">
              <Link to="/">
                <Home className="mr-2 w-4 h-4" /> Back to Home
              </Link>
            </Button>
          ) : (
            <Button
              asChild
              className="w-full bg-purple-600 hover:bg-purple-700"
            >
              <Link to="/payment" state={{ type: "general" }}>
                <RefreshCcw className="mr-2 w-4 h-4" /> Try Again
              </Link>
            </Button>
          )}
          <Button asChild variant="outline" className="w-full">
            <Link to="/">
              <ArrowLeft className="mr-2 w-4 h-4" /> Home
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

function Row({ label, value, mono, bold }) {
  return (
    <div className="flex justify-between items-center text-sm gap-4">
      <span className="text-gray-500 shrink-0">{label}</span>
      <span
        className={`text-right break-all ${mono ? "font-mono text-xs" : ""} ${
          bold ? "font-bold text-gray-900" : "text-gray-700"
        }`}
      >
        {value}
      </span>
    </div>
  );
}