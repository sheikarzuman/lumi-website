import type * as THREE from "three";
import type { Finish } from "@/components/product/ProductArt";

/** Physical material settings that differ between the three shell finishes. */
export interface FinishParams {
  roughness: number;
  metalness: number;
  clearcoat: number;
  clearcoatRoughness: number;
  sheen: number;
  iridescence: number;
  envMapIntensity: number;
}

/** How much of the foil and gold looks are blended in (0 and 0 = matte). */
export interface FinishWeights {
  foil: number;
  gold: number;
}

const FINISH_PARAMS: Record<Finish, FinishParams> = {
  matte: {
    roughness: 0.36,
    metalness: 0,
    clearcoat: 0.6,
    clearcoatRoughness: 0.3,
    sheen: 0.5,
    iridescence: 0,
    envMapIntensity: 1,
  },
  // iridescent film over a glossy clearcoat: shifts hue as the shell turns
  foil: {
    roughness: 0.12,
    metalness: 0.5,
    clearcoat: 1,
    clearcoatRoughness: 0.05,
    sheen: 0.2,
    iridescence: 1,
    envMapIntensity: 1.6,
  },
  // polished metallic gold
  gold: {
    roughness: 0.2,
    metalness: 1,
    clearcoat: 0.7,
    clearcoatRoughness: 0.08,
    sheen: 0,
    iridescence: 0,
    envMapIntensity: 1.7,
  },
};

/** Thin-film thickness range in nanometres; spans enough of the spectrum to read as rainbow foil. */
export const IRIDESCENCE_RANGE: [number, number] = [220, 860];
/** Below this the iridescence shader branch is switched off entirely, so matte shells pay nothing for it. */
const IRIDESCENCE_EPSILON = 0.01;

export function finishWeights(finish: Finish = "matte"): FinishWeights {
  return { foil: finish === "foil" ? 1 : 0, gold: finish === "gold" ? 1 : 0 };
}

export function lerpWeights(a: FinishWeights, b: FinishWeights, t: number): FinishWeights {
  return { foil: a.foil + (b.foil - a.foil) * t, gold: a.gold + (b.gold - a.gold) * t };
}

/** Matte base plus weighted offsets toward foil and gold. */
export function blendFinish(w: FinishWeights): FinishParams {
  const base = FINISH_PARAMS.matte;
  const pick = (key: keyof FinishParams) =>
    base[key] + (FINISH_PARAMS.foil[key] - base[key]) * w.foil + (FINISH_PARAMS.gold[key] - base[key]) * w.gold;
  return {
    roughness: pick("roughness"),
    metalness: pick("metalness"),
    clearcoat: pick("clearcoat"),
    clearcoatRoughness: pick("clearcoatRoughness"),
    sheen: pick("sheen"),
    iridescence: pick("iridescence"),
    envMapIntensity: pick("envMapIntensity"),
  };
}

/** Writes finish params onto a material (three.js materials are mutable GPU-backed objects by design). */
export function applyFinish(mat: THREE.MeshPhysicalMaterial | null | undefined, p: FinishParams) {
  if (!mat) return;
  mat.roughness = p.roughness;
  mat.metalness = p.metalness;
  mat.clearcoat = p.clearcoat;
  mat.clearcoatRoughness = p.clearcoatRoughness;
  mat.sheen = p.sheen;
  mat.iridescence = p.iridescence < IRIDESCENCE_EPSILON ? 0 : p.iridescence;
  mat.envMapIntensity = p.envMapIntensity;
}
