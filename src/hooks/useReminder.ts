"use client";

import { useCallback, useEffect, useState, useSyncExternalStore } from "react";

export type ReminderStatus = "idle" | "running" | "due";
export type PermissionState = NotificationPermission | "unsupported";

interface StoredReminder {
  /** Epoch ms when the reapply reminder is due, or null when no timer is running */
  endsAt: number | null;
  durationMs: number;
  intervalMin: number;
  /** True once the notification for this timer has been sent */
  notified: boolean;
}

/** 60 / 90 / 120 / 180 min: the UV-adaptive intervals from lib/uvAdvice, also selectable by hand. */
export const INTERVAL_OPTIONS = [60, 90, 120, 180] as const;
const DEFAULT_INTERVAL_MIN = 120;
const STORAGE_KEY = "lumi.reminder.v1";
const TICK_MS = 1000;
const MS_PER_MIN = 60_000;
const SW_PATH = "/sw.js";

const DEFAULT_STATE: StoredReminder = {
  endsAt: null,
  durationMs: DEFAULT_INTERVAL_MIN * MS_PER_MIN,
  intervalMin: DEFAULT_INTERVAL_MIN,
  notified: false,
};

function isStoredReminder(value: unknown): value is StoredReminder {
  if (typeof value !== "object" || value === null) return false;
  const v = value as Record<string, unknown>;
  return (
    (v.endsAt === null || typeof v.endsAt === "number") &&
    typeof v.durationMs === "number" &&
    typeof v.intervalMin === "number" &&
    typeof v.notified === "boolean"
  );
}

function loadState(): StoredReminder {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : null;
    return isStoredReminder(parsed) ? parsed : DEFAULT_STATE;
  } catch {
    return DEFAULT_STATE;
  }
}

function saveState(state: StoredReminder) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Storage can be blocked (private mode). The timer still works for this session.
  }
}

function currentPermission(): PermissionState {
  return typeof Notification === "undefined" ? "unsupported" : Notification.permission;
}

/* ---------- tiny external store over localStorage ---------- */

const listeners = new Set<() => void>();
let cached: StoredReminder | null = null;

const emit = () => listeners.forEach((listener) => listener());

function subscribe(listener: () => void) {
  listeners.add(listener);
  const onStorage = (e: StorageEvent) => {
    if (e.key !== STORAGE_KEY) return;
    cached = null;
    listener();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

function getSnapshot(): StoredReminder {
  cached ??= loadState();
  return cached;
}

const getServerSnapshot = (): StoredReminder => DEFAULT_STATE;

function updateState(change: (state: StoredReminder) => StoredReminder) {
  cached = change(getSnapshot());
  saveState(cached);
  emit();
}

const subscribeNever = () => () => undefined;

async function showReapplyNotification() {
  const title = "Time to reapply your sunscreen";
  const options: NotificationOptions = { body: "Tap to open LUMI and restart your timer.", tag: "lumi-reapply" };
  try {
    const registration = await navigator.serviceWorker?.getRegistration();
    if (registration) {
      await registration.showNotification(title, options);
      return;
    }
    new Notification(title, options);
  } catch {
    // The in-app banner is the fallback when the browser refuses the notification.
  }
}

export function useReminder() {
  const state = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const permission = useSyncExternalStore<PermissionState>(subscribe, currentPermission, () => "default");
  const ready = useSyncExternalStore(subscribeNever, () => true, () => false);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    navigator.serviceWorker?.register(SW_PATH).catch(() => undefined);
  }, []);

  const ticking = state.endsAt !== null && !state.notified;
  useEffect(() => {
    if (!ticking) return;
    const tick = () => setNow(Date.now());
    const id = window.setInterval(tick, TICK_MS);
    document.addEventListener("visibilitychange", tick);
    return () => {
      window.clearInterval(id);
      document.removeEventListener("visibilitychange", tick);
    };
  }, [ticking]);

  const remainingMs = state.endsAt === null ? 0 : Math.max(0, state.endsAt - now);
  const status: ReminderStatus = state.endsAt === null ? "idle" : remainingMs > 0 ? "running" : "due";

  useEffect(() => {
    if (status !== "due" || state.notified) return;
    updateState((s) => ({ ...s, notified: true }));
    navigator.vibrate?.([200, 100, 200]);
    if (currentPermission() === "granted") void showReapplyNotification();
  }, [status, state.notified]);

  const start = useCallback(() => {
    const startedAt = Date.now();
    setNow(startedAt);
    updateState((s) => {
      const durationMs = s.intervalMin * MS_PER_MIN;
      return { ...s, durationMs, endsAt: startedAt + durationMs, notified: false };
    });
  }, []);

  /** Start (or restart) with a specific interval, e.g. the one recommended for the current UV Index. */
  const startWith = useCallback((intervalMin: number) => {
    const startedAt = Date.now();
    setNow(startedAt);
    updateState((s) => {
      const durationMs = intervalMin * MS_PER_MIN;
      return { ...s, intervalMin, durationMs, endsAt: startedAt + durationMs, notified: false };
    });
  }, []);

  const reset = useCallback(() => {
    updateState((s) => ({ ...s, endsAt: null, notified: false }));
  }, []);

  const setIntervalMin = useCallback((intervalMin: number) => {
    updateState((s) => ({ ...s, intervalMin }));
  }, []);

  const enableNotifications = useCallback(async () => {
    if (typeof Notification === "undefined") return;
    await Notification.requestPermission();
    emit();
  }, []);

  const sendTest = useCallback(() => {
    if (currentPermission() === "granted") void showReapplyNotification();
  }, []);

  return {
    ready,
    status,
    remainingMs,
    durationMs: state.durationMs,
    intervalMin: state.intervalMin,
    permission,
    start,
    startWith,
    reset,
    setIntervalMin,
    enableNotifications,
    sendTest,
  };
}
