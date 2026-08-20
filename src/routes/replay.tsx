import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { RotateCcw, Trash2, ArrowLeft, ShieldAlert, Sparkles } from "lucide-react";

import { FictionalNotice } from "@/components/fictional/FictionalNotice";
import { PageShell } from "@/components/fictional/PageShell";
import { StepBadge } from "@/components/fictional/StepBadge";
import { getPersonality } from "@/data/personalities";
import { useSession } from "@/state/session";

export const Route = createFileRoute("/replay")({
  head: () => ({
    meta: [
      { title: "Session Management & Reset — Whim Cart" },
      {
        name: "description",
        content: "Reset your shopping basket or restart demo buyer sessions.",
      },
      { property: "og:title", content: "Session Management — Whim Cart" },
      { property: "og:description", content: "Manage shopping run session state." },
    ],
  }),
  component: ReplayPage,
});

function ReplayPage() {
  const { session, resetExperience, clearCart } = useSession();
  const navigate = useNavigate();
  const personality = getPersonality(session.personalityId);

  const fullReset = () => {
    resetExperience();
    void navigate({ to: "/personality" });
  };

  return (
    <PageShell wide>
      <div className="max-w-2xl mx-auto space-y-6">
        <StepBadge step={7} label="Session Management" />

        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-3">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display">
            Session & State Management
          </h1>
          <p className="text-sm text-slate-600">
            Whim Cart maintains your active cart, merchant items, and order simulations in your
            browser session storage. You can clear current orders or start a new buyer profile run.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between space-y-4">
            <div>
              <h2 className="text-base font-extrabold text-slate-900 font-display flex items-center gap-2">
                <RotateCcw className="w-4 h-4 text-emerald-600" />
                <span>Keep Current Persona</span>
              </h2>
              <p className="text-xs text-slate-500 mt-2">
                Keep {personality ? `"${personality.name}"` : "your profile"} and start a fresh cart
                session with your wallet refreshed.
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                clearCart();
                void navigate({ to: "/catalog" });
              }}
              className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors cursor-pointer"
            >
              Start New Shopping Bag
            </button>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between space-y-4">
            <div>
              <h2 className="text-base font-extrabold text-rose-900 font-display flex items-center gap-2">
                <Trash2 className="w-4 h-4 text-rose-600" />
                <span>Full State Reset</span>
              </h2>
              <p className="text-xs text-slate-500 mt-2">
                Wipe all cached cart data, active orders, and return to buyer persona onboarding.
              </p>
            </div>

            <button
              type="button"
              onClick={fullReset}
              className="w-full py-2.5 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs transition-colors cursor-pointer"
            >
              Reset All Session State
            </button>
          </div>
        </div>

        <div className="pt-2 flex justify-start">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-900"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Marketplace Home</span>
          </Link>
        </div>

        <FictionalNotice />
      </div>
    </PageShell>
  );
}
