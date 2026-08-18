import { Link } from "@tanstack/react-router";

import { PopButton } from "@/components/fictional/PopButton";
import { formatCoins } from "@/lib/fictional-config";
import type { Product } from "@/types/shopping";

export function ProductCard({
  product,
  onAdd,
}: {
  product: Product;
  onAdd: (productId: string) => void;
}) {
  return (
    <article className="card-pop flex flex-col overflow-hidden">
      <Link
        to="/product/$productId"
        params={{ productId: product.id }}
        className="flex flex-col gap-3 p-4 focus-visible:bg-secondary/60"
      >
        <div
          className="flex h-32 items-center justify-center rounded-lg border-2 border-ink bg-secondary text-6xl"
          aria-hidden="true"
        >
          {product.emoji}
        </div>
        <div>
          <h3 className="text-lg font-bold leading-tight">{product.name}</h3>
          <p className="mt-1 text-sm text-muted-foreground">{product.blurb}</p>
        </div>
        <p className="text-sm font-semibold">
          <span aria-hidden="true">⭐</span> {product.rating.toFixed(1)}{" "}
          <span className="font-normal text-muted-foreground">
            ({product.reviewCount.toLocaleString("en-US")} fictional reviews)
          </span>
        </p>
      </Link>
      <div className="mt-auto flex items-center justify-between gap-2 border-t-2 border-ink px-4 py-3">
        <p className="font-display text-xl font-extrabold">{formatCoins(product.price)}</p>
        <PopButton
          size="sm"
          onClick={() => onAdd(product.id)}
          aria-label={`Add ${product.name} to fictional cart`}
        >
          Add
        </PopButton>
      </div>
    </article>
  );
}
