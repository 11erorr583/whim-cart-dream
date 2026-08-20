import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  Search,
  SlidersHorizontal,
  Sparkles,
  ShoppingBag,
  CheckCircle2,
  TrendingUp,
  Store,
  ShieldCheck,
} from "lucide-react";

import { FictionalNotice } from "@/components/fictional/FictionalNotice";
import { PageShell } from "@/components/fictional/PageShell";
import { ProductCard } from "@/components/fictional/ProductCard";
import { getPersonality } from "@/data/personalities";
import { CATEGORIES, PRODUCTS } from "@/data/products";
import { useSeller } from "@/state/seller";
import { cartCount } from "@/lib/shopping-logic";
import { useSession } from "@/state/session";
import type { ProductCategory } from "@/types/shopping";

export const Route = createFileRoute("/catalog")({
  head: () => ({
    meta: [
      { title: "Curated Marketplace Catalog — Whim Cart" },
      {
        name: "description",
        content:
          "Explore handcrafted lifestyle goods, modern electronics, gourmet ceramics, and verified boutique merchant listings on Whim Cart.",
      },
      { property: "og:title", content: "Curated Marketplace Catalog — Whim Cart" },
      {
        property: "og:description",
        content:
          "Browse premium goods direct from independent verified artisans and boutique creators.",
      },
    ],
  }),
  component: CatalogPage,
});

type SortKey = "featured" | "price-asc" | "price-desc" | "rating" | "popular";

