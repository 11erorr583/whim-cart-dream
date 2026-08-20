import { createFileRoute, Link } from "@tanstack/react-router";
import {
  CheckCircle2,
  Package,
  Truck,
  ArrowRight,
  Printer,
  ShieldCheck,
  Clock,
} from "lucide-react";

import { FictionalNotice } from "@/components/fictional/FictionalNotice";
import { PageShell } from "@/components/fictional/PageShell";
import { StepBadge } from "@/components/fictional/StepBadge";
import { formatCoins } from "@/lib/fictional-config";
import { useSession } from "@/state/session";

export const Route = createFileRoute("/order")({
  head: () => ({
    meta: [
      { title: "Order Confirmed — Whim Cart Marketplace" },
      {
        name: "description",
        content:
          "Your order has been authorized and forwarded to independent merchants for fulfillment.",
      },
      { property: "og:title", content: "Order Confirmed — Whim Cart" },
      {
        property: "og:description",
        content: "Your merchant order is confirmed and tracking is active.",
      },
    ],
  }),
  component: OrderPage,
});

function OrderPage() {
  const { session } = useSession();
  const order = session.order;

  if (!order) {
    return (
      <PageShell>
        <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center my-8 shadow-xs">
          <h1 className="text-2xl font-bold text-slate-900">No active order found</h1>
          <p className="mt-2 text-sm text-slate-500">
            Start browsing the marketplace to assemble your bag.
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
      <div className="max-w-3xl mx-auto space-y-6">
        <StepBadge step={3} label="Order Confirmed" />

        {/* Hero Confirmation Banner */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 border border-emerald-200 flex items-center justify-center text-emerald-700 shrink-0">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
                Payment Authorized & Verified
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display">
                Thank you for your order!
              </h1>
            </div>
          </div>

          <p className="text-sm text-slate-600">
            We've sent a simulated confirmation receipt to your account. Your package is currently
            being packaged for shipment.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-xs">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-500 block text-[11px]">Order Reference</span>
              <span className="font-mono font-bold text-slate-900">{order.id}</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-500 block text-[11px]">Order Date</span>
              <span className="font-bold text-slate-900">
                {new Date(order.createdAt).toLocaleDateString()}
              </span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-500 block text-[11px]">Total Paid</span>
              <span className="font-extrabold text-slate-900 font-display">
                {formatCoins(order.total)}
              </span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-500 block text-[11px]">Assigned Carrier</span>
              <span className="font-bold text-slate-900 truncate block">
                {order.courierEmoji} {order.courierName}
              </span>
            </div>
          </div>
        </div>

        {/* Order Details & Items */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <h2 className="text-base font-extrabold text-slate-900 font-display flex items-center gap-2">
              <Package className="w-4 h-4 text-emerald-600" />
              <span>Purchased Merchandise ({order.lines.length})</span>
            </h2>
            <button
              type="button"
              onClick={() => window.print()}
              className="text-xs font-bold text-slate-600 hover:text-slate-900 flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Invoice</span>
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {order.lines.map((line) => (
              <div
                key={line.productId}
                className="py-3 flex items-center justify-between gap-4 text-xs"
              >
                <div className="flex items-center gap-3">
                  <span className="w-10 h-10 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-lg shrink-0">
                    {line.emoji || "📦"}
                  </span>
                  <div>
                    <p className="font-bold text-slate-900">{line.name}</p>
                    <p className="text-slate-500 text-[11px]">
                      Quantity: {line.quantity} × {formatCoins(line.unitPrice)}
                    </p>
                  </div>
                </div>

                <span className="font-bold text-slate-900 font-display text-sm">
                  {formatCoins(line.unitPrice * line.quantity)}
                </span>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Covered by Whim Buyer Protection Plan</span>
            </div>

            <div className="flex items-center gap-3">
              <Link
                to="/delivery"
                className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-2 transition-colors cursor-pointer"
              >
                <Truck className="w-4 h-4" />
                <span>Track Live Courier Dispatch</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>

        <FictionalNotice />
      </div>
    </PageShell>
  );
}
