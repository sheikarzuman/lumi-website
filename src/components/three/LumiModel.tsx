"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { Finish } from "@/components/product/ProductArt";
import type { ShellVariant } from "@/lib/lumi";
import { applyFinish, blendFinish, finishWeights, lerpWeights, type FinishWeights } from "./finish";
import { LumiMeshes, NODE, type LumiSharedMaterials } from "./LumiMeshes";

/** Mutable scene state written by scroll/pointer handlers and read every frame (no React re-renders). */
export interface SceneState {
  /** 0 = assembled, 1 = fully exploded */
  explode: number;
  /** index into PARTS (0 shell, 1 cartridge, 2 cap, 3 charm, 4 RFID chip) or -1 */
  active: number;
  /** extra yaw in radians */
  spin: number;
  /** pointer position, -0.5..0.5 */
  px: number;
  py: number;
}

export const INITIAL_SCENE_STATE: SceneState = { explode: 0, active: -1, spin: 0, px: 0, py: 0 };

/** A shell colourway with an optional finish (matte when omitted). */
export type FinishedVariant = ShellVariant & { finish?: Finish };

/**
 * Absolute pose for deterministic rendering (reels). When supplied, the model ignores the clock,
 * damping and viewport fitting and renders exactly this pose, so the same pose always gives the same frame.
 */
export interface ModelPose {
  from: FinishedVariant;
  to: FinishedVariant;
  /** 0 = from, 1 = to */
  mix: number;
  explode: number;
  rotX: number;
  rotY: number;
  rotZ: number;
  x: number;
  y: number;
  scale: number;
  /** Seconds, drives the charm swing and chip-glow ripples */
  time: number;
  /** 0..1 RFID chip glow */
  chipGlow: number;
}

const { damp, lerp } = THREE.MathUtils;
const COLOUR_RATE = 7;
const FINISH_RATE = 5;
const GLOW_PERIOD = 1.1;
const CHARM_SWING_HZ = 1.6;

interface LumiModelProps {
  variant: ShellVariant;
  /** Optional shell finish; matte when omitted */
  finish?: Finish;
  /** Overrides the variant's default charm colour */
  charmColor?: string;
  state: RefObject<SceneState>;
  /** Idle bobbing + sway */
  idle?: boolean;
  /** Deterministic pose; takes over from state/idle while non-null */
  pose?: RefObject<ModelPose | null>;
}

interface ColourSet {
  shell: THREE.Color;
  cap: THREE.Color;
  charm: THREE.Color;
  deep: THREE.Color;
}

const newColourSet = (): ColourSet => ({
  shell: new THREE.Color(),
  cap: new THREE.Color(),
  charm: new THREE.Color(),
  deep: new THREE.Color(),
});

function setColourTargets(c: ColourSet, v: ShellVariant, charm?: string) {
  c.shell.set(v.shell);
  c.deep.set(v.deep);
  c.cap.set(v.shell).lerp(c.deep, 0.3);
  c.charm.set(charm ?? v.charm);
}

function lerpColourSet(c: ColourSet, to: ColourSet, t: number) {
  c.shell.lerp(to.shell, t);
  c.cap.lerp(to.cap, t);
  c.charm.lerp(to.charm, t);
  c.deep.lerp(to.deep, t);
}

/** Direct handles to the animated nodes, looked up by name once the meshes mount. */
interface Rig {
  root: THREE.Group;
  shellG?: THREE.Object3D;
  cartridgeG?: THREE.Object3D;
  capG?: THREE.Object3D;
  charmG?: THREE.Object3D;
  dialG?: THREE.Object3D;
  glowG?: THREE.Object3D;
  shellMat?: THREE.MeshPhysicalMaterial;
  loopMat?: THREE.MeshPhysicalMaterial;
  capMat?: THREE.MeshPhysicalMaterial;
  chipDotMat?: THREE.MeshPhysicalMaterial;
  logoMat?: THREE.MeshBasicMaterial;
}

