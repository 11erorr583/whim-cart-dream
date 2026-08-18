import type { Product, ProductCategory } from "@/types/shopping";

export const CATEGORIES: { id: ProductCategory | "all"; label: string; emoji: string }[] = [
  { id: "all", label: "Everything", emoji: "🛍️" },
  { id: "gadgets", label: "Gadgets", emoji: "🔌" },
  { id: "snacks", label: "Snacks", emoji: "🍪" },
  { id: "fashion", label: "Fashion", emoji: "🧦" },
  { id: "home", label: "Home", emoji: "🛋️" },
  { id: "pets", label: "Pets", emoji: "🐾" },
  { id: "absurd", label: "Absurd", emoji: "🛸" },
];

/**
 * Mock catalog. A FastAPI backend can later serve this exact shape from
 * GET /api/products — no component changes required.
 */
export const PRODUCTS: Product[] = [
  {
    id: "p-001",
    name: "Self-Folding Laundry Basket",
    category: "home",
    price: 349,
    rating: 4.6,
    reviewCount: 1204,
    emoji: "🧺",
    blurb: "Folds your laundry. Judges your folding.",
    description:
      "A fictional basket that folds clothes while narrating your life choices. Runs on imaginary batteries (not included, because they do not exist).",
    seller: "Nonsense Home Co.",
    tags: ["bestseller", "chores"],
    reviews: [
      { id: "r1", author: "TidyGoblin", rating: 5, body: "It folded my socks and my resolve." },
      { id: "r2", author: "MaxPile", rating: 4, body: "Great, but it sighs a lot." },
    ],
  },
  {
    id: "p-002",
    name: "Infinite Snack Drawer",
    category: "snacks",
    price: 899,
    rating: 4.9,
    reviewCount: 5310,
    emoji: "🍫",
    blurb: "Opens to a new snack every single time.",
    description:
      "A drawer with no bottom and no rules. Contains a fictional snack for every mood, including moods you have not invented yet.",
    seller: "Midnight Pantry",
    tags: ["fan favorite"],
    reviews: [
      { id: "r1", author: "CrumbLord", rating: 5, body: "Found a burrito at 3am. Life changed." },
      { id: "r2", author: "Nia", rating: 5, body: "The drawer knows me better than my friends." },
    ],
  },
  {
    id: "p-003",
    name: "Noise-Cancelling Socks",
    category: "fashion",
    price: 129,
    rating: 4.1,
    reviewCount: 812,
    emoji: "🧦",
    blurb: "Silences footsteps and small talk.",
    description:
      "Step anywhere without a sound. Side effect: people stop noticing you at parties, which is either a bug or a feature.",
    seller: "Quiet Thread Studio",
    tags: ["stealth"],
    reviews: [
      { id: "r1", author: "SneakySue", rating: 4, body: "Scared my roommate six times today." },
    ],
  },
  {
    id: "p-004",
    name: "Pocket Thundercloud",
    category: "absurd",
    price: 2400,
    rating: 4.8,
    reviewCount: 388,
    emoji: "🌩️",
    blurb: "Personal weather, dramatically deployed.",
    description:
      "A palm-sized storm for punctuating arguments. Rains only on you, which is arguably the point.",
    seller: "Dramatic Skies Ltd.",
    tags: ["limited", "dramatic"],
    reviews: [
      { id: "r1", author: "StormBoi", rating: 5, body: "Entered the room. Lightning. Perfect." },
      { id: "r2", author: "Petra", rating: 4, body: "Humidity in my bag is a real issue." },
    ],
  },
  {
    id: "p-005",
    name: "Cat Translator Collar",
    category: "pets",
    price: 640,
    rating: 3.9,
    reviewCount: 2210,
    emoji: "🐱",
    blurb: "Now you know exactly what she thinks.",
    description:
      "Translates meows with 100% fictional accuracy. Most common output: 'move'.",
    seller: "Whisker Labs",
    tags: ["risky"],
    reviews: [
      { id: "r1", author: "PixelQueen", rating: 3, body: "I was not ready for the honesty." },
    ],
  },
  {
    id: "p-006",
    name: "Hologram Houseplant",
    category: "home",
    price: 275,
    rating: 4.4,
    reviewCount: 940,
    emoji: "🪴",
    blurb: "Unkillable. Photosynthesises vibes.",
    description:
      "Projects a thriving monstera that never needs water, light, or your attention. Grows when complimented.",
    seller: "Nonsense Home Co.",
    tags: ["low maintenance"],
    reviews: [{ id: "r1", author: "Fern", rating: 5, body: "Finally a plant that outlives me." }],
  },
  {
    id: "p-007",
    name: "Time-Zone Toaster",
    category: "gadgets",
    price: 1150,
    rating: 4.2,
    reviewCount: 610,
    emoji: "🍞",
    blurb: "Toast arrives before you want it.",
    description:
      "Browns bread four minutes in the past. Breakfast becomes a mild paradox.",
    seller: "Chrono Kitchen",
    tags: ["new"],
    reviews: [
      { id: "r1", author: "LoafLogic", rating: 4, body: "Toast was ready. I was not." },
    ],
  },
  {
    id: "p-008",
    name: "Anti-Gravity Sneakers",
    category: "fashion",
    price: 3200,
    rating: 4.7,
    reviewCount: 1770,
    emoji: "👟",
    blurb: "Hover 4cm above every problem.",
    description:
      "Fictional lift technology keeps you just above the floor and slightly above the discourse.",
    seller: "Float Athletics",
    tags: ["hype", "limited"],
    reviews: [
      { id: "r1", author: "AirNoah", rating: 5, body: "Ceilings are the new floor." },
      { id: "r2", author: "Dee", rating: 4, body: "Stairs remain confusing." },
    ],
  },
  {
    id: "p-009",
    name: "Emergency Confetti Button",
    category: "absurd",
    price: 89,
    rating: 4.95,
    reviewCount: 8402,
    emoji: "🎉",
    blurb: "One press. Immediate celebration.",
    description:
      "For meetings, breakups, and Tuesdays. Confetti is fictional and therefore never needs sweeping.",
    seller: "Party Contingency Co.",
    tags: ["bestseller", "cheap thrill"],
    reviews: [{ id: "r1", author: "Milo", rating: 5, body: "Pressed it in a lift. No regrets." }],
  },
  {
    id: "p-010",
    name: "Snack-Sniffing Drone",
    category: "gadgets",
    price: 1980,
    rating: 4.3,
    reviewCount: 455,
    emoji: "🛸",
    blurb: "Finds hidden biscuits in 30 seconds.",
    description:
      "Patrols your fictional home and reports the location of every concealed treat. Loyal to no one.",
    seller: "Crumb Recon",
    tags: ["gadget of the week"],
    reviews: [
      { id: "r1", author: "Bea", rating: 4, body: "Found my flatmate's secret stash. Chaos." },
    ],
  },
  {
    id: "p-011",
    name: "Bottomless Coffee Mug",
    category: "snacks",
    price: 420,
    rating: 4.8,
    reviewCount: 3011,
    emoji: "☕",
    blurb: "Refills itself. Never scalds.",
    description:
      "Holds exactly one more sip forever. Warning: fictional caffeine has fictional consequences.",
    seller: "Midnight Pantry",
    tags: ["staff pick"],
    reviews: [{ id: "r1", author: "Owl", rating: 5, body: "Slept in 2021. Doing great." }],
  },
  {
    id: "p-012",
    name: "Dog Compliment Speaker",
    category: "pets",
    price: 310,
    rating: 4.6,
    reviewCount: 1288,
    emoji: "🐶",
    blurb: "Tells your dog he is the best boy. Hourly.",
    description:
      "A small speaker that delivers sincere, escalating praise. Tail-wag guaranteed (fictionally).",
    seller: "Whisker Labs",
    tags: ["wholesome"],
    reviews: [{ id: "r1", author: "Rex's Human", rating: 5, body: "He believes it. So do I." }],
  },
];

export const getProduct = (id: string): Product | undefined =>
  PRODUCTS.find((p) => p.id === id);
