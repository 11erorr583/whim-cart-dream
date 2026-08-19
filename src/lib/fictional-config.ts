/** Single source of truth for shared copy and tunable gameplay numbers. */

export const FICTIONAL_DISCLAIMER =
  "This is a fictional shopping experience. No purchase is made and no money is charged.";

export const CURRENCY_LABEL = "fictional coins";

export const STORAGE_KEY = "fsep.session.v1";

/** Seller profile + uploaded fictional products (gameplay state only). */
export const SELLER_STORAGE_KEY = "fsep.seller.v1";

export const SELLER_DISCLAIMER =
  "Uploads are part of a fictional game. Nothing is sold, shipped, or charged — please only submit made-up products.";

export const AVATAR_CHOICES = ["🧑‍🚀", "🦄", "🐙", "🤖", "🧙", "🐸", "👽", "🦩"];

/** Imaginary delivery duration in seconds. */
export const DELIVERY_SECONDS = 45;

/** Flat fictional shipping fee. */
export const FICTIONAL_SHIPPING = 25;

/** Reward points earned per fictional coin spent (before personality multiplier). */
export const POINTS_PER_COIN = 2;

export const COURIERS = [
  { name: "Captain Pigeon", emoji: "🐦" },
  { name: "The Teleport Guy", emoji: "🌀" },
  { name: "Very Fast Snail", emoji: "🐌" },
  { name: "Drone #4471", emoji: "🛸" },
];

export const formatCoins = (value: number): string =>
  `${Math.round(value).toLocaleString("en-US")}c`;
