import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";

import { FictionalNotice } from "@/components/fictional/FictionalNotice";
import { PageShell } from "@/components/fictional/PageShell";
import { PopLink } from "@/components/fictional/PopButton";
import { ProductCard } from "@/components/fictional/ProductCard";
import { StepBadge } from "@/components/fictional/StepBadge";
import { getPersonality } from "@/data/personalities";
import { CATEGORIES, PRODUCTS } from "@/data/products";
import { cartCount } from "@/lib/shopping-logic";
import { useSession } from "@/state/session";
import type { ProductCategory } from "@/types/shopping";

export const Route = createFileRoute("/catalog")({
  head: () => ({
    meta: [
      { title: "Fictional Product Catalog — Pretendly" },
      {
        name: "description",
        content:
          "Browse imaginary gadgets, snacks, fashion and absurd inventions. Every price is fictional.",
      },
      { property: "og:title", content: "Fictional Product Catalog — Pretendly" },
      {
        property: "og:description",
        content: "Anti-gravity sneakers, infinite snack drawers, and a pocket thundercloud.",
      },
    ],
  }),
  component: CatalogPage,
});

type SortKey = "featured" | "price-asc" | "price-desc" | "rating";

function CatalogPage() {
  const { session, addToCart } = useSession();
  const personality = getPersonality(session.personalityId);
  const [category, setCategory] = useState<ProductCategory | "all">("all");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortKey>("featured");
  const [lastAdded, setLastAdded] = useState<string | null>(null);

  const products = useMemo(() => {
    const filtered = PRODUCTS.filter(
      (p) =>
        (category === "all" || p.category === category) &&
        (query.trim() === "" ||
          `${p.name} ${p.blurb} ${p.tags.join(" ")}`.toLowerCase().includes(query.toLowerCase())),
    );
    const sorted = [...filtered];
    if (sort === "price-asc") sorted.sort((a, b) => a.price - b.price);
    if (sort === "price-desc") sorted.sort((a, b) => b.price - a.price);
    if (sort === "rating") sorted.sort((a, b) => b.rating - a.rating);
    return sorted;
  }, [category, query, sort]);

  const handleAdd = (productId: string) => {
    addToCart(productId);
    const quip = personality?.quips[Math.floor(Math.random() * personality.quips.length)];
    setLastAdded(quip ?? "Added to your fictional cart.");
  };

  const count = cartCount(session.cart);

  return (
    <PageShell wide>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <StepBadge step={3} label="Catalog" />
          <h1 className="mt-4 text-4xl font-extrabold sm:text-5xl">The fictional catalog</h1>
          <p className="mt-2 text-muted-foreground">
            {personality
              ? `Curated chaos for the ${personality.name}.`
              : "Pick a personality any time for tailored nonsense."}
          </p>
        </div>
        {count > 0 ? (
          <PopLink to="/cart" variant="accent">
            Review cart ({count}) →
          </PopLink>
        ) : null}
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-[1fr_auto]">
        <div>
          <label htmlFor="catalog-search" className="mb-1 block text-sm font-semibold">
            Search products
          </label>
          <input
            id="catalog-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g. snack, sneakers, cloud"
            className="w-full rounded-xl border-2 border-ink bg-card px-4 py-2.5"
          />
        </div>
        <div>
          <label htmlFor="catalog-sort" className="mb-1 block text-sm font-semibold">
            Sort by
          </label>
          <select
            id="catalog-sort"
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            className="w-full rounded-xl border-2 border-ink bg-card px-4 py-2.5 font-semibold"
          >
            <option value="featured">Featured</option>
            <option value="price-asc">Price: low to high</option>
            <option value="price-desc">Price: high to low</option>
            <option value="rating">Highest rated</option>
          </select>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2" role="group" aria-label="Filter by category">
        {CATEGORIES.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => setCategory(c.id)}
            aria-pressed={category === c.id}
            className={`rounded-full border-2 border-ink px-3 py-1.5 text-sm font-bold transition-colors ${
              category === c.id ? "bg-primary text-primary-foreground" : "bg-card"
            }`}
          >
            <span aria-hidden="true">{c.emoji}</span> {c.label}
          </button>
        ))}
      </div>

      <p aria-live="polite" className="mt-4 min-h-6 text-sm font-semibold text-primary">
        {lastAdded}
      </p>

      {products.length === 0 ? (
        <p className="card-pop mt-4 p-6 text-center text-muted-foreground">
          Nothing matches that. Even our imaginary warehouse has limits.
        </p>
      ) : (
        <ul className="mt-2 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <li key={product.id} className="contents">
              <ProductCard product={product} onAdd={handleAdd} />
            </li>
          ))}
        </ul>
      )}

      <FictionalNotice className="mt-8" />
    </PageShell>
  );
}
