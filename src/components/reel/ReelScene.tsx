"use client";

import { useEffect, useRef } from "react";
import { useThree } from "@react-three/fiber";
import { ContactShadows, Lightformer } from "@react-three/drei";
import * as THREE from "three";
import { Burst } from "@/components/three/Burst";
import { INITIAL_SCENE_STATE, LumiModel, type ModelPose, type SceneState } from "@/components/three/LumiModel";
import { StudioLighting } from "@/components/three/StudioLighting";
import { COLLECTION } from "@/lib/rarity";
import type { ReelCamera, ReelDefinition, ReelFrame } from "./types";

const SWEEP_RANGE = 11;

/** Renders exactly one frame of the reel at `ms`. Registered with the stage once the scene mounts. */
export type ReelDriver = (ms: number) => void;

interface ReelSceneProps {
  reel: ReelDefinition;
  onDriver: (driver: ReelDriver | null) => void;
}

function placeCamera(camera: THREE.PerspectiveCamera, c: ReelCamera) {
  const cosEl = Math.cos(c.el);
  camera.position.set(
    c.tx + Math.sin(c.az) * cosEl * c.dist,
    c.ty + Math.sin(c.el) * c.dist,
    Math.cos(c.az) * cosEl * c.dist,
  );
  camera.lookAt(c.tx, c.ty, 0);
  if (camera.fov !== c.fov) {
    camera.fov = c.fov;
    camera.updateProjectionMatrix();
  }
}

/** The 3D half of a reel. Nothing here reads the clock: every value comes from `reel.frame(ms)`. */
export function ReelScene({ reel, onDriver }: ReelSceneProps) {
  const advance = useThree((s) => s.advance);
  const getThree = useThree((s) => s.get);
  const frameRef = useRef<ReelFrame | null>(null);
  const poseRef = useRef<ModelPose | null>(null);
  const sweepRef = useRef<THREE.Mesh>(null);
  const stateRef = useRef<SceneState>({ ...INITIAL_SCENE_STATE });

  useEffect(() => {
    const driver: ReelDriver = (ms) => {
      const f = reel.frame(ms);
      frameRef.current = f;
      poseRef.current = f.pose;
      placeCamera(getThree().camera as THREE.PerspectiveCamera, f.camera);
      const sweep = sweepRef.current;
      if (sweep) {
        sweep.visible = f.sweep !== null;
        sweep.position.x = f.sweep === null ? 0 : -SWEEP_RANGE + f.sweep * SWEEP_RANGE * 2;
      }
      advance(ms / 1000);
    };
    onDriver(driver);
    return () => onDriver(null);
  }, [reel, getThree, advance, onDriver]);

  const Extras = reel.Extras;
  return (
    <>
      <StudioLighting frames={Infinity}>
        <Lightformer ref={sweepRef} form="rect" intensity={9} position={[0, 1, 4]} rotation={[0, 0, 0.5]} scale={[1.4, 12, 1]} color="#FFF4D6" visible={false} />
      </StudioLighting>
      <LumiModel variant={COLLECTION[0]} state={stateRef} idle={false} pose={poseRef} />
      {reel.burstSlots.map((slot, i) => (
        <Burst
          key={slot.seed}
          read={() => frameRef.current?.bursts[i] ?? null}
          seed={slot.seed}
          count={slot.count}
          spread={slot.spread}
          duration={slot.duration}
          size={slot.size}
          additive={slot.additive}
          position={slot.position}
        />
      ))}
      {Extras ? <Extras frame={frameRef} /> : null}
      <ContactShadows position={[0, -2.25, 0]} opacity={0.24} scale={10} blur={2.6} far={4} resolution={512} color="#3B2649" />
    </>
  );
}
