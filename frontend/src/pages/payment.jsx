import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import UsersHeader from "@/components/users-view/users-header";
import UsersFooter from "@/components/users-view/users-footer";
import { ArrowLeft } from "lucide-react";

// khalti public key from env
const KHALTI_PUBLIC_KEY = import.meta.env.VITE_KHALTI_PUBLIC_KEY;

export default function PaymentPage() {
  const [amt, setAmt] = useState("");
  const [pid, setPid] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state || {};
  const { source = 'direct', referrer = 'general' } = state;

  const isPremium = referrer === 'premium';
  const isAdvertiser = referrer === 'advertiser';

  // load khalti script once
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://khalti.com/static/khalti-checkout.js';
    script.async = true;
    document.body.appendChild(script);
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    if (!amt || !pid) {
      alert('Please fill in all fields');
      return;
    }
    try {
      const base = import.meta.env.VITE_API_URL || "http://localhost:8000/apis/v1/";
      const normalized = base.endsWith("/") ? base : base + "/";
      const res = await fetch(`${normalized}payments/khalti/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: parseFloat(amt), pid }),
      });
      const data = await res.json();
      if (!data.token) {
        throw new Error('no token from khalti');
      }
      // initialise checkout
      const config = {
        publicKey: KHALTI_PUBLIC_KEY,
        productIdentity: pid,
        productName: isPremium ? 'Premium Subscription' : 'Advertisement',
        productUrl: window.location.href,
        eventHandler: {
          onSuccess(payload) {
            alert('Payment successful');
            // optionally call backend to verify using payload.token
          },
          onError(err) {
            console.error('Khalti error', err);
          },
          onClose() {
            console.log('Khalti widget closed');
          }
        }
      };
      const checkout = new window.KhaltiCheckout(config);
      checkout.show({ amount: Math.round(parseFloat(amt) * 100) });
    } catch (err) {
      console.error(err);
      alert('Payment initialization failed');
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <UsersHeader />
      
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          {/* Back Button */}
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-red-600 hover:text-red-700 mb-6 font-medium transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </button>

          <Card className="shadow-lg border-0">
            <CardHeader className="bg-gradient-to-r from-red-600 to-red-700 text-white rounded-t-lg">
              <CardTitle className="text-2xl">
                {isPremium ? '⭐ Upgrade to Premium' : isAdvertiser ? '📢 Advertise with Us' : '💳 Make Payment'}
              </CardTitle>
              <CardDescription className="text-red-100">
                {isPremium 
                    ? 'Unlock exclusive content and ad-free reading'
                    : isAdvertiser 
                    ? 'Reach thousands of engaged readers'
                    : 'Complete your payment via Khalti'}
              </CardDescription>
            </CardHeader>

            <CardContent className="p-6">
              {/* Info Box */}
              <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-900">
                  {isPremium
                    ? '✨ Premium members get access to all articles, no ads, and early access to breaking news.'
                    : isAdvertiser
                    ? '📊 Your advertisement will reach our growing audience of news enthusiasts.'
                    : '🔒 Your payment information is secure and processed by Khalti.'}
                </p>
              </div>

              <form onSubmit={submit} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Amount (NPR)
                  </label>
                  <Input
                    required
                    type="number"
                    step="0.01"
                    min="1"
                    value={amt}
                    onChange={(e) => setAmt(e.target.value)}
                    placeholder={isPremium ? "99.00" : "500.00"}
                    className="w-full"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {isPremium ? 'Monthly subscription': 'Advertisement package cost'}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Transaction / Order ID
                  </label>
                  <Input
                    required
                    value={pid}
                    onChange={(e) => setPid(e.target.value)}
                    placeholder="e.g., ORDER-2024-001"
                    className="w-full"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Must be unique for each transaction
                  </p>
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold py-2 h-auto"
                  disabled={!amt || !pid}
                >
                  Proceed to Khalti Payment
                </Button>
              </form>

              {/* Security Info */}
              <div className="mt-6 pt-4 border-t border-gray-200">
                <p className="text-xs text-gray-600 text-center">
                  🔐 Powered by Khalti - Nepal's easiest payment gateway
                </p>
              </div>
            </CardContent>
          </Card>

          {/* FAQ Section */}
          <div className="mt-8 space-y-3">
            <h3 className="font-semibold text-gray-900">Need help?</h3>
            <div className="space-y-2">
              <details className="bg-white p-3 rounded-lg cursor-pointer hover:bg-gray-50">
                <summary className="text-sm font-medium text-gray-700">
                  What payment methods do you accept?
                </summary>
                <p className="text-sm text-gray-600 mt-2">
                  We accept payments via Khalti, which supports cards, mobile wallets, and bank transfers.
                </p>
              </details>
              
              <details className="bg-white p-3 rounded-lg cursor-pointer hover:bg-gray-50">
                <summary className="text-sm font-medium text-gray-700">
                  Is my payment secure?
                </summary>
                <p className="text-sm text-gray-600 mt-2">
                  Yes, all payments are processed securely through Khalti with industry-standard encryption.
                </p>
              </details>

              <details className="bg-white p-3 rounded-lg cursor-pointer hover:bg-gray-50">
                <summary className="text-sm font-medium text-gray-700">
                  Can I cancel my subscription?
                </summary>
                <p className="text-sm text-gray-600 mt-2">
                  Yes, you can cancel anytime from your account settings. No questions asked.
                </p>
              </details>
            </div>
          </div>
        </div>
      </main>

      <UsersFooter />
    </div>
  );
}
