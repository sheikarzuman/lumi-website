"use client";

import type { ReactNode } from "react";
import { Environment, Lightformer } from "@react-three/drei";

interface StudioLightingProps {
  /** Extra lightformers rendered into the environment map (e.g. a moving light sweep) */
  children?: ReactNode;
  /** How many frames to re-render the environment map; Infinity when lightformers move */
  frames?: number;
  resolution?: number;
}

/** Self-contained lighting (no network HDRIs): soft cream key, blush + lavender fills. */
export function StudioLighting({ children, frames = 1, resolution = 256 }: StudioLightingProps) {
  return (
    <>
      <ambientLight intensity={0.55} />
      <directionalLight position={[3, 5, 4]} intensity={1.5} color="#fff1d0" />
      <Environment resolution={resolution} frames={frames}>
        <Lightformer form="rect" intensity={2.4} position={[0, 4, 3]} scale={[9, 3, 1]} color="#fff6e5" />
        <Lightformer form="rect" intensity={1.3} position={[-5, 1, 2]} scale={[3, 6, 1]} color="#F5B2C7" />
        <Lightformer form="rect" intensity={1.3} position={[5, 0, -1]} scale={[3, 6, 1]} color="#CBB5EF" />
        <Lightformer form="ring" intensity={1.6} position={[0, -1, 5]} scale={4} color="#FFE69A" />
        {children}
      </Environment>
    </>
  );
}
