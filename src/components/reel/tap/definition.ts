import type { ReelDefinition } from "../types";
import { TapOverlay } from "./TapOverlay";
import { TapPhone } from "./TapPhone";
import { TAP_DURATION_MS, tapFrame } from "./timeline";

/** "Your sunscreen should remind YOU." — RFID chip tap, timer ring, reminder notification. */
export const TAP_REEL: ReelDefinition = {
  id: "tap",
  durationMs: TAP_DURATION_MS,
  frame: tapFrame,
  Overlay: TapOverlay,
  Extras: TapPhone,
  burstSlots: [{ seed: 41, count: 90, spread: 0.45, duration: 1.1, size: 45, additive: false, position: [0.15, -0.25, 0.8] }],
};
