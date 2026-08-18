import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { STORAGE_KEY } from "@/lib/fictional-config";
import {
  addToCart as addToCartFn,
  buildFinalResult,
  createFictionalOrder,
  removeFromCart as removeFromCartFn,
  setQuantity as setQuantityFn,
} from "@/lib/shopping-logic";
import type { FictionalOrder, PersonalityId, SessionState } from "@/types/shopping";

const EMPTY_SESSION: SessionState = {
  personalityId: null,
  cart: [],
  order: null,
  callCompleted: false,
  result: null,
};

/**
 * Gameplay state only. Nothing personal or sensitive is ever persisted.
 * Swap the localStorage read/write for REST calls when a backend exists.
 */
function readSession(): SessionState {
  if (typeof window === "undefined") return EMPTY_SESSION;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return EMPTY_SESSION;
    return { ...EMPTY_SESSION, ...(JSON.parse(raw) as Partial<SessionState>) };
  } catch {
    return EMPTY_SESSION;
  }
}

interface SessionContextValue {
  session: SessionState;
  hydrated: boolean;
  choosePersonality: (id: PersonalityId) => void;
  addToCart: (productId: string, quantity?: number) => void;
  setQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  placeOrder: () => FictionalOrder | null;
  markDelivered: () => void;
  completeCall: () => void;
  finishExperience: () => void;
  resetExperience: () => void;
}

const SessionContext = createContext<SessionContextValue | null>(null);

export function SessionProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<SessionState>(EMPTY_SESSION);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setSession(readSession());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    } catch {
      /* storage unavailable — gameplay continues in memory */
    }
  }, [session, hydrated]);

  const choosePersonality = useCallback((id: PersonalityId) => {
    setSession((prev) => ({ ...prev, personalityId: id }));
  }, []);

  const addToCart = useCallback((productId: string, quantity = 1) => {
    setSession((prev) => ({ ...prev, cart: addToCartFn(prev.cart, productId, quantity) }));
  }, []);

  const setQuantity = useCallback((productId: string, quantity: number) => {
    setSession((prev) => ({ ...prev, cart: setQuantityFn(prev.cart, productId, quantity) }));
  }, []);

  const removeFromCart = useCallback((productId: string) => {
    setSession((prev) => ({ ...prev, cart: removeFromCartFn(prev.cart, productId) }));
  }, []);

  const clearCart = useCallback(() => setSession((prev) => ({ ...prev, cart: [] })), []);

  const placeOrder = useCallback(() => {
    let created: FictionalOrder | null = null;
    setSession((prev) => {
      if (prev.cart.length === 0) return prev;
      created = createFictionalOrder(prev.cart, prev.personalityId);
      return { ...prev, order: created, cart: [], callCompleted: false, result: null };
    });
    return created;
  }, []);

  const markDelivered = useCallback(() => {
    setSession((prev) =>
      prev.order ? { ...prev, order: { ...prev.order, status: "delivered" } } : prev,
    );
  }, []);

  const completeCall = useCallback(() => {
    setSession((prev) => ({ ...prev, callCompleted: true }));
  }, []);

  const finishExperience = useCallback(() => {
    setSession((prev) =>
      prev.order
        ? { ...prev, result: buildFinalResult(prev.order, prev.callCompleted) }
        : prev,
    );
  }, []);

  const resetExperience = useCallback(() => {
    setSession(EMPTY_SESSION);
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
  }, []);

  const value = useMemo<SessionContextValue>(
    () => ({
      session,
      hydrated,
      choosePersonality,
      addToCart,
      setQuantity,
      removeFromCart,
      clearCart,
      placeOrder,
      markDelivered,
      completeCall,
      finishExperience,
      resetExperience,
    }),
    [
      session,
      hydrated,
      choosePersonality,
      addToCart,
      setQuantity,
      removeFromCart,
      clearCart,
      placeOrder,
      markDelivered,
      completeCall,
      finishExperience,
      resetExperience,
    ],
  );

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession(): SessionContextValue {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error("useSession must be used inside <SessionProvider>");
  return ctx;
}
