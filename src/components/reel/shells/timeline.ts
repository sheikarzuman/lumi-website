import type { FinishedVariant, ModelPose } from "@/components/three/LumiModel";
import { COLLECTION, findShell, type CollectionShell, type RarityId } from "@/lib/rarity";
import {
  easeInOutCubic,
  easeOutBack,
  easeOutCubic,
  mix,
  progress,
  sampleKeys,
  type Keyframe,
} from "@/lib/tween";
import type { ReelCamera, ReelFrame } from "../types";

export const SHELLS_DURATION_MS = 18_000;
const TAU = Math.PI * 2;

/** Beat sheet, in seconds. */
export const BEATS = {
  hookEnd: 2.8,
  commons: 2.8,
  commonStep: 0.8,
  rares: 7.6,
  rareStep: 1.4,
  epic: 10.4,
  secret: 12.8,
  darkIn: 12.8,
  darkFull: 13.4,
  silhouette: 12.95,
  reveal: 13.9,
  sweepStart: 13.45,
  sweepEnd: 14.85,
  end: 15.8,
} as const;

/** The secret shell before its reveal: a dark, glossy silhouette. */
const SILHOUETTE: FinishedVariant = {
  id: "silhouette",
  name: "???",
  shell: "#3A2550",
  deep: "#1B0F26",
  charm: "#3A2550",
  finish: "gold",
};

interface ShellKey {
  at: number;
  shell: FinishedVariant;
  /** seconds to morph colour into this shell */
  morph: number;
  /** seconds for the full-turn whip that hides the change (0 = no whip) */
  whip: number;
}

const COMMONS = COLLECTION.filter((s) => s.rarity === "common");

export const SHELL_KEYS: readonly ShellKey[] = [
  ...COMMONS.map((shell, i) => ({
    at: i === 0 ? 0 : BEATS.commons + i * BEATS.commonStep,
    shell,
    morph: 0.36,
    whip: i === 0 ? 0 : 0.62,
  })),
  { at: BEATS.rares, shell: findShell("cherry"), morph: 0.42, whip: 0.9 },
  { at: BEATS.rares + BEATS.rareStep, shell: findShell("cobalt"), morph: 0.42, whip: 0.9 },
  { at: BEATS.epic, shell: findShell("aurora"), morph: 0.5, whip: 1.1 },
  { at: BEATS.silhouette, shell: SILHOUETTE, morph: 0.45, whip: 0 },
  { at: BEATS.reveal, shell: findShell("golden-hour"), morph: 0.9, whip: 0 },
];

/** Shell on screen (the one being morphed into) and its index in the reel's running order. */
export function shellAt(t: number): { key: ShellKey; index: number } {
  let index = 0;
  SHELL_KEYS.forEach((k, i) => {
    if (k.at <= t) index = i;
  });
  return { key: SHELL_KEYS[index], index };
}

/** Which tier block is on screen. */
export function tierAt(t: number): RarityId {
  if (t >= BEATS.secret) return "secret";
  if (t >= BEATS.epic) return "epic";
  if (t >= BEATS.rares) return "rare";
  return "common";
}

export function isCollectionShell(v: FinishedVariant): v is CollectionShell {
  return "rarity" in v;
}

