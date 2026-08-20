import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  ShieldCheck,
  CreditCard,
  Truck,
  MapPin,
  Lock,
  ArrowRight,
  Gift,
  Wallet,
  CheckCircle2,
} from "lucide-react";

import { FictionalNotice } from "@/components/fictional/FictionalNotice";
import { PageShell } from "@/components/fictional/PageShell";
import { StepBadge } from "@/components/fictional/StepBadge";
import { FICTIONAL_SHIPPING, formatCoins } from "@/lib/fictional-config";
import { buildCartLines, cartSubtotal, rewardPointsFor } from "@/lib/shopping-logic";
import { useSession } from "@/state/session";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "Secure Checkout — Whim Cart Marketplace" },
      {
        name: "description",
        content: "Complete your order with simulated secure processing and instant dispatch.",
      },
      { property: "og:title", content: "Secure Checkout — Whim Cart" },
      {
        property: "og:description",
        content: "Simulated order finalization and shipping confirmation.",
      },
    ],
  }),
  component: CheckoutPage,
});

const SHIPPING_METHODS = [
  {
    id: "standard",
    title: "Standard Ground Dispatch",
    time: "2-3 business days",
    price: FICTIONAL_SHIPPING,
  },
  {
    id: "express",
    title: "Express Courier Priority",
    time: "Next day delivery",
    price: FICTIONAL_SHIPPING * 2,
  },
];