function buildRig(root: THREE.Group): Rig {
  const node = (name: string) => root.getObjectByName(name);
  const mat = <M extends THREE.Material>(name: string) => (node(name) as THREE.Mesh | undefined)?.material as M | undefined;
  return {
    root,
    shellG: node(NODE.shellG),
    cartridgeG: node(NODE.cartridgeG),
    capG: node(NODE.capG),
    charmG: node(NODE.charmG),
    dialG: node(NODE.dialG),
    glowG: node(NODE.glowG),
    shellMat: mat<THREE.MeshPhysicalMaterial>(NODE.shellBody),
    loopMat: mat<THREE.MeshPhysicalMaterial>(NODE.loop),
    capMat: mat<THREE.MeshPhysicalMaterial>(NODE.capBody),
    chipDotMat: mat<THREE.MeshPhysicalMaterial>(NODE.chipDot),
    logoMat: mat<THREE.MeshBasicMaterial>(NODE.logo),
  };
}

function useSharedMaterials(charm: string, deep: string): LumiSharedMaterials {
  const [shared] = useState<LumiSharedMaterials>(() => ({
    charm: new THREE.MeshPhysicalMaterial({ color: charm, emissive: charm, emissiveIntensity: 0, roughness: 0.4, clearcoat: 0.45 }),
    deep: new THREE.MeshPhysicalMaterial({ color: deep, emissive: deep, emissiveIntensity: 0, roughness: 0.45 }),
    deepFlat: new THREE.MeshBasicMaterial({ color: deep }),
  }));
  useEffect(
    () => () => {
      shared.charm.dispose();
      shared.deep.dispose();
      shared.deepFlat.dispose();
    },
    [shared],
  );
  return shared;
}

/** Explode offsets for each part; `e` is 0 (assembled) to 1 (exploded). */
function layoutParts(r: Rig, e: number) {
  r.shellG?.position.set(lerp(0, -1.05, e), lerp(0, 0.25, e), 0);
  r.cartridgeG?.position.set(lerp(0, 1.25, e), lerp(0, 0.5, e), lerp(0, -0.1, e));
  if (r.cartridgeG) r.cartridgeG.rotation.y = -0.35 * e;
  r.capG?.position.set(lerp(0, -1.05, e), lerp(-1.05, -2.15, e), 0);
  r.charmG?.position.set(lerp(0.95, 1.35, e), lerp(-0.9, -1.8, e), lerp(0.3, 0.5, e));
  // RFID chip lifts off the shell face and floats in the gap between shell and cartridge
  r.dialG?.position.set(lerp(0, 0.2, e), lerp(-0.35, 0.45, e), lerp(0.43, 0.85, e));
}

function applyShellFinish(r: Rig, w: FinishWeights) {
  const p = blendFinish(w);
  applyFinish(r.shellMat, p);
  applyFinish(r.loopMat, p);
  applyFinish(r.capMat, p);
}

/** Writes the four colour roles; emissive follows colour so the highlight glow is tinted correctly. */
function applyColours(r: Rig, shared: LumiSharedMaterials, c: ColourSet) {
  for (const m of [r.shellMat, r.loopMat]) {
    if (!m) continue;
    m.color.copy(c.shell);
    m.emissive.copy(c.shell);
  }
  if (r.capMat) {
    r.capMat.color.copy(c.cap);
    r.capMat.emissive.copy(c.cap);
  }
  shared.charm.color.copy(c.charm);
  shared.charm.emissive.copy(c.charm);
  shared.deep.color.copy(c.deep);
  shared.deep.emissive.copy(c.deep);
  shared.deepFlat.color.copy(c.deep);
  r.logoMat?.color.copy(c.deep);
}

function updateChipGlow(r: Rig, glow: number, time: number) {
  const g = r.glowG;
  if (r.chipDotMat) r.chipDotMat.emissiveIntensity = glow * 2.2;
  if (!g) return;
  g.visible = glow > 0.001;
  if (!g.visible) return;
  g.children.forEach((child, i) => {
    const phase = (((time / GLOW_PERIOD + i / g.children.length) % 1) + 1) % 1;
    child.scale.setScalar(1 + phase * 1.6);
    const mat = (child as THREE.Mesh).material as THREE.MeshBasicMaterial;
    mat.opacity = glow * (1 - phase) * 0.9;
  });
}

