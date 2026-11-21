import type { ComponentType, RefObject } from "react";
import type { BurstFrame } from "@/components/three/Burst";
import type { ModelPose } from "@/components/three/LumiModel";

/** Orbit camera: spherical offset around a target point. */
export interface ReelCamera {
  /** azimuth, radians (0 = straight on) */
  az: number;
  /** elevation, radians */
  el: number;
  dist: number;
  tx: number;
  ty: number;
  fov: number;
}

/** Everything the 3D layer needs for one instant. Produced by a pure function of time. */
export interface ReelFrame {
  /** Seconds since the start of the reel */
  time: number;
  pose: ModelPose;
  camera: ReelCamera;
  /** 0 = cream studio, 1 = dark plum stage */
  dark: number;
  /** 0..1 progress of a bright light sweeping across the environment, null when off */
  sweep: number | null;
  /** One entry per burst slot declared by the reel */
  bursts: readonly (BurstFrame | null)[];
  /** Reel-specific numbers for extra 3D props (e.g. the phone in the tap reel) */
  extras: Readonly<Record<string, number>>;
}

export interface BurstSlot {
  seed: number;
  count: number;
  spread: number;
  duration: number;
  size: number;
  additive: boolean;
  position: [number, number, number];
}

export interface ReelDefinition {
  id: string;
  durationMs: number;
  frame: (ms: number) => ReelFrame;
  /** 2D type and graphics layered over the canvas; must be a pure function of `ms` */
  Overlay: ComponentType<{ ms: number }>;
  /** Extra 3D props that read the current frame each render */
  Extras?: ComponentType<{ frame: RefObject<ReelFrame | null> }>;
  burstSlots: readonly BurstSlot[];
}

/** Instagram Reels canvas, CSS pixels. */
export const REEL_WIDTH = 1080;
export const REEL_HEIGHT = 1920;
/** Keep key content out of the areas Instagram covers with its own UI. */
export const SAFE_TOP = 250;
export const SAFE_BOTTOM = 380;
export const SAFE_SIDE = 80;
