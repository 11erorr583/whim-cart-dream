import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";

import { getPersonality } from "@/data/personalities";
import { CURRENCY_LABEL, formatCoins } from "@/lib/fictional-config";
import { cartCount } from "@/lib/shopping-logic";
import { useSession } from "@/state/session";
import { cn } from "@/lib/utils";

export function PageShell({
  children,
  className,
  wide = false,
}: {
  children: ReactNode;
  className?: string;
  wide?: boolean;
}) {
  const { session } = useSession();
  const personality = getPersonality(session.personalityId);
  const count = cartCount(session.cart);

  return (
    <div className="min-h-screen surface-grid">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:border-2 focus:border-ink focus:bg-card focus:px-4 focus:py-2"
      >
        Skip to content
      </a>
      <header className="sticky top-0 z-40 border-b-2 border-ink bg-paper/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-3 px-4 py-3 sm:px-6">
          <Link to="/" className="flex items-center gap-2 font-display text-lg font-extrabold">
            <span aria-hidden="true">🛍️</span>
            <span>Pretendly</span>
          </Link>

          <nav aria-label="Main" className="order-3 flex w-full gap-1 overflow-x-auto sm:order-none sm:w-auto sm:ml-4">
            {[
              { to: "/personality", label: "Personality" },
              { to: "/catalog", label: "Catalog" },
              { to: "/cart", label: "Cart" },
              { to: "/sell", label: "Sell" },
              { to: "/manage-seller", label: "My listings" },
            ].map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="whitespace-nowrap rounded-lg px-3 py-1.5 text-sm font-semibold text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                activeProps={{ className: "bg-secondary text-foreground" }}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-2">
            {personality ? (
              <span className="hidden items-center gap-1.5 rounded-full border-2 border-ink bg-mint px-3 py-1 text-xs font-bold text-mint-foreground sm:inline-flex">
                <span aria-hidden="true">{personality.emoji}</span>
                {personality.name}
              </span>
            ) : null}
            <span
              className="rounded-full border-2 border-ink bg-card px-3 py-1 font-mono text-xs font-bold"
              title={`Fictional wallet in ${CURRENCY_LABEL}`}
            >
              {formatCoins(personality?.startingWallet ?? 0)}
            </span>
            <Link
              to="/cart"
              className="relative rounded-full border-2 border-ink bg-card px-3 py-1 text-sm font-bold"
              aria-label={`Fictional cart, ${count} item${count === 1 ? "" : "s"}`}
            >
              <span aria-hidden="true">🛒</span>
              <span className="ml-1 font-mono text-xs">{count}</span>
            </Link>
          </div>
        </div>
        <p className="border-t-2 border-ink bg-sunny/70 px-4 py-1 text-center text-[11px] font-bold uppercase tracking-widest text-ink">
          Fictional marketplace • no real money • no real deliveries
        </p>
      </header>

      <main id="main" className={cn("mx-auto px-4 py-8 sm:px-6 sm:py-10", wide ? "max-w-6xl" : "max-w-4xl", className)}>
        {children}
      </main>

      <footer className="border-t-2 border-ink bg-paper px-4 py-6 text-center text-xs text-muted-foreground">
        Pretendly is a shopping simulation game. Everything here is imaginary — products, coins,
        couriers, and calls.
      </footer>
    </div>
  );
}
