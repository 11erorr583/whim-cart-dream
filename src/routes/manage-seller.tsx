import { Link, createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import { FictionalNotice } from "@/components/fictional/FictionalNotice";
import { PageShell } from "@/components/fictional/PageShell";
import { PopButton, PopLink } from "@/components/fictional/PopButton";
import { SellerProductForm } from "@/components/fictional/SellerProductForm";
import { SELLER_DISCLAIMER, formatCoins } from "@/lib/fictional-config";
import { useSeller } from "@/state/seller";

export const Route = createFileRoute("/manage-seller")({
  head: () => ({
    meta: [
      { title: "Manage My Fictional Listings — Pretendly" },
      {
        name: "description",
        content: "Edit or delete the imaginary products you listed in the pretend catalog.",
      },
      { property: "og:title", content: "Manage My Fictional Listings — Pretendly" },
      {
        property: "og:description",
        content: "Your made-up shop, your rules. Nothing here is real or for sale.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ManageSellerPage,
});

function ManageSellerPage() {
  const { products, profile, updateProduct, deleteProduct, hydrated } = useSeller();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [status, setStatus] = useState<string>("");

  return (
    <PageShell>
      <h1 className="text-4xl font-extrabold sm:text-5xl">My fictional listings</h1>
      <p className="mt-2 text-muted-foreground">
        Listed as {profile.avatar} <strong>{profile.displayName}</strong>. {SELLER_DISCLAIMER}
      </p>

      <FictionalNotice className="mt-6" />

      <p aria-live="polite" className="mt-4 min-h-6 text-sm font-semibold text-primary">
        {status}
      </p>

      {!hydrated ? null : products.length === 0 ? (
        <div className="card-pop mt-2 p-6 text-center">
          <p className="text-muted-foreground">You have not uploaded any imaginary products yet.</p>
          <PopLink to="/sell" className="mt-4">
            List your first invention
          </PopLink>
        </div>
      ) : (
        <ul className="mt-2 grid gap-4">
          {products.map((product) => (
            <li key={product.id} className="card-pop p-4">
              {editingId === product.id ? (
                <SellerProductForm
                  initial={{
                    name: product.name,
                    blurb: product.blurb,
                    category: product.category,
                    price: product.price,
                    emoji: product.emoji,
                    description: product.description,
                  }}
                  submitLabel="Save changes"
                  onCancel={() => setEditingId(null)}
                  onSubmit={(draft) => {
                    updateProduct(product.id, draft);
                    setEditingId(null);
                    setStatus(`"${draft.name}" updated.`);
                  }}
                />
              ) : (
                <div className="flex flex-wrap items-center gap-4">
                  <span aria-hidden="true" className="text-4xl">
                    {product.emoji}
                  </span>
                  <div className="mr-auto min-w-40">
                    <h2 className="text-lg font-bold">
                      <Link
                        to="/product/$productId"
                        params={{ productId: product.id }}
                        className="underline"
                      >
                        {product.name}
                      </Link>
                    </h2>
                    <p className="text-sm text-muted-foreground">{product.blurb}</p>
                    <p className="mt-1 font-display font-extrabold">{formatCoins(product.price)}</p>
                  </div>
                  <div className="flex gap-2">
                    <PopButton
                      size="sm"
                      variant="ghost"
                      onClick={() => setEditingId(product.id)}
                      aria-label={`Edit ${product.name}`}
                    >
                      Edit
                    </PopButton>
                    <PopButton
                      size="sm"
                      variant="accent"
                      onClick={() => {
                        deleteProduct(product.id);
                        setStatus(`"${product.name}" removed from the fictional catalog.`);
                      }}
                      aria-label={`Delete ${product.name}`}
                    >
                      Delete
                    </PopButton>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}

      <div className="mt-8 flex flex-wrap gap-3">
        <PopLink to="/sell" variant="ghost">
          Upload another
        </PopLink>
        <PopLink to="/catalog" variant="ghost">
          Back to catalog
        </PopLink>
      </div>
    </PageShell>
  );
}
