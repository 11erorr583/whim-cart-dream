import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect } from "react";
import {
  Award,
  CheckCircle2,
  TrendingDown,
  Gift,
  ShoppingBag,
  RotateCcw,
  Sparkles,
  Package,
} from "lucide-react";

import { FictionalNotice } from "@/components/fictional/FictionalNotice";
import { PageShell } from "@/components/fictional/PageShell";
import { StepBadge } from "@/components/fictional/StepBadge";
import { getPersonality } from "@/data/personalities";
import { formatCoins } from "@/lib/fictional-config";
import { useSession } from "@/state/session";

export const Route = createFileRoute("/result")({
  head: () => ({
    meta: [
      { title: "Delivery Complete & Rewards Scorecard — Whim Cart" },
      {
        name: "description",
        content:
          "View your order completion receipt, loyalty rewards, and merchant transaction summary.",
      },
      { property: "og:title", content: "Order Complete — Whim Cart" },
      {
        property: "og:description",
        content: "Final order fulfillment score and shopping summary.",
      },
    ],
  }),
  component: ResultPage,
});

function ResultPage() {
  const { session, finishExperience } = useSession();
  const order = session.order;
  const result = session.result;
  const personality = getPersonality(session.personalityId);

  useEffect(() => {
    if (order && !result) finishExperience();
  }, [order, result, finishExperience]);

  if (!order || !result) {
    return (
      <PageShell>
        <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center my-8 shadow-xs">
          <h1 className="text-2xl font-bold text-slate-900">No completed orders found</h1>
          <p className="mt-2 text-sm text-slate-500">Shop our independent artisan catalog first.</p>
          <div className="mt-6">
            <Link
              to="/catalog"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs"
            >
              Browse Catalog
            </Link>
          </div>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell wide>
      <div className="max-w-3xl mx-auto space-y-6">
        <StepBadge step={6} label="Fulfillment Complete" />

        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-6 text-center">
          <div className="w-16 h-16 rounded-2xl bg-emerald-100 border border-emerald-200 flex items-center justify-center mx-auto text-3xl">
            {result.badge || "🏆"}
          </div>

          <div>
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
              Transaction Completed
            </span>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 font-display mt-1">
              {result.verdict}
            </h1>
            <p className="text-sm text-slate-600 max-w-lg mx-auto mt-2">{result.summary}</p>
          </div>

          {/* Metrics Trio */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                Total Authorized
              </span>
              <span className="text-xl font-extrabold text-slate-900 font-display">
                {formatCoins(result.spent)}
              </span>
            </div>

            <div className="p-4 bg-emerald-50/50 rounded-xl border border-emerald-200">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 block mb-1">
                Merchant Discounts
              </span>
              <span className="text-xl font-extrabold text-emerald-950 font-display">
                {formatCoins(result.saved)}
              </span>
            </div>

            <div className="p-4 bg-amber-50/50 rounded-xl border border-amber-200">
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700 block mb-1">
                Loyalty Points Earned
              </span>
              <span className="text-xl font-extrabold text-amber-950 font-display">
                +{result.rewardPoints.toLocaleString("en-US")} pts
              </span>
            </div>
          </div>

          {/* Purchased Items List */}
          <div className="text-left pt-2 border-t border-slate-100 space-y-3">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Fulfilled Order Items
            </h3>
            <div className="divide-y divide-slate-100 bg-slate-50 rounded-xl border border-slate-200 overflow-hidden">
              {order.lines.map((line) => (
                <div
                  key={line.productId}
                  className="p-3.5 flex items-center justify-between text-xs gap-3"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-sm">
                      {line.emoji || "📦"}
                    </span>
                    <div>
                      <p className="font-bold text-slate-900">{line.name}</p>
                      <p className="text-[11px] text-slate-500">Qty: {line.quantity}</p>
                    </div>
                  </div>
                  <span className="font-bold text-slate-900 font-display">
                    {formatCoins(line.unitPrice * line.quantity)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Action CTAs */}
          <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/catalog"
              className="px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-2 transition-colors cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Continue Shopping</span>
            </Link>

            <Link
              to="/replay"
              className="px-5 py-3 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs flex items-center gap-2 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Session Management</span>
            </Link>
          </div>
        </div>

        <FictionalNotice />
      </div>
    </PageShell>
  );
}
