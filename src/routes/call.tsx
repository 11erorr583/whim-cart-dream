import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Phone, PhoneOff, Mic, User, ShieldCheck, CheckCircle2, ArrowRight } from "lucide-react";

import { FictionalNotice } from "@/components/fictional/FictionalNotice";
import { PageShell } from "@/components/fictional/PageShell";
import { StepBadge } from "@/components/fictional/StepBadge";
import { useSession } from "@/state/session";

export const Route = createFileRoute("/call")({
  head: () => ({
    meta: [
      { title: "Courier Delivery Call — Whim Cart Marketplace" },
      {
        name: "description",
        content: "Simulated courier phone dispatch verification and delivery confirmation.",
      },
      { property: "og:title", content: "Courier Delivery Call — Whim Cart" },
      {
        property: "og:description",
        content: "Voice handover confirmation with dedicated courier.",
      },
    ],
  }),
  component: CallPage,
});

interface Beat {
  from: "courier" | "you";
  text: string;
}

function CallPage() {
  const { session, completeCall } = useSession();
  const navigate = useNavigate();
  const order = session.order;
  const [answered, setAnswered] = useState(false);
  const [step, setStep] = useState(0);
  const [seconds, setSeconds] = useState(0);

  const script = useMemo<Beat[]>(() => {
    if (!order) return [];
    const first = order.lines[0];
    return [
      {
        from: "courier",
        text: `Hi Alex! This is ${order.courierName} with Whim Cart Logistics regarding order #${order.id}.`,
      },
      { from: "you", text: "Hello! Has the package arrived at the doorstep?" },
      {
        from: "courier",
        text: `Yes, your parcel containing "${first?.name ?? "merchandise"}" has been placed at your designated delivery point.`,
      },
      { from: "you", text: "Perfect, is there anything else needed?" },
      {
        from: "courier",
        text: "Everything is fully authorized and signed off! Thanks for shopping independent creators on Whim Cart.",
      },
      { from: "courier", text: "Have a wonderful rest of your day!" },
    ];
  }, [order]);

  useEffect(() => {
    if (!answered) return;
    const id = window.setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => window.clearInterval(id);
  }, [answered]);

  useEffect(() => {
    if (!answered) return;
    if (step >= script.length) return;
    const id = window.setTimeout(() => setStep((s) => s + 1), 1500);
    return () => window.clearTimeout(id);
  }, [answered, step, script.length]);

  if (!order) {
    return (
      <PageShell>
        <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center my-8 shadow-xs">
          <h1 className="text-2xl font-bold text-slate-900">No incoming dispatch call</h1>
          <p className="mt-2 text-sm text-slate-500">Explore items in the marketplace first.</p>
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

  const finished = answered && step >= script.length;

  const endCall = () => {
    completeCall();
    void navigate({ to: "/result" });
  };

  return (
    <PageShell wide>
      <div className="max-w-xl mx-auto space-y-6">
        <StepBadge step={5} label="Courier Verification" />

        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-md space-y-6 text-center">
          {/* Caller Avatar */}
          <div className="relative mx-auto w-24 h-24">
            <div
              className={`w-24 h-24 rounded-full bg-slate-900 border-4 border-white shadow-md flex items-center justify-center text-4xl ${
                answered ? "" : "animate-bounce"
              }`}
            >
              {order.courierEmoji}
            </div>
            {!answered && (
              <span className="absolute inset-0 rounded-full border-2 border-emerald-500 animate-ping opacity-75 pointer-events-none" />
            )}
          </div>

          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 font-display">
              {order.courierName}
            </h1>
            <p className="text-xs font-semibold text-slate-500 mt-0.5">
              Whim Logistics Courier • Order #{order.id}
            </p>
            <p className="text-xs font-mono text-emerald-700 font-bold mt-2">
              {answered
                ? `Active Call · ${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(
                    seconds % 60,
                  ).padStart(2, "0")}`
                : "Incoming Courier Voice Call..."}
            </p>
          </div>

          {!answered ? (
            <div className="flex items-center justify-center gap-4 pt-4">
              <button
                type="button"
                onClick={() => setAnswered(true)}
                className="px-6 py-3.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2 shadow-sm transition-transform active:scale-95 cursor-pointer"
              >
                <Phone className="w-4 h-4" />
                <span>Accept Call</span>
              </button>

              <button
                type="button"
                onClick={endCall}
                className="px-6 py-3.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-2 transition-transform active:scale-95 cursor-pointer"
              >
                <PhoneOff className="w-4 h-4 text-rose-500" />
                <span>Decline & View Summary</span>
              </button>
            </div>
          ) : (
            <div className="space-y-4 text-left">
              {/* Dialogue Transcript */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3 max-h-64 overflow-y-auto">
                {script.slice(0, step).map((beat, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-xl text-xs ${
                      beat.from === "courier"
                        ? "bg-white border border-slate-200 text-slate-800 mr-8 shadow-2xs"
                        : "bg-emerald-700 text-white ml-8"
                    }`}
                  >
                    <p
                      className={`text-[10px] font-bold uppercase tracking-wider mb-1 ${
                        beat.from === "courier" ? "text-slate-400" : "text-emerald-200"
                      }`}
                    >
                      {beat.from === "courier" ? order.courierName : "You"}
                    </p>
                    <p className="font-medium">{beat.text}</p>
                  </div>
                ))}
              </div>

              <div className="flex justify-center pt-2">
                <button
                  type="button"
                  onClick={endCall}
                  className="px-8 py-3.5 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
                >
                  <PhoneOff className="w-4 h-4 text-rose-400" />
                  <span>{finished ? "Complete Call & View Receipt" : "End Call"}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>

        <FictionalNotice />
      </div>
    </PageShell>
  );
}
