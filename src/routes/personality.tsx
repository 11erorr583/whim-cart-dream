import { createFileRoute, useNavigate } from "@tanstack/react-router";

import { FictionalNotice } from "@/components/fictional/FictionalNotice";
import { PageShell } from "@/components/fictional/PageShell";
import { PopButton } from "@/components/fictional/PopButton";
import { StepBadge } from "@/components/fictional/StepBadge";
import { PERSONALITIES } from "@/data/personalities";
import { CURRENCY_LABEL, formatCoins } from "@/lib/fictional-config";
import { useSession } from "@/state/session";

export const Route = createFileRoute("/personality")({
  head: () => ({
    meta: [
      { title: "Choose Your Shopping Personality — Pretendly" },
      {
        name: "description",
        content:
          "Impulse Buyer, Window Shopper, Delusional Millionaire or Responsible Adult — pick the shopper you play as.",
      },
      { property: "og:title", content: "Choose Your Shopping Personality — Pretendly" },
      {
        property: "og:description",
        content: "Four archetypes, four fictional wallets, four very different carts.",
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
      <StepBadge step={2} label="Personality" />
      <h1 className="mt-4 text-4xl font-extrabold sm:text-5xl">Pick your shopping personality</h1>
      <p className="mt-3 max-w-2xl text-lg text-muted-foreground">
        Your choice sets your fictional wallet, your reward multiplier, and the voice in your head
        while you browse.
      </p>

      <ul className="mt-8 grid gap-4 sm:grid-cols-2">
        {PERSONALITIES.map((p) => {
          const selected = session.personalityId === p.id;
          return (
            <li key={p.id}>
              <button
                type="button"
                onClick={() => pick(p.id)}
                aria-pressed={selected}
                className={`card-pop h-full w-full p-6 text-left transition-transform duration-150 hover:-translate-y-1 ${
                  selected ? "bg-mint shadow-pop" : ""
                }`}
              >
                <span aria-hidden="true" className="text-4xl">
                  {p.emoji}
                </span>
                <h2 className="mt-3 text-2xl font-extrabold">{p.name}</h2>
                <p className="font-semibold text-primary">{p.tagline}</p>
                <p className="mt-2 text-sm text-muted-foreground">{p.description}</p>
                <dl className="mt-4 flex flex-wrap gap-2 font-mono text-xs font-bold">
                  <div className="rounded-full border-2 border-ink bg-card px-3 py-1">
                    <dt className="sr-only">Fictional wallet</dt>
                    <dd title={CURRENCY_LABEL}>Wallet {formatCoins(p.startingWallet)}</dd>
                  </div>
                  <div className="rounded-full border-2 border-ink bg-card px-3 py-1">
                    <dt className="sr-only">Reward multiplier</dt>
                    <dd>Points ×{p.rewardMultiplier}</dd>
                  </div>
                </dl>
                <p className="mt-4 font-semibold underline">
                  {selected ? "Selected — continue shopping" : "Play as this shopper"}
                </p>
              </button>
            </li>
          );
        })}
      </ul>

      {session.personalityId ? (
        <div className="mt-8">
          <PopButton size="lg" variant="accent" onClick={() => void navigate({ to: "/catalog" })}>
            Go to the catalog →
          </PopButton>
        </div>
      ) : null}

      <FictionalNotice className="mt-8 max-w-2xl" />
    </PageShell>
  );
}
