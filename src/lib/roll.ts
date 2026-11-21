import { COLLECTION, RARITIES, RARITY_ORDER, type CollectionShell } from "./rarity";

/**
 * Rolls one blind box using the proposed tier odds: first pick a tier by its share
 * (common 70, rare 20, epic 8, secret 2), then pick evenly among the shells in that tier.
 * `random` must return a number in [0, 1); it is injectable for tests and deterministic demos.
 */
export function rollShell(random: () => number = Math.random): CollectionShell {
  const total = RARITY_ORDER.reduce((sum, id) => sum + RARITIES[id].oddsPct, 0);
  const tierRoll = clampUnit(random()) * total;

  let cumulative = 0;
  const tier =
    RARITY_ORDER.find((id) => {
      cumulative += RARITIES[id].oddsPct;
      return tierRoll < cumulative;
    }) ?? RARITY_ORDER[RARITY_ORDER.length - 1];

  const pool = COLLECTION.filter((s) => s.rarity === tier);
  const index = Math.min(pool.length - 1, Math.floor(clampUnit(random()) * pool.length));
  return pool[index];
}

function clampUnit(n: number) {
  return Number.isFinite(n) ? Math.min(Math.max(n, 0), 0.999999) : 0;
}
