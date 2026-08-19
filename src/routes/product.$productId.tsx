import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";

import { FictionalNotice } from "@/components/fictional/FictionalNotice";
import { PageShell } from "@/components/fictional/PageShell";
import { PopButton, PopLink } from "@/components/fictional/PopButton";
import { resolveProduct } from "@/data/product-registry";
import { formatCoins } from "@/lib/fictional-config";
import { useSession } from "@/state/session";
import { useSeller } from "@/state/seller";

export const Route = createFileRoute("/product/$productId")({
  head: () => ({
    meta: [
      { title: "Fictional Product Details — Pretendly" },
      {
        name: "description",
        content: "Read fictional reviews, ratings and specs before adding to your pretend cart.",
      },
      { property: "og:title", content: "Fictional Product Details — Pretendly" },
      {
        property: "og:description",
        content: "Imaginary specs, imaginary reviews, imaginary price tag.",
      },
    ],
  }),
  component: ProductDetail,
});

function ProductDetail() {
  const { productId } = Route.useParams();
  const { products: sellerProducts } = useSeller();
  const product = useMemo(() => resolveProduct(productId), [productId, sellerProducts]);
  const { addToCart } = useSession();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  if (!product) {
    return (
      <PageShell>
        <h1 className="text-3xl font-extrabold">This imaginary item vanished</h1>
        <p className="mt-2 text-muted-foreground">
          It was never real to begin with, but still — sorry.
        </p>
        <PopLink to="/catalog" className="mt-6">
          Back to catalog
        </PopLink>
      </PageShell>
    );
  }

  return (
    <PageShell wide>
      <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground">
        <Link to="/catalog" className="font-semibold underline">
          Catalog
        </Link>
        <span aria-hidden="true"> / </span>
        <span>{product.name}</span>
      </nav>

      <div className="mt-4 grid gap-8 lg:grid-cols-2">
        <div
          className="card-pop flex h-72 items-center justify-center text-[7rem] sm:h-96"
          aria-hidden="true"
        >
          {product.emoji}
        </div>

        <div>
          <p className="font-mono text-xs font-bold uppercase tracking-widest text-muted-foreground">
            Sold by {product.seller} • fictional seller
          </p>
          <h1 className="mt-2 text-4xl font-extrabold">{product.name}</h1>
          <p className="mt-2 text-lg text-muted-foreground">{product.blurb}</p>
          <p className="mt-3 font-semibold">
            <span aria-hidden="true">⭐</span> {product.rating.toFixed(1)} ·{" "}
            {product.reviewCount.toLocaleString("en-US")} fictional reviews
          </p>
          <p className="mt-4 font-display text-4xl font-extrabold">{formatCoins(product.price)}</p>
          <p className="text-sm text-muted-foreground">Fictional coins. Never real currency.</p>

          <p className="mt-5">{product.description}</p>

          <div className="mt-6 flex flex-wrap items-end gap-3">
            <div>
              <label htmlFor="qty" className="mb-1 block text-sm font-semibold">
                Quantity
              </label>
              <input
                id="qty"
                type="number"
                min={1}
                max={99}
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, Math.min(99, Number(e.target.value) || 1)))}
                className="w-24 rounded-xl border-2 border-ink bg-card px-3 py-2.5 font-mono"
              />
            </div>
            <PopButton
              size="lg"
              onClick={() => {
                addToCart(product.id, quantity);
                setAdded(true);
              }}
            >
              Add to fictional cart
            </PopButton>
            <PopButton
              size="lg"
              variant="ghost"
              onClick={() => {
                addToCart(product.id, quantity);
                void navigate({ to: "/cart" });
              }}
            >
              Add & view cart
            </PopButton>
          </div>
          <p aria-live="polite" className="mt-3 min-h-5 text-sm font-semibold text-primary">
            {added ? "Added to your fictional cart." : ""}
          </p>

          <FictionalNotice className="mt-4" />
        </div>
      </div>

      <section className="mt-12" aria-labelledby="reviews">
        <h2 id="reviews" className="text-2xl font-extrabold">
          Fictional reviews
        </h2>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2">
          {product.reviews.map((review) => (
            <li key={review.id} className="card-pop p-4">
              <p className="font-bold">
                {review.author}{" "}
                <span className="font-normal text-muted-foreground">
                  {"★".repeat(review.rating)}
                </span>
              </p>
              <p className="mt-1 text-sm text-muted-foreground">{review.body}</p>
            </li>
          ))}
        </ul>
      </section>
    </PageShell>
  );
}