/** Renders an absolute pose: no clock, no damping, no viewport fit. */
function renderPose(r: Rig, shared: LumiSharedMaterials, c: { now: ColourSet; scratch: ColourSet }, p: ModelPose) {
  setColourTargets(c.now, p.from);
  setColourTargets(c.scratch, p.to);
  lerpColourSet(c.now, c.scratch, p.mix);
  applyColours(r, shared, c.now);
  applyShellFinish(r, lerpWeights(finishWeights(p.from.finish), finishWeights(p.to.finish), p.mix));
  layoutParts(r, p.explode);
  if (r.charmG) r.charmG.rotation.z = -0.3 + Math.sin(p.time * CHARM_SWING_HZ) * 0.1;
  updateChipGlow(r, p.chipGlow, p.time);
  const root = r.root;
  root.position.set(p.x, p.y, 0);
  root.rotation.set(p.rotX, p.rotY, p.rotZ);
  root.scale.setScalar(p.scale);
}

export function LumiModel({ variant, finish, charmColor, state, idle = true, pose }: LumiModelProps) {
  const [initial] = useState(() => ({ shell: variant.shell, deep: variant.deep, charm: charmColor ?? variant.charm }));
  const rootRef = useRef<THREE.Group>(null);
  const rigRef = useRef<Rig | null>(null);
  const shared = useSharedMaterials(initial.charm, initial.deep);

  const colours = useRef({ targets: newColourSet(), now: newColourSet(), scratch: newColourSet(), primed: false });
  const finishTarget = useRef<FinishWeights>(finishWeights(finish));
  const finishNow = useRef<FinishWeights | null>(null);
  const explode = useRef(0);
  const highlight = useRef([0, 0, 0, 0, 0]);

  useEffect(() => {
    setColourTargets(colours.current.targets, variant, charmColor);
    finishTarget.current = finishWeights(finish);
  }, [variant, charmColor, finish]);

  useFrame((frame, dt) => {
    if (!rigRef.current && rootRef.current) rigRef.current = buildRig(rootRef.current);
    const rig = rigRef.current;
    if (!rig) return;
    const c = colours.current;
    const p = pose?.current;
    if (p) {
      renderPose(rig, shared, c, p);
      return;
    }
    const s = state.current;
    const clock = frame.clock.elapsedTime;
    const e = (explode.current = damp(explode.current, s.explode, 4.5, dt));

    // colour + finish easing toward targets (snap on the first frame)
    const k = c.primed ? 1 - Math.exp(-COLOUR_RATE * dt) : 1;
    c.primed = true;
    lerpColourSet(c.now, c.targets, k);
    applyColours(rig, shared, c.now);
    const fk = 1 - Math.exp(-FINISH_RATE * dt);
    finishNow.current = finishNow.current
      ? lerpWeights(finishNow.current, finishTarget.current, fk)
      : finishTarget.current;
    applyShellFinish(rig, finishNow.current);

    layoutParts(rig, e);
    if (rig.charmG) rig.charmG.rotation.z = -0.3 + Math.sin(clock * CHARM_SWING_HZ) * 0.1;

    // active-part highlight (pulse + glow)
    const parts = [rig.shellG, rig.cartridgeG, rig.capG, rig.charmG, rig.dialG];
    parts.forEach((g, i) => {
      if (!g) return;
      highlight.current[i] = damp(highlight.current[i], s.active === i ? 1 : 0, 8, dt);
      const h = highlight.current[i];
      g.scale.setScalar(1 + h * 0.07);
      g.traverse((o) => {
        const m = (o as THREE.Mesh).material as THREE.MeshPhysicalMaterial | undefined;
        if (m && "emissiveIntensity" in m) m.emissiveIntensity = h * 0.38;
      });
    });

    // whole-object motion
    const bob = idle ? Math.sin(clock * 1.1) * 0.08 : 0;
    const sway = idle ? Math.sin(clock * 0.6) * 0.14 : 0;
    const root = rig.root;
    // exploded layout spans y 1.5 → -2.5, so lift the group to centre it in frame
    root.position.y = damp(root.position.y, bob + lerp(0.12, 0.2, e), 6, dt);
    root.rotation.y = damp(root.rotation.y, s.spin + s.px * 0.9 + sway, 5, dt);
    root.rotation.x = damp(root.rotation.x, -s.py * 0.35, 5, dt);
    const neededW = lerp(2.1, 4.4, e);
    const neededH = lerp(3.3, 5.6, e);
    const fit = Math.min(1.05, (frame.viewport.width / neededW) * 0.92, (frame.viewport.height / neededH) * 0.92);
    root.scale.setScalar(damp(root.scale.x || 1, Math.max(0.5, fit), 6, dt));
  });

  return <LumiMeshes rootRef={rootRef} initial={initial} shared={shared} />;
}
