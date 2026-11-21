/**
 * Single source of truth for LUMI's brand tokens and copy.
 * Everything here is sourced from the LUMI pitch deck (Team 5, MBA Challenge 05).
 * LUMI is concept stage: formulation, manufacturer and NGO partner are NOT finalised.
 */

export interface ShellVariant {
  id: string;
  name: string;
  /** Main shell colour */
  shell: string;
  /** Deeper tone for logotype, chip mark, outlines */
  deep: string;
  /** Default charm colour */
  charm: string;
}

/** Six pastel shell colours (deck: "Collectible, in six pastel shell colours"). */
export const VARIANTS: readonly ShellVariant[] = [
  { id: "blush", name: "Blush", shell: "#F5B2C7", deep: "#D2527F", charm: "#B9E4CD" },
  { id: "lilac", name: "Lilac", shell: "#CBB5EF", deep: "#7A55C4", charm: "#CBB5EF" },
  { id: "butter", name: "Butter", shell: "#FFE69A", deep: "#D9A11A", charm: "#FFE69A" },
  { id: "mint", name: "Mint", shell: "#B9E4CD", deep: "#3E9A72", charm: "#B9E4CD" },
  { id: "sky", name: "Sky", shell: "#B7DCF5", deep: "#2F86C4", charm: "#B7DCF5" },
  { id: "oat", name: "Oat", shell: "#F3E4CC", deep: "#9A7B5C", charm: "#F3E4CC" },
] as const;

export const CHARM_SWATCHES = VARIANTS.map((v) => ({ id: v.id, name: v.name, color: v.shell }));

export const TAGLINE = "Sun protection that goes wherever you go.";

export const NAV_LINKS = [
  { id: "problem", label: "The problem" },
  { id: "meet", label: "Meet LUMI" },
  { id: "collection", label: "Collection" },
  { id: "innovation", label: "Innovation" },
  { id: "tap", label: "Tap" },
  { id: "cares", label: "LUMI CARES" },
] as const;

export const SECTION_IDS = [
  "top",
  "problem",
  "meet",
  "collection",
  "innovation",
  "tap",
  "cares",
  "experience",
  "join",
] as const;

/** The five components of the proposed product (deck slide 4). */
export const PARTS = [
  {
    id: "shell",
    name: "Reusable outer shell",
    blurb: "Durable casing with a loop for the clip and charm.",
  },
  {
    id: "cartridge",
    name: "Replaceable cartridge",
    blurb: "Sealed 60 ml unit. The starter kit has two: one inside, one spare.",
  },
  {
    id: "cap",
    name: "Locking cap and nozzle",
    blurb: "Leak-proof, one-handed dispensing.",
  },
  {
    id: "charm",
    name: "Interchangeable charm",
    blurb: "Collectible, in six pastel shell colours.",
  },
  {
    id: "chip",
    name: "RFID tap chip",
    blurb: "A passive chip with no battery. Tap your phone to open the LUMI app and start your reapply timer.",
  },
] as const;

/** How the RFID tap chip flow is proposed to work. */
export const TAP_STEPS = [
  { title: "Tap", body: "Hold your phone to the chip in the cap. The LUMI app opens on your shell.", tone: "bg-blush" },
  { title: "Start the timer", body: "Hit “I just applied”. The ring starts counting down to your next reapply.", tone: "bg-sun" },
  { title: "Get nudged", body: "A notification tells you when it’s time, and one tap restarts the timer.", tone: "bg-mint" },
] as const;

export const PROBLEM_STAGES = [
  {
    step: "01",
    title: "Apply at home",
    body: "Sunscreen gets applied at home, then stays there.",
  },
  {
    step: "02",
    title: "Left in a drawer",
    body: "Standard bottles take bag space and are easy to forget.",
  },
  {
    step: "03",
    title: "Hours outdoors",
    body: "Reapplying needs the product within reach. It isn’t.",
  },
  {
    step: "04",
    title: "Reapplication skipped",
    body: "Clinical packaging gives young consumers little reason to carry it, or be seen with it.",
  },
] as const;

export const PAIN_POINTS = [
  {
    title: "Not with you",
    body: "Sunscreen gets applied at home, then stays there. Reapplying needs the product within reach.",
    tone: "bg-blush",
  },
  {
    title: "Bulky and forgettable",
    body: "Standard bottles take bag space and are easy to forget, so reapplication gets skipped.",
    tone: "bg-sun",
  },
  {
    title: "Not worth showing off",
    body: "Clinical packaging gives young consumers little reason to carry it or be seen with it.",
    tone: "bg-lavender",
  },
] as const;

export const MARKET_STATS = [
  { value: 481, prefix: "USD ", suffix: "M", decimals: 0, label: "India sunscreen market in 2024", tone: "bg-blush" },
  { value: 9.1, prefix: "", suffix: "%", decimals: 1, label: "Projected annual growth 2025 to 2030, to about USD 811M", tone: "bg-sun" },
  { value: 10.8, prefix: "", suffix: "%", decimals: 1, label: "Projected growth for stick sunscreens, linked to convenience and portability", tone: "bg-mint" },
] as const;

export const TARGET_CONSUMERS = [
  { title: "Gen Z consumers", body: "Led by brand and identity", tone: "bg-blush" },
  { title: "College students", body: "Price-aware, on campus daily", tone: "bg-lavender" },
  { title: "Young professionals", body: "Commutes, lunches, weekends", tone: "bg-sun" },
  { title: "Travellers and outdoor", body: "Long hours in the sun", tone: "bg-mint" },
] as const;

export const FORMULATION_TARGETS = [
  "SPF 50+",
  "PA++++ UVA",
  "Fragrance-free",
  "Non-comedogenic",
  "Lightweight, non-greasy",
  "No visible white cast",
  "Suits hot, humid weather",
  "Sweat and water resistant*",
] as const;

export const CARES_FLOW = [
  { title: "Every 3 bought", body: "Three LUMI cartridges sold.", tone: "bg-blush" },
  { title: "1 meal funded", body: "A set contribution per cartridge, fixed in advance.", tone: "bg-sun" },
  { title: "Prospective partner", body: "An NGO partner is being considered. None is confirmed.", tone: "bg-mint" },
  { title: "Tracked and reported", body: "Proposed: a QR on pack and a quarterly report of meals funded and delivered.", tone: "bg-lavender" },
] as const;

/** Budget assumption from the deck: ₹15 per meal across 3 cartridges = ₹5 per cartridge. A starter kit holds 2 cartridges (₹10). */
export const CARES_MODEL = { cartridgesPerMeal: 3, rupeesPerCartridge: 5, rupeesPerMeal: 15, cartridgesPerKit: 2 } as const;

/** Preliminary pricing assumptions from the deck (MRP, GST included). Not final, not supplier quotes. */
export const PRICING = { kit: 899, refill: 449, cartridgeMl: 60 } as const;

export const ROADMAP = [
  { phase: "Phase 1", when: "Months 0–2", title: "Research and validation", tone: "bg-blush" },
  { phase: "Phase 2", when: "Months 2–6", title: "Product development", tone: "bg-sun" },
  { phase: "Phase 3", when: "Months 6–9", title: "Pilot production", tone: "bg-mint" },
  { phase: "Phase 4", when: "Month 9 onward", title: "Commercial launch", tone: "bg-lavender" },
] as const;
