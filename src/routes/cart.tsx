import { createFileRoute } from "@tanstack/react-router";

import { FictionalNotice } from "@/components/fictional/FictionalNotice";
import { PageShell } from "@/components/fictional/PageShell";
import { PopButton, PopLink } from "@/components/fictional/PopButton";
import { StepBadge } from "@/components/fictional/StepBadge";
import { getPersonality } from "@/data/personalities";
import { FICTIONAL_SHIPPING, formatCoins } from "@/lib/fictional-config";
import { buildCartLines, cartSubtotal } from "@/lib/shopping-logic";
import { useSession } from "@/state/session";

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [
      { title: "Fictional Cart — Pretendly" },
      {
        name: "description",
        content: "Review your pretend cart. No purchase is made and no money is charged.",
      },
      { property: "og:title", content: "Fictional Cart — Pretendly" },
      { property: "og:description", content: "Imaginary items, imaginary totals." },
    ],
  }),
  component: CartPage,
});

function CartPage() {
  const { session, setQuantity, removeFromCart, clearCart } = useSession();
  const lines = buildCartLines(session.cart);
  const subtotal = cartSubtotal(session.cart);
  const personality = getPersonality(session.personalityId);
  const wallet = personality?.startingWallet ?? 0;
  const total = subtotal + (lines.length ? FICTIONAL_SHIPPING : 0);

  return (
    <PageShell>
      <StepBadge step={5} label="Cart" />
      <h1 className="mt-4 text-4xl font-extrabold sm:text-5xl">Your fictional cart</h1>
      <FictionalNotice className="mt-5" />

      {lines.length === 0 ? (
        <div className="card-pop mt-6 p-8 text-center">
          <p className="text-5xl" aria-hidden="true">
            🛒
          </p>
          <p className="mt-3 text-lg font-semibold">Nothing imaginary in here yet.</p>
          <PopLink to="/catalog" className="mt-5">
            Browse the catalog
          </PopLink>
        </div>
      ) : (
        <>
          <ul className="mt-6 space-y-3">
            {lines.map((line) => (
              <li key={line.product.id} className="card-pop flex flex-wrap items-center gap-4 p-4">
                <span aria-hidden="true" className="text-4xl">
                  {line.product.emoji}
                </span>
                <div className="min-w-40 flex-1">
                  <h2 className="font-bold">{line.product.name}</h2>
                  <p className="text-sm text-muted-foreground">
                    {formatCoins(line.product.price)} each
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <PopButton
                    size="sm"
                    variant="ghost"
                    aria-label={`Decrease quantity of ${line.product.name}`}
                    onClick={() => setQuantity(line.product.id, line.quantity - 1)}
                  >
                    −
                  </PopButton>
                  <span className="w-8 text-center font-mono font-bold" aria-live="polite">
                    {line.quantity}
                  </span>
                  <PopButton
                    size="sm"
                    variant="ghost"
                    aria-label={`Increase quantity of ${line.product.name}`}
                    onClick={() => setQuantity(line.product.id, line.quantity + 1)}
                  >
                    +
                  </PopButton>
                </div>
                <p className="w-24 text-right font-display text-lg font-extrabold">
                  {formatCoins(line.lineTotal)}
                </p>
                <PopButton
                  size="sm"
                  variant="ghost"
                  onClick={() => removeFromCart(line.product.id)}
                  aria-label={`Remove ${line.product.name} from fictional cart`}
                >
                  Remove
                </PopButton>
              </li>
            ))}
          </ul>

          <div className="card-pop mt-6 p-6">
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between">
                <dt>Fictional subtotal</dt>
                <dd className="font-mono font-bold">{formatCoins(subtotal)}</dd>
              </div>
              <div className="flex justify-between">
                <dt>Imaginary shipping</dt>
                <dd className="font-mono font-bold">{formatCoins(FICTIONAL_SHIPPING)}</dd>
              </div>
              <div className="flex justify-between border-t-2 border-ink pt-2 text-lg">
                <dt className="font-extrabold">Fictional total</dt>
                <dd className="font-display font-extrabold">{formatCoins(total)}</dd>
              </div>
              {personality ? (
                <div className="flex justify-between text-muted-foreground">
                  <dt>Wallet after (pretend)</dt>
                  <dd className="font-mono">{formatCoins(Math.max(wallet - total, 0))}</dd>
                </div>
              ) : null}
            </dl>

            <div className="mt-6 flex flex-wrap gap-3">
              <PopLink to="/checkout" size="lg" variant="accent">
                Fictional checkout →
              </PopLink>
              <PopButton size="lg" variant="ghost" onClick={clearCart}>
                Empty cart
              </PopButton>
            </div>
          </div>
        </>
      )}
    </PageShell>
  );
}
