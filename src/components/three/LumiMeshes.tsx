"use client";

import type { RefObject } from "react";
import { RoundedBox } from "@react-three/drei";
import * as THREE from "three";
import { IRIDESCENCE_RANGE } from "./finish";
import { useTextTexture } from "./useTextTexture";

const PETALS = 10;
const CHIP_ARC_RADII = [0.12, 0.2, 0.28] as const;
const CHIP_ARC = Math.PI / 2;
const GLOW_RINGS = 3;
const CREAM = "#FFF7ED";
const MINT = "#B9E4CD";
const BERRY = "#C2477A";
const TAU = Math.PI * 2;
const WHITE = new THREE.Color("#ffffff");

/** Node names LumiModel looks up once to build its animation rig. */
export const NODE = {
  shellG: "lumi-shell",
  cartridgeG: "lumi-cartridge",
  capG: "lumi-cap",
  charmG: "lumi-charm",
  dialG: "lumi-dial",
  glowG: "lumi-chip-glow",
  shellBody: "lumi-shell-body",
  loop: "lumi-loop",
  capBody: "lumi-cap-body",
  chipDot: "lumi-chip-dot",
  logo: "lumi-logo",
} as const;

/** Materials shared by several meshes so one colour write recolours every petal / accent. */
export interface LumiSharedMaterials {
  charm: THREE.MeshPhysicalMaterial;
  deep: THREE.MeshPhysicalMaterial;
  deepFlat: THREE.MeshBasicMaterial;
}

export interface LumiColours {
  shell: string;
  deep: string;
  charm: string;
}

