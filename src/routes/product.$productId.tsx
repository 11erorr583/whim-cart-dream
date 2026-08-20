import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  Star,
  ShieldCheck,
  Truck,
  RotateCcw,
  Heart,
  Share2,
  CheckCircle2,
  Package,
  Layers,
  Sparkles,
  ShoppingBag,
  Store,
  ChevronRight,
  Info,
} from "lucide-react";

import { FictionalNotice } from "@/components/fictional/FictionalNotice";
import { PageShell } from "@/components/fictional/PageShell";
import { resolveProduct } from "@/data/product-registry";
import { formatCoins } from "@/lib/fictional-config";
import { useSession } from "@/state/session";
import { useSeller } from "@/state/seller";

export const Route = createFileRoute("/product/$productId")({
  head: () => ({
    meta: [
      { title: "Product Overview & Specifications — Whim Cart" },
      {
        name: "description",
        content:
          "Read verified reviews, technical specifications, and shipping details before completing your order.",
      },
      { property: "og:title", content: "Product Overview — Whim Cart" },
      {
        property: "og:description",
        content: "Boutique artisan craftsmanship with verified buyer protection.",
      },
    ],
  }),
  component: ProductDetail,
});

function ProductDetail() {
  const { productId } = Route.useParams();
  const { products: sellerProducts, profile } = useSeller();
  const product = useMemo(
    () => sellerProducts.find((p) => p.id === productId) ?? resolveProduct(productId),
    [productId, sellerProducts],
  );
  const { session, addToCart, toggleWishlist } = useSession();
  const navigate = useNavigate();

  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [newReviewAuthor, setNewReviewAuthor] = useState("");
  const [newReviewBody, setNewReviewBody] = useState("");
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [localReviews, setLocalReviews] = useState(product?.reviews ?? []);

  const isWishlisted = product ? session.wishlist?.includes(product.id) : false;

  if (!product) {
    return (
      <PageShell>
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-xs">
          <Package className="w-12 h-12 text-slate-400 mx-auto mb-3" />
          <h1 className="text-2xl font-bold text-slate-900">Product Not Found</h1>
          <p className="mt-2 text-sm text-slate-500">
            This item may have been discontinued or moved to a new catalog collection.
          </p>
          <Link
            to="/catalog"
            className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 text-white font-semibold text-sm hover:bg-slate-800"
          >
            Explore Catalog
          </Link>
        </div>
      </PageShell>
    );
  }

  const galleryImages = product.images && product.images.length > 0 ? product.images : [];

  const primaryImg = galleryImages[activeImageIndex] || galleryImages[0];

  const discountPercent =
    product.comparePrice && product.comparePrice > product.price
      ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
      : null;

  const handleAddToCart = (redirect = false) => {
    addToCart(product.id, quantity);
    setToastMessage(`Added ${quantity} item${quantity > 1 ? "s" : ""} to your cart.`);
    if (redirect) {
      void navigate({ to: "/cart" });
    } else {
      setTimeout(() => setToastMessage(null), 3500);
    }
  };

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewAuthor.trim() || !newReviewBody.trim()) return;
    const newRev = {
      id: `rev-${Date.now()}`,
      author: newReviewAuthor.trim(),
      rating: newReviewRating,
      body: newReviewBody.trim(),
      date: "Just now",
      verified: true,
    };
    setLocalReviews((prev) => [newRev, ...prev]);
    setNewReviewAuthor("");
    setNewReviewBody("");
  };

  return (
    <PageShell wide>
      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-xl border border-slate-800 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <div className="w-6 h-6 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center font-bold text-xs">
            ✓
          </div>
          <span className="text-xs font-semibold">{toastMessage}</span>
          <Link
            to="/cart"
            className="ml-2 text-xs font-bold text-emerald-400 hover:text-emerald-300 underline"
          >
            Go to Cart
          </Link>
        </div>
      )}

      {/* Breadcrumbs */}
      <nav
        aria-label="Breadcrumb"
        className="flex items-center gap-1.5 text-xs text-slate-500 mb-6"
      >
        <Link to="/" className="hover:text-slate-900 transition-colors">
          Home
        </Link>
        <ChevronRight className="w-3 h-3 text-slate-400" />
        <Link to="/catalog" className="hover:text-slate-900 transition-colors">
          Catalog
        </Link>
        <ChevronRight className="w-3 h-3 text-slate-400" />
        <span className="font-semibold text-slate-900 truncate max-w-xs">{product.name}</span>
      </nav>

      {/* Main PDP Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left 6 Cols: Photo Gallery */}
        <div className="lg:col-span-6 space-y-4">
          {/* Main Visual Display */}
          <div className="relative aspect-4/3 sm:aspect-square bg-slate-100 rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            {primaryImg ? (
              <img
                src={primaryImg}
                alt={product.name}
                referrerPolicy="no-referrer"
                onError={(e) => {
                  const target = e.currentTarget;
                  if (!target.src.includes("photo-1523275335684-37898b6baf30")) {
                    target.src =
                      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=900&auto=format&fit=crop&q=80";
                  }
                }}
                className="w-full h-full object-cover object-center"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-8xl bg-slate-100">
                {product.emoji || "📦"}
              </div>
            )}

            {/* Discount / Inventory Badges */}
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              {discountPercent && (
                <span className="px-2.5 py-1 rounded-lg bg-rose-600 text-white text-xs font-bold shadow-sm">
                  {discountPercent}% OFF
                </span>
              )}
              {product.inventory !== undefined && product.inventory <= 5 && (
                <span className="px-2.5 py-1 rounded-lg bg-amber-500 text-slate-950 text-xs font-bold shadow-sm">
                  Only {product.inventory} left in stock
                </span>
              )}
            </div>

            {/* Wishlist floating toggle */}
            <button
              type="button"
              onClick={() => toggleWishlist(product.id)}
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/90 backdrop-blur-xs border border-slate-200 flex items-center justify-center text-slate-700 hover:text-rose-600 hover:bg-white shadow-xs transition-transform active:scale-90"
              aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
            >
              <Heart className={`w-5 h-5 ${isWishlisted ? "fill-rose-500 text-rose-500" : ""}`} />
            </button>
          </div>

          {/* Gallery Thumbnails List */}
          {galleryImages.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {galleryImages.map((imgUrl, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveImageIndex(idx)}
                  className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 shrink-0 transition-all ${
                    idx === activeImageIndex
                      ? "border-slate-900 ring-2 ring-slate-900/10"
                      : "border-slate-200 hover:border-slate-400 opacity-80"
                  }`}
                >
                  <img
                    src={imgUrl}
                    alt={`Thumbnail ${idx + 1}`}
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      const target = e.currentTarget;
                      if (!target.src.includes("photo-1523275335684-37898b6baf30")) {
                        target.src =
                          "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&auto=format&fit=crop&q=80";
                      }
                    }}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}

          {/* Value Props Strip */}
          <div className="grid grid-cols-3 gap-3 pt-2">
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-center">
              <Truck className="w-5 h-5 text-emerald-600 mx-auto mb-1" />
              <span className="text-[11px] font-bold text-slate-800 block">Fast Dispatch</span>
              <span className="text-[10px] text-slate-500">Ships within 24h</span>
            </div>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-center">
              <RotateCcw className="w-5 h-5 text-emerald-600 mx-auto mb-1" />
              <span className="text-[11px] font-bold text-slate-800 block">30-Day Returns</span>
              <span className="text-[10px] text-slate-500">Hassle-free guarantee</span>
            </div>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-center">
              <ShieldCheck className="w-5 h-5 text-emerald-600 mx-auto mb-1" />
              <span className="text-[11px] font-bold text-slate-800 block">Secure Checkout</span>
              <span className="text-[10px] text-slate-500">Encrypted payments</span>
            </div>
          </div>
        </div>

        {/* Right 6 Cols: Details & Purchase Column */}
        <div className="lg:col-span-6 space-y-6">
          {/* Title, Merchant, and Rating Header */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[11px] font-bold uppercase tracking-wider">
                {product.category}
              </span>
              {product.sku && (
                <span className="text-xs text-slate-400 font-mono">SKU: {product.sku}</span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-display">
              {product.name}
            </h1>

            <p className="mt-2 text-sm text-slate-600 leading-relaxed">{product.blurb}</p>

            {/* Merchant Attribution */}
            <div className="mt-3 flex items-center justify-between py-2.5 px-3.5 bg-slate-50 border border-slate-200 rounded-xl">
              <div className="flex items-center gap-2 text-xs text-slate-700">
                <Store className="w-4 h-4 text-emerald-600" />
                <span>
                  Dispatched & Sold by:{" "}
                  <strong className="font-semibold text-slate-900">{product.seller}</strong>
                </span>
                {product.sellerVerified && (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 inline" />
                )}
              </div>
              <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-100/60 px-2 py-0.5 rounded-md">
                Verified Seller
              </span>
            </div>

            {/* Rating Stars & Count */}
            <div className="mt-3 flex items-center gap-3 text-sm">
              <div className="flex items-center text-amber-500">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span className="ml-1 font-bold text-slate-900">{product.rating.toFixed(1)}</span>
              </div>
              <span className="text-slate-400">•</span>
              <a
                href="#customer-reviews"
                className="text-xs font-semibold text-emerald-700 hover:underline"
              >
                {product.reviewCount} customer reviews
              </a>
              <span className="text-slate-400">•</span>
              <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> 100% Quality Inspected
              </span>
            </div>
          </div>

          {/* Pricing Box */}
          <div className="p-5 bg-slate-50/80 rounded-2xl border border-slate-200 space-y-4">
            <div className="flex items-baseline gap-3">
              <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-display">
                {formatCoins(product.price)}
              </span>
              {product.comparePrice && product.comparePrice > product.price && (
                <span className="text-lg text-slate-400 line-through">
                  {formatCoins(product.comparePrice)}
                </span>
              )}
              <span className="text-xs text-slate-500 font-medium ml-auto">
                Taxes calculated at checkout
              </span>
            </div>

            {/* Stock status */}
            <div className="text-xs font-semibold text-slate-700 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>
                {product.inventory && product.inventory > 0
                  ? `In Stock (${product.inventory} units available)`
                  : "In Stock & Ready to Ship"}
              </span>
            </div>

            {/* Quantity Selector & Buy Buttons */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3">
                <label htmlFor="qty-select" className="text-xs font-bold text-slate-700 uppercase">
                  Quantity:
                </label>
                <select
                  id="qty-select"
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="py-1.5 px-3 rounded-lg border border-slate-300 bg-white font-semibold text-sm text-slate-800"
                >
                  {[1, 2, 3, 4, 5, 8, 10].map((num) => (
                    <option key={num} value={num}>
                      {num}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => handleAddToCart(false)}
                  className="w-full py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm shadow-sm transition-all active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add to Cart</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleAddToCart(true)}
                  className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-sm transition-all active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Buy Now</span>
                </button>
              </div>
            </div>
          </div>

          {/* Overview & Description */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Product Description
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
              {product.description}
            </p>
          </div>

          {/* Technical Specifications */}
          {product.specifications && Object.keys(product.specifications).length > 0 && (
            <div className="space-y-3 pt-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-emerald-600" />
                <span>Specifications & Technical Details</span>
              </h3>
              <div className="rounded-xl border border-slate-200 overflow-hidden divide-y divide-slate-100 text-xs">
                {Object.entries(product.specifications).map(([key, value]) => (
                  <div key={key} className="grid grid-cols-3 p-3 bg-white hover:bg-slate-50">
                    <span className="font-semibold text-slate-500">{key}</span>
                    <span className="col-span-2 text-slate-900 font-medium">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Customer Reviews Section */}
      <section id="customer-reviews" className="mt-16 pt-10 border-t border-slate-200">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl font-bold text-slate-900 font-display">
              Verified Customer Reviews
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Real feedback from verified marketplace purchases
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center text-amber-500 font-bold text-base">
              <Star className="w-5 h-5 fill-amber-400 text-amber-400 mr-1.5" />
              <span>{product.rating.toFixed(1)} out of 5</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Reviews List (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            {localReviews.map((review) => (
              <div
                key={review.id}
                className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-sm">{review.author}</span>
                    {review.verified && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                        <CheckCircle2 className="w-3 h-3" /> Verified Buyer
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-slate-400">
                    {review.date || "Verified Purchase"}
                  </span>
                </div>

                <div className="flex text-amber-400">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3.5 h-3.5 ${
                        i < review.rating ? "fill-amber-400" : "text-slate-200"
                      }`}
                    />
                  ))}
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">{review.body}</p>
              </div>
            ))}
          </div>

          {/* Write a Review Card */}
          <div className="bg-slate-50 rounded-xl border border-slate-200 p-5 shadow-xs h-fit space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Leave a Customer Review
            </h3>
            <form onSubmit={handleAddReview} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Your Name</label>
                <input
                  value={newReviewAuthor}
                  onChange={(e) => setNewReviewAuthor(e.target.value)}
                  placeholder="e.g. Alex Morgan"
                  required
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Rating</label>
                <select
                  value={newReviewRating}
                  onChange={(e) => setNewReviewRating(Number(e.target.value))}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-900 font-semibold"
                >
                  <option value={5}>★★★★★ (5 Stars - Exceptional)</option>
                  <option value={4}>★★★★☆ (4 Stars - Very Good)</option>
                  <option value={3}>★★★☆☆ (3 Stars - Average)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Your Feedback
                </label>
                <textarea
                  rows={3}
                  value={newReviewBody}
                  onChange={(e) => setNewReviewBody(e.target.value)}
                  placeholder="How was the build quality, shipping speed, and unboxing experience?"
                  required
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-900"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2 px-3 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors cursor-pointer"
              >
                Submit Verified Review
              </button>
            </form>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
