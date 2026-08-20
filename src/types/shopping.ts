/**
 * Domain types for the Whim Cart shopping platform.
 * These shapes are REST-friendly so a FastAPI backend can easily bind to them.
 */

export type PersonalityId =
  "impulse-buyer" | "window-shopper" | "delusional-millionaire" | "responsible-adult";

export interface Personality {
  id: PersonalityId;
  name: string;
  emoji: string;
  tagline: string;
  description: string;
  /** Starting credit/wallet balance in $ USD */
  startingWallet: number;
  /** Multiplier applied to reward points */
  rewardMultiplier: number;
  /** Shopper commentary */
  quips: string[];
}

export type ProductCategory =
  "electronics" | "fashion" | "home" | "beauty" | "gourmet" | "gadgets" | "sports" | "collectibles";

export interface ProductReview {
  id: string;
  author: string;
  rating: number;
  body: string;
  date?: string;
  verifiedPurchase?: boolean;
  sellerReply?: string;
}

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  price: number;
  comparePrice?: number;
  rating: number;
  reviewCount: number;
  images: string[];
  emoji: string;
  blurb: string;
  description: string;
  seller: string;
  sellerId?: string;
  sellerVerified?: boolean;
  tags: string[];
  reviews: ProductReview[];
  inventory: number;
  sku?: string;
  condition?: "Brand New" | "Refurbished" | "Like New";
  specifications?: Record<string, string>;
  status?: "active" | "in_review" | "draft" | "paused";
  riskScore?: number;
  riskLevel?: "low" | "medium" | "high";
  moderationFeedback?: string[];
  isFeatured?: boolean;
}

/** A merchant product uploaded through Seller Studio */
export interface SellerProduct extends Product {
  submittedBySeller: true;
  sellerTagline: string;
  sellerAvatar: string;
  createdAt: string;
}

/** Comprehensive Seller / Merchant Store Profile */
export interface SellerProfile {
  id: string;
  storeName: string;
  handle: string;
  tagline: string;
  bio: string;
  avatar: string;
  bannerUrl: string;
  category: ProductCategory | "general";
  rating: number;
  reviewsCount: number;
  salesCount: number;
  joinedDate: string;
  location: string;
  isVerified: boolean;
  contactEmail: string;
  returnPolicy: string;
  shippingPolicy: string;
}

export interface SellerOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  items: {
    productId: string;
    name: string;
    image: string;
    quantity: number;
    price: number;
  }[];
  totalAmount: number;
  status: "processing" | "shipped" | "delivered" | "cancelled";
  date: string;
  shippingAddress: string;
}

export interface CartItem {
  productId: string;
  quantity: number;
}

export type OrderStatus = "placed" | "processing" | "in-transit" | "delivered";

export interface FictionalOrderLine {
  productId: string;
  name: string;
  image: string;
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
  shipping: number;
  discount: number;
  total: number;
  rewardPoints: number;
  status: OrderStatus;
  deliveryAt: number;
  courierName: string;
  courierEmoji: string;
  trackingNumber: string;
  shippingAddress: {
    fullName: string;
    addressLine: string;
    city: string;
    postalCode: string;
    country: string;
    deliverySpeed: "Standard (Free)" | "Express (2-Day)" | "Same-Day Priority";
  };
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
  wishlist: string[];
  order: FictionalOrder | null;
  callCompleted: boolean;
  result: FinalResult | null;
  walletBalance: number;
}
