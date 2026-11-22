import { PRICING } from "@/lib/lumi";
import { RARITIES, RARITY_ORDER } from "@/lib/rarity";

/** Investor thesis copy for /investors. All figures are preliminary assumptions at concept stage. */
export const THESIS = {
  badge: "Concept & Prototyping Stage • Pre-Seed",
  headline: "Turning daily sun protection into a wearable, recurring-revenue habit.",
  subhead:
    "India's sunscreen market is growing rapidly, yet daily reapplication fails because bulky clinical bottles stay at home. LUMI solves the convenience gap with a refillable clip-on bag charm, 60ml drop-in cartridges, and a battery-free RFID chip that adapts reapplication guidance to live weather and UV index.",
} as const;

const rarityLine = RARITY_ORDER.map((id) => `${RARITIES[id].label} ${RARITIES[id].oddsPct}%`).join(", ");

export const UNIT_CARDS = [
  {
    eyebrow: "Starter Kit",
    price: `₹${PRICING.kit}`,
    priceNote: "MRP incl. GST",
    body: `Reusable outer shell, interchangeable charm, and two sealed ${PRICING.cartridgeMl}ml SPF 50+ cartridges (preliminary pricing assumption).`,
    tone: "bg-blush",
  },
  {
    eyebrow: "High-Margin Refills",
    price: `₹${PRICING.refill}`,
    priceNote: "MRP incl. GST",
    body: `Recurring 30–45 day replacement cycle for ${PRICING.cartridgeMl}ml cartridges—keeping the shell in play while reducing single-use plastic per cycle.`,
    tone: "bg-sun",
  },
  {
    eyebrow: "Collectible & Connected Retention",
    price: "10 × 4",
    priceNote: "shells × rarity tiers",
    body: `10 shell colorways across 4 rarity tiers (${rarityLine}) + passive RFID tap that checks live weather/UV (skipping unnecessary applications on rainy/overcast days and setting dynamic timers on high-UV days).`,
    tone: "bg-mint",
  },
] as const;

export const USE_OF_FUNDS = [
  { pct: 35, label: "SPF 50+ stability, heat-exposure testing & CDSCO/BIS cosmetic compliance", tone: "bg-blush" },
  { pct: 30, label: "Precision CAD tooling, silicone dispensing valve testing & pilot mold fabrication", tone: "bg-sun" },
  { pct: 20, label: "Passive RFID + live weather/UV mobile app & initial 1,000-unit pilot batch", tone: "bg-lavender" },
  { pct: 15, label: "Campus seeding & Phase 1 consumer validation", tone: "bg-mint" },
] as const;

/** The first six months of the site's existing roadmap, with the funding lines each phase draws on. */
export const SIX_MONTH_ROADMAP = [
  {
    when: "Months 0–2",
    title: "Research & validation",
    items: ["Formulation brief, SPF/UVA and stability test plan", "CDSCO/BIS cosmetic compliance mapping", "Campus seeding & Phase 1 consumer validation"],
    tone: "bg-blush",
  },
  {
    when: "Months 2–6",
    title: "Product development",
    items: ["Precision CAD tooling & silicone valve testing", "Pilot mold fabrication", "RFID + weather/UV app build toward a 1,000-unit pilot batch"],
    tone: "bg-sun",
  },
] as const;
