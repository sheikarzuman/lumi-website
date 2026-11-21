"use client";

import { useRef, type KeyboardEvent, type PointerEvent, type RefObject } from "react";
import dynamic from "next/dynamic";
import { ProductArt } from "@/components/product/ProductArt";
import { INITIAL_SCENE_STATE, type SceneState } from "@/components/three/LumiModel";
import { useWebGLSupport } from "@/components/three/ProductCanvas";
import { cn } from "@/lib/cn";
import type { CollectionShell } from "@/lib/rarity";
import { clamp } from "@/lib/tween";
import type { PullState } from "@/lib/unboxTimeline";

const UnboxScene = dynamic(() => import("./UnboxScene"), { ssr: false });

const DRAG_YAW = 0.012;
const DRAG_TILT = 0.004;
const KEY_YAW = 0.4;
const KEY_TILT = 0.15;
const MAX_TILT = 0.8;

interface UnboxStageProps {
  shell: CollectionShell;
  pull: RefObject<PullState | null>;
  reduced: boolean;
  dark: boolean;
}

/** The 3D stage: drag (mouse or touch) or arrow keys to turn the LUMI. Falls back to the 2D art without WebGL. */
export function UnboxStage({ shell, pull, reduced, dark }: UnboxStageProps) {
  const webgl = useWebGLSupport();
  const state = useRef<SceneState>({ ...INITIAL_SCENE_STATE });
  const drag = useRef<{ id: number; x: number; y: number } | null>(null);

  const turn = (yaw: number, tilt: number) => {
    const s = state.current;
    s.spin += yaw;
    s.py = clamp(s.py + tilt, -MAX_TILT, MAX_TILT);
  };

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    drag.current = { id: e.pointerId, x: e.clientX, y: e.clientY };
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    if (!d || d.id !== e.pointerId) return;
    turn((e.clientX - d.x) * DRAG_YAW, (e.clientY - d.y) * DRAG_TILT);
    drag.current = { id: d.id, x: e.clientX, y: e.clientY };
  };
  const endDrag = (e: PointerEvent<HTMLDivElement>) => {
    if (drag.current?.id === e.pointerId) drag.current = null;
  };
  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const moves: Record<string, [number, number]> = {
      ArrowLeft: [-KEY_YAW, 0],
      ArrowRight: [KEY_YAW, 0],
      ArrowUp: [0, -KEY_TILT],
      ArrowDown: [0, KEY_TILT],
    };
    const move = moves[e.key];
    if (!move) return;
    e.preventDefault();
    turn(move[0], move[1]);
  };

  return (
    <div
      role="group"
      tabIndex={0}
      aria-roledescription="3D viewer"
      aria-label={`${shell.name} LUMI shell, concept visual. Drag, or use the arrow keys, to turn it.`}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      onKeyDown={onKeyDown}
      className={cn(
        "relative aspect-[4/5] w-full cursor-grab touch-pan-y select-none overflow-hidden rounded-[2.5rem] outline-none transition-colors duration-700 focus-visible:ring-4 focus-visible:ring-plum/40 active:cursor-grabbing md:aspect-auto md:h-[min(78svh,720px)]",
        dark ? "bg-plum" : "bg-aurora",
      )}
    >
      {webgl === false ? (
        <div className="grid h-full place-items-center p-12">
          <span className="block w-1/2 max-w-[260px]">
            <ProductArt shell={shell.shell} deep={shell.deep} charm={shell.charm} finish={shell.finish} title={`${shell.name} LUMI shell (concept visual)`} />
          </span>
        </div>
      ) : webgl ? (
        <UnboxScene shell={shell} state={state} pull={pull} reduced={reduced} />
      ) : null}
      <p
        aria-hidden
        className={cn(
          "pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full px-4 py-1.5 text-xs font-semibold",
          dark ? "bg-cream/15 text-cream" : "bg-white/60 text-plum/70",
        )}
      >
        Drag to turn
      </p>
    </div>
  );
}
