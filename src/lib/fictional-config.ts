/** Configuration and constants for Whim Cart ecommerce simulation */

export const FICTIONAL_DISCLAIMER =
  "Simulated shopping experience • No real financial transactions or payments are charged.";

export const CURRENCY_LABEL = "USD ($)";

export const STORAGE_KEY = "whimcart.session.v2";

/** Seller profile + uploaded products storage */
export const SELLER_STORAGE_KEY = "whimcart.seller.v2";

export const SELLER_DISCLAIMER =
  "All products and merchant tools operate in a simulated marketplace environment.";

export const AVATAR_CHOICES = [
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&auto=format&fit=crop&q=80",
];

export const BANNER_CHOICES = [
  "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=1200&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=1200&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&auto=format&fit=crop&q=80",
];

export const PRODUCT_IMAGE_PRESETS = [
  {
    category: "electronics",
    title: "Pro Noise-Canceling Wireless Headphones",
    url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80",
  },
  {
    category: "electronics",
    title: "Mechanical Tactile Studio Keyboard",
    url: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&auto=format&fit=crop&q=80",
  },
  {
    category: "fashion",
    title: "Minimalist Italian Leather Sneakers",
    url: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&auto=format&fit=crop&q=80",
  },
  {
    category: "fashion",
    title: "All-Weather Technical Windbreaker",
    url: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&auto=format&fit=crop&q=80",
  },
  {
    category: "home",
    title: "Nordic Minimalist Ceramic Pour-Over Set",
    url: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&auto=format&fit=crop&q=80",
  },
  {
    category: "home",
    title: "Smart Ambient Sunset Lamp",
    url: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&auto=format&fit=crop&q=80",
  },
  {
    category: "gadgets",
    title: "Ultra-Fast Magnetic Wireless Power Hub",
    url: "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=800&auto=format&fit=crop&q=80",
  },
  {
    category: "gourmet",
    title: "Artisanal Single-Origin Cold Brew Beans",
    url: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=800&auto=format&fit=crop&q=80",
  },
];

export const SAMPLE_PRODUCT_IMAGES = PRODUCT_IMAGE_PRESETS.map((p) => p.url);

/** Simulated delivery duration in seconds. */
export const DELIVERY_SECONDS = 30;

/** Flat simulated shipping fee. */
export const FICTIONAL_SHIPPING = 4.99;

/** Reward points earned per dollar spent. */
export const POINTS_PER_COIN = 5;

export const COURIERS = [
  { name: "Apex Express Logistics", emoji: "⚡", vehicle: "Electric Delivery Van" },
  { name: "SwiftAir Priority Carrier", emoji: "✈️", vehicle: "Aero Dispatch" },
  { name: "MetroFleet Urban Courier", emoji: "🚴", vehicle: "Rapid Cargo Bike" },
  { name: "Skyline Autonomous Drone", emoji: "🛸", vehicle: "Drone Fleet #88" },
];

export const formatCurrency = (value: number): string =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: value % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(value);

export const formatCoins = (value: number): string => formatCurrency(value);
