import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ShoppingBag,
  Store,
  ShieldCheck,
  Truck,
  RotateCcw,
  Sparkles,
  ArrowRight,
  Star,
  CheckCircle2,
  Package,
  TrendingUp,
} from "lucide-react";

import { FictionalNotice } from "@/components/fictional/FictionalNotice";
import { PageShell } from "@/components/fictional/PageShell";
import { STATIC_PRODUCTS } from "@/data/products";
import { formatCoins } from "@/lib/fictional-config";
import { useSeller } from "@/state/seller";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Whim Cart — Curated Marketplace for Independent Creators & Brands" },
      {
        name: "description",
        content:
          "Discover thoughtful essentials, boutique workspace gear, and precision-crafted lifestyle goods from verified independent merchants.",
      },
      { property: "og:title", content: "Whim Cart — Curated Modern Marketplace" },
      {
        property: "og:description",
        content: "Discover thoughtful essentials from verified independent studios and merchants.",
      },
    ],
  }),
  component: Landing,
});

function Landing() {
  const { products: sellerProducts } = useSeller();
  const featured = [...sellerProducts, ...STATIC_PRODUCTS].slice(0, 4);

  return (
    <PageShell wide>
      {/* Hero Section */}
      <section className="relative rounded-3xl bg-slate-900 text-white overflow-hidden p-8 sm:p-12 lg:p-16 mb-12 shadow-md">
        {/* Background Ambient Glow */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-slate-700/30 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-2xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Curated Artisan Marketplace</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight font-display leading-[1.08]">
            Thoughtful Goods for Everyday Living.
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-xl">
            Explore meticulously crafted workspace gear, bespoke accessories, and design essentials
            from independent makers and verified studios.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link
              to="/catalog"
              className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm shadow-sm transition-transform active:scale-95 flex items-center gap-2 cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Explore Full Catalog</span>
            </Link>

            <Link
              to="/seller-profile"
              className="px-5 py-3 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-white border border-slate-700 font-bold text-sm transition-transform active:scale-95 flex items-center gap-2 cursor-pointer"
            >
              <Store className="w-4 h-4 text-emerald-400" />
              <span>Become a Merchant</span>
            </Link>
          </div>

          {/* Guarantee Badges Bar */}
          <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-800 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Fast 24h Dispatch</span>
            </div>
            <div className="flex items-center gap-2">
              <RotateCcw className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>30-Day Returns</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Verified Protection</span>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Bestsellers Section */}
      <section className="mb-14">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800 uppercase tracking-wider mb-1">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Top Trending</span>
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900 font-display">
              Featured Merchandise
            </h2>
          </div>

          <Link
            to="/catalog"
            className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 group"
          >
            <span>View All ({sellerProducts.length + STATIC_PRODUCTS.length} items)</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {featured.map((product) => (
            <Link
              key={product.id}
              to="/product/$productId"
              params={{ productId: product.id }}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-all group flex flex-col"
            >
              <div className="aspect-square bg-slate-100 relative overflow-hidden flex items-center justify-center">
                {product.images && product.images[0] ? (
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <span className="text-5xl">{product.emoji || "📦"}</span>
                )}

                <span className="absolute top-3 left-3 px-2 py-0.5 rounded-md bg-white/90 backdrop-blur-xs text-[10px] font-bold text-slate-800 uppercase">
                  {product.category}
                </span>
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <div className="flex items-center gap-1 text-xs text-amber-500 mb-1">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <span className="font-bold text-slate-900">{product.rating.toFixed(1)}</span>
                    <span className="text-slate-400">({product.reviewCount})</span>
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm group-hover:text-emerald-700 transition-colors line-clamp-1">
                    {product.name}
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">{product.blurb}</p>
                </div>

                <div className="pt-2 flex items-center justify-between border-t border-slate-100">
                  <span className="font-extrabold text-slate-900 text-base font-display">
                    {formatCoins(product.price)}
                  </span>
                  <span className="text-xs font-bold text-emerald-700 group-hover:underline">
                    View Details
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Merchant Spotlight Banner */}
      <section className="bg-slate-50 rounded-2xl border border-slate-200 p-8 sm:p-10 mb-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
              <Store className="w-3.5 h-3.5" />
              <span>Independent Creator Program</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display">
              Open Your Merchant Storefront in Minutes
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              Whim Cart empowers independent designers, ateliers, and boutique workshops to reach
              enthusiastic shoppers worldwide with seamless listing tools, integrated order
              dispatch, and reliable payouts.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <Link
                to="/seller-profile"
                className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors"
              >
                Register as Merchant
              </Link>
              <Link
                to="/manage-seller"
                className="px-5 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 text-xs font-bold transition-colors"
              >
                Seller Dashboard
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs space-y-1.5">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <h4 className="font-bold text-xs text-slate-900">Zero Commission Overhead</h4>
              <p className="text-[11px] text-slate-500">
                Keep 100% of your earnings with direct weekly payouts.
              </p>
            </div>
            <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs space-y-1.5">
              <Package className="w-5 h-5 text-emerald-600" />
              <h4 className="font-bold text-xs text-slate-900">Rich Photo Uploads</h4>
              <p className="text-[11px] text-slate-500">
                Showcase high-resolution product photography & specs.
              </p>
            </div>
            <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs space-y-1.5">
              <Truck className="w-5 h-5 text-emerald-600" />
              <h4 className="font-bold text-xs text-slate-900">Integrated Courier Dispatch</h4>
              <p className="text-[11px] text-slate-500">
                Assign tracking numbers directly to buyer orders.
              </p>
            </div>
            <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs space-y-1.5">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              <h4 className="font-bold text-xs text-slate-900">Verified Seller Badges</h4>
              <p className="text-[11px] text-slate-500">
                Build immediate trust with authentic customer reviews.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Security & Buyer Protection */}
      <FictionalNotice
        title="Buyer & Merchant Security Guaranteed"
        description="All catalog interactions, customer orders, and store inventory persist securely in your active session."
      />
    </PageShell>
  );
}
