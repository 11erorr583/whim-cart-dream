import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import {
  Store,
  CheckCircle2,
  Building2,
  CreditCard,
  Truck,
  ShieldCheck,
  Award,
  Sparkles,
  MapPin,
  Mail,
  ExternalLink,
  Package,
  DollarSign,
  ArrowRight,
  TrendingUp,
} from "lucide-react";

import { FictionalNotice } from "@/components/fictional/FictionalNotice";
import { PageShell } from "@/components/fictional/PageShell";
import { AVATAR_CHOICES, formatCoins } from "@/lib/fictional-config";
import { useSeller } from "@/state/seller";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/seller-profile")({
  head: () => ({
    meta: [
      { title: "Merchant Registration & Store Profile — Whim Cart" },
      {
        name: "description",
        content:
          "Register your merchant storefront, configure shipping policies, manage payouts, and update your boutique profile on Whim Cart.",
      },
      { property: "og:title", content: "Merchant Registration & Store Profile — Whim Cart" },
      {
        property: "og:description",
        content:
          "Open your boutique storefront on Whim Cart and reach verified shoppers worldwide.",
      },
    ],
  }),
  component: SellerProfilePage,
});

const inputClass =
  "w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-900 focus:ring-1 focus:ring-slate-900 transition-colors";

function SellerProfilePage() {
  const { profile, products, orders, saveProfile, registerAsSeller, hydrated } = useSeller();
  const navigate = useNavigate();

  // Onboarding / Profile Form State
  const [displayName, setDisplayName] = useState(profile.displayName);
  const [tagline, setTagline] = useState(profile.tagline);
  const [bio, setBio] = useState(profile.bio || "");
  const [avatar, setAvatar] = useState(profile.avatar);
  const [location, setLocation] = useState(profile.location || "San Francisco, CA");
  const [supportEmail, setSupportEmail] = useState(profile.supportEmail || "merchant@whimcart.com");
  const [returnPolicyDays, setReturnPolicyDays] = useState(
    String(profile.returnPolicyDays || "30"),
  );
  const [payoutAccount, setPayoutAccount] = useState(
    profile.payoutAccount || "****-****-****-8821",
  );
  const [category, setCategory] = useState(profile.category || "Lifestyle & Design Goods");
  const [coverPhoto, setCoverPhoto] = useState(
    profile.coverPhoto ||
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&auto=format&fit=crop&q=80",
  );

  const [onboardingStep, setOnboardingStep] = useState<1 | 2 | 3>(1);
  const [savedMessage, setSavedMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!hydrated) return;
    setDisplayName(profile.displayName);
    setTagline(profile.tagline);
    setBio(profile.bio || "");
    setAvatar(profile.avatar);
    setLocation(profile.location || "San Francisco, CA");
    setSupportEmail(profile.supportEmail || "merchant@whimcart.com");
    setReturnPolicyDays(String(profile.returnPolicyDays || "30"));
    setPayoutAccount(profile.payoutAccount || "****-****-****-8821");
    setCategory(profile.category || "Lifestyle & Design Goods");
    if (profile.coverPhoto) setCoverPhoto(profile.coverPhoto);
  }, [hydrated, profile]);

  const handleRegister = (e: FormEvent) => {
    e.preventDefault();
    registerAsSeller({
      displayName: displayName.trim() || "Artisan Goods Co.",
      tagline: tagline.trim() || "Handcrafted modern essentials.",
      bio: bio.trim() || "Dedicated to sustainable materials and meticulous craftsmanship.",
      avatar,
      location: location.trim(),
      supportEmail: supportEmail.trim(),
      returnPolicyDays: parseInt(returnPolicyDays, 10) || 30,
      payoutAccount: payoutAccount.trim(),
      category: category.trim(),
      coverPhoto,
      isRegistered: true,
      verifiedStatus: "verified",
    });
    setSavedMessage("Merchant storefront successfully registered and verified!");
    setTimeout(() => setSavedMessage(null), 4000);
  };

  const handleSaveProfile = (e: FormEvent) => {
    e.preventDefault();
    saveProfile({
      displayName: displayName.trim() || "Artisan Goods Co.",
      tagline: tagline.trim() || "Handcrafted modern essentials.",
      bio: bio.trim(),
      avatar,
      location: location.trim(),
      supportEmail: supportEmail.trim(),
      returnPolicyDays: parseInt(returnPolicyDays, 10) || 30,
      payoutAccount: payoutAccount.trim(),
      category: category.trim(),
      coverPhoto,
      isRegistered: true,
    });
    setSavedMessage("Merchant profile settings updated successfully.");
    setTimeout(() => setSavedMessage(null), 4000);
  };

  const totalRevenue = orders.reduce((sum, o) => sum + o.subtotal, 0);

  return (
    <PageShell wide>
      {/* Toast Notification */}
      {savedMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-xl border border-slate-800 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-xs font-semibold">{savedMessage}</span>
        </div>
      )}

      {/* If Not Registered: Show Multi-Stage Merchant Onboarding */}
      {!profile.isRegistered ? (
        <div className="max-w-3xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold uppercase tracking-wider">
              <Store className="w-3.5 h-3.5" />
              <span>Merchant Onboarding Suite</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-display">
              Open Your Merchant Storefront
            </h1>
            <p className="text-sm text-slate-600 max-w-xl mx-auto">
              Join thousands of independent studios and verified boutique brands selling directly to
              enthusiastic shoppers worldwide.
            </p>
          </div>

          {/* Stepper Tabs */}
          <div className="grid grid-cols-3 gap-2 border-b border-slate-200 pb-3 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setOnboardingStep(1)}
              className={`py-2 text-center rounded-lg transition-colors ${
                onboardingStep === 1
                  ? "bg-slate-900 text-white"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              1. Brand & Store Info
            </button>
            <button
              type="button"
              onClick={() => setOnboardingStep(2)}
              className={`py-2 text-center rounded-lg transition-colors ${
                onboardingStep === 2
                  ? "bg-slate-900 text-white"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              2. Shipping & Policies
            </button>
            <button
              type="button"
              onClick={() => setOnboardingStep(3)}
              className={`py-2 text-center rounded-lg transition-colors ${
                onboardingStep === 3
                  ? "bg-slate-900 text-white"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              3. Payout & Verification
            </button>
          </div>

          {/* Onboarding Form */}
          <form
            onSubmit={handleRegister}
            className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6"
          >
            {onboardingStep === 1 && (
              <div className="space-y-4">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-emerald-600" />
                  <span>Step 1: Storefront Identity & Category</span>
                </h3>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Storefront Business Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="e.g. Luminary Craft Studio"
                    className={inputClass}
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Brand Tagline / Header <span className="text-rose-500">*</span>
                  </label>
                  <input
                    value={tagline}
                    onChange={(e) => setTagline(e.target.value)}
                    placeholder="e.g. Precision-crafted lifestyle goods and mechanical accessories"
                    className={inputClass}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Primary Industry Category
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className={inputClass}
                    >
                      <option value="Lifestyle & Design Goods">Lifestyle & Design Goods</option>
                      <option value="Electronics & Audio">Electronics & Audio</option>
                      <option value="Home & Studio Decor">Home & Studio Decor</option>
                      <option value="Apparel & Leathercraft">Apparel & Leathercraft</option>
                      <option value="Culinary & Specialty Gourmet">
                        Culinary & Specialty Gourmet
                      </option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Merchant Studio Location
                    </label>
                    <input
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="e.g. Portland, Oregon, USA"
                      className={inputClass}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Storefront Bio & Story
                  </label>
                  <textarea
                    rows={3}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Tell buyers about your design philosophy, sourcing standards, and what makes your workshop unique..."
                    className={inputClass}
                  />
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="button"
                    onClick={() => setOnboardingStep(2)}
                    className="px-5 py-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>Continue to Shipping Policies</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {onboardingStep === 2 && (
              <div className="space-y-4">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Truck className="w-5 h-5 text-emerald-600" />
                  <span>Step 2: Fulfillment, Contact & Return Terms</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Customer Support Email
                    </label>
                    <input
                      type="email"
                      value={supportEmail}
                      onChange={(e) => setSupportEmail(e.target.value)}
                      placeholder="support@yourbrand.com"
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Customer Return Window
                    </label>
                    <select
                      value={returnPolicyDays}
                      onChange={(e) => setReturnPolicyDays(e.target.value)}
                      className={inputClass}
                    >
                      <option value="14">14 Days Hassle-Free Returns</option>
                      <option value="30">30 Days Guaranteed Return Window (Recommended)</option>
                      <option value="60">60 Days Extended Guarantee</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Storefront Avatar Badge
                  </label>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {AVATAR_CHOICES.map((choice) => (
                      <button
                        key={choice}
                        type="button"
                        onClick={() => setAvatar(choice)}
                        className={`w-12 h-12 rounded-xl overflow-hidden border-2 transition-all p-0.5 shrink-0 cursor-pointer ${
                          avatar === choice
                            ? "border-emerald-600 ring-2 ring-emerald-600/30"
                            : "border-slate-200 hover:border-slate-400 bg-white"
                        }`}
                      >
                        {choice.startsWith("http") ? (
                          <img
                            src={choice}
                            alt="Avatar option"
                            referrerPolicy="no-referrer"
                            onError={(e) => {
                              const target = e.currentTarget;
                              if (!target.src.includes("photo-1534528741775-53994a69daeb")) {
                                target.src =
                                  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80";
                              }
                            }}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        ) : (
                          <span className="text-xl flex items-center justify-center w-full h-full">
                            {choice}
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-2 flex justify-between">
                  <button
                    type="button"
                    onClick={() => setOnboardingStep(1)}
                    className="px-4 py-2 rounded-lg border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-100"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={() => setOnboardingStep(3)}
                    className="px-5 py-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>Continue to Payout Setup</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {onboardingStep === 3 && (
              <div className="space-y-4">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-emerald-600" />
                  <span>Step 3: Direct Deposit & Verification Agreement</span>
                </h3>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Settlement Bank Payout Account (Simulated)
                  </label>
                  <input
                    value={payoutAccount}
                    onChange={(e) => setPayoutAccount(e.target.value)}
                    placeholder="ACH Routing / Direct Deposit Account"
                    className={cn(inputClass, "font-mono")}
                  />
                  <span className="text-[11px] text-slate-500 mt-1 block">
                    Payouts settle every Friday automatically via Whim Cart Merchant Clearing.
                  </span>
                </div>

                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-900">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>Merchant Code of Quality Standards</span>
                  </div>
                  <p className="text-xs text-emerald-800 leading-relaxed">
                    By launching your storefront, you agree to fulfill orders within 48 hours with
                    courier tracking, provide accurate product photos, and honor Whim Cart buyer
                    protection.
                  </p>
                </div>

                <div className="pt-4 flex justify-between">
                  <button
                    type="button"
                    onClick={() => setOnboardingStep(2)}
                    className="px-4 py-2 rounded-lg border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-100"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-2 shadow-sm cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Launch & Verify Storefront</span>
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>
      ) : (
        /* If Already Registered: Show Full Merchant Business Management Suite */
        <div className="space-y-8">
          {/* Storefront Header Card */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="h-44 sm:h-56 bg-slate-800 relative overflow-hidden">
              <img
                src={coverPhoto}
                alt="Store cover"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  const target = e.currentTarget;
                  if (!target.src.includes("photo-1441986300917-64674bd600d8")) {
                    target.src =
                      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&auto=format&fit=crop&q=80";
                  }
                }}
                className="w-full h-full object-cover opacity-80"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            </div>

            <div className="p-6 sm:p-8 relative">
              <div className="flex flex-wrap items-start justify-between gap-4 -mt-16 sm:-mt-20">
                <div className="flex items-end gap-4">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-white border-4 border-white shadow-md flex items-center justify-center text-4xl sm:text-5xl shrink-0 overflow-hidden">
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
                      <span>{profile.avatar || "🏪"}</span>
                    )}
                  </div>
                  <div className="pb-1">
                    <div className="flex items-center gap-2">
                      <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display">
                        {profile.displayName}
                      </h1>
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Verified Boutique
                      </span>
                    </div>
                    <p className="text-sm text-slate-600 mt-0.5">{profile.tagline}</p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 pt-2 sm:pt-0">
                  <Link
                    to="/sell"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors"
                  >
                    <Package className="w-3.5 h-3.5" />
                    <span>Upload Product</span>
                  </Link>
                  <Link
                    to="/manage-seller"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold transition-colors"
                  >
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span>Order Manager ({orders.length})</span>
                  </Link>
                </div>
              </div>

              {/* Merchant Quick Metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-100">
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-xs text-slate-500 font-medium block">Total Revenue</span>
                  <span className="text-lg font-extrabold text-slate-900 font-display">
                    {formatCoins(totalRevenue)}
                  </span>
                </div>
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-xs text-slate-500 font-medium block">Active Listings</span>
                  <span className="text-lg font-extrabold text-slate-900 font-display">
                    {products.length} Products
                  </span>
                </div>
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-xs text-slate-500 font-medium block">Processed Orders</span>
                  <span className="text-lg font-extrabold text-slate-900 font-display">
                    {orders.length} Orders
                  </span>
                </div>
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-xs text-slate-500 font-medium block">Merchant Rating</span>
                  <span className="text-lg font-extrabold text-slate-900 font-display">
                    ★ {profile.rating || 5.0} (100% On-Time)
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Edit Profile & Policies Form */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <form
                onSubmit={handleSaveProfile}
                className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5"
              >
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Store className="w-4 h-4 text-emerald-600" />
                  <span>Storefront Business Information</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Store Name
                    </label>
                    <input
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      className={inputClass}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Marketplace Category
                    </label>
                    <input
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className={inputClass}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Storefront Tagline
                  </label>
                  <input
                    value={tagline}
                    onChange={(e) => setTagline(e.target.value)}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Store Bio & Artisan Story
                  </label>
                  <textarea
                    rows={4}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    className={inputClass}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Support Contact Email
                    </label>
                    <input
                      value={supportEmail}
                      onChange={(e) => setSupportEmail(e.target.value)}
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Dispatch Location
                    </label>
                    <input
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className={inputClass}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Cover Banner Photo URL
                  </label>
                  <input
                    value={coverPhoto}
                    onChange={(e) => setCoverPhoto(e.target.value)}
                    className={inputClass}
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="py-2.5 px-5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors cursor-pointer"
                  >
                    Save Store Settings
                  </button>
                </div>
              </form>
            </div>

            {/* Right Column: Policies & Verification Status */}
            <div className="space-y-6">
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Merchant Compliance</span>
                </h4>

                <div className="space-y-3 text-xs text-slate-600">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <span>Account Tier:</span>
                    <span className="font-bold text-slate-900">Level 2 Verified Studio</span>
                  </div>
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <span>Identity Status:</span>
                    <span className="font-bold text-emerald-700 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> ID Verified
                    </span>
                  </div>
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <span>Return Policy:</span>
                    <span className="font-bold text-slate-900">
                      {returnPolicyDays} Days Guarantee
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Payout Schedule:</span>
                    <span className="font-bold text-slate-900">Weekly ACH Direct</span>
                  </div>
                </div>
              </div>

              <FictionalNotice
                title="Seller Data Protection"
                description="Your merchant storefront credentials, payout details, and product inventory remain securely stored in your active browser instance."
              />
            </div>
          </div>
        </div>
      )}
    </PageShell>
  );
}
