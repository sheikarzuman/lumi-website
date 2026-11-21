"use client";

import type { RefObject } from "react";
import { Canvas } from "@react-three/fiber";
import { ContactShadows } from "@react-three/drei";
import * as THREE from "three";
import type { Finish } from "@/components/product/ProductArt";
import type { ShellVariant } from "@/lib/lumi";
import { LumiModel, type SceneState } from "./LumiModel";
import { StudioLighting } from "./StudioLighting";

interface ProductSceneProps {
  variant: ShellVariant;
  finish?: Finish;
  charmColor?: string;
  state: RefObject<SceneState>;
  /** Frame loop only runs while the canvas is on screen */
  visible: boolean;
  idle?: boolean;
}

export default function ProductScene({ variant, finish, charmColor, state, visible, idle }: ProductSceneProps) {
  return (
    <Canvas
      dpr={[1, 1.75]}
      frameloop={visible ? "always" : "never"}
      camera={{ position: [0, 0, 9], fov: 32 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.NeutralToneMapping;
        gl.toneMappingExposure = 1.05;
      }}
    >
      <StudioLighting />
      <LumiModel variant={variant} finish={finish} charmColor={charmColor} state={state} idle={idle} />
      <ContactShadows position={[0, -2.9, 0]} opacity={0.28} scale={11} blur={2.8} far={4.5} resolution={512} color="#3B2649" />
    </Canvas>
  );
}
