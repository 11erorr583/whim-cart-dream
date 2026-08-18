import { createFileRoute } from "@tanstack/react-router";

import { FictionalNotice } from "@/components/fictional/FictionalNotice";
import { PageShell } from "@/components/fictional/PageShell";
import { PopLink } from "@/components/fictional/PopButton";
import { PERSONALITIES } from "@/data/personalities";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Pretendly — A Fictional Shopping Game" },
      {
        name: "description",
        content:
          "Shop absurd imaginary products, pick a shopping personality, and track a pretend delivery. No money, no accounts, no real purchases.",
      },
      { property: "og:title", content: "Pretendly — A Fictional Shopping Game" },
      {
        property: "og:description",
        content: "A playful shopping simulation where nothing is real except the fun.",
      },
    ],
  }),
  component: Landing,
});

const STEPS = [
  { emoji: "🎭", title: "Pick a personality", text: "Four shopper archetypes, four very different carts." },
  { emoji: "🛒", title: "Fill a pretend cart", text: "Browse absurd products with fictional prices." },
  { emoji: "🚚", title: "Track the delivery", text: "Countdown, courier call, and a final verdict." },
];

function Landing() {
  return (
    <PageShell wide>
      <section className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <p className="inline-flex rounded-full border-2 border-ink bg-mint px-3 py-1 font-mono text-xs font-bold uppercase tracking-widest text-mint-foreground">
            100% imaginary retail
          </p>
          <h1 className="mt-4 text-5xl font-extrabold leading-[0.95] sm:text-6xl">
            Shop wildly.
            <br />
            Spend nothing.
          </h1>
          <p className="mt-5 max-w-xl text-lg text-muted-foreground">
            Pretendly is a shopping simulation game for kids and adults. Choose a shopping
            personality, load a cart with ridiculous inventions, and watch your imaginary courier
            sprint across a fictional city.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <PopLink to="/personality" size="lg">
              Start shopping 🎭
            </PopLink>
            <PopLink to="/catalog" variant="ghost" size="lg">
              Just browse
            </PopLink>
          </div>
          <FictionalNotice className="mt-7 max-w-xl" />
        </div>

        <div className="card-pop p-5">
          <p className="font-mono text-xs font-bold uppercase tracking-widest text-muted-foreground">
            Today's fictional bestsellers
          </p>
          <ul className="mt-3 space-y-3">
            {[
              { emoji: "🎉", name: "Emergency Confetti Button", price: "89c" },
              { emoji: "🍫", name: "Infinite Snack Drawer", price: "899c" },
              { emoji: "👟", name: "Anti-Gravity Sneakers", price: "3,200c" },
            ].map((item) => (
              <li
                key={item.name}
                className="flex items-center gap-3 rounded-lg border-2 border-ink bg-secondary/60 px-3 py-2"
              >
                <span aria-hidden="true" className="text-2xl">
                  {item.emoji}
                </span>
                <span className="font-semibold">{item.name}</span>
                <span className="ml-auto font-mono text-sm font-bold">{item.price}</span>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-xs text-muted-foreground">
            Prices are fictional coins. They cannot be earned, bought, or exchanged.
          </p>
        </div>
      </section>

      <section className="mt-14" aria-labelledby="how-it-works">
        <h2 id="how-it-works" className="text-3xl font-extrabold">
          How the game works
        </h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-3">
          {STEPS.map((step) => (
            <div key={step.title} className="card-pop p-5">
              <span aria-hidden="true" className="text-3xl">
                {step.emoji}
              </span>
              <h3 className="mt-3 text-xl font-bold">{step.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{step.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-14" aria-labelledby="personalities">
        <h2 id="personalities" className="text-3xl font-extrabold">
          Which shopper are you?
        </h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {PERSONALITIES.map((p) => (
            <div key={p.id} className="card-pop p-5">
              <span aria-hidden="true" className="text-3xl">
                {p.emoji}
              </span>
              <h3 className="mt-2 text-lg font-bold">{p.name}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{p.tagline}</p>
            </div>
          ))}
        </div>
        <div className="mt-6">
          <PopLink to="/personality" size="lg" variant="accent">
            Choose yours
          </PopLink>
        </div>
      </section>
    </PageShell>
  );
}
