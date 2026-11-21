"use client";

import { useEffect, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import * as THREE from "three";
import type { BoxPose } from "@/lib/unboxTimeline";
import { useTextTexture } from "./useTextTexture";

const W = 2.7;
const H = 3.3;
const T = 0.09;
const WALL_FOLD = 1.75;
const BOX_SCALE = 0.82;
const PLUM = "#3B2649";
const SUN = "#FFE69A";

interface WallSpec {
  key: string;
  /** hinge position on the base */
  hinge: [number, number, number];
  /** yaw so every wall's local +z faces outward */
  yaw: number;
}

const WALLS: WallSpec[] = [
  { key: "front", hinge: [0, 0, W / 2], yaw: 0 },
  { key: "back", hinge: [0, 0, -W / 2], yaw: Math.PI },
  { key: "left", hinge: [-W / 2, 0, 0], yaw: -Math.PI / 2 },
  { key: "right", hinge: [W / 2, 0, 0], yaw: Math.PI / 2 },
];

/** Blind box that drops in, wobbles, then folds open. Driven entirely by `read()` each frame. */
export function BlindBox({ read }: { read: () => BoxPose }) {
  const rootRef = useRef<THREE.Group>(null);
  const lidRef = useRef<THREE.Group>(null);
  const wallRefs = useRef<(THREE.Group | null)[]>([]);
  const mark = useTextTexture("?", { width: 256, height: 256, size: 200, offsetY: 10 });
  const [wallMat] = useState(
    () => new THREE.MeshPhysicalMaterial({ color: PLUM, roughness: 0.6, clearcoat: 0.15, clearcoatRoughness: 0.5, transparent: true }),
  );
  const [lidMat] = useState(() => new THREE.MeshPhysicalMaterial({ color: SUN, roughness: 0.4, clearcoat: 0.5, transparent: true }));
  const [markMat] = useState(
    () => new THREE.MeshBasicMaterial({ color: SUN, map: mark, transparent: true, depthWrite: false, toneMapped: false }),
  );

  useEffect(
    () => () => {
      wallMat.dispose();
      lidMat.dispose();
      markMat.dispose();
    },
    [wallMat, lidMat, markMat],
  );

  // three.js materials are mutated per frame; going through a ref keeps that out of React's render data
  const fadeMats = useRef<THREE.Material[]>([]);
  useEffect(() => {
    fadeMats.current = [wallMat, lidMat, markMat];
  }, [wallMat, lidMat, markMat]);

  useFrame(() => {
    const root = rootRef.current;
    if (!root) return;
    const p = read();
    root.visible = p.visible;
    if (!p.visible) return;
    root.position.y = p.y - (H / 2) * BOX_SCALE;
    root.rotation.z = p.shake;
    root.rotation.y = p.shake * 1.6;
    wallRefs.current.forEach((g) => {
      if (g) g.rotation.x = p.walls * WALL_FOLD;
    });
    const lid = lidRef.current;
    if (lid) {
      lid.position.set(0, H + p.lid * 3.2, -p.lid * 0.8);
      lid.rotation.set(-p.lid * 1.3, p.lid * 0.6, 0);
    }
    fadeMats.current.forEach((m, i) => {
      m.opacity = p.opacity;
      // the "?" decal never writes depth; walls and lid stop once they start fading
      m.depthWrite = i < 2 && p.opacity > 0.98;
    });
  });

  return (
    <group ref={rootRef} visible={false} scale={BOX_SCALE}>
      <RoundedBox args={[W, T, W]} radius={0.04} smoothness={3} material={wallMat} />
      {WALLS.map((w, i) => (
        <group key={w.key} position={w.hinge} rotation={[0, w.yaw, 0]}>
          <group
            ref={(g) => {
              wallRefs.current[i] = g;
            }}
          >
            <RoundedBox args={[W, H, T]} radius={0.04} smoothness={3} position={[0, H / 2, 0]} material={wallMat} />
            <mesh position={[0, H / 2, T / 2 + 0.005]} material={markMat}>
              <planeGeometry args={[1.5, 1.5]} />
            </mesh>
          </group>
        </group>
      ))}
      <group ref={lidRef} position={[0, H, 0]}>
        <RoundedBox args={[W + 0.14, 0.22, W + 0.14]} radius={0.06} smoothness={3} material={lidMat} />
      </group>
    </group>
  );
}
