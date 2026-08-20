import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  Truck,
  CheckCircle2,
  Clock,
  MapPin,
  PhoneCall,
  ArrowRight,
  ShieldCheck,
  PackageCheck,
  FastForward,
} from "lucide-react";

import { FictionalNotice } from "@/components/fictional/FictionalNotice";
import { PageShell } from "@/components/fictional/PageShell";
import { StepBadge } from "@/components/fictional/StepBadge";
import { DELIVERY_SECONDS } from "@/lib/fictional-config";
import { useSession } from "@/state/session";

export const Route = createFileRoute("/delivery")({
  head: () => ({
    meta: [
      { title: "Live Courier Tracking — Whim Cart Marketplace" },
      {
        name: "description",
        content:
          "Track your shipment route in real-time with courier telemetry and checkpoint timestamps.",
      },
      { property: "og:title", content: "Live Courier Tracking — Whim Cart" },
      {
        property: "og:description",
        content: "Active logistics route tracking and delivery updates.",
      },
    ],
  }),
  component: DeliveryPage,
});

const LOGISTICS_MILESTONES = [
  {
    title: "Order Verified & Packed",
    detail: "Merchant fulfillment center completed quality check",
  },
  { title: "Dispatched from Regional Hub", detail: "Scanned into line-haul transport network" },
  { title: "Out for Final Mile Delivery", detail: "Assigned to dedicated courier route" },
  { title: "Arriving at Destination", detail: "Courier approaching delivery premises" },
  { title: "Delivered & Signed", detail: "Package safely handed over at drop point" },
];

function DeliveryPage() {
  const { session, markDelivered } = useSession();
  const order = session.order;
  const [remaining, setRemaining] = useState(DELIVERY_SECONDS);
  const [skipped, setSkipped] = useState(false);

  useEffect(() => {
    if (!order) return;
    const tick = () => setRemaining(Math.max(0, Math.ceil((order.deliveryAt - Date.now()) / 1000)));
    tick();
    const id = window.setInterval(tick, 500);
    return () => window.clearInterval(id);
  }, [order]);

  const delivered = skipped || remaining <= 0;

  useEffect(() => {
    if (delivered && order && order.status !== "delivered") markDelivered();
  }, [delivered, order, markDelivered]);

  if (!order) {
    return (
      <PageShell>
        <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center my-8 shadow-xs">
          <h1 className="text-2xl font-bold text-slate-900">No active delivery in progress</h1>
          <p className="mt-2 text-sm text-slate-500">Place an order to start live tracking.</p>
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

  const progress = delivered
    ? 100
    : Math.min(100, Math.round(((DELIVERY_SECONDS - remaining) / DELIVERY_SECONDS) * 100));
  const currentMilestoneIndex = Math.min(
    LOGISTICS_MILESTONES.length - 1,
    Math.floor((progress / 100) * LOGISTICS_MILESTONES.length),
  );

  return (
    <PageShell wide>
      <div className="max-w-3xl mx-auto space-y-6">
        <StepBadge step={4} label="Live Logistics Tracking" />

        {/* Courier Telemetry Header Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
                Tracking #{order.id}
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display">
                {delivered ? "Package Arrived" : "Shipment in Transit"}
              </h1>
            </div>

            <div className="flex items-center gap-3">
              <span className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 text-xl flex items-center justify-center">
                {order.courierEmoji}
              </span>
              <div>
                <p className="font-bold text-xs text-slate-900">{order.courierName}</p>
                <p className="text-[11px] text-slate-500">Dedicated Fleet Courier</p>
              </div>
            </div>
          </div>

          {/* Countdown & ETA */}
          <div className="bg-slate-900 rounded-2xl p-6 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                {delivered ? "Status: Complete" : "Estimated Arrival"}
              </span>
              <p className="text-4xl sm:text-5xl font-extrabold font-display tabular-nums mt-1">
                {delivered ? "Delivered" : `00:${String(remaining).padStart(2, "0")}`}
              </p>
              <p className="text-xs text-slate-400 mt-1">
                {delivered
                  ? "Carrier marked parcel safely received at your address."
                  : "Live telematics updating every 500ms."}
              </p>
            </div>

            {!delivered && (
              <button
                type="button"
                onClick={() => setSkipped(true)}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer self-start sm:self-center"
              >
                <FastForward className="w-4 h-4 text-emerald-400" />
                <span>Expedite Simulation</span>
              </button>
            )}
          </div>

          {/* Progress Bar */}
          <div>
            <div className="flex justify-between text-xs font-bold text-slate-700 mb-2">
              <span>Transit Progress</span>
              <span>{progress}%</span>
            </div>
            <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200">
              <div
                className="h-full bg-emerald-600 transition-[width] duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Logistics Milestones Checkpoints */}
          <div className="space-y-3 pt-2">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Transit Checkpoints
            </h3>

            <div className="space-y-2">
              {LOGISTICS_MILESTONES.map((milestone, idx) => {
                const isPassed = idx <= currentMilestoneIndex;
                const isCurrent = idx === currentMilestoneIndex;

                return (
                  <div
                    key={milestone.title}
                    className={`p-3.5 rounded-xl border flex items-start gap-3 transition-colors ${
                      isPassed
                        ? "bg-emerald-50/50 border-emerald-200"
                        : "bg-slate-50 border-slate-200 opacity-60"
                    }`}
                  >
                    <div className="mt-0.5">
                      {isPassed ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      ) : (
                        <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                      )}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p
                          className={`text-xs font-bold ${
                            isPassed ? "text-slate-900" : "text-slate-500"
                          }`}
                        >
                          {milestone.title}
                        </p>
                        {isCurrent && !delivered && (
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full animate-pulse">
                            Active Step
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">{milestone.detail}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Action Trigger */}
          <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Contactless Drop Confirmation Enabled</span>
            </div>

            {delivered ? (
              <Link
                to="/call"
                className="px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-2 transition-colors cursor-pointer"
              >
                <PhoneCall className="w-4 h-4 text-emerald-400" />
                <span>Answer Courier Call</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            ) : (
              <button
                type="button"
                disabled
                className="px-6 py-3 rounded-xl bg-slate-100 text-slate-400 font-bold text-xs flex items-center gap-2 cursor-not-allowed"
              >
                <Clock className="w-4 h-4" />
                <span>Awaiting Arrival...</span>
              </button>
            )}
          </div>
        </div>

        <FictionalNotice />
      </div>
    </PageShell>
  );
}
