import { COLLECTION } from "./rarity";

/** Shell id -> how many times it has been pulled on this device. */
export type Pulls = Readonly<Record<string, number>>;

const STORAGE_KEY = "lumi.pulls.v1";
const EMPTY: Pulls = Object.freeze({});
const KNOWN_IDS = new Set(COLLECTION.map((s) => s.id));

let cache: Pulls | null = null;
const listeners = new Set<() => void>();

function parse(raw: string | null): Pulls {
  if (!raw) return EMPTY;
  const value: unknown = JSON.parse(raw);
  if (typeof value !== "object" || value === null) return EMPTY;
  const entries = Object.entries(value as Record<string, unknown>).filter(
    (e): e is [string, number] => KNOWN_IDS.has(e[0]) && typeof e[1] === "number" && e[1] > 0 && Number.isFinite(e[1]),
  );
  return Object.freeze(Object.fromEntries(entries));
}

function read(): Pulls {
  try {
    return parse(window.localStorage.getItem(STORAGE_KEY));
  } catch {
    // Storage blocked or corrupt: start fresh for this session.
    return EMPTY;
  }
}

function write(next: Pulls) {
  cache = next;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Storage can be blocked (private mode). The tracker still works until the tab closes.
  }
  listeners.forEach((l) => l());
}

export function getPulls(): Pulls {
  if (cache === null) cache = read();
  return cache;
}

export function getServerPulls(): Pulls {
  return EMPTY;
}

export function subscribePulls(listener: () => void) {
  listeners.add(listener);
  const onStorage = (e: StorageEvent) => {
    if (e.key !== STORAGE_KEY) return;
    cache = read();
    listener();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

export function recordPull(id: string) {
  const current = getPulls();
  write(Object.freeze({ ...current, [id]: (current[id] ?? 0) + 1 }));
}

export function resetPulls() {
  write(EMPTY);
}
