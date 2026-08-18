import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";

import { FictionalNotice } from "@/components/fictional/FictionalNotice";
import { PageShell } from "@/components/fictional/PageShell";
import { PopButton, PopLink } from "@/components/fictional/PopButton";
import { StepBadge } from "@/components/fictional/StepBadge";
import { useSession } from "@/state/session";

export const Route = createFileRoute("/call")({
  head: () => ({
    meta: [
      { title: "Simulated Delivery Call — Pretendly" },
      {
        name: "description",
        content:
          "A pretend in-browser call from your imaginary courier. No phone numbers, no real calls.",
      },
      { property: "og:title", content: "Simulated Delivery Call — Pretendly" },
      { property: "og:description", content: "Answer the fictional courier. Nothing is dialled." },
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
      { from: "courier", text: `Hello! ${order.courierName} here with order ${order.id}.` },
      { from: "you", text: "Hi! Is it really here?" },
      {
        from: "courier",
        text: `As real as anything in this game: your ${first?.name ?? "parcel"} is sitting at your imaginary drop point.`,
      },
      { from: "you", text: "Do I owe you anything?" },
      {
        from: "courier",
        text: "Not a coin. Nothing here costs money — it's all fictional, remember?",
      },
      { from: "courier", text: "Enjoy your pretend haul. I'm off to deliver a cloud." },
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
    const id = window.setTimeout(() => setStep((s) => s + 1), 1600);
    return () => window.clearTimeout(id);
  }, [answered, step, script.length]);

  if (!order) {
    return (
      <PageShell>
        <h1 className="text-4xl font-extrabold">Nobody is calling</h1>
        <FictionalNotice className="mt-5" />
        <PopLink to="/catalog" className="mt-6">
          Start shopping
        </PopLink>
      </PageShell>
    );
  }

  const finished = answered && step >= script.length;

  const endCall = () => {
    completeCall();
    void navigate({ to: "/result" });
  };

  return (
    <PageShell>
      <StepBadge step={9} label="Courier call" />
      <h1 className="mt-4 text-4xl font-extrabold sm:text-5xl">Simulated delivery call</h1>
      <FictionalNotice className="mt-5" />
      <p className="mt-3 text-sm text-muted-foreground">
        This call happens entirely in your browser. No phone number is used and no call is placed.
      </p>

      <div className="card-pop mt-6 p-6 sm:p-8">
        <div className="flex items-center gap-4">
          <span
            className={`flex size-16 items-center justify-center rounded-full border-2 border-ink bg-mint text-3xl ${
              answered ? "" : "animate-pulse"
            }`}
            aria-hidden="true"
          >
            {order.courierEmoji}
          </span>
          <div>
            <p className="font-display text-2xl font-extrabold">{order.courierName}</p>
            <p className="font-mono text-sm text-muted-foreground" aria-live="polite">
              {answered
                ? `Fictional call · ${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(
                    seconds % 60,
                  ).padStart(2, "0")}`
                : "Incoming pretend call…"}
            </p>
          </div>
        </div>

        {!answered ? (
          <div className="mt-8 flex flex-wrap gap-3">
            <PopButton size="lg" variant="mint" onClick={() => setAnswered(true)}>
              Answer 📞
            </PopButton>
            <PopButton size="lg" variant="ghost" onClick={endCall}>
              Decline & see result
            </PopButton>
          </div>
        ) : (
          <>
            <ul className="mt-6 space-y-3" aria-live="polite">
              {script.slice(0, step).map((beat, index) => (
                <li
                  key={index}
                  className={`max-w-[85%] rounded-xl border-2 border-ink px-4 py-2 text-sm font-semibold ${
                    beat.from === "courier" ? "bg-secondary" : "ml-auto bg-accent/40"
                  }`}
                >
                  <span className="block font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                    {beat.from === "courier" ? order.courierName : "You"}
                  </span>
                  {beat.text}
                </li>
              ))}
            </ul>

            <div className="mt-8 flex flex-wrap gap-3">
              <PopButton size="lg" onClick={endCall}>
                {finished ? "End call & see result" : "Hang up"}
              </PopButton>
            </div>
          </>
        )}
      </div>
    </PageShell>
  );
}
