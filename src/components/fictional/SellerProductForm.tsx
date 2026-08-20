import { useState, useRef, type FormEvent, type ChangeEvent } from "react";
import {
  Upload,
  Image as ImageIcon,
  Plus,
  Trash2,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Tag,
  Layers,
  DollarSign,
  Package,
  Wand2,
} from "lucide-react";

import { CATEGORIES } from "@/data/products";
import { SAMPLE_PRODUCT_IMAGES, formatCoins } from "@/lib/fictional-config";
import { analyzeListingRisk, type SellerDraft } from "@/state/seller";
import type { ProductCategory } from "@/types/shopping";
import { cn } from "@/lib/utils";

const inputClass =
  "w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-900 focus:ring-1 focus:ring-slate-900 transition-colors";

export function SellerProductForm({
  initial,
  submitLabel = "Publish Product",
  onSubmit,
  onCancel,
  className,
}: {
  initial?: Partial<SellerDraft>;
  submitLabel?: string;
  onSubmit: (draft: SellerDraft) => void;
  onCancel?: () => void;
  className?: string;
}) {
  const [name, setName] = useState(initial?.name ?? "");
  const [blurb, setBlurb] = useState(initial?.blurb ?? "");
  const [category, setCategory] = useState<ProductCategory>(initial?.category ?? "gadgets");
  const [price, setPrice] = useState(String(initial?.price ?? "49.00"));
  const [comparePrice, setComparePrice] = useState(
    initial?.comparePrice ? String(initial.comparePrice) : "",
  );
  const [inventory, setInventory] = useState(String(initial?.inventory ?? "25"));
  const [sku, setSku] = useState(
    initial?.sku ?? `SKU-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
  );
  const [condition, setCondition] = useState<"Brand New" | "Refurbished" | "Like New">(
    initial?.condition ?? "Brand New",
  );
  const [description, setDescription] = useState(initial?.description ?? "");
  const [images, setImages] = useState<string[]>(
    initial?.images && initial.images.length > 0
      ? initial.images
      : [SAMPLE_PRODUCT_IMAGES[0]?.url || ""],
  );
  const [urlInput, setUrlInput] = useState("");
  const [showPresets, setShowPresets] = useState(false);

  // Specifications
  const [specs, setSpecs] = useState<Array<{ key: string; value: string }>>(
    initial?.specifications
      ? Object.entries(initial.specifications).map(([key, value]) => ({ key, value }))
      : [
          { key: "Material", value: "Premium Composite & Aluminum" },
          { key: "Warranty", value: "2-Year Manufacturer Warranty" },
        ],
  );

  // Tags
  const [tagsInput, setTagsInput] = useState(
    initial?.tags ? initial.tags.join(", ") : "Featured, Free Shipping",
  );
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle local image file upload (Base64)
  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      if (!file.type.startsWith("image/")) return;
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result as string;
        if (base64) {
          setImages((prev) => [...prev, base64]);
        }
      };
      reader.readAsDataURL(file);
    });

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleAddImageUrl = () => {
    if (!urlInput.trim()) return;
    setImages((prev) => [...prev, urlInput.trim()]);
    setUrlInput("");
  };

  const handleRemoveImage = (index: number) => {
    setImages((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleMakePrimary = (index: number) => {
    setImages((prev) => {
      const copy = [...prev];
      const [chosen] = copy.splice(index, 1);
      if (chosen) copy.unshift(chosen);
      return copy;
    });
  };

  const handleAddSpec = () => {
    setSpecs((prev) => [...prev, { key: "", value: "" }]);
  };

  const handleUpdateSpec = (index: number, field: "key" | "value", val: string) => {
    setSpecs((prev) => prev.map((item, idx) => (idx === index ? { ...item, [field]: val } : item)));
  };

  const handleRemoveSpec = (index: number) => {
    setSpecs((prev) => prev.filter((_, idx) => idx !== index));
  };

  const generateSku = () => {
    const prefix = category.substring(0, 3).toUpperCase();
    const random = Math.random().toString(36).substring(2, 7).toUpperCase();
    setSku(`${prefix}-${random}`);
  };

  // Live AI Quality & Risk Assessment
  const currentDraft: Partial<SellerDraft> = {
    name,
    description,
    price: Number(price),
    images,
    inventory: Number(inventory),
  };
  const analysis = analyzeListingRisk(currentDraft);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const parsedPrice = parseFloat(price);
    const parsedCompare = comparePrice ? parseFloat(comparePrice) : undefined;
    const parsedInventory = parseInt(inventory, 10);

    if (name.trim().length < 3) {
      return setError("Please provide a product title of at least 3 characters.");
    }
    if (blurb.trim().length < 5) {
      return setError("Please add a concise subtitle / blurb for search summaries.");
    }
    if (isNaN(parsedPrice) || parsedPrice <= 0) {
      return setError("Price must be a valid number greater than $0.00.");
    }
    if (images.length === 0) {
      return setError("Please upload or select at least 1 gallery photo for this product.");
    }
    if (description.trim().length < 15) {
      return setError("Please write a detailed product description (minimum 15 characters).");
    }

    const specRecord: Record<string, string> = {};
    specs.forEach((s) => {
      if (s.key.trim() && s.value.trim()) {
        specRecord[s.key.trim()] = s.value.trim();
      }
    });

    const parsedTags = tagsInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    setError(null);

    onSubmit({
      name: name.trim(),
      blurb: blurb.trim(),
      category,
      price: parsedPrice,
      comparePrice: parsedCompare,
      images,
      inventory: isNaN(parsedInventory) ? 10 : parsedInventory,
      sku: sku.trim() || undefined,
      condition,
      specifications: specRecord,
      tags: parsedTags.length > 0 ? parsedTags : ["New Arrival"],
      description: description.trim(),
      status: "active",
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={cn("grid grid-cols-1 lg:grid-cols-3 gap-6", className)}
      noValidate
    >
      {/* Main Left Column (2 Cols) */}
      <div className="lg:col-span-2 space-y-6">
        {/* Core Info Card */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4 shadow-xs">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
            <Package className="w-4 h-4 text-emerald-600" />
            <span>Product General Information</span>
          </h3>

          <div>
            <label htmlFor="sp-name" className="block text-xs font-semibold text-slate-700 mb-1">
              Product Title <span className="text-rose-500">*</span>
            </label>
            <input
              id="sp-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Minimalist Wireless Mechanical Keyboard (87-Key)"
              className={inputClass}
              required
            />
          </div>

          <div>
            <label htmlFor="sp-blurb" className="block text-xs font-semibold text-slate-700 mb-1">
              Short Tagline / Subtitle <span className="text-rose-500">*</span>
            </label>
            <input
              id="sp-blurb"
              value={blurb}
              onChange={(e) => setBlurb(e.target.value)}
              placeholder="e.g. Hot-swappable switches with anodized aluminum body and Bluetooth 5.2"
              className={inputClass}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="sp-category"
                className="block text-xs font-semibold text-slate-700 mb-1"
              >
                Marketplace Category <span className="text-rose-500">*</span>
              </label>
              <select
                id="sp-category"
                value={category}
                onChange={(e) => setCategory(e.target.value as ProductCategory)}
                className={inputClass}
              >
                {CATEGORIES.filter((c) => c.id !== "all").map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.emoji} {c.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="sp-condition"
                className="block text-xs font-semibold text-slate-700 mb-1"
              >
                Item Condition
              </label>
              <select
                id="sp-condition"
                value={condition}
                onChange={(e) =>
                  setCondition(e.target.value as "Brand New" | "Refurbished" | "Like New")
                }
                className={inputClass}
              >
                <option value="Brand New">Brand New (Sealed in Original Packaging)</option>
                <option value="Refurbished">Certified Refurbished (Grade A)</option>
                <option value="Like New">Like New (Open Box inspected)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Product Media Gallery Card */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4 shadow-xs">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-emerald-600" />
              <span>Product Image Gallery ({images.length})</span>
            </h3>
            <button
              type="button"
              onClick={() => setShowPresets(!showPresets)}
              className="text-xs text-emerald-700 hover:text-emerald-800 font-semibold flex items-center gap-1 cursor-pointer"
            >
              <Wand2 className="w-3.5 h-3.5" />
              <span>{showPresets ? "Hide Presets" : "Use Preset Photos"}</span>
            </button>
          </div>

          {/* Preset Picker Drawer */}
          {showPresets && (
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-2">
              <p className="text-xs text-slate-600 font-medium">
                Click any high-resolution product photography preset to append:
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {SAMPLE_PRODUCT_IMAGES.map((sample) => (
                  <button
                    key={sample.id}
                    type="button"
                    onClick={() => {
                      setImages((prev) => [...prev, sample.url]);
                    }}
                    className="flex flex-col items-center p-2 bg-white rounded-md border border-slate-200 hover:border-emerald-600 transition-colors text-left group"
                  >
                    <img
                      src={sample.url}
                      alt={sample.label}
                      className="w-full h-16 object-cover rounded-sm mb-1"
                    />
                    <span className="text-[11px] font-semibold text-slate-800 truncate w-full group-hover:text-emerald-700">
                      {sample.label}
                    </span>
                    <span className="text-[10px] text-slate-400 capitalize">{sample.category}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Upload Dropzone & URL Input */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* File Upload Trigger */}
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-300 hover:border-emerald-600 hover:bg-emerald-50/30 rounded-lg p-4 flex flex-col items-center justify-center text-center cursor-pointer transition-all"
            >
              <Upload className="w-6 h-6 text-slate-400 mb-2" />
              <span className="text-xs font-semibold text-slate-800">Upload from Computer</span>
              <span className="text-[11px] text-slate-500 mt-0.5">Supports JPG, PNG, WebP</span>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>

            {/* Direct URL Input */}
            <div className="border border-slate-200 rounded-lg p-3 bg-slate-50 flex flex-col justify-between">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Add Image by Web URL
                </label>
                <input
                  type="url"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className={cn(inputClass, "text-xs mb-2")}
                />
              </div>
              <button
                type="button"
                onClick={handleAddImageUrl}
                disabled={!urlInput.trim()}
                className="w-full py-1.5 px-3 rounded-md bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white text-xs font-semibold transition-colors flex items-center justify-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Photo URL</span>
              </button>
            </div>
          </div>

          {/* Current Gallery Grid */}
          {images.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              {images.map((imgUrl, idx) => (
                <div
                  key={idx}
                  className="relative group rounded-lg overflow-hidden border border-slate-200 aspect-square bg-slate-100"
                >
                  <img
                    src={imgUrl}
                    alt={`Product preview ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                  {idx === 0 && (
                    <span className="absolute top-1.5 left-1.5 bg-slate-900 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-sm uppercase tracking-wider">
                      Primary Cover
                    </span>
                  )}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-2">
                    {idx !== 0 && (
                      <button
                        type="button"
                        onClick={() => handleMakePrimary(idx)}
                        className="p-1.5 bg-white rounded-md text-slate-800 hover:bg-slate-100 text-[10px] font-bold"
                        title="Set as Cover"
                      >
                        Cover
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(idx)}
                      className="p-1.5 bg-rose-600 text-white rounded-md hover:bg-rose-700"
                      title="Delete Image"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-amber-700 bg-amber-50 p-3 rounded-lg border border-amber-200 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>No images added yet. Add at least 1 photo for buyer visibility.</span>
            </p>
          )}
        </div>

        {/* Pricing, Inventory & Stock */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4 shadow-xs">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-emerald-600" />
            <span>Pricing, Inventory & SKU</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label htmlFor="sp-price" className="block text-xs font-semibold text-slate-700 mb-1">
                Selling Price ($ USD) <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-slate-400 font-bold">$</span>
                <input
                  id="sp-price"
                  type="number"
                  step="0.01"
                  min="0.50"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className={cn(inputClass, "pl-7 font-mono font-bold")}
                  required
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="sp-compare"
                className="block text-xs font-semibold text-slate-700 mb-1"
              >
                MSRP / Compare Price (Optional)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-slate-400 font-bold">$</span>
                <input
                  id="sp-compare"
                  type="number"
                  step="0.01"
                  value={comparePrice}
                  onChange={(e) => setComparePrice(e.target.value)}
                  placeholder="e.g. 79.00"
                  className={cn(inputClass, "pl-7 font-mono")}
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="sp-inventory"
                className="block text-xs font-semibold text-slate-700 mb-1"
              >
                Available Stock Count
              </label>
              <input
                id="sp-inventory"
                type="number"
                min="0"
                value={inventory}
                onChange={(e) => setInventory(e.target.value)}
                className={cn(inputClass, "font-mono font-bold")}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label htmlFor="sp-sku" className="block text-xs font-semibold text-slate-700">
                  Custom Merchant SKU
                </label>
                <button
                  type="button"
                  onClick={generateSku}
                  className="text-[11px] text-emerald-700 hover:underline font-semibold"
                >
                  Generate
                </button>
              </div>
              <input
                id="sp-sku"
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                className={cn(inputClass, "font-mono uppercase")}
              />
            </div>

            <div>
              <label htmlFor="sp-tags" className="block text-xs font-semibold text-slate-700 mb-1">
                Search Tags (comma separated)
              </label>
              <input
                id="sp-tags"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="Wireless, Aluminum, Bestseller"
                className={inputClass}
              />
            </div>
          </div>
        </div>

        {/* Specifications & Highlights */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4 shadow-xs">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-600" />
              <span>Technical Specifications & Attributes</span>
            </h3>
            <button
              type="button"
              onClick={handleAddSpec}
              className="text-xs text-emerald-700 hover:text-emerald-800 font-semibold flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Attribute</span>
            </button>
          </div>

          <div className="space-y-2">
            {specs.map((item, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <input
                  value={item.key}
                  onChange={(e) => handleUpdateSpec(idx, "key", e.target.value)}
                  placeholder="e.g. Dimensions / Battery"
                  className={cn(inputClass, "w-1/3")}
                />
                <input
                  value={item.value}
                  onChange={(e) => handleUpdateSpec(idx, "value", e.target.value)}
                  placeholder="e.g. 180mm x 90mm x 7.5mm"
                  className={cn(inputClass, "flex-1")}
                />
                <button
                  type="button"
                  onClick={() => handleRemoveSpec(idx)}
                  className="p-2 text-slate-400 hover:text-rose-600 transition-colors"
                  title="Remove spec"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Description Editor */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4 shadow-xs">
          <label
            htmlFor="sp-description"
            className="block text-xs font-semibold text-slate-700 mb-1"
          >
            Complete Product Description & Overview <span className="text-rose-500">*</span>
          </label>
          <textarea
            id="sp-description"
            rows={5}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Write a clear overview detailing the craftsmanship, materials, box contents, compatibility, and why buyers will love this product..."
            className={inputClass}
            required
          />
        </div>
      </div>

      {/* Right Column: AI Risk & Quality Review + Actions */}
      <div className="space-y-6">
        {/* AI Listing Health Panel */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>Listing Health & Quality</span>
            </h4>
            <span
              className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                analysis.qualityScore >= 80
                  ? "bg-emerald-100 text-emerald-800"
                  : analysis.qualityScore >= 50
                    ? "bg-amber-100 text-amber-800"
                    : "bg-rose-100 text-rose-800"
              }`}
            >
              {analysis.qualityScore}/100
            </span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between text-slate-600">
              <span>Risk Assessment:</span>
              <span className="font-semibold capitalize text-emerald-700 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                {analysis.riskLevel} Risk ({analysis.riskScore}/100)
              </span>
            </div>

            {analysis.feedback.length > 0 ? (
              <div className="mt-3 p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-1.5">
                <span className="font-semibold text-slate-700 text-[11px]">Optimization Tips:</span>
                <ul className="space-y-1 text-slate-500 list-disc list-inside text-[11px]">
                  {analysis.feedback.map((tip, i) => (
                    <li key={i}>{tip}</li>
                  ))}
                </ul>
              </div>
            ) : (
              <div className="mt-2 p-2.5 rounded-lg bg-emerald-50 text-emerald-900 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Listing fulfills all high-converting merchant quality checks.</span>
              </div>
            )}
          </div>
        </div>

        {/* Live Marketplace Preview Card */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-3 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
            Customer Card Preview
          </span>
          <div className="border border-slate-200 rounded-lg overflow-hidden bg-white shadow-xs">
            <div className="aspect-4/3 bg-slate-100 overflow-hidden relative">
              {images[0] ? (
                <img src={images[0]} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-400 text-sm">
                  Photo Preview
                </div>
              )}
            </div>
            <div className="p-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded-sm">
                {category}
              </span>
              <h5 className="font-semibold text-slate-900 text-xs mt-1 line-clamp-1">
                {name || "Untitled Product"}
              </h5>
              <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                {blurb || "Add a subtitle..."}
              </p>
              <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between">
                <span className="font-bold text-slate-900 text-sm">
                  {formatCoins(parseFloat(price) || 0)}
                </span>
                <span className="text-[11px] text-slate-400">Stock: {inventory || 0}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-lg text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-2 pt-2">
          <button
            type="submit"
            className="w-full py-3 px-4 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold shadow-sm transition-all active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{submitLabel}</span>
          </button>
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="w-full py-2.5 px-4 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 text-sm font-semibold transition-colors cursor-pointer"
            >
              Cancel
            </button>
          )}
        </div>
      </div>
    </form>
  );
}
