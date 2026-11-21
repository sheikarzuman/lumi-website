/** Reel ids that /reel/[id] can render. Kept free of client imports so the server page can use it. */
export const REEL_IDS = ["shells", "tap"] as const;
export type ReelId = (typeof REEL_IDS)[number];

export function isReelId(id: string): id is ReelId {
  return (REEL_IDS as readonly string[]).includes(id);
}
