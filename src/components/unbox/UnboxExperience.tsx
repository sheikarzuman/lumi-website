"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useReducedMotion } from "motion/react";
import { ArrowLeft, Gift } from "lucide-react";
import { StatusTag } from "@/components/ui/StatusTag";
import { cn } from "@/lib/cn";
import { recordPull } from "@/lib/pullStore";
import { COLLECTION, RARITIES, RARITY_ORDER, oddsPerShell, type CollectionShell } from "@/lib/rarity";
import { rollShell } from "@/lib/roll";
import { pullDurationMs, revealDelayMs, type PullState } from "@/lib/unboxTimeline";
import { CollectionTracker } from "./CollectionTracker";
import { RarityBadge } from "./RarityBadge";
import { UnboxStage } from "./UnboxStage";

type Phase = "idle" | "rolling" | "revealed";

const formatPct = (n: number) => `${Number.isInteger(n) ? n : n.toFixed(1)}%`;

/** /unbox: pull a proposed blind box, watch it open in 3D, and track the shells you have found. */
export function UnboxExperience() {
  const reduced = useReducedMotion() ?? false;
  const [shell, setShell] = useState<CollectionShell>(COLLECTION[0]);
  const [phase, setPhase] = useState<Phase>("idle");
  const pull = useRef<PullState | null>(null);
  const timers = useRef<number[]>([]);

  useEffect(() => () => timers.current.forEach((id) => window.clearTimeout(id)), []);

  const onPull = () => {
    if (phase === "rolling") return;
    const next = rollShell();
    pull.current = { start: performance.now(), shell: next, reduced };
    setPhase("rolling");
    timers.current = [
      window.setTimeout(() => {
        setShell(next);
        recordPull(next.id);
      }, revealDelayMs(reduced)),
      window.setTimeout(() => setPhase("revealed"), pullDurationMs(reduced)),
    ];
  };

  const rarity = RARITIES[shell.rarity];
  const dark = shell.rarity === "secret" && phase === "revealed";

  return (
    <main className="min-h-screen bg-cream text-plum">
      <header className="flex items-center justify-between gap-4 px-6 py-5 md:px-12">
        <Link
          href="/#collection"
          className="inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-semibold hover:bg-plum/5 focus-visible:outline-2 focus-visible:outline-plum"
        >
          <ArrowLeft size={16} aria-hidden /> Back to LUMI
        </Link>
        <StatusTag kind="proposed" tone="plum" label="Concept · not on sale" />
      </header>

      <div className="mx-auto grid max-w-6xl gap-8 px-6 pb-16 md:grid-cols-[1.15fr_1fr] md:items-start md:px-12">
        <UnboxStage shell={shell} pull={pull} reduced={reduced} dark={dark} />

        <div className="flex flex-col gap-6">
          <div>
            <h1 className="font-display text-[clamp(2.2rem,5vw,3.6rem)] font-extrabold leading-[1.02] tracking-tight">
              Pull a blind box.
            </h1>
            <p className="mt-3 max-w-md text-plum/75">
              Every LUMI shell would ship sealed. Pull one to see which of the ten proposed colourways you get.
            </p>
          </div>

          <div className="rounded-[2rem] bg-white/70 p-6 shadow-soft" aria-live="polite" aria-atomic="true">
            {phase === "idle" ? (
              <p className="font-display text-xl font-bold">Ready when you are.</p>
            ) : phase === "rolling" ? (
              <p className="font-display text-xl font-bold">Opening…</p>
            ) : (
              <div className="flex flex-col gap-3">
                <RarityBadge rarity={shell.rarity} className="self-start" />
                <p className="font-display text-3xl font-extrabold tracking-tight" style={{ color: shell.deep }}>
                  You pulled {shell.name}
                </p>
                <p className="text-sm text-plum/70">
                  {rarity.label}
                  {shell.finish !== "matte" ? `, ${shell.finish} finish` : ""}. Proposed chance for this shell: about{" "}
                  {formatPct(oddsPerShell(shell.rarity))}.
                </p>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={onPull}
            disabled={phase === "rolling"}
            className={cn(
              "inline-flex items-center justify-center gap-3 rounded-full bg-plum px-8 py-5 font-display text-lg font-bold text-cream shadow-soft transition-transform",
              "hover:-translate-y-0.5 focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-sun disabled:translate-y-0 disabled:opacity-60",
            )}
          >
            <Gift size={22} aria-hidden />
            {phase === "idle" ? "Pull a blind box" : phase === "rolling" ? "Opening…" : "Pull another"}
          </button>

          <section aria-labelledby="odds-title" className="rounded-[2rem] border-2 border-plum/10 p-6">
            <h2 id="odds-title" className="font-display text-lg font-bold">
              Proposed odds
            </h2>
            <ul className="mt-3 space-y-2 text-sm">
              {RARITY_ORDER.map((id) => (
                <li key={id} className="flex items-center justify-between gap-3">
                  <span className="font-semibold">
                    <span aria-hidden className="text-berry">
                      {"★".repeat(RARITIES[id].stars)}{" "}
                    </span>
                    {RARITIES[id].label}
                  </span>
                  <span className="text-plum/70">
                    {RARITIES[id].oddsPct}% tier · {formatPct(oddsPerShell(id))} each
                  </span>
                </li>
              ))}
            </ul>
          </section>

          <CollectionTracker />

          <p className="text-sm font-semibold text-plum/70">
            Concept. Proposed odds. Nothing is on sale. Pulls are simulated in your browser and saved only on this device.
          </p>
        </div>
      </div>
    </main>
  );
}