function CatalogPage() {
  const { session, addToCart } = useSession();
  const { products: sellerProducts, profile } = useSeller();
  const personality = getPersonality(session.personalityId);
  const [category, setCategory] = useState<ProductCategory | "all">("all");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortKey>("featured");
  const [onlyInStock, setOnlyInStock] = useState(false);
  const [onlyMerchantUploads, setOnlyMerchantUploads] = useState(false);
  const [lastAddedName, setLastAddedName] = useState<string | null>(null);

  const products = useMemo(() => {
    const catalog = [...sellerProducts, ...PRODUCTS];
    const filtered = catalog.filter((p) => {
      if (category !== "all" && p.category !== category) return false;
      if (onlyInStock && p.inventory !== undefined && p.inventory <= 0) return false;
      if (onlyMerchantUploads && !p.submittedBySeller) return false;
      if (query.trim() !== "") {
        const searchCorpus =
          `${p.name} ${p.blurb} ${p.seller || ""} ${p.tags?.join(" ") || ""}`.toLowerCase();
        if (!searchCorpus.includes(query.toLowerCase())) return false;
      }
      return true;
    });

    const sorted = [...filtered];
    if (sort === "price-asc") sorted.sort((a, b) => a.price - b.price);
    if (sort === "price-desc") sorted.sort((a, b) => b.price - a.price);
    if (sort === "rating") sorted.sort((a, b) => b.rating - a.rating);
    if (sort === "popular") sorted.sort((a, b) => b.reviewCount - a.reviewCount);
    return sorted;
  }, [category, query, sort, onlyInStock, onlyMerchantUploads, sellerProducts]);

  const handleAdd = (productId: string) => {
    addToCart(productId);
    const item = [...sellerProducts, ...PRODUCTS].find((p) => p.id === productId);
    setLastAddedName(item ? `"${item.name}" added to cart` : "Item added to cart");
    setTimeout(() => {
      setLastAddedName(null);
    }, 4000);
  };

  const count = cartCount(session.cart);

  return (
    <PageShell wide>
      {/* Toast Notification for Add to Cart */}
      {lastAddedName && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-xl border border-slate-800 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <div className="w-6 h-6 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center font-bold text-xs">
            ✓
          </div>
          <div className="text-xs">
            <span className="font-semibold">{lastAddedName}</span>
          </div>
          <Link
            to="/cart"
            className="ml-2 text-xs font-bold text-emerald-400 hover:text-emerald-300 underline"
          >
            View Cart ({count})
          </Link>
        </div>
      )}

      {/* Hero Marketplace Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white rounded-2xl p-6 sm:p-8 mb-8 relative overflow-hidden shadow-sm">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Curated Autumn Collection</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight font-display text-white">
            Discover Exceptional Craftsmanship & Design
          </h1>
          <p className="mt-2 text-sm text-slate-300 leading-relaxed">
            Shop directly from independent studios, master artisans, and boutique merchants. Every
            order backed by 30-day returns and real-time courier tracking.
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-4 text-xs font-medium text-slate-300">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Verified Merchant Sellers</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Free Courier Shipping &gt; $150</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Instant AI Quality Inspected</span>
            </div>
          </div>
        </div>

        {/* Floating Quick Action Badge */}
        <div className="mt-6 sm:mt-0 sm:absolute sm:right-8 sm:bottom-8 z-10">
          <Link
            to="/sell"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-colors shadow-sm"
          >
            <Store className="w-4 h-4" />
            <span>Open Merchant Storefront</span>
          </Link>
        </div>
      </div>

      {/* Search & Sort Toolbar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs mb-6 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-[1fr_220px] gap-3">
          <div className="relative">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
            <input
              id="catalog-search"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by product name, materials, features, or merchant..."
              className="w-full pl-10 pr-4 py-2 text-sm rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:border-slate-900 focus:ring-1 focus:ring-slate-900 transition-all text-slate-900"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              id="catalog-sort"
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
              className="w-full py-2 px-3 text-xs font-semibold rounded-lg border border-slate-200 bg-slate-50 text-slate-800 focus:bg-white focus:border-slate-900"
            >
              <option value="featured">Sort: Featured</option>
              <option value="popular">Sort: Most Popular</option>
              <option value="price-asc">Sort: Price Low to High</option>
              <option value="price-desc">Sort: Price High to Low</option>
              <option value="rating">Sort: Highest Customer Rating</option>
            </select>
          </div>
        </div>

        {/* Category Pills & Quick Filter Switches */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100">
          <div
            className="flex flex-wrap items-center gap-1.5"
            role="group"
            aria-label="Filter by category"
          >
            {CATEGORIES.map((c) => {
              const isSelected = category === c.id;
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setCategory(c.id)}
                  aria-pressed={isSelected}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
                    isSelected
                      ? "bg-slate-900 text-white shadow-xs"
                      : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                  }`}
                >
                  <span>{c.emoji}</span>
                  <span>{c.label}</span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-3 text-xs text-slate-600 font-medium">
            <label className="flex items-center gap-1.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={onlyInStock}
                onChange={(e) => setOnlyInStock(e.target.checked)}
                className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
              />
              <span>In Stock Only</span>
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={onlyMerchantUploads}
                onChange={(e) => setOnlyMerchantUploads(e.target.checked)}
                className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
              />
              <span>Merchant Uploads ({sellerProducts.length})</span>
            </label>
          </div>
        </div>
      </div>

      {/* Catalog Grid Header */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-xs font-semibold text-slate-500">
          Showing <span className="font-bold text-slate-900">{products.length}</span> curated
          product{products.length === 1 ? "" : "s"}
        </p>

        {personality && (
          <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-500">
            <span>Tailored recommendations for:</span>
            <span className="font-bold text-slate-800">{personality.name}</span>
          </div>
        )}
      </div>

      {/* Products Grid */}
      {products.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-xs">
          <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-900">No matching products found</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
            Try adjusting your search terms or selecting a different category from the top filters.
          </p>
          <button
            type="button"
            onClick={() => {
              setCategory("all");
              setQuery("");
              setOnlyInStock(false);
              setOnlyMerchantUploads(false);
            }}
            className="mt-4 px-4 py-2 rounded-lg bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <li key={product.id} className="contents">
              <ProductCard product={product} onAdd={handleAdd} />
            </li>
          ))}
        </ul>
      )}

      {/* Buyer Protection Guarantee Notice */}
      <div className="mt-12">
        <FictionalNotice
          title="Whim Cart Verified Purchase Guarantee"
          description="All merchants on Whim Cart undergo identity and quality verification. Your payments are held securely with full refund eligibility up to 30 days post-delivery."
        />
      </div>
    </PageShell>
  );
}
