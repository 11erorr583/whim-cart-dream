import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";

import { FictionalNotice } from "@/components/fictional/FictionalNotice";
import { PageShell } from "@/components/fictional/PageShell";
import { PopLink } from "@/components/fictional/PopButton";
import { StepBadge } from "@/components/fictional/StepBadge";
import { getPersonality } from "@/data/personalities";
import { formatCoins } from "@/lib/fictional-config";
import { useSession } from "@/state/session";

export const Route = createFileRoute("/result")({
  head: () => ({
    meta: [
      { title: "Your Fictional Shopping Result — Pretendly" },
      {
        name: "description",
        content: "See your pretend haul, fictional spend, reward points and shopper verdict.",
      },
      { property: "og:title", content: "Your Fictional Shopping Result — Pretendly" },
      { property: "og:description", content: "The final scorecard of an imaginary spree." },
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
        <h1 className="text-4xl font-extrabold">No fictional spree to score yet</h1>
        <FictionalNotice className="mt-5" />
        <PopLink to="/catalog" className="mt-6">
          Start shopping
        </PopLink>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <StepBadge step={10} label="Final result" />
      <div className="card-pop mt-4 overflow-hidden">
        <div className="fictional-stripe h-4" aria-hidden="true" />
        <div className="p-6 text-center sm:p-10">
          <p className="text-6xl" aria-hidden="true">
            {result.badge}
          </p>
          <h1 className="mt-3 text-4xl font-extrabold sm:text-5xl">{result.verdict}</h1>
          <p className="mt-2 text-muted-foreground">{result.summary}</p>

          <dl className="mt-7 grid gap-3 sm:grid-cols-3">
            {[
              { label: "Fictionally spent", value: formatCoins(result.spent) },
              { label: "Pretend savings", value: formatCoins(result.saved) },
              { label: "Reward points", value: result.rewardPoints.toLocaleString("en-US") },
            ].map((stat) => (
              <div key={stat.label} className="rounded-lg border-2 border-ink bg-mint/60 px-4 py-3">
                <dt className="font-mono text-xs font-bold uppercase tracking-widest">
                  {stat.label}
                </dt>
                <dd className="mt-1 font-display text-2xl font-extrabold">{stat.value}</dd>
              </div>
            ))}
          </dl>

          <ul className="mt-6 space-y-2 text-left">
            {order.lines.map((line) => (
              <li
                key={line.productId}
                className="flex items-center justify-between gap-3 rounded-lg border-2 border-ink bg-secondary/50 px-3 py-2 text-sm font-semibold"
              >
                <span>
                  <span aria-hidden="true">{line.emoji}</span> {line.name} ×{line.quantity}
                </span>
                <span className="font-mono">{formatCoins(line.unitPrice * line.quantity)}</span>
              </li>
            ))}
          </ul>

          <p className="mt-5 text-sm text-muted-foreground">
            Played as {personality ? `${personality.emoji} ${personality.name}` : "a mystery shopper"} ·
            courier call {result.callCompleted ? "answered" : "declined"}
          </p>

          <FictionalNotice className="mt-6 text-left" />

          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <PopLink to="/replay" size="lg" variant="accent">
              Replay the experience 🔁
            </PopLink>
            <PopLink to="/catalog" size="lg" variant="ghost">
              Keep browsing
            </PopLink>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
