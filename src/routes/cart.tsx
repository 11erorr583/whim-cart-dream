import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShieldCheck,
  Truck,
  RotateCcw,
} from "lucide-react";

import { FictionalNotice } from "@/components/fictional/FictionalNotice";
import { PageShell } from "@/components/fictional/PageShell";
import { StepBadge } from "@/components/fictional/StepBadge";
import { FICTIONAL_SHIPPING, formatCoins } from "@/lib/fictional-config";
import { buildCartLines, cartSubtotal } from "@/lib/shopping-logic";
import { useSession } from "@/state/session";

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [
      { title: "Shopping Cart — Whim Cart Marketplace" },
      {
        name: "description",
        content: "Review and manage items in your shopping bag before secure checkout.",
      },
      { property: "og:title", content: "Shopping Cart — Whim Cart" },
      { property: "og:description", content: "Review items in your active shopping bag." },
    ],
  }),
  component: CartPage,
});

function CartPage() {
  const { session, setQuantity, removeFromCart, clearCart } = useSession();
  const lines = buildCartLines(session.cart);
  const subtotal = cartSubtotal(session.cart);
  const shipping = lines.length ? (subtotal >= 1000 ? 0 : FICTIONAL_SHIPPING) : 0;
  const total = subtotal + shipping;

  return (
    <PageShell wide>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <StepBadge step={1} label="Cart Review" />
          <h1 className="mt-2 text-2xl sm:text-3xl font-extrabold text-slate-900 font-display">
            Shopping Cart ({lines.reduce((sum, item) => sum + item.quantity, 0)} items)
          </h1>
        </div>
        <Link
          to="/catalog"
          className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
        >
          <span>Continue Shopping</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {lines.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-xs max-w-lg mx-auto my-8">
          <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-4 text-slate-400">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">Your shopping bag is empty</h2>
          <p className="mt-2 text-sm text-slate-500 max-w-xs mx-auto">
            Discover bespoke gear, artisan electronics, and handcrafted goods from independent
            creators.
          </p>
          <div className="mt-6">
            <Link
              to="/catalog"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm transition-colors"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Explore Marketplace</span>
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Item List */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white rounded-2xl border border-slate-200 divide-y divide-slate-100 shadow-xs overflow-hidden">
              {lines.map((line) => (
                <div
                  key={line.product.id}
                  className="p-4 sm:p-5 flex flex-wrap sm:flex-nowrap gap-4 items-center"
                >
                  {/* Thumbnail */}
                  <div className="w-20 h-20 rounded-xl bg-slate-100 border border-slate-200 shrink-0 overflow-hidden flex items-center justify-center">
                    {line.product.images && line.product.images[0] ? (
                      <img
                        src={line.product.images[0]}
                        alt={line.product.name}
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          const target = e.currentTarget;
                          if (!target.src.includes("photo-1523275335684-37898b6baf30")) {
                            target.src =
                              "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&auto=format&fit=crop&q=80";
                          }
                        }}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-3xl">{line.product.emoji || "📦"}</span>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-[180px]">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded uppercase">
                        {line.product.category}
                      </span>
                    </div>
                    <Link
                      to="/product/$productId"
                      params={{ productId: line.product.id }}
                      className="font-bold text-sm text-slate-900 hover:text-emerald-700 transition-colors line-clamp-1"
                    >
                      {line.product.name}
                    </Link>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Unit Price: {formatCoins(line.product.price)}
                    </p>
                  </div>

                  {/* Quantity Stepper */}
                  <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-slate-50">
                    <button
                      type="button"
                      onClick={() => setQuantity(line.product.id, line.quantity - 1)}
                      className="w-8 h-8 flex items-center justify-center hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-9 text-center font-bold text-xs text-slate-900">
                      {line.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQuantity(line.product.id, line.quantity + 1)}
                      className="w-8 h-8 flex items-center justify-center hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Item Total */}
                  <div className="text-right min-w-[90px]">
                    <span className="text-base font-extrabold text-slate-900 font-display">
                      {formatCoins(line.lineTotal)}
                    </span>
                  </div>

                  {/* Remove Button */}
                  <button
                    type="button"
                    onClick={() => removeFromCart(line.product.id)}
                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={clearCart}
                className="text-xs font-semibold text-rose-600 hover:underline cursor-pointer"
              >
                Clear entire cart
              </button>

              <div className="flex items-center gap-4 text-xs text-slate-500">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Buyer Protection Active
                </span>
                <span className="flex items-center gap-1">
                  <Truck className="w-3.5 h-3.5 text-slate-600" /> Free Dispatch &gt; 1,000c
                </span>
              </div>
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
              <h2 className="text-base font-extrabold text-slate-900 font-display">
                Order Summary
              </h2>

              <dl className="space-y-2.5 text-xs text-slate-600 border-b border-slate-100 pb-4">
                <div className="flex justify-between">
                  <dt>Subtotal</dt>
                  <dd className="font-bold text-slate-900">{formatCoins(subtotal)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt>Standard Shipping</dt>
                  <dd className="font-bold text-slate-900">
                    {shipping === 0 ? (
                      <span className="text-emerald-700 font-bold">FREE</span>
                    ) : (
                      formatCoins(shipping)
                    )}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt>Estimated Tax</dt>
                  <dd className="font-bold text-slate-900">{formatCoins(0)}</dd>
                </div>
              </dl>

              <div className="flex justify-between items-baseline pt-1">
                <span className="text-sm font-extrabold text-slate-900">Total</span>
                <span className="text-xl font-extrabold text-slate-900 font-display">
                  {formatCoins(total)}
                </span>
              </div>

              <Link
                to="/checkout"
                className="w-full py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Trust Assurances */}
            <div className="bg-slate-50 rounded-2xl border border-slate-200 p-4 space-y-3 text-xs text-slate-600">
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Encrypted simulated checkout processing</span>
              </div>
              <div className="flex items-center gap-2.5">
                <RotateCcw className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>30-day merchant returns accepted</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Truck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Express courier tracking included</span>
              </div>
            </div>
          </div>
        </div>
      )}

      <FictionalNotice className="mt-12" />
    </PageShell>
  );
}
