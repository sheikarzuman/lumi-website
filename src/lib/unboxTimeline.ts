import type { CollectionShell } from "./rarity";
import { easeInCubic, easeOutBack, easeOutCubic, easeInOutCubic, progress } from "./tween";

/** A pull in progress. `start` is a performance.now() timestamp in ms. */
export interface PullState {
  start: number;
  shell: CollectionShell;
  reduced: boolean;
}

/** Everything the blind-box animation needs at one instant. */
export interface BoxPose {
  visible: boolean;
  /** box drop offset in world units (0 = landed) */
  y: number;
  /** z-rotation wobble in radians */
  shake: number;
  /** 0 closed .. 1 lid gone */
  lid: number;
  /** 0 upright .. 1 walls folded flat */
  walls: number;
  /** 1 opaque .. 0 gone */
  opacity: number;
  /** scale of the LUMI inside: shrinks out, grows back after the reveal */
  modelScale: number;
}

interface Beats {
  shrinkEnd: number;
  dropStart: number;
  dropEnd: number;
  reveal: number;
  openEnd: number;
  growEnd: number;
  fadeStart: number;
  end: number;
}

const FULL: Beats = {
  shrinkEnd: 0.35,
  dropStart: 0.12,
  dropEnd: 0.62,
  reveal: 1.45,
  openEnd: 1.95,
  growEnd: 2.2,
  fadeStart: 1.95,
  end: 2.5,
};

/** Reduced motion: no drop, no shake, a quick cross-fade open. */
const REDUCED: Beats = {
  shrinkEnd: 0.12,
  dropStart: 0,
  dropEnd: 0,
  reveal: 0.3,
  openEnd: 0.55,
  growEnd: 0.5,
  fadeStart: 0.45,
  end: 0.8,
};

const DROP_HEIGHT = 6;
const SHAKE_AMPLITUDE = 0.09;
const SHAKE_HZ = 7;

export const beatsFor = (reduced: boolean): Beats => (reduced ? REDUCED : FULL);

/** Seconds after the pull when the new shell is revealed (colour switches, tracker updates). */
export const revealDelayMs = (reduced: boolean) => beatsFor(reduced).reveal * 1000;
/** Seconds after the pull when the whole animation has settled. */
export const pullDurationMs = (reduced: boolean) => beatsFor(reduced).end * 1000;

export const IDLE_POSE: BoxPose = { visible: false, y: 0, shake: 0, lid: 0, walls: 0, opacity: 0, modelScale: 1 };

/** Pure: the blind-box pose `t` seconds after a pull. */
export function boxPose(t: number, reduced: boolean): BoxPose {
  const b = beatsFor(reduced);
  if (t < 0 || t >= b.end) return IDLE_POSE;

  const drop = reduced ? 1 : easeOutBack(progress(t, b.dropStart, b.dropEnd), 1.3);
  const shakeRamp = reduced ? 0 : Math.sin(Math.PI * progress(t, b.dropEnd, b.reveal));
  const open = easeInOutCubic(progress(t, b.reveal, b.openEnd));
  const grow = reduced
    ? easeOutCubic(progress(t, b.reveal, b.growEnd))
    : easeOutBack(progress(t, b.reveal + 0.05, b.growEnd), 1.8);
  const shrink = 1 - easeInCubic(progress(t, 0, b.shrinkEnd));

  return {
    visible: true,
    y: (1 - drop) * DROP_HEIGHT,
    shake: Math.sin(t * SHAKE_HZ * Math.PI * 2) * SHAKE_AMPLITUDE * shakeRamp,
    lid: open,
    walls: open,
    opacity: (reduced ? easeOutCubic(progress(t, 0, 0.15)) : 1) * (1 - easeOutCubic(progress(t, b.fadeStart, b.end))),
    modelScale: t < b.reveal ? shrink : grow,
  };
}
