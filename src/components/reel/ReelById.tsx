"use client";

import type { ReelId } from "./reelIds";
import { ReelStage } from "./ReelStage";
import { SHELLS_REEL } from "./shells/definition";
import { TAP_REEL } from "./tap/definition";
import type { ReelDefinition } from "./types";

const REELS: Record<ReelId, ReelDefinition> = {
  shells: SHELLS_REEL,
  tap: TAP_REEL,
};

export default function ReelById({ id }: { id: ReelId }) {
  return <ReelStage reel={REELS[id]} />;
}
