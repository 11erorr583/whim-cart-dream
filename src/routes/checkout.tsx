import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";

import { FictionalNotice } from "@/components/fictional/FictionalNotice";
import { PageShell } from "@/components/fictional/PageShell";
import { PopButton, PopLink } from "@/components/fictional/PopButton";
import { StepBadge } from "@/components/fictional/StepBadge";
import { getPersonality } from "@/data/personalities";
import { FICTIONAL_SHIPPING, formatCoins } from "@/lib/fictional-config";
import { buildCartLines, cartSubtotal, rewardPointsFor } from "@/lib/shopping-logic";
import { useSession } from "@/state/session";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "Fictional Checkout — Pretendly" },
      {
        name: "description",
        content:
          "A pretend checkout with no payment fields, no address fields and no real transaction.",
      },
      { property: "og:title", content: "Fictional Checkout — Pretendly" },
      { property: "og:description", content: "Confirm an order that will never exist." },
    ],
  }),
  component: CheckoutPage,
});

const DROP_POINTS = [
  { id: "cloud", label: "A passing cloud ☁️" },
  { id: "treehouse", label: "Imaginary treehouse 🌳" },
  { id: "moonbase", label: "Moon base, lobby 🌙" },
  { id: "sock-drawer", label: "Your sock drawer 🧦" },
];

function CheckoutPage() {
  const { session, placeOrder } = useSession();
  const navigate = useNavigate();
  const lines = buildCartLines(session.cart);
  const subtotal = cartSubtotal(session.cart);
  const total = subtotal + FICTIONAL_SHIPPING;
  const personality = getPersonality(session.personalityId);
  const [dropPoint, setDropPoint] = useState(DROP_POINTS[0]!.id);
  const [gift, setGift] = useState(false);

  const confirm = () => {
    const order = placeOrder();
    if (order) void navigate({ to: "/order" });
  };

  if (lines.length === 0) {
    return (
      <PageShell>
        <StepBadge step={6} label="Checkout" />
        <h1 className="mt-4 text-4xl font-extrabold">Nothing to pretend-buy</h1>
        <FictionalNotice className="mt-5" />
        <PopLink to="/catalog" className="mt-6">
          Back to catalog
        </PopLink>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <StepBadge step={6} label="Checkout" />
      <h1 className="mt-4 text-4xl font-extrabold sm:text-5xl">Fictional checkout</h1>
      <FictionalNotice className="mt-5" />
      <p className="mt-3 text-sm text-muted-foreground">
        We never ask for payment details, phone numbers, addresses or ID. There is nothing to pay
        and nothing to deliver.
      </p>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="card-pop p-6" aria-labelledby="pretend-details">
          <h2 id="pretend-details" className="text-2xl font-extrabold">
            Pretend delivery preferences
          </h2>
          <fieldset className="mt-4">
            <legend className="text-sm font-semibold">Imaginary drop point</legend>
            <div className="mt-2 space-y-2">
              {DROP_POINTS.map((point) => (
                <label
                  key={point.id}
                  className="flex cursor-pointer items-center gap-3 rounded-lg border-2 border-ink bg-secondary/50 px-3 py-2 font-semibold"
                >
                  <input
                    type="radio"
                    name="drop-point"
                    value={point.id}
                    checked={dropPoint === point.id}
                    onChange={() => setDropPoint(point.id)}
                    className="size-4"
                  />
                  {point.label}
                </label>
              ))}
            </div>
          </fieldset>

          <label className="mt-5 flex cursor-pointer items-center gap-3 font-semibold">
            <input
              type="checkbox"
              checked={gift}
              onChange={(e) => setGift(e.target.checked)}
              className="size-4"
            />
            Wrap it in imaginary paper 🎁
          </label>

          <p className="mt-6 rounded-lg border-2 border-dashed border-ink px-4 py-3 text-sm text-muted-foreground">
            No payment method is required or accepted. This screen collects zero personal
            information.
          </p>
        </section>

        <section className="card-pop h-fit p-6" aria-labelledby="order-summary">
          <h2 id="order-summary" className="text-2xl font-extrabold">
            Order summary
          </h2>
          <ul className="mt-4 space-y-2 text-sm">
            {lines.map((line) => (
              <li key={line.product.id} className="flex justify-between gap-3">
                <span>
                  <span aria-hidden="true">{line.product.emoji}</span> {line.product.name} ×
                  {line.quantity}
                </span>
                <span className="font-mono font-bold">{formatCoins(line.lineTotal)}</span>
              </li>
            ))}
          </ul>
          <dl className="mt-4 space-y-2 border-t-2 border-ink pt-3 text-sm">
            <div className="flex justify-between">
              <dt>Imaginary shipping</dt>
              <dd className="font-mono font-bold">{formatCoins(FICTIONAL_SHIPPING)}</dd>
            </div>
            <div className="flex justify-between text-lg">
              <dt className="font-extrabold">Fictional total</dt>
              <dd className="font-display font-extrabold">{formatCoins(total)}</dd>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <dt>Reward points {personality ? `(×${personality.rewardMultiplier})` : ""}</dt>
              <dd className="font-mono">
                {rewardPointsFor(total, session.personalityId).toLocaleString("en-US")}
              </dd>
            </div>
          </dl>

          <PopButton size="lg" className="mt-6 w-full" onClick={confirm}>
            Place fictional order
          </PopButton>
          <p className="mt-2 text-center text-xs text-muted-foreground">
            Nothing is charged. Nothing ships.
          </p>
        </section>
      </div>
    </PageShell>
  );
}
