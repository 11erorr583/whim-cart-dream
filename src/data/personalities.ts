import type { Personality, PersonalityId } from "@/types/shopping";

export const PERSONALITIES: Personality[] = [
  {
    id: "impulse-buyer",
    name: "Impulse Buyer",
    emoji: "⚡",
    tagline: "Saw it. Wanted it. Added it.",
    description:
      "You shop at the speed of thought. Carts fill themselves. Regret is a tomorrow problem — and tomorrow is fictional too.",
    startingWallet: 4000,
    rewardMultiplier: 1.5,
    quips: [
      "Adding that before your brain objects.",
      "One more won't hurt. Probably.",
      "The cart says hello again.",
    ],
  },
  {
    id: "window-shopper",
    name: "Window Shopper",
    emoji: "🪟",
    tagline: "Just looking, thanks.",
    description:
      "You browse for the art of it. Wishlists are your love language. Checkout is a theoretical concept.",
    startingWallet: 1500,
    rewardMultiplier: 0.75,
    quips: [
      "Beautiful. Not buying it though.",
      "Adding to the mental wishlist.",
      "You've viewed this item eleven times.",
    ],
  },
  {
    id: "delusional-millionaire",
    name: "Delusional Millionaire",
    emoji: "🦚",
    tagline: "Money is imaginary anyway.",
    description:
      "Your fictional wallet is enormous and your taste is louder. Budgets are for people with real currency.",
    startingWallet: 100000,
    rewardMultiplier: 2,
    quips: [
      "Buy two. Gift one to yourself.",
      "Price tags are just suggestions.",
      "Yes, the gold one.",
    ],
  },
  {
    id: "responsible-adult",
    name: "Responsible Adult",
    emoji: "🧾",
    tagline: "Compared. Researched. Approved.",
    description:
      "You read the reviews. All of them. Your cart is a spreadsheet with feelings, and every item earns its place.",
    startingWallet: 2500,
    rewardMultiplier: 1.25,
    quips: [
      "Have you checked the reviews?",
      "That's 3 fictional coins per use. Acceptable.",
      "Sleeping on it is still an option.",
    ],
  },
];

export const getPersonality = (id: PersonalityId | null): Personality | null =>
  PERSONALITIES.find((p) => p.id === id) ?? null;
