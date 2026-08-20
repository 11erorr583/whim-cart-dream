import { allProducts, resolveProduct } from "@/data/product-registry";
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

/** Pure business logic for the Whim Cart experience */

export interface DetailedCartLine {
  product: Product;
  quantity: number;
  lineTotal: number;
}

export const buildCartLines = (cart: CartItem[]): DetailedCartLine[] =>
  cart
    .map((item) => {
      const product = resolveProduct(item.productId);
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
  shippingSpeed: "Standard (Free)" | "Express (2-Day)" | "Same-Day Priority" = "Standard (Free)",
  customAddress?: Partial<FictionalOrder["shippingAddress"]>,
): FictionalOrder => {
  const lines = buildCartLines(cart);
  const subtotal = lines.reduce((sum, line) => sum + line.lineTotal, 0);
  const shippingFee =
    shippingSpeed === "Same-Day Priority" ? 14.99 : shippingSpeed === "Express (2-Day)" ? 7.99 : 0;
  const discount = subtotal > 150 ? 15.0 : 0;
  const total = Math.max(0, subtotal + shippingFee - discount);
  const courier = COURIERS[Math.floor(Math.random() * COURIERS.length)] ?? COURIERS[0]!;

  return {
    id: `WHIM-${Math.random().toString(36).substring(2, 7).toUpperCase()}`,
    trackingNumber: `1Z99999999${Math.floor(10000000 + Math.random() * 90000000)}`,
    createdAt: new Date().toISOString(),
    personalityId,
    lines: lines.map((line) => ({
      productId: line.product.id,
      name: line.product.name,
      image: line.product.images[0] || "",
      emoji: line.product.emoji,
      unitPrice: line.product.price,
      quantity: line.quantity,
    })),
    subtotal,
    shipping: shippingFee,
    discount,
    total,
    rewardPoints: rewardPointsFor(total, personalityId),
    status: "placed",
    deliveryAt: Date.now() + DELIVERY_SECONDS * 1000,
    courierName: courier.name,
    courierEmoji: courier.emoji,
    shippingAddress: {
      fullName: customAddress?.fullName || "Alex Rivera",
      addressLine: customAddress?.addressLine || "742 Skyline Blvd, Apt 4B",
      city: customAddress?.city || "San Francisco, CA",
      postalCode: customAddress?.postalCode || "94107",
      country: customAddress?.country || "United States",
      deliverySpeed: shippingSpeed,
    },
  };
};

const VERDICTS: Record<PersonalityId, { verdict: string; badge: string }> = {
  "impulse-buyer": { verdict: "Curator of Instant Gratification", badge: "⚡" },
  "window-shopper": { verdict: "Discerning Aesthetic Minimalist", badge: "✨" },
  "delusional-millionaire": { verdict: "Luxury Marketplace Connoisseur", badge: "💎" },
  "responsible-adult": { verdict: "Strategic Value Optimizer", badge: "📊" },
};

export const buildFinalResult = (order: FictionalOrder, callCompleted: boolean): FinalResult => {
  const personality = getPersonality(order.personalityId);
  const wallet = personality?.startingWallet ?? 2500;
  const base = order.personalityId
    ? VERDICTS[order.personalityId]
    : { verdict: "Premier Shopper", badge: "🛍️" };
  const items = order.lines.reduce((sum, line) => sum + line.quantity, 0);

  return {
    orderId: order.id,
    verdict: base.verdict,
    badge: base.badge,
    spent: order.total,
    saved: Math.max(wallet - order.total, 0),
    rewardPoints: order.rewardPoints,
    callCompleted,
    summary: `You successfully completed order ${order.id} with ${items} premier product${items === 1 ? "" : "s"} for a total of $${order.total.toFixed(
      2,
    )} USD, dispatched via ${order.courierName}.`,
  };
};

export const recommendFor = (personalityId: PersonalityId | null): Product[] => {
  if (personalityId === "delusional-millionaire") {
    return [...allProducts()].sort((a, b) => b.price - a.price).slice(0, 4);
  }
  if (personalityId === "responsible-adult") {
    return [...allProducts()].sort((a, b) => b.rating - a.rating).slice(0, 4);
  }
  if (personalityId === "window-shopper") {
    return [...allProducts()].sort((a, b) => a.price - b.price).slice(0, 4);
  }
  return [...allProducts()].sort((a, b) => b.reviewCount - a.reviewCount).slice(0, 4);
};
