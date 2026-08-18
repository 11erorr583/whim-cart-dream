import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { FictionalNotice } from "@/components/fictional/FictionalNotice";
import { PageShell } from "@/components/fictional/PageShell";
import { PopLink } from "@/components/fictional/PopButton";
import { PopButton } from "@/components/fictional/PopButton";
import { StepBadge } from "@/components/fictional/StepBadge";
import { DELIVERY_SECONDS } from "@/lib/fictional-config";
import { useSession } from "@/state/session";

export const Route = createFileRoute("/delivery")({
  head: () => ({
    meta: [
      { title: "Imaginary Delivery Countdown — Pretendly" },
      {
        name: "description",
        content: "Watch a pretend courier cross a fictional city. Nothing is really being shipped.",
      },
      { property: "og:title", content: "Imaginary Delivery Countdown — Pretendly" },
      { property: "og:description", content: "Your imaginary parcel is moving. Sort of." },
    ],
  }),
  component: DeliveryPage,
});

const STAGES = [
  "Packed by imaginary hands",
  "Left the pretend warehouse",
  "Stuck in fictional traffic",
  "Approaching your drop point",
  "Delivered (imaginarily)",
];

function DeliveryPage() {
  const { session, markDelivered } = useSession();
  const order = session.order;
  const [remaining, setRemaining] = useState(DELIVERY_SECONDS);
  const [skipped, setSkipped] = useState(false);

  useEffect(() => {
    if (!order) return;
    const tick = () =>
      setRemaining(Math.max(0, Math.ceil((order.deliveryAt - Date.now()) / 1000)));
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
        <h1 className="text-4xl font-extrabold">Nothing is being imagined for you yet</h1>
        <FictionalNotice className="mt-5" />
        <PopLink to="/catalog" className="mt-6">
          Start shopping
        </PopLink>
      </PageShell>
    );
  }

  const progress = delivered
    ? 100
    : Math.min(100, Math.round(((DELIVERY_SECONDS - remaining) / DELIVERY_SECONDS) * 100));
  const stageIndex = Math.min(STAGES.length - 1, Math.floor((progress / 100) * STAGES.length));

  return (
    <PageShell>
      <StepBadge step={8} label="Delivery" />
      <h1 className="mt-4 text-4xl font-extrabold sm:text-5xl">Imaginary delivery countdown</h1>
      <FictionalNotice className="mt-5" />

      <div className="card-pop mt-6 p-6 sm:p-8">
        <p className="font-mono text-xs font-bold uppercase tracking-widest text-muted-foreground">
          Order {order.id} • {order.courierEmoji} {order.courierName}
        </p>

        <p
          className="mt-4 text-center font-display text-7xl font-extrabold tabular-nums"
          aria-live="polite"
        >
          {delivered ? "00:00" : `00:${String(remaining).padStart(2, "0")}`}
        </p>
        <p className="text-center text-sm text-muted-foreground">
          {delivered ? "Your imaginary parcel has landed." : "Fictional seconds remaining"}
        </p>

        <div
          className="mt-6 h-5 w-full overflow-hidden rounded-full border-2 border-ink bg-secondary"
          role="progressbar"
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Imaginary delivery progress"
        >
          <div
            className="h-full bg-primary transition-[width] duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="relative mt-4 h-10" aria-hidden="true">
          <span
            className="absolute top-0 text-3xl transition-[left] duration-500"
            style={{ left: `calc(${progress}% - 1rem)` }}
          >
            {order.courierEmoji}
          </span>
        </div>

        <ol className="mt-4 space-y-2">
          {STAGES.map((stage, index) => (
            <li
              key={stage}
              className={`flex items-center gap-3 rounded-lg border-2 border-ink px-3 py-2 text-sm font-semibold ${
                index <= stageIndex ? "bg-mint" : "bg-secondary/40 text-muted-foreground"
              }`}
            >
              <span aria-hidden="true">{index <= stageIndex ? "✅" : "⏳"}</span>
              {stage}
            </li>
          ))}
        </ol>

        <div className="mt-7 flex flex-wrap gap-3">
          {delivered ? (
            <PopLink to="/call" size="lg" variant="accent">
              Answer the courier call 📞
            </PopLink>
          ) : (
            <>
              <PopButton size="lg" variant="accent" disabled>
                Waiting for the courier…
              </PopButton>
              <PopButton
                size="lg"
                variant="ghost"
                onClick={() => setSkipped(true)}
                aria-label="Skip the imaginary delivery countdown"
              >
                Skip the wait
              </PopButton>
            </>
          )}
        </div>

      </div>
    </PageShell>
  );
}
