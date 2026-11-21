/** Pure easing and interpolation helpers shared by the unbox animation and the reel timelines. */

export const clamp = (n: number, min = 0, max = 1) => Math.min(Math.max(n, min), max);
export const mix = (a: number, b: number, t: number) => a + (b - a) * t;

/** 0 before `start`, 1 after `end`, linear in between. */
export const progress = (t: number, start: number, end: number) => (end === start ? (t >= end ? 1 : 0) : clamp((t - start) / (end - start)));

export const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);
export const easeOutCubic = (t: number) => 1 - (1 - t) ** 3;
export const easeInCubic = (t: number) => t * t * t;
export const easeOutExpo = (t: number) => (t >= 1 ? 1 : 1 - 2 ** (-10 * t));
export const easeInOutSine = (t: number) => -(Math.cos(Math.PI * t) - 1) / 2;
export function easeOutBack(t: number, overshoot = 1.70158) {
  const c3 = overshoot + 1;
  return 1 + c3 * (t - 1) ** 3 + overshoot * (t - 1) ** 2;
}

/** Fade in over [inStart, inEnd], hold, fade out over [outStart, outEnd]. */
export function window01(t: number, inStart: number, inEnd: number, outStart: number, outEnd: number) {
  return Math.min(easeOutCubic(progress(t, inStart, inEnd)), 1 - easeInCubic(progress(t, outStart, outEnd)));
}

/** Small deterministic PRNG (mulberry32) so particle layouts are identical every render. */
export function seededRandom(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export interface Keyframe<T> {
  at: number;
  value: T;
}

/** Interpolates numeric records between keyframes with easeInOutSine; holds the ends. */
export function sampleKeys<T extends { [K in keyof T]: number }>(keys: readonly Keyframe<T>[], t: number): T {
  if (t <= keys[0].at) return keys[0].value;
  const last = keys[keys.length - 1];
  if (t >= last.at) return last.value;
  const i = keys.findIndex((k) => k.at > t);
  const a = keys[i - 1];
  const b = keys[i];
  const k = easeInOutSine(progress(t, a.at, b.at));
  const entries = (Object.keys(a.value) as (keyof T)[]).map((key) => [key, mix(a.value[key], b.value[key], k)]);
  return Object.fromEntries(entries) as T;
}
