import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";

import { FictionalNotice } from "@/components/fictional/FictionalNotice";
import { PageShell } from "@/components/fictional/PageShell";
import { PopButton, PopLink } from "@/components/fictional/PopButton";
import { SellerProductForm } from "@/components/fictional/SellerProductForm";
import { SELLER_DISCLAIMER } from "@/lib/fictional-config";
import { useSeller } from "@/state/seller";

export const Route = createFileRoute("/sell")({
  head: () => ({
    meta: [
      { title: "Upload a Fictional Product — Pretendly" },
      {
        name: "description",
        content:
          "Invent an imaginary product, give it a fictional price, and list it in the pretend catalog.",
      },
      { property: "og:title", content: "Upload a Fictional Product — Pretendly" },
      {
        property: "og:description",
        content: "List your made-up invention for other pretend shoppers to add to imaginary carts.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SellPage,
});

function SellPage() {
  const { profile, addProduct, products } = useSeller();
  const navigate = useNavigate();
  const [lastCreated, setLastCreated] = useState<string | null>(null);

  return (
    <PageShell>
      <h1 className="text-4xl font-extrabold sm:text-5xl">List a fictional product</h1>
      <p className="mt-2 text-muted-foreground">
        Anything you upload shows up in the catalog for other pretend shoppers. {SELLER_DISCLAIMER}
      </p>

      <div className="card-pop mt-6 flex flex-wrap items-center gap-3 p-4">
        <span aria-hidden="true" className="text-3xl">
          {profile.avatar}
        </span>
        <div className="mr-auto">
          <p className="font-bold">{profile.displayName}</p>
          <p className="text-sm text-muted-foreground">{profile.tagline}</p>
        </div>
        <PopLink to="/seller-profile" variant="ghost" size="sm">
          Edit seller profile
        </PopLink>
      </div>

      <FictionalNotice className="mt-6" />

      <SellerProductForm
        className="mt-6"
        submitLabel="Publish to fictional catalog"
        onSubmit={(draft) => {
          const created = addProduct(draft);
          setLastCreated(created.name);
        }}
      />

      <p aria-live="polite" className="mt-4 min-h-6 text-sm font-semibold text-primary">
        {lastCreated ? `"${lastCreated}" is now live in the fictional catalog.` : ""}
      </p>

      <div className="mt-4 flex flex-wrap gap-3">
        <PopButton variant="accent" onClick={() => void navigate({ to: "/catalog" })}>
          View catalog
        </PopButton>
        <PopLink to="/manage-seller" variant="ghost">
          Manage my listings ({products.length})
        </PopLink>
      </div>
    </PageShell>
  );
}
