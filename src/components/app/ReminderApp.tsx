"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Bell, BellOff, RotateCcw, ShieldCheck, Sun } from "lucide-react";
import { ConditionsPanel } from "@/components/app/ConditionsPanel";
import { ProductArt } from "@/components/product/ProductArt";
import { StatusTag } from "@/components/ui/StatusTag";
import { cn } from "@/lib/cn";
import { RARITIES, findShell } from "@/lib/rarity";
import { adviseReapply } from "@/lib/uvAdvice";
import { useConditions, type ConditionsMode } from "@/hooks/useConditions";
import { INTERVAL_OPTIONS, useReminder, type ReminderStatus } from "@/hooks/useReminder";

const RING_RADIUS = 92;
const RING_LENGTH = 2 * Math.PI * RING_RADIUS;
const SECONDS_PER_HOUR = 3600;

function formatClock(ms: number): string {
  const total = Math.ceil(ms / 1000);
  const h = Math.floor(total / SECONDS_PER_HOUR);
  const m = Math.floor((total % SECONDS_PER_HOUR) / 60);
  const s = total % 60;
  const pad = (n: number) => String(n).padStart(2, "0");
  return h > 0 ? `${h}:${pad(m)}:${pad(s)}` : `${pad(m)}:${pad(s)}`;
}

function formatInterval(min: number): string {
  return min % 60 === 0 ? `${min / 60} h` : `${min} min`;
}

const HEADLINES: Record<ReminderStatus, string> = {
  idle: "Just applied?",
  running: "You're covered. For now.",
  due: "Time to reapply",
};