const CAMERA_KEYS: readonly Keyframe<ReelCamera>[] = [
  { at: 0, value: { az: -0.65, el: 0.2, dist: 17.5, tx: 0, ty: 1.15, fov: 30 } },
  { at: 2.4, value: { az: -0.3, el: 0.12, dist: 15.8, tx: 0, ty: 0.95, fov: 30 } },
  { at: 3.1, value: { az: -0.25, el: 0.1, dist: 15.2, tx: 0, ty: 0.1, fov: 30 } },
  { at: 7.3, value: { az: 0.32, el: 0.14, dist: 14.8, tx: 0, ty: 0.1, fov: 30 } },
  { at: 8.2, value: { az: 0.42, el: 0.05, dist: 13.6, tx: 0, ty: 0.1, fov: 30 } },
  { at: 10.2, value: { az: 0.05, el: 0.1, dist: 13.4, tx: 0, ty: 0.1, fov: 30 } },
  { at: 11.2, value: { az: -0.55, el: 0.36, dist: 13, tx: 0, ty: 0.08, fov: 30 } },
  { at: 12.6, value: { az: 0.45, el: 0.1, dist: 13.6, tx: 0, ty: 0.1, fov: 30 } },
  { at: 13.3, value: { az: 0.18, el: 0.04, dist: 16, tx: 0, ty: 0.1, fov: 30 } },
  { at: 14.5, value: { az: -0.05, el: 0.1, dist: 13.2, tx: 0, ty: 0.1, fov: 30 } },
  { at: 15.6, value: { az: 0.12, el: 0.12, dist: 14, tx: 0, ty: 0.1, fov: 30 } },
  { at: 16.5, value: { az: 0, el: 0.16, dist: 16.5, tx: 0, ty: 0.15, fov: 30 } },
  { at: 18, value: { az: 0.3, el: 0.16, dist: 17.5, tx: 0, ty: 0.15, fov: 30 } },
];

function colourMix(t: number): Pick<ModelPose, "from" | "to" | "mix"> {
  const { key, index } = shellAt(t);
  const prev = SHELL_KEYS[Math.max(0, index - 1)];
  return { from: prev.shell, to: key.shell, mix: easeInOutCubic(progress(t, key.at, key.at + key.morph)) };
}

/** Sum of every full-turn whip so far: each shell change spins the model once, hiding the swap. */
function whipTurns(t: number): { angle: number; lean: number } {
  return SHELL_KEYS.reduce(
    (acc, k) => {
      if (k.whip === 0) return acc;
      const start = k.at - k.whip * 0.3;
      const p = progress(t, start, start + k.whip);
      return { angle: acc.angle + easeInOutCubic(p) * TAU, lean: acc.lean + Math.sin(Math.PI * p) * 0.2 };
    },
    { angle: 0, lean: 0 },
  );
}

function modelPose(t: number): ModelPose {
  const enter = easeOutBack(progress(t, 0.05, 1.0), 1.4);
  const whip = whipTurns(t);
  const { key } = shellAt(t);
  const pop = Math.sin(Math.PI * progress(t, key.at, key.at + 0.5)) * 0.06;
  const endShrink = easeInOutCubic(progress(t, BEATS.end, BEATS.end + 0.8));
  // the secret turns slowly into the light instead of whipping
  const secretTurn = t < BEATS.silhouette ? 0 : mix(-1.5, 0, easeOutCubic(progress(t, BEATS.silhouette, BEATS.end - 0.4)));
  return {
    ...colourMix(t),
    explode: 0,
    rotX: 0.1 * Math.sin(t * 0.7),
    rotY: whip.angle + 0.32 * Math.sin(t * 0.9) - (1 - enter) * 1.2 + secretTurn,
    rotZ: 0.06 * Math.sin(t * 1.1) - whip.lean,
    x: 0,
    y: mix(-3.2, 0.1, enter) + 0.07 * Math.sin(t * 1.4) - endShrink * 0.35,
    scale: (0.55 + 0.45 * enter) * (1 + pop) * mix(1, 0.84, endShrink),
    time: t,
    chipGlow: 0,
  };
}

const EPIC_BURST_AT = BEATS.epic + 0.25;
const SECRET_BURST_AT = BEATS.reveal + 0.1;

export function shellsFrame(ms: number): ReelFrame {
  const t = ms / 1000;
  const darkIn = easeOutCubic(progress(t, BEATS.darkIn, BEATS.darkFull));
  const sweep = t >= BEATS.sweepStart && t <= BEATS.sweepEnd ? easeInOutCubic(progress(t, BEATS.sweepStart, BEATS.sweepEnd)) : null;
  return {
    time: t,
    pose: modelPose(t),
    camera: sampleKeys(CAMERA_KEYS, t),
    dark: darkIn,
    sweep,
    bursts: [
      { t: t - EPIC_BURST_AT, colorA: "#8FE3D6", colorB: "#CBB5EF" },
      { t: t - SECRET_BURST_AT, colorA: "#FFD35A", colorB: "#FFF1B8" },
    ],
    extras: {},
  };
}