/** Static geometry of the LUMI clip-on. Positions here are the assembled layout; LumiModel animates from there. */
export function LumiMeshes({
  rootRef,
  initial,
  shared,
}: {
  rootRef: RefObject<THREE.Group | null>;
  initial: LumiColours;
  shared: LumiSharedMaterials;
}) {
  const logo = useTextTexture("LUMI");
  const shellFinish = {
    iridescenceIOR: 2,
    iridescenceThicknessRange: IRIDESCENCE_RANGE,
  };

  return (
    <group ref={rootRef}>
      {/* ---------- cartridge (hidden inside shell until exploded) ---------- */}
      <group name={NODE.cartridgeG}>
        <RoundedBox args={[1.0, 1.5, 0.5]} radius={0.2} smoothness={5}>
          <meshPhysicalMaterial color={MINT} emissive={MINT} emissiveIntensity={0} roughness={0.35} clearcoat={0.5} />
        </RoundedBox>
        <RoundedBox args={[0.7, 0.72, 0.03]} radius={0.12} smoothness={4} position={[0, -0.15, 0.255]}>
          <meshPhysicalMaterial color="#E9F7EF" emissive="#E9F7EF" emissiveIntensity={0} roughness={0.5} />
        </RoundedBox>
        <RoundedBox args={[0.34, 0.22, 0.3]} radius={0.08} smoothness={4} position={[0, 0.84, 0]}>
          <meshPhysicalMaterial color={MINT} emissive={MINT} emissiveIntensity={0} roughness={0.35} />
        </RoundedBox>
      </group>

      {/* ---------- shell + loop + logo ---------- */}
      <group name={NODE.shellG}>
        <RoundedBox name={NODE.shellBody} args={[1.5, 2.0, 0.85]} radius={0.42} smoothness={7}>
          <meshPhysicalMaterial
            color={initial.shell}
            emissive={initial.shell}
            emissiveIntensity={0}
            roughness={0.36}
            clearcoat={0.6}
            clearcoatRoughness={0.3}
            sheen={0.5}
            sheenColor={WHITE}
            {...shellFinish}
          />
        </RoundedBox>
        <mesh name={NODE.loop} position={[0, 1.13, 0]}>
          <torusGeometry args={[0.2, 0.06, 20, 48]} />
          <meshPhysicalMaterial
            color={initial.shell}
            emissive={initial.shell}
            emissiveIntensity={0}
            roughness={0.35}
            clearcoat={0.5}
            {...shellFinish}
          />
        </mesh>
        <mesh name={NODE.logo} position={[0, 0.5, 0.4305]} renderOrder={2}>
          <planeGeometry args={[1.05, 0.41]} />
          <meshBasicMaterial map={logo} color={initial.deep} transparent depthWrite={false} toneMapped={false} />
        </mesh>
      </group>

      {/* ---------- RFID chip dial ---------- */}
      <group name={NODE.dialG}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.36, 0.36, 0.07, 48]} />
          <meshPhysicalMaterial color={CREAM} emissive={CREAM} emissiveIntensity={0} roughness={0.45} />
        </mesh>
        <mesh position={[0, 0, 0.01]} material={shared.deep}>
          <torusGeometry args={[0.36, 0.035, 12, 48]} />
        </mesh>
        {/* contactless arcs opening to the right */}
        {CHIP_ARC_RADII.map((r) => (
          <mesh key={r} position={[-0.12, 0, 0.045]} rotation={[0, 0, -CHIP_ARC / 2]} material={shared.deepFlat}>
            <torusGeometry args={[r, 0.022, 8, 24, CHIP_ARC]} />
          </mesh>
        ))}
        <mesh name={NODE.chipDot} position={[-0.12, 0, 0.05]}>
          <sphereGeometry args={[0.04, 16, 16]} />
          <meshPhysicalMaterial color={BERRY} emissive={BERRY} emissiveIntensity={0} />
        </mesh>
        <group name={NODE.glowG} visible={false} position={[0, 0, 0.06]}>
          {Array.from({ length: GLOW_RINGS }, (_, i) => (
            <mesh key={i}>
              <torusGeometry args={[0.4, 0.018, 8, 64]} />
              <meshBasicMaterial color={CREAM} transparent opacity={0} depthWrite={false} toneMapped={false} />
            </mesh>
          ))}
        </group>
      </group>

      {/* ---------- locking cap + nozzle ---------- */}
      <group name={NODE.capG} position={[0, -1.05, 0]}>
        <RoundedBox name={NODE.capBody} args={[0.9, 0.42, 0.62]} radius={0.14} smoothness={5}>
          <meshPhysicalMaterial
            color={initial.shell}
            emissive={initial.shell}
            emissiveIntensity={0}
            roughness={0.38}
            clearcoat={0.5}
            {...shellFinish}
          />
        </RoundedBox>
        <mesh position={[0, -0.24, 0]}>
          <cylinderGeometry args={[0.1, 0.13, 0.16, 24]} />
          <meshPhysicalMaterial color={CREAM} emissive={CREAM} emissiveIntensity={0} roughness={0.5} />
        </mesh>
      </group>

      {/* ---------- sun charm ---------- */}
      <group name={NODE.charmG} position={[0.95, -0.9, 0.3]}>
        <mesh rotation={[Math.PI / 2, 0, 0]} material={shared.charm}>
          <cylinderGeometry args={[0.21, 0.21, 0.12, 36]} />
        </mesh>
        {Array.from({ length: PETALS }, (_, i) => {
          const a = (i / PETALS) * TAU;
          return (
            <mesh
              key={i}
              position={[Math.sin(a) * 0.29, Math.cos(a) * 0.29, 0]}
              rotation={[0, 0, -a]}
              material={shared.charm}
            >
              <capsuleGeometry args={[0.07, 0.1, 6, 12]} />
            </mesh>
          );
        })}
        <mesh position={[0, 0, 0.065]}>
          <circleGeometry args={[0.11, 28]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.4} />
        </mesh>
        <mesh position={[0, 0.46, 0]} material={shared.deep}>
          <torusGeometry args={[0.07, 0.022, 10, 24]} />
        </mesh>
      </group>
    </group>
  );
}
