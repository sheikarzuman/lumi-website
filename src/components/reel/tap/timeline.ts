import type { ModelPose } from "@/components/three/LumiModel";
import { findShell } from "@/lib/rarity";
import { easeInOutCubic, easeOutBack, easeOutCubic, mix, progress, sampleKeys, type Keyframe } from "@/lib/tween";
import type { ReelCamera, ReelFrame } from "../types";

export const TAP_DURATION_MS = 15_000;

/** Beat sheet, in seconds. */
export const TAP_BEATS = {
  hookEnd: 3.0,
  glowStart: 3.3,
  phoneIn: 4.1,
  tap: 5.2,
  phoneOut: 5.6,
  cardIn: 6.2,
  ringStart: 7.3,
  ringEnd: 9.3,
  notify: 9.6,
  cardOut: 11.0,
  end: 11.5,
} as const;

const SHELL = findShell("blush");
const MODEL_SCALE = 1;
const PHONE_SCALE = 0.75;
/** Local position of the RFID chip on the assembled model. */
const CHIP = { y: -0.35, z: 0.43 };

const CAMERA_KEYS: readonly Keyframe<ReelCamera>[] = [
  { at: 0, value: { az: -0.5, el: 0.18, dist: 17, tx: 0, ty: 1.05, fov: 30 } },
  { at: 2.6, value: { az: -0.1, el: 0.12, dist: 15.5, tx: 0, ty: 0.95, fov: 30 } },
  { at: 4.0, value: { az: 0.3, el: 0.08, dist: 13, tx: 0.45, ty: 0.05, fov: 30 } },
  { at: 5.3, value: { az: 0.36, el: 0.06, dist: 12.2, tx: 0.5, ty: 0, fov: 30 } },
  { at: 6.4, value: { az: 0.2, el: 0.1, dist: 14, tx: 0, ty: 0, fov: 30 } },
  { at: 11.0, value: { az: -0.1, el: 0.1, dist: 15, tx: 0, ty: 0, fov: 30 } },
  { at: 12.0, value: { az: 0.05, el: 0.14, dist: 15.5, tx: 0, ty: 0.25, fov: 30 } },
  { at: 15, value: { az: 0.3, el: 0.14, dist: 16.5, tx: 0, ty: 0.25, fov: 30 } },
];

function modelPose(t: number): ModelPose {
  const enter = easeOutBack(progress(t, 0.05, 1.0), 1.4);
  // spins in, settles facing the camera for the tap, then idles
  const settle = easeInOutCubic(progress(t, 2.6, 4.0));
  const spin = mix(-Math.PI * 2 + t * 1.2, 0.38, settle);
  const glowPulse = t >= TAP_BEATS.tap ? Math.exp(-(t - TAP_BEATS.tap) * 3) * 0.6 : 0;
  const glow = Math.min(1, easeOutCubic(progress(t, TAP_BEATS.glowStart, TAP_BEATS.glowStart + 0.6)) + glowPulse);
  const knock = Math.sin(Math.PI * progress(t, TAP_BEATS.tap - 0.05, TAP_BEATS.tap + 0.3)) * 0.12;
  return {
    from: SHELL,
    to: SHELL,
    mix: 0,
    explode: 0,
    rotX: 0.06 * Math.sin(t * 0.8),
    rotY: spin + 0.12 * Math.sin(t * 0.9) * (1 - settle * 0.6) - knock,
    rotZ: 0.05 * Math.sin(t * 1.1) + knock * 0.5,
    x: 0,
    y: mix(-3.2, 0.1, enter) + 0.06 * Math.sin(t * 1.3),
    scale: (0.55 + 0.45 * enter) * MODEL_SCALE,
    time: t,
    chipGlow: glow,
  };
}

/** Phone path: slides in from the right, taps the chip, then lifts toward the camera and away. */
function phoneExtras(t: number): Record<string, number> {
  const inP = easeOutCubic(progress(t, TAP_BEATS.phoneIn, TAP_BEATS.tap));
  const outP = easeInOutCubic(progress(t, TAP_BEATS.phoneOut, TAP_BEATS.cardIn + 0.4));
  const visible = t >= TAP_BEATS.phoneIn && t < TAP_BEATS.cardIn + 0.4 ? 1 : 0;
  // phone tilted so its top-left corner meets the chip's edge
  const tapX = 1.4;
  const tapY = CHIP.y - 0.75;
  const tapZ = CHIP.z + 0.25;
  const bump = Math.sin(Math.PI * progress(t, TAP_BEATS.tap - 0.12, TAP_BEATS.tap + 0.2)) * 0.18;
  return {
    phoneVisible: visible,
    phoneX: mix(mix(5.5, tapX, inP), 2.6, outP) - bump,
    phoneY: mix(mix(1.4, tapY, inP), 1.8, outP),
    phoneZ: mix(mix(1.6, tapZ, inP), 4.5, outP),
    phoneRotY: mix(mix(-1.1, -0.25, inP), 0.1, outP),
    phoneRotZ: mix(mix(0.2, 0.72, inP), 0, outP),
    phoneScale: PHONE_SCALE * (1 - easeInOutCubic(progress(t, TAP_BEATS.cardIn, TAP_BEATS.cardIn + 0.4))),
    screenGlow: 0.4 + Math.exp(-Math.max(0, t - TAP_BEATS.tap) * 2.5) * (t >= TAP_BEATS.tap ? 1.2 : 0),
  };
}

export function tapFrame(ms: number): ReelFrame {
  const t = ms / 1000;
  return {
    time: t,
    pose: modelPose(t),
    camera: sampleKeys(CAMERA_KEYS, t),
    dark: 0,
    sweep: null,
    bursts: [{ t: t - TAP_BEATS.tap, colorA: "#FFF7ED", colorB: "#B9E4CD" }],
    extras: phoneExtras(t),
  };
}
