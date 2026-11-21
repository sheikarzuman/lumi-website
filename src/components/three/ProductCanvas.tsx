"use client";

import { useRef, useSyncExternalStore, type ReactNode, type RefObject } from "react";
import dynamic from "next/dynamic";
import { useInViewport } from "@/hooks/useInViewport";
import type { Finish } from "@/components/product/ProductArt";
import type { ShellVariant } from "@/lib/lumi";
import type { SceneState } from "./LumiModel";

const ProductScene = dynamic(() => import("./ProductScene"), { ssr: false });

let webglSupport: boolean | undefined;
function detectWebGL() {
  if (webglSupport === undefined) {
    try {
      const canvas = document.createElement("canvas");
      webglSupport = Boolean(canvas.getContext("webgl2") || canvas.getContext("webgl"));
    } catch {
      webglSupport = false;
    }
  }
  return webglSupport;
}
const noopSubscribe = () => () => undefined;

/** true / false once known on the client, null during SSR and hydration. */
export function useWebGLSupport() {
  return useSyncExternalStore(noopSubscribe, detectWebGL, () => null);
}

interface ProductCanvasProps {
  variant: ShellVariant;
  /** Optional shell finish; matte when omitted */
  finish?: Finish;
  charmColor?: string;
  state: RefObject<SceneState>;
  className?: string;
  /** Rendered when WebGL is unavailable */
  fallback?: ReactNode;
  idle?: boolean;
}

/** Lazy-loads the R3F scene, pauses it when off-screen, and degrades gracefully without WebGL. */
export function ProductCanvas({ variant, finish, charmColor, state, className, fallback, idle = true }: ProductCanvasProps) {
  const ref = useRef<HTMLDivElement>(null);
  const visible = useInViewport(ref);
  const webgl = useWebGLSupport();

  return (
    <div ref={ref} className={className}>
      {webgl === false ? (
        fallback
      ) : webgl ? (
        <ProductScene variant={variant} finish={finish} charmColor={charmColor} state={state} visible={visible} idle={idle} />
      ) : null}
    </div>
  );
}
