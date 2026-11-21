"use client";

import { useState } from "react";
import { animate } from "motion/react";
import { Pause, Play } from "lucide-react";
import { cn } from "@/lib/cn";
import { PARTS } from "@/lib/lumi";

type PartId = (typeof PARTS)[number]["id"];

const PLUM = "#3B2649";
const STROKE = 4.5;

/** Assembled → exploded offsets (SVG user units, relative to the scene centre). */
const LAYOUT: Record<PartId, { home: [number, number]; away: [number, number] }> = {
  cartridge: { home: [0, 0], away: [158, -18] },
  shell: { home: [0, 0], away: [-172, 0] },
  cap: { home: [0, 0], away: [-172, 196] },
  chip: { home: [0, 22], away: [-24, -152] },
  charm: { home: [98, 132], away: [58, 168] },
};

const DRAW_ORDER: PartId[] = ["cartridge", "shell", "cap", "chip", "charm"];
const CHIP: Record<PartId, string> = {
  shell: "bg-blush",
  cartridge: "bg-mint",
  cap: "bg-lavender",
  charm: "bg-sun",
  chip: "bg-cream border-2 border-plum",
};

const mix = (a: number, b: number, t: number) => a + (b - a) * t;

function Shape({ id }: { id: PartId }) {
  switch (id) {
    case "shell":
      return (
        <g>
          <circle cy="-168" r="20" fill="none" stroke="#9C8BB0" strokeWidth="9" />
          <path
            d="M0 -150 C70 -150 96 -104 96 -40 L96 96 C96 138 62 156 0 156 C-62 156 -96 138 -96 96 L-96 -40 C-96 -104 -70 -150 0 -150 Z"
            fill="#F5B2C7"
            stroke={PLUM}
            strokeWidth={STROKE}
          />
          <text y="-52" textAnchor="middle" fontSize="44" fontWeight="800" fill="#D2527F" letterSpacing="-2" style={{ fontFamily: "var(--font-poppins), sans-serif" }}>
            LUMI
          </text>
        </g>
      );
    case "cartridge":
      return (
        <g>
          <rect x="-62" y="-122" width="124" height="236" rx="32" fill="#B9E4CD" stroke={PLUM} strokeWidth={STROKE} />
          <rect x="-44" y="-30" width="88" height="130" rx="22" fill="#E6F6EE" />
          <rect x="-22" y="112" width="44" height="26" rx="9" fill="#B9E4CD" stroke={PLUM} strokeWidth={STROKE} />
          <text y="44" textAnchor="middle" fontSize="20" fontWeight="700" fill={PLUM} opacity="0.7" style={{ fontFamily: "var(--font-dm-sans), sans-serif" }}>
            60 ml
          </text>
        </g>
      );
    case "cap":
      return (
        <g>
          <rect x="-58" y="132" width="116" height="48" rx="16" fill="#CBB5EF" stroke={PLUM} strokeWidth={STROKE} />
          <rect x="-24" y="148" width="48" height="14" rx="7" fill={PLUM} opacity="0.35" />
        </g>
      );
    case "chip":
      return (
        <g>
          <circle r="38" fill="#FFF7ED" stroke={PLUM} strokeWidth={STROKE} />
          <circle cx="-14" r="4.5" fill="#C2477A" />
          <path d="M-4 -12 A13 13 0 0 1 -4 12" fill="none" stroke={PLUM} strokeWidth="3.5" strokeLinecap="round" />
          <path d="M6 -21 A24 24 0 0 1 6 21" fill="none" stroke={PLUM} strokeWidth="3.5" strokeLinecap="round" />
        </g>
      );
    case "charm":
      return (
        <g>
          {Array.from({ length: 10 }, (_, i) => (
            <ellipse key={i} cy="-24" rx="6.5" ry="9" fill="#FFE69A" stroke={PLUM} strokeWidth="3" transform={`rotate(${i * 36})`} />
          ))}
          <circle r="19" fill="#FFE69A" stroke={PLUM} strokeWidth="3.5" />
          <circle r="9" fill="#fff" opacity="0.5" />
        </g>
      );
  }
}

