import type { ReelDefinition } from "../types";
import { ShellsOverlay } from "./ShellsOverlay";
import { SHELLS_DURATION_MS, shellsFrame } from "./timeline";

/** "6 pastel shells. 2 rare. 1 epic. 1 secret." — tours the whole proposed collection. */
export const SHELLS_REEL: ReelDefinition = {
  id: "shells",
  durationMs: SHELLS_DURATION_MS,
  frame: shellsFrame,
  Overlay: ShellsOverlay,
  burstSlots: [
    { seed: 11, count: 160, spread: 0.9, duration: 1.8, size: 70, additive: false, position: [0, 0.2, 0.6] },
    { seed: 29, count: 260, spread: 1.15, duration: 2.3, size: 80, additive: true, position: [0, 0.2, 0.6] },
  ],
};
