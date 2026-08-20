import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { setSellerProducts } from "@/data/product-registry";
import { SELLER_STORAGE_KEY } from "@/lib/fictional-config";
import type { ProductCategory, SellerOrder, SellerProduct, SellerProfile } from "@/types/shopping";

export interface SellerDraft {
  name: string;
  blurb: string;
  category: ProductCategory;
  price: number;
  comparePrice?: number;
  images: string[];
  emoji?: string;
  description: string;
  inventory: number;
  sku?: string;
  condition?: "Brand New" | "Refurbished" | "Like New";
  specifications?: Record<string, string>;
  tags?: string[];
  status?: "active" | "in_review" | "draft" | "paused";
}

export interface AIReviewResult {
  riskScore: number;
  riskLevel: "low" | "medium" | "high";
  qualityScore: number;
  feedback: string[];
  passed: boolean;
}

export const analyzeListingRisk = (draft: Partial<SellerDraft>): AIReviewResult => {
  const feedback: string[] = [];
  let riskScore = 5;
  let qualityScore = 95;

  if (!draft.images || draft.images.length === 0) {
    riskScore += 25;
    qualityScore -= 30;
    feedback.push(
      "Missing product gallery images. Adding high-resolution photos boosts buyer trust.",
    );
  } else if (draft.images.length < 2) {
    qualityScore -= 10;
    feedback.push("Consider uploading at least 2 angle photos for better conversion.");
  }

  if (!draft.name || draft.name.trim().length < 8) {
    riskScore += 15;
    qualityScore -= 15;
    feedback.push("Title is short. Include brand, key model, or material attributes.");
  }

  if (!draft.description || draft.description.trim().length < 40) {
    riskScore += 20;
    qualityScore -= 20;
    feedback.push("Description is brief. Add bulleted highlights, dimensions, and box contents.");
  }

  if (!draft.price || draft.price <= 0) {
    riskScore += 40;
    qualityScore -= 40;
    feedback.push("Invalid price. Set a standard market value.");
  }

  if (!draft.inventory || draft.inventory <= 0) {
    feedback.push("Initial inventory is 0. Listing will appear as Out of Stock.");
  }

  const riskLevel: "low" | "medium" | "high" =
    riskScore > 50 ? "high" : riskScore > 25 ? "medium" : "low";

  return {
    riskScore: Math.min(100, riskScore),
    riskLevel,
    qualityScore: Math.max(10, qualityScore),
    feedback,
    passed: riskScore < 60,
  };
};

export const DEFAULT_SELLER_PROFILE: SellerProfile = {
  id: "merchant-usr-01",
  storeName: "Vanguard Design Collective",
  handle: "vanguard_studio",
  tagline: "Curated modern lifestyle, audio essentials & minimal electronics.",
  bio: "Independent artisan studio based in Seattle. We design and source premium lifestyle goods built for longevity and aesthetic balance.",
  avatar:
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80",
  bannerUrl:
    "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&auto=format&fit=crop&q=80",
  category: "electronics",
  rating: 4.9,
  reviewsCount: 128,
  salesCount: 842,
  joinedDate: "October 2024",
  location: "Seattle, WA, USA",
  isVerified: true,
  contactEmail: "concierge@vanguard-collective.io",
  returnPolicy: "30-Day Hassle-Free Return Guarantee. Free return shipping for verified buyers.",
  shippingPolicy:
    "Same-day dispatch for orders before 2 PM PST. Standard 2-3 business days delivery.",
};

