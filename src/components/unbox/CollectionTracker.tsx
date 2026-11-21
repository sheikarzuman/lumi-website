"use client";

import { useSyncExternalStore } from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/cn";
import { getPulls, getServerPulls, resetPulls, subscribePulls } from "@/lib/pullStore";
import { COLLECTION, RARITIES } from "@/lib/rarity";

const finishFill = (finish: string, shell: string) =>
  finish === "foil"
    ? "linear-gradient(135deg, #8FE3D6, #CBB5EF 50%, #F5B2C7)"
    : finish === "gold"
      ? "linear-gradient(135deg, #FFE69A, #F6C453 50%, #E2A93B)"
      : shell;

/** Which of the ten shells this device has pulled. Saved locally; works (for the session) without storage. */
export function CollectionTracker() {
  const pulls = useSyncExternalStore(subscribePulls, getPulls, getServerPulls);
  const owned = COLLECTION.filter((s) => (pulls[s.id] ?? 0) > 0).length;
  const total = Object.values(pulls).reduce((a, b) => a + b, 0);

  return (
    <section aria-labelledby="tracker-title" className="rounded-[2rem] bg-white/70 p-6 shadow-soft">
      <div className="flex items-baseline justify-between gap-3">
        <h2 id="tracker-title" className="font-display text-lg font-bold">
          Your collection
        </h2>
        <p className="text-sm font-semibold text-plum/70">
          {owned} / {COLLECTION.length} shells · {total} {total === 1 ? "pull" : "pulls"}
        </p>
      </div>
      <ul className="mt-4 grid grid-cols-5 gap-3">
        {COLLECTION.map((s) => {
          const count = pulls[s.id] ?? 0;
          const have = count > 0;
          return (
            <li key={s.id} className="flex flex-col items-center gap-1.5 text-center">
              <span
                className={cn(
                  "relative grid h-11 w-11 place-items-center rounded-full transition-opacity",
                  have ? "opacity-100" : "opacity-30 grayscale",
                )}
                style={{ background: finishFill(s.finish, s.shell), boxShadow: `inset 0 0 0 3px ${s.deep}33` }}
              >
                {have ? <Check size={18} strokeWidth={3} color={s.deep} aria-hidden /> : null}
              </span>
              <span className="text-[0.68rem] font-semibold leading-tight">
                {have ? s.name : "???"}
                <span className="sr-only">
                  , {RARITIES[s.rarity].label}, {have ? `pulled ${count} ${count === 1 ? "time" : "times"}` : "not pulled yet"}
                </span>
              </span>
            </li>
          );
        })}
      </ul>
      {total > 0 ? (
        <button
          type="button"
          onClick={resetPulls}
          className="mt-4 text-xs font-semibold text-plum/60 underline underline-offset-4 hover:text-plum focus-visible:outline-2 focus-visible:outline-plum"
        >
          Reset my collection
        </button>
      ) : null}
    </section>
  );
}
