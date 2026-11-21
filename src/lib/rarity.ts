import type { Finish } from "@/components/product/ProductArt";
import { VARIANTS, type ShellVariant } from "./lumi";

export type RarityId = "common" | "rare" | "epic" | "secret";

export interface Rarity {
  id: RarityId;
  label: string;
  /** Proposed drop rate for the whole tier, as a share of all shells */
  oddsPct: number;
  stars: number;
  /** Tailwind classes for the rarity badge */
  badge: string;
}

/** Blind-box style tiers. Odds are a proposal, not a validated figure. */
export const RARITIES: Record<RarityId, Rarity> = {
  common: { id: "common", label: "Common", oddsPct: 70, stars: 1, badge: "bg-white/60 text-plum" },
  rare: { id: "rare", label: "Rare", oddsPct: 20, stars: 2, badge: "bg-sky text-plum" },
  epic: { id: "epic", label: "Epic", oddsPct: 8, stars: 3, badge: "bg-lavender text-plum" },
  secret: { id: "secret", label: "Secret", oddsPct: 2, stars: 4, badge: "bg-plum text-sun" },
};

export const RARITY_ORDER: readonly RarityId[] = ["common", "rare", "epic", "secret"];

export interface CollectionShell extends ShellVariant {
  rarity: RarityId;
  finish: Finish;
}

const COMMONS: CollectionShell[] = VARIANTS.map((v) => ({ ...v, rarity: "common", finish: "matte" }));

const CHASE: CollectionShell[] = [
  { id: "cherry", name: "Cherry", shell: "#F0556A", deep: "#9E1B34", charm: "#FFE69A", rarity: "rare", finish: "matte" },
  { id: "cobalt", name: "Cobalt", shell: "#5B8CFF", deep: "#23409E", charm: "#B7DCF5", rarity: "rare", finish: "matte" },
  { id: "aurora", name: "Aurora", shell: "#8FE3D6", deep: "#3B2FA0", charm: "#CBB5EF", rarity: "epic", finish: "foil" },
  { id: "golden-hour", name: "Golden Hour", shell: "#F6C453", deep: "#8A5A00", charm: "#FFF1B8", rarity: "secret", finish: "gold" },
];

/** Every shell in the proposed collection, commons first and the chase pieces last. */
export const COLLECTION: readonly CollectionShell[] = [...COMMONS, ...CHASE];

/** Each shell's own chance: the tier's share split evenly across the shells in that tier. */
export function oddsPerShell(rarity: RarityId): number {
  const count = COLLECTION.filter((s) => s.rarity === rarity).length;
  return RARITIES[rarity].oddsPct / count;
}

export function findShell(id: string | null): CollectionShell {
  return COLLECTION.find((s) => s.id === id) ?? COLLECTION[0];
}