const INITIAL_SELLER_PRODUCTS: SellerProduct[] = [
  {
    id: "usr-prod-01",
    name: "Horizon Brushed Aluminum Desk Charging Pad",
    category: "gadgets",
    price: 68.0,
    comparePrice: 90.0,
    rating: 4.95,
    reviewCount: 42,
    images: [
      "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=900&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=900&auto=format&fit=crop&q=80",
    ],
    emoji: "⚡",
    blurb: "Ultra-thin 15W Qi wireless charger with integrated vegetable-tanned leather rest.",
    description:
      "Crafted from a solid block of aircraft-grade 6061 aluminum with hand-beveled edges and genuine Horween leather padding. Features smart thermal regulation and ambient LED indicator.",
    seller: DEFAULT_SELLER_PROFILE.storeName,
    sellerId: DEFAULT_SELLER_PROFILE.id,
    sellerVerified: true,
    tags: ["Staff Pick", "Wireless Qi", "Bestseller"],
    inventory: 45,
    sku: "VANG-HORIZON-PAD-GRY",
    condition: "Brand New",
    specifications: {
      Dimensions: "180mm × 90mm × 7.5mm",
      Material: "Anodized 6061 Aluminum & Full-Grain Leather",
      Output: "15W Max Fast Charging",
      Cable: "1.5m Braided USB-C Cable Included",
    },
    status: "active",
    riskScore: 4,
    riskLevel: "low",
    isFeatured: true,
    reviews: [
      {
        id: "r101",
        author: "Devon Miller",
        rating: 5,
        body: "The machining on the aluminum is immaculate. Sits flush and charges my iPhone effortlessly.",
        date: "3 days ago",
        verifiedPurchase: true,
      },
    ],
    submittedBySeller: true,
    sellerTagline: DEFAULT_SELLER_PROFILE.tagline,
    sellerAvatar: DEFAULT_SELLER_PROFILE.avatar,
    createdAt: new Date(Date.now() - 14 * 86400000).toISOString(),
  },
  {
    id: "usr-prod-02",
    name: "Artisan Stoneware Espresso Cup Pair",
    category: "gourmet",
    price: 36.0,
    comparePrice: 48.0,
    rating: 4.88,
    reviewCount: 29,
    images: [
      "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=900&auto=format&fit=crop&q=80",
    ],
    emoji: "☕",
    blurb: "Hand-dipped reactive matte glaze with double-walled thermal retention.",
    description:
      "Set of two 90ml double-walled stoneware demitasse cups. Individually hand-thrown with volcanic clay and finished in our signature basalt matte glaze.",
    seller: DEFAULT_SELLER_PROFILE.storeName,
    sellerId: DEFAULT_SELLER_PROFILE.id,
    sellerVerified: true,
    tags: ["Handmade", "Ceramics", "Gift Ready"],
    inventory: 28,
    sku: "VANG-ESPR-CUP-2X",
    condition: "Brand New",
    specifications: {
      Capacity: "90ml each (3.0 fl oz)",
      Material: "Volcanic Stoneware with Reactive Glaze",
      Care: "Dishwasher & Microwave Safe",
    },
    status: "active",
    riskScore: 3,
    riskLevel: "low",
    reviews: [],
    submittedBySeller: true,
    sellerTagline: DEFAULT_SELLER_PROFILE.tagline,
    sellerAvatar: DEFAULT_SELLER_PROFILE.avatar,
    createdAt: new Date(Date.now() - 7 * 86400000).toISOString(),
  },
];

const INITIAL_SELLER_ORDERS: SellerOrder[] = [
  {
    id: "ord-sel-01",
    orderNumber: "WHIM-ORD-9842",
    customerName: "Sophia Martinez",
    items: [
      {
        productId: "usr-prod-01",
        name: "Horizon Brushed Aluminum Desk Charging Pad",
        image:
          "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=900&auto=format&fit=crop&q=80",
        quantity: 1,
        price: 68.0,
      },
    ],
    totalAmount: 72.99,
    status: "processing",
    date: "Today, 10:24 AM",
    shippingAddress: "742 Evergreen Terrace, Portland, OR 97201",
  },
  {
    id: "ord-sel-02",
    orderNumber: "WHIM-ORD-9820",
    customerName: "David Kim",
    items: [
      {
        productId: "usr-prod-02",
        name: "Artisan Stoneware Espresso Cup Pair",
        image:
          "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=900&auto=format&fit=crop&q=80",
        quantity: 2,
        price: 36.0,
      },
    ],
    totalAmount: 76.99,
    status: "shipped",
    date: "Yesterday, 3:15 PM",
    shippingAddress: "1200 Grand Ave, Suite 400, Los Angeles, CA 90015",
  },
];

interface SellerState {
  isRegistered: boolean;
  profile: SellerProfile;
  products: SellerProduct[];
  orders: SellerOrder[];
}

