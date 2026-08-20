import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { UserCheck, Sparkles, Wallet, Check, ArrowRight, ShieldCheck } from "lucide-react";

import { FictionalNotice } from "@/components/fictional/FictionalNotice";
import { PageShell } from "@/components/fictional/PageShell";
import { StepBadge } from "@/components/fictional/StepBadge";
import { PERSONALITIES } from "@/data/personalities";
import { CURRENCY_LABEL, formatCoins } from "@/lib/fictional-config";
import { useSession } from "@/state/session";

export const Route = createFileRoute("/personality")({
  head: () => ({
    meta: [
      { title: "Select Shopper Profile & Budget — Whim Cart" },
      {
        name: "description",
        content:
          "Select your shopping profile persona, budget tier, and custom reward preferences.",
      },
      { property: "og:title", content: "Shopper Profile — Whim Cart" },
      {
        property: "og:description",
        content: "Select your buyer persona and wallet budget allocation.",
      },
    ],
  }),
  component: PersonalityPage,
});

function PersonalityPage() {
  const { session, choosePersonality } = useSession();
  const navigate = useNavigate();

  const pick = (id: (typeof PERSONALITIES)[number]["id"]) => {
    choosePersonality(id);
    void navigate({ to: "/catalog" });
  };

  return (
    <PageShell wide>
      <div className="max-w-4xl mx-auto space-y-6">
        <StepBadge step={1} label="Buyer Profile" />

        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 border border-emerald-200 flex items-center justify-center text-emerald-800">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
                Buyer Archetype
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display">
                Select Your Shopper Profile & Budget
              </h1>
            </div>
          </div>
          <p className="text-sm text-slate-600">
            Customize your shopping preference tier, starting spending allowance, and reward point
            multipliers across all independent merchant stores.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {PERSONALITIES.map((p) => {
            const selected = session.personalityId === p.id;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => pick(p.id)}
                aria-pressed={selected}
                className={`p-6 rounded-2xl border text-left transition-all relative flex flex-col justify-between cursor-pointer ${
                  selected
                    ? "bg-white border-emerald-600 shadow-md ring-2 ring-emerald-500/20"
                    : "bg-white border-slate-200 hover:border-slate-300 hover:shadow-xs"
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-2xl">
                        {p.emoji}
                      </span>
                      <div>
                        <h2 className="text-base font-extrabold text-slate-900 font-display">
                          {p.name}
                        </h2>
                        <span className="text-xs font-medium text-slate-500">{p.tagline}</span>
                      </div>
                    </div>

                    {selected && (
                      <span className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs shrink-0">
                        <Check className="w-3.5 h-3.5" />
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-600 mt-4 leading-relaxed">{p.description}</p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-slate-700">
                    <Wallet className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="font-bold">Budget: {formatCoins(p.startingWallet)}</span>
                  </div>

                  <span className="text-emerald-800 font-bold bg-emerald-50 px-2 py-0.5 rounded-full text-[11px] border border-emerald-200">
                    {p.rewardMultiplier}x Rewards
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {session.personalityId && (
          <div className="flex justify-end pt-2">
            <Link
              to="/catalog"
              className="px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-2 transition-colors cursor-pointer"
            >
              <span>Continue to Marketplace Catalog</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}

        <FictionalNotice />
      </div>
    </PageShell>
  );
}
