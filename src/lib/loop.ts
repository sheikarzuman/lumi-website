/**
 * LUMI Loop: the proposed cartridge take-back programme. Everything here is a concept-stage proposal.
 * No return scheme, recycling partner or reward programme exists yet, and the reward values are illustrative.
 */
export const LOOP_RULES = {
  minCartridges: 6,
  maxCartridges: 10,
  pointsPerCartridge: 10,
  bonusPointsAtMax: 20,
} as const;

export const LOOP_STEPS = [
  { title: "Collect 6 to 10", body: "Keep your empty LUMI cartridges. Once you have 6 to 10, you are ready to send them.", tone: "bg-blush" },
  { title: "Mail them back", body: "Proposed: a pre-paid return pack comes with your refills, so posting them costs you nothing.", tone: "bg-sun" },
  { title: "We reuse and recycle", body: "Cartridges are sorted and cleaned. Anything that passes safety checks is reused, the rest is recycled.", tone: "bg-mint" },
  { title: "You earn rewards", body: "Proposed: Loop Points for every cartridge, redeemable as coupons on refills and charms.", tone: "bg-lavender" },
] as const;

export interface LoopReward {
  points: number;
  perk: string;
}

/** Points and the perk unlocked for a pack of `cartridges` returned together. */
export function loopReward(cartridges: number): LoopReward {
  const { minCartridges, maxCartridges, pointsPerCartridge, bonusPointsAtMax } = LOOP_RULES;
  const count = Math.min(maxCartridges, Math.max(minCartridges, Math.round(cartridges)));
  const full = count === maxCartridges;
  return {
    points: count * pointsPerCartridge + (full ? bonusPointsAtMax : 0),
    perk: full ? "A refill coupon plus a free collectible charm" : "A refill coupon",
  };
}