export function ExplodedView() {
  const [explode, setExplode] = useState(0.72);
  const [selected, setSelected] = useState<PartId>("shell");
  const [playing, setPlaying] = useState(false);

  const part = PARTS.find((p) => p.id === selected) ?? PARTS[0];

  const play = () => {
    if (playing) return;
    setPlaying(true);
    animate(explode < 0.5 ? 0 : 1, explode < 0.5 ? 1 : 0, {
      duration: 1.8,
      ease: [0.65, 0, 0.35, 1],
      onUpdate: setExplode,
      onComplete: () => setPlaying(false),
    });
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
      <div className="relative overflow-hidden rounded-[2.5rem] bg-white p-4 shadow-lift md:p-8">
        <svg viewBox="0 0 760 540" className="block h-auto w-full" role="group" aria-label="Interactive exploded view of the proposed LUMI clip-on">
          <g transform="translate(380 262)">
            {/* leader lines from each part's assembled slot to where it floats */}
            {DRAW_ORDER.filter((id) => id !== "shell").map((id) => {
              const { home, away } = LAYOUT[id];
              return (
                <line
                  key={id}
                  x1={home[0]}
                  y1={home[1]}
                  x2={away[0]}
                  y2={away[1]}
                  stroke={PLUM}
                  strokeWidth="2.5"
                  strokeDasharray="3 9"
                  strokeLinecap="round"
                  opacity={explode * 0.45}
                />
              );
            })}

            {DRAW_ORDER.map((id) => {
              const { home, away } = LAYOUT[id];
              const x = mix(home[0], away[0], explode);
              const y = mix(home[1], away[1], explode);
              const isSelected = selected === id;
              const meta = PARTS.find((p) => p.id === id)!;
              return (
                <g
                  key={id}
                  role="button"
                  tabIndex={0}
                  aria-label={`${meta.name}. ${meta.blurb}`}
                  aria-pressed={isSelected}
                  onPointerEnter={() => setSelected(id)}
                  onFocus={() => setSelected(id)}
                  onClick={() => setSelected(id)}
                  onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && setSelected(id)}
                  style={{
                    transform: `translate(${x}px, ${y}px) scale(${isSelected ? 1.04 : 1})`,
                    transition: "transform 0.5s cubic-bezier(.2,.8,.2,1)",
                    cursor: "pointer",
                    filter: isSelected ? "drop-shadow(0 10px 18px rgba(59,38,73,0.3))" : undefined,
                  }}
                >
                  <Shape id={id} />
                  <text
                    y={id === "cap" ? 214 : id === "shell" ? 196 : id === "charm" ? 54 : id === "chip" ? 66 : 168}
                    textAnchor="middle"
                    fontSize="17"
                    fontWeight="700"
                    fill={PLUM}
                    style={{ fontFamily: "var(--font-dm-sans), sans-serif", opacity: explode > 0.55 ? 1 : 0, transition: "opacity .4s" }}
                  >
                    {meta.name.replace("Reusable ", "").replace("Replaceable ", "").replace("Interchangeable ", "").replace("Reapply reminder ", "")}
                  </text>
                </g>
              );
            })}
          </g>
        </svg>

        <div className="mt-2 flex items-center gap-4 px-2 pb-2 md:px-4">
          <button
            onClick={play}
            aria-label={playing ? "Animating" : "Play explode animation"}
            className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-plum text-cream transition-transform hover:scale-105"
          >
            {playing ? <Pause size={18} /> : <Play size={18} className="translate-x-px" />}
          </button>
          <div className="flex-1">
            <div className="mb-2 flex justify-between text-[0.7rem] font-bold uppercase tracking-[0.16em] text-plum-soft">
              <span>Assembled</span>
              <span>Exploded</span>
            </div>
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={explode}
              onChange={(e) => setExplode(Number(e.target.value))}
              aria-label="Explode the product"
              className="lumi-range w-full"
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <div className="rounded-[2rem] bg-plum p-7 text-cream">
          <p className="text-[0.7rem] font-bold uppercase tracking-[0.2em] text-sun">Selected part</p>
          <h4 className="mt-3 font-display text-2xl font-bold leading-tight">{part.name}</h4>
          <p className="mt-2 text-cream/80">{part.blurb}</p>
        </div>
        <ul className="space-y-2">
          {PARTS.map((p) => (
            <li key={p.id}>
              <button
                onClick={() => setSelected(p.id)}
                onPointerEnter={() => setSelected(p.id)}
                aria-pressed={selected === p.id}
                className={cn(
                  "flex w-full items-center gap-4 rounded-2xl px-5 py-4 text-left transition-all",
                  selected === p.id ? "bg-white shadow-soft" : "bg-white/40 hover:bg-white/70",
                )}
              >
                <span className={cn("h-5 w-5 shrink-0 rounded-md", CHIP[p.id])} />
                <span className="font-display font-semibold">{p.name}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
