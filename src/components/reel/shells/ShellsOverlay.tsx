"use client";

import type { CSSProperties, ReactNode } from "react";
import { COLLECTION, RARITIES, type RarityId } from "@/lib/rarity";
import { easeOutBack, easeOutCubic, progress, window01 } from "@/lib/tween";
import { SAFE_SIDE, SAFE_TOP } from "../types";
import { BEATS, SHELL_KEYS, isCollectionShell, shellAt, tierAt } from "./timeline";

const GRADIENTS = {
  rare: "linear-gradient(100deg, #F0556A, #5B8CFF)",
  epic: "linear-gradient(100deg, #8FE3D6, #CBB5EF 50%, #F5B2C7)",
  secret: "linear-gradient(100deg, #FFE69A, #F6C453 45%, #FFF1B8 70%, #E2A93B)",
} as const;

const TIER_WINDOWS: Record<RarityId, [number, number]> = {
  common: [BEATS.commons + 0.1, BEATS.rares],
  rare: [BEATS.rares, BEATS.epic],
  epic: [BEATS.epic, BEATS.secret],
  secret: [BEATS.reveal + 0.05, BEATS.end],
};

const TIER_COUNTS: Record<RarityId, number> = {
  common: COLLECTION.filter((s) => s.rarity === "common").length,
  rare: COLLECTION.filter((s) => s.rarity === "rare").length,
  epic: COLLECTION.filter((s) => s.rarity === "epic").length,
  secret: COLLECTION.filter((s) => s.rarity === "secret").length,
};

