/**
 * Domain types for the fictional shopping experience.
 * These shapes are intentionally REST-friendly so a FastAPI backend can
 * later return the same JSON structures without touching the UI layer.
 */

export type PersonalityId =
  | "impulse-buyer"
  | "window-shopper"
  | "delusional-millionaire"
  | "responsible-adult";

export interface Personality {
  id: PersonalityId;
  name: string;
  emoji: string;
  tagline: string;
  description: string;
  /** Fictional starting wallet balance in fictional coins. */
  startingWallet: number;
  /** Multiplier applied to fictional reward points. */
  rewardMultiplier: number;
  /** Playful commentary shown while shopping. */
  quips: string[];
}

export type ProductCategory =
  | "gadgets"
  | "snacks"
  | "fashion"
  | "home"
  | "absurd"
  | "pets";

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  price: number;
  rating: number;
  reviewCount: number;
  emoji: string;
  blurb: string;
  description: string;
  seller: string;
  tags: string[];
  reviews: ProductReview[];
}

export interface ProductReview {
  id: string;
  author: string;
  rating: number;
  body: string;
}

export interface CartItem {
  productId: string;
  quantity: number;
}

export type OrderStatus = "placed" | "in-transit" | "delivered";

export interface FictionalOrderLine {
  productId: string;
  name: string;
  emoji: string;
  unitPrice: number;
  quantity: number;
}

export interface FictionalOrder {
  id: string;
  createdAt: string;
  personalityId: PersonalityId | null;
  lines: FictionalOrderLine[];
  subtotal: number;
  fictionalShipping: number;
  total: number;
  rewardPoints: number;
  status: OrderStatus;
  /** Epoch ms when the imaginary delivery arrives. */
  deliveryAt: number;
  courierName: string;
  courierEmoji: string;
}

export interface FinalResult {
  orderId: string;
  verdict: string;
  summary: string;
  spent: number;
  saved: number;
  rewardPoints: number;
  badge: string;
  callCompleted: boolean;
}

export interface SessionState {
  personalityId: PersonalityId | null;
  cart: CartItem[];
  order: FictionalOrder | null;
  result: FinalResult | null;
}
