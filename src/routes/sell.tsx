import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { PlusCircle, Store, CheckCircle2, ArrowRight, Package, ShieldCheck } from "lucide-react";

import { FictionalNotice } from "@/components/fictional/FictionalNotice";
import { PageShell } from "@/components/fictional/PageShell";
import { SellerProductForm } from "@/components/fictional/SellerProductForm";
import { useSeller } from "@/state/seller";

export const Route = createFileRoute("/sell")({
  head: () => ({
    meta: [
      { title: "Create New Product Listing — Whim Cart Marketplace" },
      {
        name: "description",
        content:
          "Upload product imagery, configure technical specifications, pricing, and launch new merchandise on Whim Cart.",
      },
      { property: "og:title", content: "Create New Product Listing — Whim Cart" },
      {
        property: "og:description",
        content: "Expand your merchant catalog with high-converting, verified product listings.",
      },
    ],
  }),
  component: SellPage,
});

function SellPage() {
  const { profile, addProduct, products } = useSeller();
  const navigate = useNavigate();
  const [lastCreated, setLastCreated] = useState<string | null>(null);

  return (
    <PageShell wide>
      {/* Page Title */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full uppercase tracking-wider mb-2 w-fit">
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Merchant Studio Portal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display">
            Create Product Listing
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Publish boutique goods, technical accessories, or handcrafted lifestyle products.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/manage-seller"
            className="px-4 py-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-800 text-xs font-bold transition-colors"
          >
            Manage Existing ({products.length})
          </Link>
          <Link
            to="/seller-profile"
            className="px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors"
          >
            Store Profile
          </Link>
        </div>
      </div>

      {/* Seller Header Badge */}
      <div className="mt-6 bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center shrink-0">
            {profile.avatar && profile.avatar.startsWith("http") ? (
              <img
                src={profile.avatar}
                alt={profile.displayName}
                referrerPolicy="no-referrer"
                onError={(e) => {
                  const target = e.currentTarget;
                  if (!target.src.includes("photo-1534528741775-53994a69daeb")) {
                    target.src =
                      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80";
                  }
                }}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-2xl">{profile.avatar || "🏪"}</span>
            )}
          </span>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-slate-900 text-sm">{profile.displayName}</h3>
              <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-100/60 px-2 py-0.5 rounded-md flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Active Merchant
              </span>
            </div>
            <p className="text-xs text-slate-500">{profile.tagline}</p>
          </div>
        </div>

        <Link
          to="/seller-profile"
          className="text-xs font-bold text-emerald-700 hover:underline flex items-center gap-1"
        >
          <span>Edit Merchant Details</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Success Banner */}
      {lastCreated && (
        <div className="mt-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <div>
              <p className="text-xs font-bold text-emerald-900">
                "{lastCreated}" has been published to the marketplace catalog!
              </p>
              <p className="text-[11px] text-emerald-700">
                Buyers can now browse, add to cart, and checkout this item.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => void navigate({ to: "/catalog" })}
              className="px-3.5 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition-colors cursor-pointer"
            >
              View in Catalog
            </button>
          </div>
        </div>
      )}

      {/* Product Upload Form */}
      <div className="mt-6">
        <SellerProductForm
          submitLabel="Publish Product to Marketplace"
          onSubmit={(draft) => {
            const created = addProduct(draft);
            setLastCreated(created.name);
          }}
        />
      </div>

      <FictionalNotice
        className="mt-8"
        title="Merchant Compliance Notice"
        description="All published items are instantly indexed and made available in the active marketplace catalog with simulated buyer checkout."
      />
    </PageShell>
  );
}