const EMPTY: SellerState = {
  isRegistered: true,
  profile: DEFAULT_SELLER_PROFILE,
  products: INITIAL_SELLER_PRODUCTS,
  orders: INITIAL_SELLER_ORDERS,
};

const sanitizeImageUrl = (url: string): string => {
  if (!url || typeof url !== "string") {
    return "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80";
  }
  if (url.includes("photo-1622445262464-84b14e074558")) {
    return "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=900&auto=format&fit=crop&q=80";
  }
  return url;
};

const sanitizeProduct = (p: SellerProduct): SellerProduct => ({
  ...p,
  images: (p.images || []).map(sanitizeImageUrl),
});

function readSeller(): SellerState {
  if (typeof window === "undefined") return EMPTY;
  try {
    const raw = window.localStorage.getItem(SELLER_STORAGE_KEY);
    if (!raw) return EMPTY;
    const parsed = JSON.parse(raw) as Partial<SellerState>;
    const loadedProducts = (
      parsed.products && parsed.products.length > 0 ? parsed.products : INITIAL_SELLER_PRODUCTS
    ).map(sanitizeProduct);

    return {
      isRegistered: parsed.isRegistered ?? true,
      profile: { ...DEFAULT_SELLER_PROFILE, ...(parsed.profile ?? {}) },
      products: loadedProducts,
      orders: parsed.orders && parsed.orders.length > 0 ? parsed.orders : INITIAL_SELLER_ORDERS,
    };
  } catch {
    return EMPTY;
  }
}

interface SellerContextValue extends SellerState {
  hydrated: boolean;
  registerSeller: (profile: Partial<SellerProfile>) => void;
  saveProfile: (profile: SellerProfile) => void;
  addProduct: (draft: SellerDraft) => SellerProduct;
  updateProduct: (id: string, draft: Partial<SellerDraft>) => void;
  updateInventory: (id: string, count: number) => void;
  toggleProductStatus: (id: string) => void;
  duplicateProduct: (id: string) => void;
  deleteProduct: (id: string) => void;
  updateOrderStatus: (orderId: string, status: SellerOrder["status"]) => void;
  replyToReview: (productId: string, reviewId: string, replyText: string) => void;
}

const SellerContext = createContext<SellerContextValue | null>(null);

