import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";

import { FictionalNotice } from "@/components/fictional/FictionalNotice";
import { PageShell } from "@/components/fictional/PageShell";
import { PopButton, PopLink } from "@/components/fictional/PopButton";
import { AVATAR_CHOICES, SELLER_DISCLAIMER } from "@/lib/fictional-config";
import { cn } from "@/lib/utils";
import { useSeller } from "@/state/seller";

export const Route = createFileRoute("/seller-profile")({
  head: () => ({
    meta: [
      { title: "Your Fictional Seller Profile — Pretendly" },
      {
        name: "description",
        content:
          "Pick a made-up seller name, tagline and avatar shown on the imaginary products you upload.",
      },
      { property: "og:title", content: "Your Fictional Seller Profile — Pretendly" },
      {
        property: "og:description",
        content: "A pretend shopfront identity — no real names, no real contact details.",
      },
      { property: "og:type", content: "profile" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SellerProfilePage,
});

const inputClass = "w-full rounded-xl border-2 border-ink bg-card px-4 py-2.5";

function SellerProfilePage() {
  const { profile, products, saveProfile, hydrated } = useSeller();
  const [displayName, setDisplayName] = useState(profile.displayName);
  const [tagline, setTagline] = useState(profile.tagline);
  const [avatar, setAvatar] = useState(profile.avatar);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!hydrated) return;
    setDisplayName(profile.displayName);
    setTagline(profile.tagline);
    setAvatar(profile.avatar);
  }, [hydrated, profile]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    saveProfile({
      displayName: displayName.trim() || "Anonymous Dreamer",
      tagline: tagline.trim() || "Inventing things that will never exist.",
      avatar,
    });
    setSaved(true);
  };

  return (
    <PageShell>
      <h1 className="text-4xl font-extrabold sm:text-5xl">Your fictional seller identity</h1>
      <p className="mt-2 text-muted-foreground">
        Shown on every product you upload. Use a made-up persona — {SELLER_DISCLAIMER}
      </p>

      <FictionalNotice className="mt-6" />

      <div className="card-pop mt-6 flex items-center gap-4 p-5">
        <span aria-hidden="true" className="text-5xl">
          {avatar}
        </span>
        <div>
          <p className="font-display text-2xl font-extrabold">{displayName || "Unnamed seller"}</p>
          <p className="text-muted-foreground">{tagline}</p>
          <p className="mt-1 text-sm font-semibold">
            {products.length} fictional listing{products.length === 1 ? "" : "s"}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="card-pop mt-6 grid gap-4 p-5">
        <div>
          <label htmlFor="seller-name" className="mb-1 block text-sm font-semibold">
            Seller name (invented)
          </label>
          <input
            id="seller-name"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            maxLength={40}
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="seller-tagline" className="mb-1 block text-sm font-semibold">
            Shop tagline
          </label>
          <input
            id="seller-tagline"
            value={tagline}
            onChange={(e) => setTagline(e.target.value)}
            maxLength={80}
            className={inputClass}
          />
        </div>
        <fieldset>
          <legend className="mb-1 text-sm font-semibold">Avatar</legend>
          <div className="flex flex-wrap gap-2">
            {AVATAR_CHOICES.map((choice) => (
              <button
                key={choice}
                type="button"
                onClick={() => setAvatar(choice)}
                aria-pressed={avatar === choice}
                aria-label={`Use ${choice} as your seller avatar`}
                className={cn(
                  "rounded-xl border-2 border-ink px-3 py-1.5 text-2xl transition-colors",
                  avatar === choice ? "bg-primary" : "bg-card",
                )}
              >
                <span aria-hidden="true">{choice}</span>
              </button>
            ))}
          </div>
        </fieldset>

        <div className="flex flex-wrap gap-3">
          <PopButton type="submit">Save seller profile</PopButton>
          <PopLink to="/sell" variant="ghost">
            Back to uploading
          </PopLink>
        </div>
        <p aria-live="polite" className="min-h-5 text-sm font-semibold text-primary">
          {saved ? "Seller profile saved and applied to your listings." : ""}
        </p>
      </form>
    </PageShell>
  );
}
