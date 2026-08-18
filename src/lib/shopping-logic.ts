import { PRODUCTS, getProduct } from "@/data/products";
import { getPersonality } from "@/data/personalities";
import {
  COURIERS,
  DELIVERY_SECONDS,
  FICTIONAL_SHIPPING,
  POINTS_PER_COIN,
} from "@/lib/fictional-config";
import type {
  CartItem,
  FictionalOrder,
  FinalResult,
  PersonalityId,
  Product,
} from "@/types/shopping";

/** Pure business logic — deliberately UI-free so it can be reused or replaced by API calls. */

export interface DetailedCartLine {
  product: Product;
  quantity: number;
  lineTotal: number;
}

export const buildCartLines = (cart: CartItem[]): DetailedCartLine[] =>
  cart
    .map((item) => {
      const product = getProduct(item.productId);
      if (!product) return null;
      return { product, quantity: item.quantity, lineTotal: product.price * item.quantity };
    })
    .filter((line): line is DetailedCartLine => line !== null);

export const cartSubtotal = (cart: CartItem[]): number =>
  buildCartLines(cart).reduce((sum, line) => sum + line.lineTotal, 0);

export const cartCount = (cart: CartItem[]): number =>
  cart.reduce((sum, item) => sum + item.quantity, 0);

export const addToCart = (cart: CartItem[], productId: string, quantity = 1): CartItem[] => {
  const existing = cart.find((item) => item.productId === productId);
  if (existing) {
    return cart.map((item) =>
      item.productId === productId ? { ...item, quantity: item.quantity + quantity } : item,
    );
  }
  return [...cart, { productId, quantity }];
};

export const setQuantity = (cart: CartItem[], productId: string, quantity: number): CartItem[] =>
  quantity <= 0
    ? cart.filter((item) => item.productId !== productId)
    : cart.map((item) => (item.productId === productId ? { ...item, quantity } : item));

export const removeFromCart = (cart: CartItem[], productId: string): CartItem[] =>
  cart.filter((item) => item.productId !== productId);

export const rewardPointsFor = (total: number, personalityId: PersonalityId | null): number => {
  const multiplier = getPersonality(personalityId)?.rewardMultiplier ?? 1;
  return Math.round(total * POINTS_PER_COIN * multiplier);
};

export const createFictionalOrder = (
  cart: CartItem[],
  personalityId: PersonalityId | null,
): FictionalOrder => {
  const lines = buildCartLines(cart);
  const subtotal = lines.reduce((sum, line) => sum + line.lineTotal, 0);
  const total = subtotal + FICTIONAL_SHIPPING;
  const courier =
    COURIERS[Math.floor(Math.random() * COURIERS.length)] ?? COURIERS[0]!;

  return {
    id: `FIC-${Math.random().toString(36).slice(2, 7).toUpperCase()}`,
    createdAt: new Date().toISOString(),
    personalityId,
    lines: lines.map((line) => ({
      productId: line.product.id,
      name: line.product.name,
      emoji: line.product.emoji,
      unitPrice: line.product.price,
      quantity: line.quantity,
    })),
    subtotal,
    fictionalShipping: FICTIONAL_SHIPPING,
    total,
    rewardPoints: rewardPointsFor(total, personalityId),
    status: "placed",
    deliveryAt: Date.now() + DELIVERY_SECONDS * 1000,
    courierName: courier.name,
    courierEmoji: courier.emoji,
  };
};

const VERDICTS: Record<PersonalityId, { verdict: string; badge: string }> = {
  "impulse-buyer": { verdict: "Chaos Merchant", badge: "⚡" },
  "window-shopper": { verdict: "Master of Restraint", badge: "🪟" },
  "delusional-millionaire": { verdict: "Fictional Tycoon", badge: "🦚" },
  "responsible-adult": { verdict: "Spreadsheet Sage", badge: "🧾" },
};

export const buildFinalResult = (
  order: FictionalOrder,
  callCompleted: boolean,
): FinalResult => {
  const personality = getPersonality(order.personalityId);
  const wallet = personality?.startingWallet ?? 2500;
  const base = order.personalityId
    ? VERDICTS[order.personalityId]
    : { verdict: "Curious Browser", badge: "🛍️" };
  const items = order.lines.reduce((sum, line) => sum + line.quantity, 0);

  return {
    orderId: order.id,
    verdict: base.verdict,
    badge: base.badge,
    spent: order.total,
    saved: Math.max(wallet - order.total, 0),
    rewardPoints: order.rewardPoints,
    callCompleted,
    summary: `You fictionally acquired ${items} item${items === 1 ? "" : "s"} for ${Math.round(
      order.total,
    ).toLocaleString("en-US")} fictional coins, delivered by ${order.courierName}.`,
  };
};

export const recommendFor = (personalityId: PersonalityId | null): Product[] => {
  if (personalityId === "delusional-millionaire") {
    return [...PRODUCTS].sort((a, b) => b.price - a.price).slice(0, 3);
  }
  if (personalityId === "responsible-adult") {
    return [...PRODUCTS].sort((a, b) => b.rating - a.rating).slice(0, 3);
  }
  if (personalityId === "window-shopper") {
    return [...PRODUCTS].sort((a, b) => a.price - b.price).slice(0, 3);
  }
  return [...PRODUCTS].sort((a, b) => b.reviewCount - a.reviewCount).slice(0, 3);
};
