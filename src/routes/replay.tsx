import { createFileRoute, useNavigate } from "@tanstack/react-router";

import { FictionalNotice } from "@/components/fictional/FictionalNotice";
import { PageShell } from "@/components/fictional/PageShell";
import { PopButton, PopLink } from "@/components/fictional/PopButton";
import { StepBadge } from "@/components/fictional/StepBadge";
import { getPersonality } from "@/data/personalities";
import { useSession } from "@/state/session";

export const Route = createFileRoute("/replay")({
  head: () => ({
    meta: [
      { title: "Replay or Reset — Pretendly" },
      {
        name: "description",
        content: "Clear your fictional session and play again as a different shopping personality.",
      },
      { property: "og:title", content: "Replay or Reset — Pretendly" },
      { property: "og:description", content: "Wipe the pretend slate and shop again." },
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
    <PageShell>
      <StepBadge step={11} label="Replay" />
      <h1 className="mt-4 text-4xl font-extrabold sm:text-5xl">Replay or reset</h1>
      <p className="mt-3 text-muted-foreground">
        Everything is stored locally in your browser as temporary gameplay state. Reset wipes it
        instantly.
      </p>
      <FictionalNotice className="mt-5" />

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <section className="card-pop p-6">
          <h2 className="text-2xl font-extrabold">Play again, same shopper</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Keep {personality ? `${personality.emoji} ${personality.name}` : "your personality"} and
            start a fresh fictional cart.
          </p>
          <PopButton
            className="mt-5"
            size="lg"
            onClick={() => {
              clearCart();
              void navigate({ to: "/catalog" });
            }}
          >
            New shopping run
          </PopButton>
        </section>

        <section className="card-pop p-6">
          <h2 className="text-2xl font-extrabold">Full reset</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Clears personality, cart, order, delivery state and final result from local storage.
          </p>
          <PopButton className="mt-5" size="lg" variant="ghost" onClick={fullReset}>
            Reset everything
          </PopButton>
        </section>
      </div>

      <div className="mt-8">
        <PopLink to="/" variant="ghost">
          ← Back to the landing page
        </PopLink>
      </div>
    </PageShell>
  );
}
