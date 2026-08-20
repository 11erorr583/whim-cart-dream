import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Star, Heart, ShoppingBag, CheckCircle2, ShieldCheck } from "lucide-react";

import { formatCoins } from "@/lib/fictional-config";
import { useSession } from "@/state/session";
import type { Product } from "@/types/shopping";

export function ProductCard({
  product,
  onAdd,
}: {
  product: Product;
  onAdd: (productId: string) => void;
}) {
  const { session, toggleWishlist } = useSession();
  const [imgSrc, setImgSrc] = useState<string>(
    product.images?.[0] ||
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80",
  );
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const isWishlisted = session.wishlist?.includes(product.id);
  const primaryImg = product.images?.[activeImageIndex] || product.images?.[0] || imgSrc;
  const discountPercent =
    product.comparePrice && product.comparePrice > product.price
      ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
      : null;

  return (
    <article className="group bg-white rounded-xl border border-slate-200/90 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col overflow-hidden relative">
      {/* Wishlist Button */}
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          toggleWishlist(product.id);
        }}
        aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
        className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-white/90 backdrop-blur-xs border border-slate-200/80 flex items-center justify-center text-slate-600 hover:text-rose-600 hover:bg-white shadow-xs transition-transform active:scale-90"
      >
        <Heart
          className={`w-4 h-4 transition-colors ${
            isWishlisted ? "fill-rose-500 text-rose-500" : ""
          }`}
        />
      </button>

      {/* Badges */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5 pointer-events-none">
        {discountPercent && (
          <span className="px-2 py-0.5 rounded-md bg-rose-600 text-white text-[11px] font-bold tracking-wide shadow-xs">
            {discountPercent}% OFF
          </span>
        )}
        {product.isFeatured && (
          <span className="px-2 py-0.5 rounded-md bg-slate-900 text-white text-[10px] font-bold tracking-wide uppercase shadow-xs">
            Featured
          </span>
        )}
        {product.inventory !== undefined && product.inventory <= 5 && product.inventory > 0 && (
          <span className="px-2 py-0.5 rounded-md bg-amber-500 text-slate-950 text-[10px] font-bold tracking-wide shadow-xs">
            Only {product.inventory} left
          </span>
        )}
      </div>

      <Link
        to="/product/$productId"
        params={{ productId: product.id }}
        className="flex flex-col flex-1"
      >
        {/* Product Image Stage */}
        <div className="relative aspect-4/3 w-full bg-slate-100 overflow-hidden">
          {primaryImg ? (
            <img
              src={primaryImg}
              alt={product.name}
              loading="lazy"
              referrerPolicy="no-referrer"
              onError={(e) => {
                const target = e.currentTarget;
                if (
                  !target.src.includes("photo-1523275335684-37898b6baf30")
                ) {
                  target.src =
                    "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80";
                }
              }}
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-slate-100 text-5xl">
              {product.emoji || "📦"}
            </div>
          )}

          {/* Multi-image indicator dots on hover */}
          {product.images && product.images.length > 1 && (
            <div
              className="absolute bottom-2 inset-x-0 flex justify-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-t from-black/40 to-transparent pt-3 pb-1"
              onClick={(e) => e.preventDefault()}
            >
              {product.images.slice(0, 4).map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onMouseEnter={() => setActiveImageIndex(idx)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    idx === activeImageIndex ? "bg-white w-4" : "bg-white/60"
                  }`}
                  aria-label={`View photo ${idx + 1}`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Content Body */}
        <div className="p-4 flex flex-col flex-1">
          {/* Category & Merchant */}
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
            <span className="font-semibold uppercase tracking-wider text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-sm">
              {product.category}
            </span>
            {product.seller && (
              <span className="truncate max-w-[140px] text-slate-500 flex items-center gap-1">
                <span>by {product.seller}</span>
                {product.sellerVerified && (
                  <CheckCircle2 className="w-3 h-3 text-emerald-600 inline shrink-0" />
                )}
              </span>
            )}
          </div>

          <h3 className="font-semibold text-slate-900 text-sm leading-snug line-clamp-2 group-hover:text-emerald-700 transition-colors">
            {product.name}
          </h3>

          <p className="text-xs text-slate-500 line-clamp-2 mt-1 mb-3">{product.blurb}</p>

          {/* Rating */}
          <div className="mt-auto flex items-center gap-1.5 text-xs">
            <div className="flex items-center text-amber-500">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span className="ml-1 font-bold text-slate-800">{product.rating.toFixed(1)}</span>
            </div>
            <span className="text-slate-400 font-normal">({product.reviewCount} reviews)</span>
          </div>
        </div>
      </Link>

      {/* Pricing & Add to Cart Footer */}
      <div className="px-4 py-3 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between gap-2">
        <div className="flex flex-col">
          <span className="font-bold text-slate-900 text-base font-display">
            {formatCoins(product.price)}
          </span>
          {product.comparePrice && product.comparePrice > product.price && (
            <span className="text-[11px] text-slate-400 line-through">
              {formatCoins(product.comparePrice)}
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={() => onAdd(product.id)}
          aria-label={`Add ${product.name} to cart`}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition-all active:scale-95 cursor-pointer"
        >
          <ShoppingBag className="w-3.5 h-3.5" />
          <span>Add</span>
        </button>
      </div>
    </article>
  );
}