export function CheckoutPage() {
  const { session, placeOrder } = useSession();
  const navigate = useNavigate();
  const lines = buildCartLines(session.cart);
  const subtotal = cartSubtotal(session.cart);

  const [shippingMethod, setShippingMethod] = useState(SHIPPING_METHODS[0]!.id);
  const [giftWrap, setGiftWrap] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"card" | "wallet">("card");
  const [isProcessing, setIsProcessing] = useState(false);

  // Form Fields
  const [fullName, setFullName] = useState("Alex Rivers");
  const [address, setAddress] = useState("742 Evergreen Terrace");
  const [city, setCity] = useState("Metropolis");
  const [postalCode, setPostalCode] = useState("90210");
  const [cardNumber, setCardNumber] = useState("•••• •••• •••• 4242");

  const selectedShipping =
    SHIPPING_METHODS.find((m) => m.id === shippingMethod) ?? SHIPPING_METHODS[0]!;
  const shippingCost =
    subtotal >= 1000 && shippingMethod === "standard" ? 0 : selectedShipping.price;
  const giftCost = giftWrap ? 25 : 0;
  const total = subtotal + shippingCost + giftCost;

  const handlePlaceOrder = () => {
    setIsProcessing(true);
    setTimeout(() => {
      const order = placeOrder();
      if (order) {
        void navigate({ to: "/order" });
      }
    }, 600);
  };

  if (lines.length === 0) {
    return (
      <PageShell>
        <StepBadge step={2} label="Checkout" />
        <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center my-8 shadow-xs">
          <h1 className="text-2xl font-bold text-slate-900">Your shopping bag is empty</h1>
          <p className="mt-2 text-sm text-slate-500">
            Please add items to your cart before proceeding to checkout.
          </p>
          <div className="mt-6">
            <Link
              to="/catalog"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs"
            >
              Explore Catalog
            </Link>
          </div>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell wide>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <StepBadge step={2} label="Secure Checkout" />
          <h1 className="mt-2 text-2xl sm:text-3xl font-extrabold text-slate-900 font-display">
            Order Finalization
          </h1>
        </div>

        <div className="flex items-center gap-2 text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-lg">
          <Lock className="w-3.5 h-3.5 text-emerald-600" />
          <span>Simulated 256-Bit SSL Encrypted</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Checkout Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Section 1: Shipping Address */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2.5 text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">
              <MapPin className="w-4 h-4 text-emerald-600" />
              <span>1. Shipping Destination</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-xs font-semibold text-slate-900 focus:border-emerald-600 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Street Address
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-xs font-semibold text-slate-900 focus:border-emerald-600 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">City / Region</label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-xs font-semibold text-slate-900 focus:border-emerald-600 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Postal Code</label>
                <input
                  type="text"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-xs font-semibold text-slate-900 focus:border-emerald-600 focus:outline-hidden"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Delivery Speed */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2.5 text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">
              <Truck className="w-4 h-4 text-emerald-600" />
              <span>2. Delivery Speed & Carrier</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {SHIPPING_METHODS.map((method) => {
                const isSelected = shippingMethod === method.id;
                const cost = subtotal >= 1000 && method.id === "standard" ? 0 : method.price;

                return (
                  <button
                    key={method.id}
                    type="button"
                    onClick={() => setShippingMethod(method.id)}
                    className={`p-4 rounded-xl border text-left flex items-start justify-between cursor-pointer transition-all ${
                      isSelected
                        ? "border-emerald-600 bg-emerald-50/40 shadow-xs"
                        : "border-slate-200 hover:border-slate-300 bg-white"
                    }`}
                  >
                    <div>
                      <p className="text-xs font-bold text-slate-900">{method.title}</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">{method.time}</p>
                    </div>
                    <span className="text-xs font-extrabold text-slate-900 font-display">
                      {cost === 0 ? "FREE" : formatCoins(cost)}
                    </span>
                  </button>
                );
              })}
            </div>

            <label className="flex items-center gap-2.5 p-3 rounded-xl border border-slate-200 bg-slate-50 cursor-pointer text-xs font-semibold text-slate-800">
              <input
                type="checkbox"
                checked={giftWrap}
                onChange={(e) => setGiftWrap(e.target.checked)}
                className="w-4 h-4 text-emerald-600 rounded"
              />
              <Gift className="w-4 h-4 text-emerald-600" />
              <span>Include Gift Packaging & Handwritten Note (+25c)</span>
            </label>
          </div>

          {/* Section 3: Payment Method */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2.5 text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">
              <CreditCard className="w-4 h-4 text-emerald-600" />
              <span>3. Payment Simulation</span>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setPaymentMethod("card")}
                className={`flex-1 py-3 px-4 rounded-xl border flex items-center justify-center gap-2 text-xs font-bold transition-all cursor-pointer ${
                  paymentMethod === "card"
                    ? "border-emerald-600 bg-emerald-50/50 text-emerald-950"
                    : "border-slate-200 bg-white text-slate-600"
                }`}
              >
                <CreditCard className="w-4 h-4" />
                <span>Simulated Card</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod("wallet")}
                className={`flex-1 py-3 px-4 rounded-xl border flex items-center justify-center gap-2 text-xs font-bold transition-all cursor-pointer ${
                  paymentMethod === "wallet"
                    ? "border-emerald-600 bg-emerald-50/50 text-emerald-950"
                    : "border-slate-200 bg-white text-slate-600"
                }`}
              >
                <Wallet className="w-4 h-4" />
                <span>Whim Account Wallet</span>
              </button>
            </div>

            {paymentMethod === "card" ? (
              <div className="space-y-3 pt-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Card Number (Demo Sandbox)
                  </label>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-xs font-mono font-bold text-slate-900 focus:border-emerald-600 focus:outline-hidden"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Expiry</label>
                    <input
                      type="text"
                      defaultValue="12/28"
                      className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-xs font-mono font-semibold text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">CVC</label>
                    <input
                      type="text"
                      defaultValue="888"
                      className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-xs font-mono font-semibold text-slate-900"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 text-xs space-y-1">
                <p className="font-bold text-emerald-900">
                  Instant Debit from Active Whim Account Wallet
                </p>
                <p className="text-emerald-700">
                  Total will be deducted automatically upon order authorization.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Order Summary & Placement */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <h2 className="text-base font-extrabold text-slate-900 font-display">
              Review Bag ({lines.length} items)
            </h2>

            <ul className="space-y-3 max-h-64 overflow-y-auto pr-1">
              {lines.map((line) => (
                <li
                  key={line.product.id}
                  className="flex items-center justify-between text-xs gap-3"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="w-8 h-8 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0 overflow-hidden">
                      {line.product.images && line.product.images[0] ? (
                        <img
                          src={line.product.images[0]}
                          alt={line.product.name}
                          referrerPolicy="no-referrer"
                          onError={(e) => {
                            const target = e.currentTarget;
                            if (!target.src.includes("photo-1523275335684-37898b6baf30")) {
                              target.src =
                                "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100&auto=format&fit=crop&q=80";
                            }
                          }}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-sm">{line.product.emoji || "📦"}</span>
                      )}
                    </span>
                    <div className="min-w-0">
                      <p className="font-bold text-slate-900 truncate">{line.product.name}</p>
                      <p className="text-[11px] text-slate-500">Qty: {line.quantity}</p>
                    </div>
                  </div>
                  <span className="font-bold text-slate-900 shrink-0 font-display">
                    {formatCoins(line.lineTotal)}
                  </span>
                </li>
              ))}
            </ul>

            <dl className="space-y-2 text-xs text-slate-600 border-t border-slate-100 pt-3">
              <div className="flex justify-between">
                <dt>Subtotal</dt>
                <dd className="font-bold text-slate-900">{formatCoins(subtotal)}</dd>
              </div>
              <div className="flex justify-between">
                <dt>Shipping</dt>
                <dd className="font-bold text-slate-900">
                  {shippingCost === 0 ? (
                    <span className="text-emerald-700">FREE</span>
                  ) : (
                    formatCoins(shippingCost)
                  )}
                </dd>
              </div>
              {giftWrap && (
                <div className="flex justify-between">
                  <dt>Gift Wrapping</dt>
                  <dd className="font-bold text-slate-900">{formatCoins(giftCost)}</dd>
                </div>
              )}
              <div className="flex justify-between items-baseline pt-2 border-t border-slate-100 text-sm font-extrabold text-slate-900">
                <dt>Total</dt>
                <dd className="text-xl font-display">{formatCoins(total)}</dd>
              </div>
            </dl>

            <button
              type="button"
              disabled={isProcessing}
              onClick={handlePlaceOrder}
              className="w-full py-3.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer disabled:opacity-50"
            >
              {isProcessing ? (
                <span>Processing Order...</span>
              ) : (
                <>
                  <span>Authorize & Place Order</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <p className="text-[11px] text-center text-slate-500">
              By confirming, your order will be dispatched to the merchant network.
            </p>
          </div>

          <FictionalNotice />
        </div>
      </div>
    </PageShell>
  );
}