export function SellerProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<SellerState>(EMPTY);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const loaded = readSeller();
    setState(loaded);
    setSellerProducts(loaded.products);
    setHydrated(true);
  }, []);

  useEffect(() => {
    setSellerProducts(state.products);
    if (!hydrated) return;
    try {
      window.localStorage.setItem(SELLER_STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* local storage fallback */
    }
  }, [state, hydrated]);

  const registerSeller = useCallback((profileData: Partial<SellerProfile>) => {
    setState((prev) => ({
      ...prev,
      isRegistered: true,
      profile: {
        ...prev.profile,
        ...profileData,
        isVerified: true,
        joinedDate: "Just now",
      },
    }));
  }, []);

  const saveProfile = useCallback((profile: SellerProfile) => {
    setState((prev) => ({
      ...prev,
      profile,
      products: prev.products.map((p) => ({
        ...p,
        seller: profile.storeName,
        sellerTagline: profile.tagline,
        sellerAvatar: profile.avatar,
      })),
    }));
  }, []);

  const addProduct = useCallback(
    (draft: SellerDraft) => {
      const aiCheck = analyzeListingRisk(draft);
      const primaryImage =
        draft.images?.[0] ||
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=900&auto=format&fit=crop&q=80";

      const created: SellerProduct = {
        id: `usr-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
        name: draft.name,
        category: draft.category,
        price: draft.price,
        comparePrice: draft.comparePrice,
        rating: 5.0,
        reviewCount: 0,
        images: draft.images && draft.images.length > 0 ? draft.images : [primaryImage],
        emoji: draft.emoji || "✨",
        blurb: draft.blurb,
        description: draft.description,
        seller: state.profile.storeName,
        sellerId: state.profile.id,
        sellerVerified: state.profile.isVerified,
        tags:
          draft.tags && draft.tags.length > 0
            ? draft.tags
            : ["New Arrival", "Direct from Merchant"],
        reviews: [],
        inventory: draft.inventory ?? 25,
        sku: draft.sku || `SKU-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
        condition: draft.condition || "Brand New",
        specifications: draft.specifications || {},
        status: draft.status || "active",
        riskScore: aiCheck.riskScore,
        riskLevel: aiCheck.riskLevel,
        moderationFeedback: aiCheck.feedback,
        submittedBySeller: true,
        sellerTagline: state.profile.tagline,
        sellerAvatar: state.profile.avatar,
        createdAt: new Date().toISOString(),
      };

      setState((prev) => ({
        ...prev,
        products: [created, ...prev.products],
        profile: {
          ...prev.profile,
          salesCount: prev.profile.salesCount + 1,
        },
      }));

      return created;
    },
    [state.profile],
  );

  const updateProduct = useCallback((id: string, draft: Partial<SellerDraft>) => {
    setState((prev) => ({
      ...prev,
      products: prev.products.map((p) => {
        if (p.id !== id) return p;
        const mergedImages = draft.images ? draft.images : p.images;
        const aiCheck = analyzeListingRisk({ ...p, ...draft, images: mergedImages });
        return {
          ...p,
          ...draft,
          images: mergedImages,
          riskScore: aiCheck.riskScore,
          riskLevel: aiCheck.riskLevel,
          moderationFeedback: aiCheck.feedback,
        };
      }),
    }));
  }, []);

  const updateInventory = useCallback((id: string, count: number) => {
    setState((prev) => ({
      ...prev,
      products: prev.products.map((p) =>
        p.id === id ? { ...p, inventory: Math.max(0, count) } : p,
      ),
    }));
  }, []);

  const toggleProductStatus = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      products: prev.products.map((p) => {
        if (p.id !== id) return p;
        const nextStatus = p.status === "active" ? "paused" : "active";
        return { ...p, status: nextStatus };
      }),
    }));
  }, []);

  const duplicateProduct = useCallback((id: string) => {
    setState((prev) => {
      const source = prev.products.find((p) => p.id === id);
      if (!source) return prev;
      const copy: SellerProduct = {
        ...source,
        id: `usr-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
        name: `${source.name} (Copy)`,
        sku: `${source.sku}-COPY`,
        createdAt: new Date().toISOString(),
      };
      return { ...prev, products: [copy, ...prev.products] };
    });
  }, []);

  const deleteProduct = useCallback((id: string) => {
    setState((prev) => ({ ...prev, products: prev.products.filter((p) => p.id !== id) }));
  }, []);

  const updateOrderStatus = useCallback((orderId: string, status: SellerOrder["status"]) => {
    setState((prev) => ({
      ...prev,
      orders: prev.orders.map((o) => (o.id === orderId ? { ...o, status } : o)),
    }));
  }, []);

  const replyToReview = useCallback((productId: string, reviewId: string, replyText: string) => {
    setState((prev) => ({
      ...prev,
      products: prev.products.map((p) => {
        if (p.id !== productId) return p;
        return {
          ...p,
          reviews: p.reviews.map((r) => (r.id === reviewId ? { ...r, sellerReply: replyText } : r)),
        };
      }),
    }));
  }, []);

  const value = useMemo<SellerContextValue>(
    () => ({
      ...state,
      hydrated,
      registerSeller,
      saveProfile,
      addProduct,
      updateProduct,
      updateInventory,
      toggleProductStatus,
      duplicateProduct,
      deleteProduct,
      updateOrderStatus,
      replyToReview,
    }),
    [
      state,
      hydrated,
      registerSeller,
      saveProfile,
      addProduct,
      updateProduct,
      updateInventory,
      toggleProductStatus,
      duplicateProduct,
      deleteProduct,
      updateOrderStatus,
      replyToReview,
    ],
  );

  return <SellerContext.Provider value={value}>{children}</SellerContext.Provider>;
}

export function useSeller(): SellerContextValue {
  const ctx = useContext(SellerContext);
  if (!ctx) throw new Error("useSeller must be used inside <SellerProvider>");
  return ctx;
}
