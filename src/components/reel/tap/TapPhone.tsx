"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import { useFrame } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import * as THREE from "three";
import { useTextTexture } from "@/components/three/useTextTexture";
import type { ReelFrame } from "../types";

const BODY = "#2A1836";
const SCREEN = "#CBB5EF";

/** Stylised phone: rounded slab, glowing screen with the LUMI mark. Pose comes from frame.extras. */
export function TapPhone({ frame }: { frame: RefObject<ReelFrame | null> }) {
  const groupRef = useRef<THREE.Group>(null);
  const screenRef = useRef<THREE.Mesh>(null);
  const logo = useTextTexture("LUMI");
  const [screenMat] = useState(
    () => new THREE.MeshStandardMaterial({ color: SCREEN, emissive: SCREEN, emissiveIntensity: 0.4, roughness: 0.25 }),
  );
  useEffect(() => () => screenMat.dispose(), [screenMat]);

  useFrame(() => {
    const g = groupRef.current;
    const e = frame.current?.extras;
    if (!g || !e) return;
    g.visible = (e.phoneVisible ?? 0) > 0 && (e.phoneScale ?? 0) > 0.01;
    if (!g.visible) return;
    g.position.set(e.phoneX, e.phoneY, e.phoneZ);
    g.rotation.set(0, e.phoneRotY, e.phoneRotZ);
    g.scale.setScalar(e.phoneScale);
    const m = screenRef.current?.material as THREE.MeshStandardMaterial | undefined;
    if (m) m.emissiveIntensity = e.screenGlow;
  });

  return (
    <group ref={groupRef} visible={false}>
      <RoundedBox args={[1.45, 2.9, 0.16]} radius={0.2} smoothness={5}>
        <meshPhysicalMaterial color={BODY} roughness={0.3} clearcoat={0.8} metalness={0.2} />
      </RoundedBox>
      <mesh ref={screenRef} position={[0, 0, 0.082]} material={screenMat}>
        <planeGeometry args={[1.3, 2.72]} />
      </mesh>
      <mesh position={[0, 0.5, 0.085]}>
        <planeGeometry args={[0.9, 0.35]} />
        <meshBasicMaterial map={logo} color="#3B2649" transparent depthWrite={false} toneMapped={false} />
      </mesh>
      <mesh position={[0, -0.25, 0.085]}>
        <ringGeometry args={[0.28, 0.36, 48]} />
        <meshBasicMaterial color="#FFF7ED" toneMapped={false} />
      </mesh>
      <mesh position={[0, 1.22, 0.086]}>
        <planeGeometry args={[0.36, 0.08]} />
        <meshBasicMaterial color={BODY} />
      </mesh>
    </group>
  );
}
