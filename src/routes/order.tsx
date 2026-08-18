import { createFileRoute } from "@tanstack/react-router";

import { FictionalNotice } from "@/components/fictional/FictionalNotice";
import { PageShell } from "@/components/fictional/PageShell";
import { PopLink } from "@/components/fictional/PopButton";
import { StepBadge } from "@/components/fictional/StepBadge";
import { formatCoins } from "@/lib/fictional-config";
import { useSession } from "@/state/session";

export const Route = createFileRoute("/order")({
  head: () => ({
    meta: [
      { title: "Fictional Order Confirmed — Pretendly" },
      {
        name: "description",
        content: "Your pretend order is confirmed. No purchase was made and no money was charged.",
      },
      { property: "og:title", content: "Fictional Order Confirmed — Pretendly" },
      { property: "og:description", content: "An imaginary courier is on the way." },
    ],
  }),
  component: OrderPage,
});

function OrderPage() {
  const { session } = useSession();
  const order = session.order;

  if (!order) {
    return (
      <PageShell>
        <h1 className="text-4xl font-extrabold">No fictional order yet</h1>
        <FictionalNotice className="mt-5" />
        <PopLink to="/catalog" className="mt-6">
          Start shopping
        </PopLink>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <StepBadge step={7} label="Confirmation" />
      <div className="card-pop mt-4 overflow-hidden">
        <div className="fictional-stripe h-4" aria-hidden="true" />
        <div className="p-6 sm:p-8">
          <p className="text-6xl" aria-hidden="true">
            🎉
          </p>
          <h1 className="mt-3 text-4xl font-extrabold">Fictional order confirmed</h1>
          <p className="mt-2 text-muted-foreground">
            Order <span className="font-mono font-bold text-foreground">{order.id}</span> placed at{" "}
            {new Date(order.createdAt).toLocaleTimeString()}
          </p>

          <FictionalNotice className="mt-5" />

          <ul className="mt-6 space-y-2">
            {order.lines.map((line) => (
              <li
                key={line.productId}
                className="flex items-center justify-between gap-3 rounded-lg border-2 border-ink bg-secondary/50 px-3 py-2"
              >
                <span className="font-semibold">
                  <span aria-hidden="true">{line.emoji}</span> {line.name} ×{line.quantity}
                </span>
                <span className="font-mono font-bold">
                  {formatCoins(line.unitPrice * line.quantity)}
                </span>
              </li>
            ))}
          </ul>

          <dl className="mt-5 grid gap-3 sm:grid-cols-3">
            {[
              { label: "Fictional total", value: formatCoins(order.total) },
              { label: "Reward points", value: order.rewardPoints.toLocaleString("en-US") },
              { label: "Courier", value: `${order.courierEmoji} ${order.courierName}` },
            ].map((stat) => (
              <div key={stat.label} className="rounded-lg border-2 border-ink bg-mint/60 px-4 py-3">
                <dt className="font-mono text-xs font-bold uppercase tracking-widest">
                  {stat.label}
                </dt>
                <dd className="mt-1 font-display text-xl font-extrabold">{stat.value}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-7 flex flex-wrap gap-3">
            <PopLink to="/delivery" size="lg" variant="accent">
              Track imaginary delivery →
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
