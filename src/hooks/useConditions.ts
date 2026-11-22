"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { PRESETS, weatherFromCode, type Conditions } from "@/lib/uvAdvice";

export type ConditionsMode = "live" | keyof typeof PRESETS;
export type LiveStatus = "idle" | "locating" | "ready" | "error";

const API = "https://api.open-meteo.com/v1/forecast";
const FETCH_TIMEOUT_MS = 8000;
const GEO_TIMEOUT_MS = 10_000;
/** A rough position is enough for weather; it also avoids sending a precise location. */
const COORD_DECIMALS = 2;

interface OpenMeteoCurrent {
  timezone?: unknown;
  current?: { weather_code?: unknown; uv_index?: unknown };
}

/** Validates the API payload instead of trusting it. */
function parseForecast(body: unknown): { code: number; uv: number; timezone: string | null } {
  const b = body as OpenMeteoCurrent;
  const code = b?.current?.weather_code;
  const uv = b?.current?.uv_index;
  if (typeof code !== "number" || typeof uv !== "number" || !Number.isFinite(uv)) {
    throw new Error("Weather service returned an unexpected response");
  }
  return { code, uv, timezone: typeof b.timezone === "string" ? b.timezone : null };
}

/** "Europe/London" -> "London"; good enough to name the area without a reverse-geocoding service. */
const placeFromTimezone = (tz: string | null): string | null =>
  tz && tz.includes("/") ? tz.split("/").pop()!.replaceAll("_", " ") : null;

function currentPosition(): Promise<GeolocationPosition> {
  return new Promise((resolve, reject) => {
    if (!("geolocation" in navigator)) {
      reject(new Error("Location isn't available in this browser"));
      return;
    }
    navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: GEO_TIMEOUT_MS, maximumAge: 15 * 60_000 });
  });
}

async function fetchLive(): Promise<Conditions> {
  const pos = await currentPosition();
  const params = new URLSearchParams({
    latitude: pos.coords.latitude.toFixed(COORD_DECIMALS),
    longitude: pos.coords.longitude.toFixed(COORD_DECIMALS),
    current: "weather_code,uv_index",
    timezone: "auto",
  });
  const res = await fetch(`${API}?${params}`, { signal: AbortSignal.timeout(FETCH_TIMEOUT_MS) });
  if (!res.ok) throw new Error(`Weather service error (${res.status})`);
  const { code, uv, timezone } = parseForecast(await res.json());
  return { weather: weatherFromCode(code), uvIndex: uv, place: placeFromTimezone(timezone), source: "live" };
}

function friendlyError(err: unknown): string {
  if (typeof GeolocationPositionError !== "undefined" && err instanceof GeolocationPositionError) {
    return err.code === err.PERMISSION_DENIED ? "Location permission was declined." : "Couldn't get your location.";
  }
  return "Couldn't reach the weather service.";
}

/**
 * Current weather + UV for the tap card. Starts on the Sunny preset (no permission prompt on load);
 * "live" asks for location and calls Open-Meteo, falling back to the last preset with a clear message.
 */
export function useConditions() {
  const [mode, setMode] = useState<ConditionsMode>("sunny");
  const [live, setLive] = useState<Conditions | null>(null);
  const [status, setStatus] = useState<LiveStatus>("idle");
  const [error, setError] = useState<string | null>(null);

  // Each live lookup gets an id; results from a superseded lookup (or after unmount) are ignored.
  const request = useRef(0);
  useEffect(
    () => () => {
      request.current += 1;
    },
    [],
  );

  const choose = useCallback((next: ConditionsMode) => {
    setMode(next);
    request.current += 1;
    if (next !== "live") return;
    const id = request.current;
    setStatus("locating");
    setError(null);
    fetchLive()
      .then((c) => {
        if (id !== request.current) return;
        setLive(c);
        setStatus("ready");
      })
      .catch((err: unknown) => {
        if (id !== request.current) return;
        setStatus("error");
        setError(`${friendlyError(err)} Showing the Sunny demo instead.`);
      });
  }, []);

  // null while a live lookup is in flight, so the UI shows "checking" instead of a fake reading
  const conditions: Conditions | null =
    mode !== "live" ? PRESETS[mode] : status === "ready" && live ? live : status === "error" ? PRESETS.sunny : null;
  return { mode, choose, conditions, status, error };
}
