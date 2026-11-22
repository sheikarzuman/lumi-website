/**
 * Weather- and UV-index-aware reapplication guidance for the LUMI tap flow.
 * Pure functions only, so the app and the concept reels share the exact same rules.
 * Prototype guidance, not medical advice.
 */

export type WeatherKind = "sunny" | "partly" | "cloudy" | "rainy";

export interface Conditions {
  weather: WeatherKind;
  /** UV Index (WHO scale, 0..11+) */
  uvIndex: number;
  /** Human-readable place, when known */
  place: string | null;
  source: "live" | "preset";
}

export type Advice =
  | { kind: "skip"; headline: string; note: string }
  | { kind: "timer"; intervalMin: number; headline: string; note: string };

/**
 * Clouds and rain cut UV, but not all of it. WHO advises protection from UVI 3 upward,
 * so a rainy/cloudy "skip" only applies while the measured UV stays at or below this.
 */
export const SKIP_MAX_UVI = 2;

const UVI_VERY_HIGH = 8;
const UVI_HIGH = 6;
const UVI_MODERATE = 4;
const UVI_LOW = 1;

export const WEATHER_LABEL: Record<WeatherKind, string> = {
  sunny: "Sunny",
  partly: "Partly sunny",
  cloudy: "Cloudy",
  rainy: "Rainy",
};

/** WMO weather interpretation codes (used by Open-Meteo) mapped to the four LUMI states. */
export function weatherFromCode(code: number): WeatherKind {
  if (code === 0 || code === 1) return "sunny";
  if (code === 2) return "partly";
  if (code === 3 || code === 45 || code === 48) return "cloudy";
  // drizzle, rain, freezing rain, snow, showers, thunderstorms
  return "rainy";
}

const roundUv = (uv: number): number => Math.max(0, Math.round(uv));

function uvTimer(uvi: number): Advice {
  if (uvi >= UVI_VERY_HIGH) {
    return { kind: "timer", intervalMin: 60, headline: "High UV alert: reapply every 60 mins.", note: `UV Index ${uvi} is very high.` };
  }
  if (uvi >= UVI_HIGH) {
    return { kind: "timer", intervalMin: 90, headline: "High UV: reapply every 90 mins.", note: `UV Index ${uvi} is high.` };
  }
  if (uvi >= UVI_MODERATE) {
    return { kind: "timer", intervalMin: 120, headline: "Moderate-high UV: reapply every 2 hours.", note: `UV Index ${uvi} is moderate to high.` };
  }
  return { kind: "timer", intervalMin: 180, headline: "Low UV: reapply every 3 hours.", note: `UV Index ${uvi} is low. Protection is optional but still sensible outdoors.` };
}

/** The recommendation shown after a tap. */
export function adviseReapply(c: Pick<Conditions, "weather" | "uvIndex">): Advice {
  const uvi = roundUv(c.uvIndex);
  const overcast = c.weather === "rainy" || c.weather === "cloudy";
  if (overcast && uvi <= SKIP_MAX_UVI) {
    const what = c.weather === "rainy" ? "Rain" : "Heavy cloud cover";
    return { kind: "skip", headline: "No sunscreen needed right now", note: `${what} detected — UV exposure is minimal (UV Index ${uvi}).` };
  }
  if (uvi < UVI_LOW) {
    return { kind: "skip", headline: "No sunscreen needed right now", note: "UV Index is 0 — there's no meaningful UV at the moment." };
  }
  const advice = uvTimer(uvi);
  return overcast ? { ...advice, note: `${advice.note} Clouds don't block all UV, so the timer still runs.` } : advice;
}

/** Demo presets for investors/testers, and the fallback when location or the API is unavailable. */
export const PRESETS: Record<"sunny" | "cloudy" | "rainy", Conditions> = {
  sunny: { weather: "sunny", uvIndex: 8, place: null, source: "preset" },
  cloudy: { weather: "cloudy", uvIndex: 2, place: null, source: "preset" },
  rainy: { weather: "rainy", uvIndex: 1, place: null, source: "preset" },
};

export const formatBadge = (c: Pick<Conditions, "weather" | "uvIndex">): string =>
  `${WEATHER_LABEL[c.weather]} • UV Index ${roundUv(c.uvIndex)}`;