export function ReminderApp() {
  const shell = findShell(useSearchParams().get("shell"));
  const rarity = RARITIES[shell.rarity];
  const r = useReminder();
  const weather = useConditions();
  const advice = weather.conditions ? adviseReapply(weather.conditions) : null;
  // A hand-picked interval wins until the weather source changes.
  const [override, setOverride] = useState<number | null>(null);
  const recommendedMin = advice?.kind === "timer" ? advice.intervalMin : r.intervalMin;
  const intervalMin = override ?? recommendedMin;
  const skipToday = advice?.kind === "skip" && r.status === "idle";

  const chooseConditions = (mode: ConditionsMode) => {
    setOverride(null);
    weather.choose(mode);
  };

  const progress = r.status === "running" ? r.remainingMs / r.durationMs : r.status === "due" ? 0 : 1;
  const notificationsOn = r.permission === "granted";

  return (
    <main
      className="grid min-h-svh place-items-center px-5 py-10 text-plum"
      style={{ backgroundColor: `color-mix(in srgb, ${shell.shell} 45%, #FFF7ED)` }}
    >
      <div className="w-full max-w-md space-y-6 rounded-[2.5rem] bg-cream/90 p-7 shadow-lift">
        <header className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10">
              <ProductArt shell={shell.shell} deep={shell.deep} charm={shell.charm} finish={shell.finish} chip={false} title="" />
            </div>
            <div>
              <p className="text-[0.7rem] font-bold uppercase tracking-[0.2em] text-plum/60">Your LUMI</p>
              <p className="font-display text-lg font-extrabold leading-tight">{shell.name}</p>
            </div>
          </div>
          <span className={cn("rounded-full px-3 py-1 text-[0.68rem] font-bold uppercase tracking-[0.14em]", rarity.badge)}>
            <span aria-hidden>{"★".repeat(rarity.stars)} </span>
            {rarity.label}
          </span>
        </header>

        <ConditionsPanel
          conditions={weather.conditions}
          mode={weather.mode}
          status={weather.status}
          error={weather.error}
          onChoose={chooseConditions}
        />

        {skipToday && advice ? (
          <section aria-label="Reapply guidance" className="rounded-[2rem] bg-mint/60 px-6 py-8 text-center">
            <ShieldCheck size={40} className="mx-auto" aria-hidden />
            <h1 aria-live="polite" className="mt-3 font-display text-2xl font-extrabold tracking-tight">
              {advice.headline}
            </h1>
            <p className="mt-2 text-sm text-plum/75">{advice.note}</p>
            <p className="mt-3 text-xs text-plum/60">No countdown started. Tap your shell again if the sun comes out.</p>
          </section>
        ) : (
        <section aria-label="Reapply timer" className="text-center">
          <h1 aria-live="polite" className="font-display text-2xl font-extrabold tracking-tight">
            {HEADLINES[r.status]}
          </h1>
          {advice?.kind === "timer" && (
            <p className="mt-1 text-sm font-semibold text-plum/75">
              {advice.headline} <span className="font-normal text-plum/60">{advice.note}</span>
            </p>
          )}
          <div className="relative mx-auto mt-4 aspect-square w-64">
            <svg viewBox="0 0 220 220" className="h-full w-full -rotate-90" aria-hidden>
              <circle cx="110" cy="110" r={RING_RADIUS} fill="none" stroke={shell.shell} strokeOpacity="0.35" strokeWidth="14" />
              <circle
                cx="110"
                cy="110"
                r={RING_RADIUS}
                fill="none"
                stroke={r.status === "due" ? "#C2477A" : shell.deep}
                strokeWidth="14"
                strokeLinecap="round"
                strokeDasharray={RING_LENGTH}
                strokeDashoffset={RING_LENGTH * (1 - progress)}
                style={{ transition: "stroke-dashoffset 1s linear, stroke 0.4s ease" }}
              />
            </svg>
            <div className="absolute inset-0 grid place-items-center">
              <div>
                <p role="timer" className="font-display text-5xl font-extrabold tabular-nums tracking-tight">
                  {r.ready ? formatClock(r.status === "idle" ? intervalMin * 60_000 : r.remainingMs) : "--:--"}
                </p>
                <p className="mt-1 text-xs font-semibold uppercase tracking-[0.18em] text-plum/60">
                  {r.status === "idle" ? "ready to start" : r.status === "running" ? "until reapply" : "overdue"}
                </p>
              </div>
            </div>
          </div>
        </section>
        )}

        <div className="space-y-3">
          <button
            type="button"
            onClick={() => r.startWith(intervalMin)}
            disabled={!r.ready || !advice}
            className={cn(
              "flex w-full items-center justify-center gap-2 rounded-full px-7 py-4 font-semibold shadow-soft transition-transform hover:scale-[1.02] disabled:opacity-60",
              skipToday ? "border-2 border-plum bg-transparent text-plum" : "bg-plum text-cream",
            )}
          >
            <Sun size={18} />
            {skipToday ? `I applied anyway. Remind me in ${formatInterval(intervalMin)}` : r.status === "idle" ? "I just applied" : "I reapplied. Restart timer"}
          </button>
          {r.status !== "idle" && (
            <button
              type="button"
              onClick={r.reset}
              className="flex w-full items-center justify-center gap-2 rounded-full border-2 border-plum px-7 py-3 text-sm font-semibold"
            >
              <RotateCcw size={16} />
              Stop timer
            </button>
          )}
        </div>

        <fieldset className="space-y-2">
          <legend className="text-[0.7rem] font-bold uppercase tracking-[0.18em] text-plum/65">Remind me every</legend>
          <div className="flex gap-2">
            {INTERVAL_OPTIONS.map((min) => (
              <button
                key={min}
                type="button"
                aria-pressed={intervalMin === min}
                onClick={() => setOverride(min)}
                className={cn(
                  "flex-1 rounded-full px-3 py-2 text-sm font-semibold transition-colors",
                  intervalMin === min ? "bg-plum text-cream" : "bg-white/70 hover:bg-white",
                )}
              >
                {formatInterval(min)}
                {advice?.kind === "timer" && advice.intervalMin === min && <span className="sr-only"> (recommended)</span>}
              </button>
            ))}
          </div>
          <p className="text-xs text-plum/65">
            LUMI suggests an interval from the current UV Index (60 min at UV 8+, 90 min at 6–7, 2 h at 4–5, 3 h at 1–3). Pick
            another any time; it applies from the next start.
          </p>
          <p className="text-xs text-plum/65">
            Prototype guidance, not medical advice. Always reapply after swimming, sweating or towelling off.
          </p>
        </fieldset>

        <section className="space-y-3 rounded-3xl bg-white/60 p-4">
          <div className="flex items-center justify-between gap-3">
            <p className="flex items-center gap-2 text-sm font-semibold">
              {notificationsOn ? <Bell size={16} /> : <BellOff size={16} />}
              {notificationsOn ? "Notifications on" : "Notifications off"}
            </p>
            {notificationsOn ? (
              <button type="button" onClick={r.sendTest} className="text-sm font-semibold underline underline-offset-4">
                Send a test
              </button>
            ) : (
              <button
                type="button"
                onClick={r.enableNotifications}
                disabled={r.permission === "unsupported" || r.permission === "denied"}
                className="rounded-full bg-sun px-4 py-2 text-sm font-semibold disabled:opacity-50"
              >
                Enable
              </button>
            )}
          </div>
          {r.permission === "denied" && (
            <p className="text-xs text-plum/70">Notifications are blocked. Allow them for this site in your browser settings.</p>
          )}
          {r.permission === "unsupported" && (
            <p className="text-xs text-plum/70">
              This browser can&rsquo;t send notifications. On iPhone, use Share, then Add to Home Screen, and open LUMI from there.
            </p>
          )}
          <p className="text-xs text-plum/65">
            Prototype: the alert fires while LUMI is open or in the background. Alerts with the app fully closed need a push service, which isn&rsquo;t built yet.
          </p>
        </section>

        <div className="text-center">
          <StatusTag kind="mockup" label="Concept prototype" />
        </div>
      </div>
    </main>
  );
}
