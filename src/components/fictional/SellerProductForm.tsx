import { useState, type FormEvent } from "react";

import { PopButton } from "@/components/fictional/PopButton";
import { CATEGORIES } from "@/data/products";
import { cn } from "@/lib/utils";
import type { SellerDraft } from "@/state/seller";
import type { ProductCategory } from "@/types/shopping";

const EMOJI_CHOICES = ["✨", "🛸", "🍭", "🧦", "🪑", "🐾", "🎈", "🔮", "🧪", "🪄"];

const inputClass = "w-full rounded-xl border-2 border-ink bg-card px-4 py-2.5";

export function SellerProductForm({
  initial,
  submitLabel,
  onSubmit,
  onCancel,
  className,
}: {
  initial?: SellerDraft;
  submitLabel: string;
  onSubmit: (draft: SellerDraft) => void;
  onCancel?: () => void;
  className?: string;
}) {
  const [name, setName] = useState(initial?.name ?? "");
  const [blurb, setBlurb] = useState(initial?.blurb ?? "");
  const [category, setCategory] = useState<ProductCategory>(initial?.category ?? "absurd");
  const [price, setPrice] = useState(String(initial?.price ?? 100));
  const [emoji, setEmoji] = useState(initial?.emoji ?? "✨");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const parsedPrice = Number(price);
    if (name.trim().length < 3) return setError("Give your invention a name of at least 3 characters.");
    if (blurb.trim().length < 3) return setError("Add a short tagline so shoppers know the vibe.");
    if (!Number.isFinite(parsedPrice) || parsedPrice <= 0)
      return setError("Fictional price must be a number above zero.");
    if (description.trim().length < 10)
      return setError("Describe the imaginary product in at least 10 characters.");

    setError(null);
    onSubmit({
      name: name.trim(),
      blurb: blurb.trim(),
      category,
      price: Math.round(parsedPrice),
      emoji,
      description: description.trim(),
    });
    if (!initial) {
      setName("");
      setBlurb("");
      setDescription("");
      setPrice("100");
    }
  };

  return (
    <form onSubmit={handleSubmit} className={cn("card-pop grid gap-4 p-5", className)} noValidate>
      <div>
        <label htmlFor="sp-name" className="mb-1 block text-sm font-semibold">
          Product name
        </label>
        <input
          id="sp-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Self-Stirring Soup Hat"
          className={inputClass}
          required
        />
      </div>

      <div>
        <label htmlFor="sp-blurb" className="mb-1 block text-sm font-semibold">
          Tagline
        </label>
        <input
          id="sp-blurb"
          value={blurb}
          onChange={(e) => setBlurb(e.target.value)}
          placeholder="Warm head. Warmer soup."
          className={inputClass}
          required
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="sp-category" className="mb-1 block text-sm font-semibold">
            Category
          </label>
          <select
            id="sp-category"
            value={category}
            onChange={(e) => setCategory(e.target.value as ProductCategory)}
            className={cn(inputClass, "font-semibold")}
          >
            {CATEGORIES.filter((c) => c.id !== "all").map((c) => (
              <option key={c.id} value={c.id}>
                {c.emoji} {c.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="sp-price" className="mb-1 block text-sm font-semibold">
            Fictional price (coins)
          </label>
          <input
            id="sp-price"
            type="number"
            min={1}
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className={cn(inputClass, "font-mono")}
            required
          />
        </div>
      </div>

      <fieldset>
        <legend className="mb-1 text-sm font-semibold">Product emoji</legend>
        <div className="flex flex-wrap gap-2">
          {EMOJI_CHOICES.map((choice) => (
            <button
              key={choice}
              type="button"
              onClick={() => setEmoji(choice)}
              aria-pressed={emoji === choice}
              aria-label={`Use ${choice} as the product emoji`}
              className={cn(
                "rounded-xl border-2 border-ink px-3 py-1.5 text-xl transition-colors",
                emoji === choice ? "bg-primary" : "bg-card",
              )}
            >
              <span aria-hidden="true">{choice}</span>
            </button>
          ))}
        </div>
      </fieldset>

      <div>
        <label htmlFor="sp-description" className="mb-1 block text-sm font-semibold">
          Description
        </label>
        <textarea
          id="sp-description"
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Explain what this imaginary thing does and why it should not exist."
          className={inputClass}
          required
        />
      </div>

      <p aria-live="polite" className="min-h-5 text-sm font-semibold text-destructive">
        {error}
      </p>

      <div className="flex flex-wrap gap-3">
        <PopButton type="submit">{submitLabel}</PopButton>
        {onCancel ? (
          <PopButton type="button" variant="ghost" onClick={onCancel}>
            Cancel
          </PopButton>
        ) : null}
      </div>
    </form>
  );
}
