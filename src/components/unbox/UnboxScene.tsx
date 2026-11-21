"use client";

import { useRef, type RefObject } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { ContactShadows } from "@react-three/drei";
import * as THREE from "three";
import { BlindBox } from "@/components/three/BlindBox";
import { Burst, type BurstFrame } from "@/components/three/Burst";
import { LumiModel, type SceneState } from "@/components/three/LumiModel";
import { StudioLighting } from "@/components/three/StudioLighting";
import type { CollectionShell } from "@/lib/rarity";
import { IDLE_POSE, beatsFor, boxPose, type BoxPose, type PullState } from "@/lib/unboxTimeline";

interface UnboxSceneProps {
  shell: CollectionShell;
  state: RefObject<SceneState>;
  pull: RefObject<PullState | null>;
  reduced: boolean;
}

const BURST_COLOURS: Partial<Record<CollectionShell["rarity"], [string, string]>> = {
  epic: ["#8FE3D6", "#CBB5EF"],
  secret: ["#FFD35A", "#FFF1B8"],
};

function secondsSince(pull: PullState | null) {
  return pull ? (performance.now() - pull.start) / 1000 : -1;
}

function currentPose(pull: PullState | null): BoxPose {
  return pull ? boxPose(secondsSince(pull), pull.reduced) : IDLE_POSE;
}

function currentBurst(pull: PullState | null): BurstFrame | null {
  if (!pull || pull.reduced) return null;
  const colours = BURST_COLOURS[pull.shell.rarity];
  if (!colours) return null;
  return { t: secondsSince(pull) - beatsFor(false).reveal - 0.1, colorA: colours[0], colorB: colours[1] };
}

/** Scales the LUMI out and back in around the box opening. */
function ModelSlot({ pull, children }: { pull: RefObject<PullState | null>; children: React.ReactNode }) {
  const ref = useRef<THREE.Group>(null);
  useFrame(() => {
    const g = ref.current;
    if (!g) return;
    const s = currentPose(pull.current).modelScale;
    g.scale.setScalar(Math.max(s, 0.0001));
    g.visible = s > 0.01;
  });
  return <group ref={ref}>{children}</group>;
}

export default function UnboxScene({ shell, state, pull, reduced }: UnboxSceneProps) {
  return (
    <Canvas
      dpr={[1, 1.75]}
      camera={{ position: [0, 0.4, 10], fov: 32 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      onCreated={({ gl, camera }) => {
        gl.toneMapping = THREE.NeutralToneMapping;
        gl.toneMappingExposure = 1.05;
        camera.lookAt(0, 0, 0);
      }}
    >
      <StudioLighting />
      <ModelSlot pull={pull}>
        <LumiModel variant={shell} finish={shell.finish} state={state} idle={!reduced} />
      </ModelSlot>
      <BlindBox read={() => currentPose(pull.current)} />
      <Burst read={() => currentBurst(pull.current)} count={220} seed={17} spread={1.1} duration={2} size={70} position={[0, 0.3, 0.8]} />
      <ContactShadows position={[0, -1.75, 0]} opacity={0.3} scale={10} blur={2.6} far={4} resolution={512} color="#3B2649" />
    </Canvas>
  );
}
