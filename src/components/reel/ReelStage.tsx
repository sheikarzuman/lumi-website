"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { Canvas } from "@react-three/fiber";
import * as THREE from "three";
import { clamp } from "@/lib/tween";
import { ReelScene, type ReelDriver } from "./ReelScene";
import { REEL_HEIGHT, REEL_WIDTH, type ReelDefinition } from "./types";

/** Contract the Playwright renderer relies on. */
export interface ReelApi {
  ready: boolean;
  durationMs: number;
  /** Renders the frame at `ms` and resolves once it has been painted */
  seek: (ms: number) => Promise<void>;
  error?: string;
}

declare global {
  interface Window {
    __lumiReel?: ReelApi;
  }
}

const FONT_FACES = ["800 120px", "700 60px", "600 40px"] as const;
const WARMUP_FRAMES = 3;

const nextPaint = () =>
  new Promise<void>((resolve) => requestAnimationFrame(() => requestAnimationFrame(() => resolve())));

async function loadFonts() {
  const root = getComputedStyle(document.documentElement);
  const families = ["--font-poppins", "--font-dm-sans"].map((v) => root.getPropertyValue(v).trim()).filter(Boolean);
  await Promise.all(families.flatMap((family) => FONT_FACES.map((face) => document.fonts.load(`${face} ${family}`))));
  await document.fonts.ready;
}

/** 1080x1920 stage: CSS background, the R3F canvas, then the 2D overlay. Time only moves through `seek`. */
export function ReelStage({ reel }: { reel: ReelDefinition }) {
  const [ms, setMs] = useState(0);
  const driverRef = useRef<ReelDriver | null>(null);
  const driverWaiters = useRef<Array<() => void>>([]);

  const onDriver = useCallback((driver: ReelDriver | null) => {
    driverRef.current = driver;
    if (!driver) return;
    driverWaiters.current.forEach((resolve) => resolve());
    driverWaiters.current = [];
  }, []);

  useEffect(() => {
    let cancelled = false;
    const waitForDriver = () =>
      driverRef.current ? Promise.resolve() : new Promise<void>((resolve) => driverWaiters.current.push(resolve));

    const api: ReelApi = {
      ready: false,
      durationMs: reel.durationMs,
      seek: async (target) => {
        const t = clamp(Number.isFinite(target) ? target : 0, 0, reel.durationMs);
        flushSync(() => setMs(t));
        driverRef.current?.(t);
        await nextPaint();
      },
    };
    window.__lumiReel = api;

    (async () => {
      await loadFonts();
      await waitForDriver();
      // let canvas textures (logo) redraw with the web font, compile shaders, fill the environment map
      for (let i = 0; i < WARMUP_FRAMES; i++) {
        driverRef.current?.(0);
        await nextPaint();
      }
      if (!cancelled) api.ready = true;
    })().catch((err: unknown) => {
      api.error = err instanceof Error ? err.message : String(err);
    });

    return () => {
      cancelled = true;
      if (window.__lumiReel === api) delete window.__lumiReel;
    };
  }, [reel]);

  const dark = reel.frame(ms).dark;
  const { Overlay } = reel;

  return (
    <div
      className="relative overflow-hidden"
      style={{ width: REEL_WIDTH, height: REEL_HEIGHT }}
      data-reel={reel.id}
    >
      <div aria-hidden className="absolute inset-0" style={{ background: CREAM_STAGE }} />
      <div aria-hidden className="absolute inset-0" style={{ background: PLUM_STAGE, opacity: dark }} />
      <Canvas
        className="!absolute inset-0"
        frameloop="never"
        dpr={typeof window === "undefined" ? 1 : window.devicePixelRatio}
        camera={{ position: [0, 0, 14], fov: 30, near: 0.1, far: 100 }}
        gl={{ antialias: true, alpha: true, preserveDrawingBuffer: true }}
        onCreated={({ gl }) => {
          gl.toneMapping = THREE.NeutralToneMapping;
          gl.toneMappingExposure = 1.05;
        }}
      >
        <ReelScene reel={reel} onDriver={onDriver} />
      </Canvas>
      <div className="pointer-events-none absolute inset-0">
        <Overlay ms={ms} />
      </div>
    </div>
  );
}

const CREAM_STAGE = [
  "radial-gradient(48% 30% at 18% 22%, rgba(245,178,199,0.55), transparent 70%)",
  "radial-gradient(46% 28% at 86% 38%, rgba(203,181,239,0.5), transparent 70%)",
  "radial-gradient(60% 30% at 50% 88%, rgba(255,230,154,0.55), transparent 72%)",
  "linear-gradient(180deg, #FFF7ED 0%, #FDEFE6 100%)",
].join(", ");

const PLUM_STAGE = [
  "radial-gradient(55% 32% at 50% 52%, rgba(246,196,83,0.22), transparent 70%)",
  "radial-gradient(70% 40% at 50% 100%, rgba(122,85,196,0.35), transparent 70%)",
  "linear-gradient(180deg, #2A1836 0%, #3B2649 55%, #24142F 100%)",
].join(", ");
