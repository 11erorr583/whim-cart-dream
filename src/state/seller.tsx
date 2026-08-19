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
import type { SellerProduct, SellerProfile } from "@/types/shopping";

export interface SellerDraft {
  name: string;
  blurb: string;
  category: SellerProduct["category"];
  price: number;
  emoji: string;
  description: string;
}

interface SellerState {
  profile: SellerProfile;
  products: SellerProduct[];
}

export const DEFAULT_PROFILE: SellerProfile = {
  displayName: "Anonymous Dreamer",
  tagline: "Inventing things that will never exist.",
  avatar: "🧑‍🚀",
};

const EMPTY: SellerState = { profile: DEFAULT_PROFILE, products: [] };

function readSeller(): SellerState {
  if (typeof window === "undefined") return EMPTY;
  try {
    const raw = window.localStorage.getItem(SELLER_STORAGE_KEY);
    if (!raw) return EMPTY;
    const parsed = JSON.parse(raw) as Partial<SellerState>;
    return {
      profile: { ...DEFAULT_PROFILE, ...(parsed.profile ?? {}) },
      products: parsed.products ?? [],
    };
  } catch {
    return EMPTY;
  }
}

interface SellerContextValue extends SellerState {
  hydrated: boolean;
  saveProfile: (profile: SellerProfile) => void;
  addProduct: (draft: SellerDraft) => SellerProduct;
  updateProduct: (id: string, draft: SellerDraft) => void;
  deleteProduct: (id: string) => void;
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
      /* storage unavailable — listings stay in memory */
    }
  }, [state, hydrated]);

  const saveProfile = useCallback((profile: SellerProfile) => {
    setState((prev) => ({
      profile,
      products: prev.products.map((p) => ({
        ...p,
        seller: profile.displayName,
        sellerTagline: profile.tagline,
        sellerAvatar: profile.avatar,
      })),
    }));
  }, []);

  const addProduct = useCallback((draft: SellerDraft) => {
    const created: SellerProduct = {
      id: `usr-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
      name: draft.name,
      category: draft.category,
      price: draft.price,
      rating: 5,
      reviewCount: 0,
      emoji: draft.emoji || "✨",
      blurb: draft.blurb,
      description: draft.description,
      seller: DEFAULT_PROFILE.displayName,
      tags: ["community upload"],
      reviews: [],
      submittedBySeller: true,
      sellerTagline: DEFAULT_PROFILE.tagline,
      sellerAvatar: DEFAULT_PROFILE.avatar,
      createdAt: new Date().toISOString(),
    };
    setState((prev) => {
      const withIdentity: SellerProduct = {
        ...created,
        seller: prev.profile.displayName,
        sellerTagline: prev.profile.tagline,
        sellerAvatar: prev.profile.avatar,
      };
      return { ...prev, products: [withIdentity, ...prev.products] };
    });
    return created;
  }, []);

  const updateProduct = useCallback((id: string, draft: SellerDraft) => {
    setState((prev) => ({
      ...prev,
      products: prev.products.map((p) =>
        p.id === id ? { ...p, ...draft, emoji: draft.emoji || p.emoji } : p,
      ),
    }));
  }, []);

  const deleteProduct = useCallback((id: string) => {
    setState((prev) => ({ ...prev, products: prev.products.filter((p) => p.id !== id) }));
  }, []);

  const value = useMemo<SellerContextValue>(
    () => ({
      ...state,
      hydrated,
      saveProfile,
      addProduct,
      updateProduct,
      deleteProduct,
    }),
    [state, hydrated, saveProfile, addProduct, updateProduct, deleteProduct],
  );

  return <SellerContext.Provider value={value}>{children}</SellerContext.Provider>;
}

export function useSeller(): SellerContextValue {
  const ctx = useContext(SellerContext);
  if (!ctx) throw new Error("useSeller must be used inside <SellerProvider>");
  return ctx;
}