function gradientText(gradient: string): CSSProperties {
  return { backgroundImage: gradient, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" };
}

/** Rises and fades in from `at`; pure function of `t`. */
function rise(t: number, at: number, dur = 0.45, dist = 60): CSSProperties {
  const p = progress(t, at, at + dur);
  return { opacity: easeOutCubic(p), transform: `translateY(${(1 - easeOutBack(p, 1.6)) * dist}px)` };
}

function HookLine({ t, at, children }: { t: number; at: number; children: ReactNode }) {
  return (
    <p className="font-display text-[118px] font-extrabold leading-[1.02] tracking-[-0.03em]" style={rise(t, at)}>
      {children}
    </p>
  );
}

function Hook({ t }: { t: number }) {
  const out = 1 - easeOutCubic(progress(t, BEATS.hookEnd - 0.35, BEATS.hookEnd));
  if (out <= 0) return null;
  return (
    <div className="absolute text-plum" style={{ left: SAFE_SIDE, right: SAFE_SIDE, top: SAFE_TOP + 40, opacity: out }}>
      <HookLine t={t} at={0.15}>6 pastel shells.</HookLine>
      <HookLine t={t} at={0.65}>
        2 <span style={gradientText(GRADIENTS.rare)}>rare.</span>
      </HookLine>
      <HookLine t={t} at={1.05}>
        1 <span style={gradientText(GRADIENTS.epic)}>epic.</span>
      </HookLine>
      <HookLine t={t} at={1.45}>
        1 <span style={gradientText(GRADIENTS.secret)}>secret.</span>
      </HookLine>
    </div>
  );
}

function TierBlock({ t, tier }: { t: number; tier: RarityId }) {
  const [start, end] = TIER_WINDOWS[tier];
  const o = window01(t, start, start + 0.35, end - 0.3, end);
  if (o <= 0) return null;
  const r = RARITIES[tier];
  const onDark = tier === "secret";
  const pct = tier === "common" ? null : (GRADIENTS as Record<string, string>)[tier];
  return (
    <div className="absolute" style={{ left: SAFE_SIDE, top: SAFE_TOP + 30, opacity: o }}>
      <div style={rise(t, start, 0.5, 40)}>
        <span
          className="inline-flex items-center gap-3 rounded-full px-6 py-2.5 font-display text-[34px] font-bold uppercase tracking-[0.14em]"
          style={{ background: onDark ? "#FFE69A" : "#3B2649", color: onDark ? "#3B2649" : "#FFF7ED" }}
        >
          <span style={{ color: onDark ? "#3B2649" : "#FFE69A" }}>{"★".repeat(r.stars)}</span>
          {r.label}
          <span className="opacity-70">· {TIER_COUNTS[tier]}</span>
        </span>
      </div>
      <p
        className="mt-4 font-display text-[200px] font-extrabold leading-[0.95] tracking-[-0.04em]"
        style={{ ...rise(t, start + 0.08, 0.55, 80), ...(pct ? gradientText(pct) : { color: "#3B2649" }) }}
      >
        {r.oddsPct}%
      </p>
      <p
        className="mt-2 font-display text-[38px] font-semibold"
        style={{ ...rise(t, start + 0.16, 0.5, 40), color: onDark ? "rgba(255,247,237,0.85)" : "rgba(59,38,73,0.75)" }}
      >
        proposed drop rate
      </p>
    </div>
  );
}

function Teaser({ t }: { t: number }) {
  const o = window01(t, BEATS.silhouette + 0.1, BEATS.silhouette + 0.4, BEATS.reveal - 0.25, BEATS.reveal);
  if (o <= 0) return null;
  return (
    <p
      className="absolute font-display text-[96px] font-extrabold leading-[1.02] tracking-[-0.03em] text-cream"
      style={{ left: SAFE_SIDE, top: SAFE_TOP + 40, ...rise(t, BEATS.silhouette + 0.1, 0.5, 50), opacity: o }}
    >
      And one
      <br />
      <span style={gradientText(GRADIENTS.secret)}>secret…</span>
    </p>
  );
}

function NameBlock({ t }: { t: number }) {
  const { key, index } = shellAt(t);
  const shell = key.shell;
  if (!isCollectionShell(shell) || t < BEATS.commons) return null;
  const next = SHELL_KEYS[index + 1];
  const out = next ? 1 - progress(t, next.at - 0.18, next.at) : 1 - progress(t, BEATS.end - 0.3, BEATS.end);
  const number = COLLECTION.findIndex((s) => s.id === shell.id) + 1;
  const onDark = shell.rarity === "secret";
  const finishLabel = shell.finish === "foil" ? "Foil finish" : shell.finish === "gold" ? "Gold finish" : "Matte";
  return (
    <div className="absolute" style={{ left: SAFE_SIDE, bottom: 400, opacity: Math.min(out, 1) }}>
      <p
        className="font-display text-[30px] font-bold uppercase tracking-[0.2em]"
        style={{ ...rise(t, key.at, 0.35, 20), color: onDark ? "#FFE69A" : "rgba(59,38,73,0.6)" }}
      >
        No. {String(number).padStart(2, "0")} · {finishLabel}
      </p>
      <p
        className="font-display text-[104px] font-extrabold leading-[1.05] tracking-[-0.03em]"
        style={{ ...rise(t, key.at + 0.05, 0.4, 40), ...(onDark ? gradientText(GRADIENTS.secret) : { color: shell.deep }) }}
      >
        {shell.name}
      </p>
    </div>
  );
}

function LightSweep({ t }: { t: number }) {
  const p = progress(t, BEATS.sweepStart, BEATS.sweepEnd);
  if (p <= 0 || p >= 1) return null;
  return (
    <div
      aria-hidden
      className="absolute inset-0"
      style={{
        background: `linear-gradient(115deg, transparent ${p * 140 - 40}%, rgba(255,205,110,0.2) ${p * 140 - 25}%, transparent ${p * 140 - 10}%)`,
        mixBlendMode: "screen",
      }}
    />
  );
}

function EndCard({ t }: { t: number }) {
  const o = easeOutCubic(progress(t, BEATS.end, BEATS.end + 0.5));
  if (o <= 0) return null;
  return (
    <>
      <p
        className="absolute text-center font-display text-[104px] font-extrabold leading-[1.04] tracking-[-0.03em] text-cream"
        style={{ left: SAFE_SIDE, right: SAFE_SIDE, top: SAFE_TOP + 40, opacity: o, ...rise(t, BEATS.end, 0.6, 70) }}
      >
        Which one are
        <br />
        you <span style={gradientText(GRADIENTS.secret)}>hoping for?</span>
      </p>
      <div className="absolute flex justify-center gap-[18px]" style={{ left: SAFE_SIDE, right: SAFE_SIDE, bottom: 520 }}>
        {COLLECTION.map((s, i) => (
          <span
            key={s.id}
            className="block h-[58px] w-[58px] rounded-full"
            style={{
              background: s.finish === "foil" ? GRADIENTS.epic : s.finish === "gold" ? GRADIENTS.secret : s.shell,
              boxShadow: s.rarity === "common" ? "inset 0 0 0 3px rgba(255,255,255,0.35)" : "0 0 0 4px #FFF7ED",
              ...rise(t, BEATS.end + 0.35 + i * 0.05, 0.4, 30),
            }}
          />
        ))}
      </div>
      <p
        className="absolute text-center font-sans text-[36px] font-semibold text-cream/85"
        style={{ left: SAFE_SIDE, right: SAFE_SIDE, bottom: 420, ...rise(t, BEATS.end + 0.7, 0.5, 20) }}
      >
        Proposed drop rates. Concept, not on sale.
      </p>
    </>
  );
}

function Wordmark({ t }: { t: number }) {
  const dark = t >= BEATS.darkIn;
  return (
    <p
      className="absolute font-display text-[44px] font-extrabold tracking-[-0.02em]"
      style={{ right: SAFE_SIDE, top: SAFE_TOP + 36, color: dark ? "#FFE69A" : "#3B2649", opacity: t >= BEATS.end || t < BEATS.hookEnd ? 0 : 1 }}
    >
      LUMI
    </p>
  );
}

/** All 2D type for the "shells" reel, derived from `ms` alone. */
export function ShellsOverlay({ ms }: { ms: number }) {
  const t = ms / 1000;
  const tier = tierAt(t);
  return (
    <>
      <LightSweep t={t} />
      <Wordmark t={t} />
      <Hook t={t} />
      <TierBlock t={t} tier={tier} />
      <Teaser t={t} />
      <NameBlock t={t} />
      <EndCard t={t} />
    </>
  );
}
