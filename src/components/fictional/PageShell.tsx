import { Link } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import {
  ShoppingBag,
  Store,
  ShieldCheck,
  Search,
  Truck,
  Heart,
  ChevronDown,
  Sparkles,
  User,
  PlusCircle,
  LayoutDashboard,
} from "lucide-react";

import { getPersonality } from "@/data/personalities";
import { formatCoins } from "@/lib/fictional-config";
import { cartCount } from "@/lib/shopping-logic";
import { useSession } from "@/state/session";
import { useSeller } from "@/state/seller";
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
  const { profile, products: sellerProds } = useSeller();
  const personality = getPersonality(session.personalityId);
  const count = cartCount(session.cart);
  const wishlistCount = session.wishlist?.length ?? 0;
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-slate-900 selection:text-white">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-slate-900 focus:text-white focus:px-4 focus:py-2 text-xs font-semibold"
      >
        Skip to main content
      </a>

      {/* Announcement Bar */}
      <div className="bg-slate-900 text-slate-200 text-xs py-2 px-4">
        <div className="mx-auto max-w-7xl flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-medium">
            <span className="inline-flex items-center justify-center rounded-full bg-emerald-500/20 text-emerald-300 px-2 py-0.5 text-[10px] font-bold tracking-wide uppercase">
              Free Shipping
            </span>
            <span className="hidden sm:inline text-slate-300">
              Complimentary standard courier delivery on all orders over $150.
            </span>
            <span className="sm:hidden text-slate-300">Free courier delivery over $150.</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400 text-xs">
            <Link
              to="/seller-profile"
              className="hover:text-white transition-colors flex items-center gap-1.5"
            >
              <Store className="w-3.5 h-3.5 text-emerald-400" />
              <span>Merchant Portal</span>
            </Link>
            <span className="text-slate-700 hidden md:inline">•</span>
            <Link
              to="/personality"
              className="hover:text-white transition-colors hidden md:flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Shopper Persona</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-4">
            {/* Logo */}
            <div className="flex items-center gap-6">
              <Link to="/catalog" className="flex items-center gap-2.5 group">
                <div className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center font-black shadow-sm group-hover:scale-105 transition-transform">
                  <ShoppingBag className="w-5 h-5 text-emerald-400" />
                </div>
                <div className="flex flex-col leading-none">
                  <span className="font-extrabold text-lg tracking-tight text-slate-900 font-display">
                    WHIM<span className="text-emerald-600">CART</span>
                  </span>
                  <span className="text-[10px] font-semibold text-slate-400 tracking-wider uppercase">
                    Curated Goods & Merchants
                  </span>
                </div>
              </Link>

              {/* Navigation Links */}
              <nav aria-label="Main" className="hidden lg:flex items-center gap-1">
                <Link
                  to="/catalog"
                  className="px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                  activeProps={{ className: "text-slate-900 bg-slate-100 font-semibold" }}
                >
                  Shop Catalog
                </Link>
                <Link
                  to="/manage-seller"
                  className="px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-colors flex items-center gap-1.5"
                  activeProps={{ className: "text-slate-900 bg-slate-100 font-semibold" }}
                >
                  <LayoutDashboard className="w-4 h-4 text-slate-500" />
                  <span>Merchant Hub</span>
                  {sellerProds.length > 0 && (
                    <span className="bg-emerald-100 text-emerald-800 text-[11px] font-bold px-1.5 py-0.2 rounded-full">
                      {sellerProds.length}
                    </span>
                  )}
                </Link>
                <Link
                  to="/sell"
                  className="px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-colors flex items-center gap-1.5"
                  activeProps={{ className: "text-slate-900 bg-slate-100 font-semibold" }}
                >
                  <PlusCircle className="w-4 h-4 text-emerald-600" />
                  <span>List New Product</span>
                </Link>
              </nav>
            </div>

            {/* Quick Action & Controls */}
            <div className="flex items-center gap-3">
              {/* Persona Pill */}
              {personality && (
                <Link
                  to="/personality"
                  className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full border border-slate-200 bg-slate-50 hover:bg-slate-100 transition-colors text-xs font-semibold text-slate-700"
                  title="Click to switch shopper persona"
                >
                  <span className="text-base leading-none">{personality.emoji}</span>
                  <span className="truncate max-w-[120px]">{personality.name}</span>
                </Link>
              )}

              {/* Wallet Pill */}
              <div
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 text-slate-800 text-xs font-mono font-bold"
                title="Available store balance"
              >
                <span className="text-slate-500 font-sans font-medium text-[11px]">Balance:</span>
                <span>{formatCoins(session.walletBalance ?? 2500)}</span>
              </div>

              {/* Wishlist Link */}
              <Link
                to="/catalog"
                className="relative p-2 rounded-full text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                title="Wishlist"
              >
                <Heart className="w-5 h-5" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              {/* Cart Button */}
              <Link
                to="/cart"
                className="relative flex items-center gap-2 px-3.5 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold transition-all shadow-sm active:scale-95"
                aria-label={`Shopping cart with ${count} items`}
              >
                <ShoppingBag className="w-4 h-4 text-emerald-400" />
                <span>Cart</span>
                {count > 0 && (
                  <span className="ml-0.5 bg-emerald-500 text-slate-950 text-xs font-bold px-2 py-0.5 rounded-full">
                    {count}
                  </span>
                )}
              </Link>

              {/* Seller Avatar */}
              <Link
                to="/seller-profile"
                className="hidden sm:flex items-center gap-2 pl-2 border-l border-slate-200"
                title="View Merchant Profile"
              >
                <img
                  src={profile.avatar}
                  alt={profile.storeName}
                  className="w-8 h-8 rounded-full object-cover ring-1 ring-slate-300"
                />
              </Link>
            </div>
          </div>
        </div>

        {/* Mobile secondary navigation */}
        <div className="lg:hidden border-t border-slate-100 bg-slate-50/70 px-4 py-2 flex items-center justify-between text-xs font-semibold overflow-x-auto gap-2">
          <Link
            to="/catalog"
            className="px-2.5 py-1.5 rounded-md hover:bg-white text-slate-700 whitespace-nowrap"
          >
            Catalog
          </Link>
          <Link
            to="/sell"
            className="px-2.5 py-1.5 rounded-md hover:bg-white text-slate-700 whitespace-nowrap text-emerald-700 font-bold flex items-center gap-1"
          >
            <PlusCircle className="w-3.5 h-3.5" />+ List Product
          </Link>
          <Link
            to="/manage-seller"
            className="px-2.5 py-1.5 rounded-md hover:bg-white text-slate-700 whitespace-nowrap"
          >
            Seller Hub ({sellerProds.length})
          </Link>
          <Link
            to="/seller-profile"
            className="px-2.5 py-1.5 rounded-md hover:bg-white text-slate-700 whitespace-nowrap"
          >
            Store Profile
          </Link>
        </div>
      </header>

      {/* Main Content Area */}
      <main
        id="main"
        className={cn(
          "mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 flex-1",
          wide ? "max-w-7xl" : "max-w-5xl",
          className,
        )}
      >
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white text-slate-600 mt-auto">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold">
                  <ShoppingBag className="w-4 h-4 text-emerald-400" />
                </div>
                <span className="font-bold text-slate-900 text-lg">Whim Cart</span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed mb-4">
                Premier marketplace connecting discerning shoppers with independent artisans and
                verified boutique product creators.
              </p>
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700">
                <ShieldCheck className="w-4 h-4" />
                <span>Verified Merchant Guarantee</span>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
                Shopping & Discover
              </h4>
              <ul className="space-y-2 text-xs">
                <li>
                  <Link to="/catalog" className="hover:text-slate-900 transition-colors">
                    Explore All Collections
                  </Link>
                </li>
                <li>
                  <Link to="/catalog" className="hover:text-slate-900 transition-colors">
                    Featured Artisans & Creators
                  </Link>
                </li>
                <li>
                  <Link to="/cart" className="hover:text-slate-900 transition-colors">
                    Review Cart & Express Checkout
                  </Link>
                </li>
                <li>
                  <Link to="/personality" className="hover:text-slate-900 transition-colors">
                    Shopper Persona Preferences
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
                Merchant Services
              </h4>
              <ul className="space-y-2 text-xs">
                <li>
                  <Link to="/sell" className="hover:text-slate-900 transition-colors">
                    Publish New Product Listing
                  </Link>
                </li>
                <li>
                  <Link to="/manage-seller" className="hover:text-slate-900 transition-colors">
                    Merchant Management Dashboard
                  </Link>
                </li>
                <li>
                  <Link to="/seller-profile" className="hover:text-slate-900 transition-colors">
                    Storefront Profile & Custom Branding
                  </Link>
                </li>
                <li>
                  <span className="text-slate-400">Zero Commission on First 50 Orders</span>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
                Buyer Protection
              </h4>
              <p className="text-xs text-slate-500 mb-3 leading-relaxed">
                Every purchase on Whim Cart is backed by our full 30-day return policy and authentic
                courier tracking.
              </p>
              <div className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-700">
                <Truck className="w-4 h-4 text-emerald-600" />
                <span>Trackable Dispatches</span>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
            <p>© {new Date().getFullYear()} Whim Cart Marketplace. All rights reserved.</p>
            <div className="flex items-center gap-6">
              <span>Security Verified SSL</span>
              <span>Encrypted Checkout</span>
              <span>24/7 Concierge Support</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
