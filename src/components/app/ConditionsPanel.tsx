"use client";

import { Cloud, CloudRain, CloudSun, LocateFixed, MapPin, Sun } from "lucide-react";
import type { ConditionsMode, LiveStatus } from "@/hooks/useConditions";
import { cn } from "@/lib/cn";
import { formatBadge, type Conditions, type WeatherKind } from "@/lib/uvAdvice";

const ICONS: Record<WeatherKind, typeof Sun> = { sunny: Sun, partly: CloudSun, cloudy: Cloud, rainy: CloudRain };

const MODES: ReadonlyArray<{ id: ConditionsMode; label: string }> = [
  { id: "live", label: "My location" },
  { id: "sunny", label: "Sunny (High UV)" },
  { id: "cloudy", label: "Cloudy" },
  { id: "rainy", label: "Rainy" },
];

interface ConditionsPanelProps {
  conditions: Conditions | null;
  mode: ConditionsMode;
  status: LiveStatus;
  error: string | null;
  onChoose: (mode: ConditionsMode) => void;
}

/** Detected location + live weather/UV badge, with demo presets testers can toggle. */
export function ConditionsPanel({ conditions, mode, status, error, onChoose }: ConditionsPanelProps) {
  const Icon = conditions ? ICONS[conditions.weather] : LocateFixed;
  const place = conditions?.source === "live" ? (conditions.place ? `Near ${conditions.place}` : "Your location") : "Demo preset";

  return (
    <section aria-label="Local weather and UV" className="space-y-3 rounded-3xl bg-white/60 p-4">
      <div className="flex items-center justify-between gap-3">
        <p aria-live="polite" className="flex items-center gap-2 font-display text-base font-extrabold">
          <Icon size={18} aria-hidden />
          {conditions ? formatBadge(conditions) : "Checking UV & weather…"}
        </p>
        <p className="flex items-center gap-1 text-xs font-semibold text-plum/65">
          <MapPin size={12} aria-hidden />
          {status === "locating" ? "Locating…" : place}
        </p>
      </div>
      <div role="group" aria-label="Weather source" className="flex flex-wrap gap-2">
        {MODES.map((m) => (
          <button
            key={m.id}
            type="button"
            aria-pressed={mode === m.id}
            onClick={() => onChoose(m.id)}
            className={cn(
              "rounded-full px-3 py-1.5 text-xs font-semibold transition-colors",
              mode === m.id ? "bg-plum text-cream" : "bg-white/80 hover:bg-white",
            )}
          >
            {m.label}
          </button>
        ))}
      </div>
      {error && <p className="text-xs text-berry">{error}</p>}
      {mode === "live" && status !== "error" && (
        <p className="text-xs text-plum/65">Uses an approximate location and Open-Meteo for current UV Index and weather.</p>
      )}
    </section>
  );
}
