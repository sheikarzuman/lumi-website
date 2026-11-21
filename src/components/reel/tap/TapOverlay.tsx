"use client";

import type { CSSProperties, ReactNode } from "react";
import { easeInCubic, easeOutBack, easeOutCubic, mix, progress, window01 } from "@/lib/tween";
import { SAFE_SIDE, SAFE_TOP } from "../types";
import { TAP_BEATS } from "./timeline";

const REMINDER_SECONDS = 2 * 60 * 60;
const RING_R = 160;
const RING_C = 2 * Math.PI * RING_R;
const YOU = { backgroundImage: "linear-gradient(100deg, #C2477A, #F5B2C7)", WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" } as const;

function rise(t: number, at: number, dur = 0.45, dist = 60): CSSProperties {
  const p = progress(t, at, at + dur);
  return { opacity: easeOutCubic(p), transform: `translateY(${(1 - easeOutBack(p, 1.6)) * dist}px)` };
}

const formatClock = (s: number) => {
  const total = Math.max(0, Math.round(s));
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  return `${h}:${String(m).padStart(2, "0")}:${String(total % 60).padStart(2, "0")}`;
};

function Big({ t, at, children }: { t: number; at: number; children: ReactNode }) {
  return (
    <p className="font-display text-[118px] font-extrabold leading-[1.02] tracking-[-0.03em]" style={rise(t, at)}>
      {children}
    </p>
  );
}

function Hook({ t }: { t: number }) {
  const o = 1 - easeOutCubic(progress(t, TAP_BEATS.hookEnd - 0.35, TAP_BEATS.hookEnd));
  if (o <= 0) return null;
  return (
    <div className="absolute text-plum" style={{ left: SAFE_SIDE, right: SAFE_SIDE, top: SAFE_TOP + 40, opacity: o }}>
      <Big t={t} at={0.15}>Your sunscreen</Big>
      <Big t={t} at={0.55}>should remind</Big>
      <Big t={t} at={1.0}>
        <span style={YOU}>YOU.</span>
      </Big>
    </div>
  );
}

function TapCaption({ t }: { t: number }) {
  const o = window01(t, TAP_BEATS.phoneIn + 0.2, TAP_BEATS.phoneIn + 0.5, TAP_BEATS.cardIn - 0.3, TAP_BEATS.cardIn);
  if (o <= 0) return null;
  return (
    <div className="absolute" style={{ left: SAFE_SIDE, top: SAFE_TOP + 20, opacity: o }}>
      <p className="font-display text-[34px] font-bold uppercase tracking-[0.2em] text-plum/60">Step 1</p>
      <p className="font-display text-[104px] font-extrabold leading-[1.02] tracking-[-0.03em] text-plum">
        Tap the chip.
      </p>
    </div>
  );
}

function AppCard({ t }: { t: number }) {
  const inP = progress(t, TAP_BEATS.cardIn, TAP_BEATS.cardIn + 0.6);
  const outP = easeInCubic(progress(t, TAP_BEATS.cardOut, TAP_BEATS.end));
  if (inP <= 0 || outP >= 1) return null;
  const y = (1 - easeOutBack(inP, 1.2)) * 900 + outP * 1200;
  const ring = 1 - easeOutCubic(progress(t, TAP_BEATS.ringStart, TAP_BEATS.ringEnd));
  const due = t >= TAP_BEATS.ringEnd;
  const ffwd = window01(t, TAP_BEATS.ringStart, TAP_BEATS.ringStart + 0.2, TAP_BEATS.ringEnd, TAP_BEATS.ringEnd + 0.2);
  return (
    <div
      className="absolute flex flex-col items-center rounded-[72px] bg-plum px-12 py-14 text-cream shadow-[0_60px_120px_-30px_rgba(59,38,73,0.6)]"
      style={{ left: 170, right: 170, top: 470, height: 1040, transform: `translateY(${y}px)` }}
    >
      <p className="font-display text-[44px] font-extrabold tracking-[-0.02em] text-sun">LUMI</p>
      <p className="mt-2 text-[28px] font-semibold text-cream/70">Blush shell · tapped just now</p>
      <div className="relative mt-12 grid h-[380px] w-[380px] place-items-center">
        <svg viewBox="0 0 380 380" className="absolute inset-0 -rotate-90">
          <circle cx="190" cy="190" r={RING_R} fill="none" stroke="rgba(255,247,237,0.12)" strokeWidth="26" />
          <circle
            cx="190"
            cy="190"
            r={RING_R}
            fill="none"
            stroke={due ? "#F5B2C7" : "#FFE69A"}
            strokeWidth="26"
            strokeLinecap="round"
            strokeDasharray={RING_C}
            strokeDashoffset={RING_C * (1 - mix(0.0001, 1, ring))}
          />
        </svg>
        <div className="text-center">
          <p className="font-display text-[68px] font-extrabold tabular-nums">{formatClock(REMINDER_SECONDS * ring)}</p>
          <p className="text-[26px] font-semibold text-cream/70">{due ? "time to reapply" : "until reapply reminder"}</p>
        </div>
      </div>
      <p className="mt-6 rounded-full bg-cream/10 px-6 py-2 text-[24px] font-semibold text-cream/80" style={{ opacity: ffwd }}>
        Sped up for the video
      </p>
      <span className="mt-auto rounded-full bg-sun px-12 py-5 font-display text-[34px] font-bold text-plum">I just applied</span>
    </div>
  );
}

function Notification({ t }: { t: number }) {
  const o = window01(t, TAP_BEATS.notify, TAP_BEATS.notify + 0.35, TAP_BEATS.cardOut - 0.2, TAP_BEATS.cardOut + 0.1);
  if (o <= 0) return null;
  const drop = (1 - easeOutBack(progress(t, TAP_BEATS.notify, TAP_BEATS.notify + 0.5), 1.4)) * -120;
  return (
    <div
      className="absolute flex items-center gap-6 rounded-[44px] bg-white/95 px-8 py-6 text-plum shadow-[0_30px_70px_-20px_rgba(59,38,73,0.45)]"
      style={{ left: SAFE_SIDE, right: SAFE_SIDE, top: SAFE_TOP + 20, opacity: o, transform: `translateY(${drop}px)` }}
    >
      <span className="grid h-[88px] w-[88px] shrink-0 place-items-center rounded-[26px] bg-blush font-display text-[30px] font-extrabold text-plum">
        LUMI
      </span>
      <div>
        <p className="text-[26px] font-semibold text-plum/60">LUMI · now</p>
        <p className="font-display text-[36px] font-bold leading-tight">Time to reapply.</p>
        <p className="text-[28px] text-plum/75">Tap your shell to restart the timer.</p>
      </div>
    </div>
  );
}

function EndCard({ t }: { t: number }) {
  if (t < TAP_BEATS.end) return null;
  return (
    <>
      <div className="absolute text-center text-plum" style={{ left: SAFE_SIDE, right: SAFE_SIDE, top: SAFE_TOP + 40 }}>
        <Big t={t} at={TAP_BEATS.end + 0.1}>Tap.</Big>
        <Big t={t} at={TAP_BEATS.end + 0.5}>Timer.</Big>
        <Big t={t} at={TAP_BEATS.end + 0.9}>
          <span style={YOU}>Done.</span>
        </Big>
      </div>
      <p
        className="absolute text-center font-sans text-[36px] font-semibold text-plum/80"
        style={{ left: SAFE_SIDE, right: SAFE_SIDE, bottom: 420, ...rise(t, TAP_BEATS.end + 1.3, 0.5, 20) }}
      >
        Concept prototype. Passive chip, no battery.
      </p>
    </>
  );
}

/** All 2D type and UI for the "tap" reel, derived from `ms` alone. */
export function TapOverlay({ ms }: { ms: number }) {
  const t = ms / 1000;
  return (
    <>
      <Hook t={t} />
      <TapCaption t={t} />
      <AppCard t={t} />
      <Notification t={t} />
      <EndCard t={t} />
    </>
  );
}
