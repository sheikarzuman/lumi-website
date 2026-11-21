import { useId } from "react";
import { cn } from "@/lib/cn";

export type Finish = "matte" | "foil" | "gold";

interface ProductArtProps {
  shell: string;
  deep: string;
  charm: string;
  className?: string;
  /** Show the RFID tap-chip mark on the cap */
  chip?: boolean;
  /** Surface finish: matte pastel, rainbow foil, or gold */
  finish?: Finish;
  title?: string;
}

const SPIKES = 10;
const FADE = "fill 0.6s ease, stroke 0.6s ease";
const SHELL_PATH =
  "M100 56 C142 56 168 88 168 134 L168 198 C168 232 142 254 100 254 C58 254 32 232 32 198 L32 134 C32 88 58 56 100 56 Z";

const FINISH_STOPS: Record<Exclude<Finish, "matte">, Array<[number, string, number]>> = {
  foil: [
    [0, "#7FE0D0", 0.55],
    [0.35, "#CBB5EF", 0.5],
    [0.65, "#F5B2C7", 0.5],
    [1, "#FFE69A", 0.55],
  ],
  gold: [
    [0, "#FFF3B0", 0.7],
    [0.4, "#F6C453", 0.55],
    [0.7, "#FFF3B0", 0.65],
    [1, "#C98A12", 0.55],
  ],
};

/**
 * Original 2D illustration of the proposed LUMI clip-on: pebble shell, loop, locking cap
 * with an RFID tap-chip mark, and a sun charm. Colours are props so cards can recolour with a transition.
 */
export function ProductArt({
  shell,
  deep,
  charm,
  className,
  chip = true,
  finish = "matte",
  title = "LUMI clip-on sunscreen (concept visual)",
}: ProductArtProps) {
  const uid = useId();
  const shade = `${uid}-shade`;
  const shine = `${uid}-shine`;
  const sheen = `${uid}-sheen`;

  return (
    <svg viewBox="0 0 220 300" className={cn("block h-auto w-full overflow-visible", className)} role="img" aria-label={title}>
      <defs>
        <linearGradient id={shade} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0.45" stopColor="#fff" stopOpacity="0" />
          <stop offset="1" stopColor="#3B2649" stopOpacity="0.16" />
        </linearGradient>
        <radialGradient id={shine} cx="0.3" cy="0.25" r="0.6">
          <stop offset="0" stopColor="#fff" stopOpacity="0.7" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
        {finish !== "matte" && (
          <linearGradient id={sheen} x1="0" y1="0" x2="1" y2="1">
            {FINISH_STOPS[finish].map(([offset, color, opacity]) => (
              <stop key={offset} offset={offset} stopColor={color} stopOpacity={opacity} />
            ))}
          </linearGradient>
        )}
      </defs>

      <ellipse cx="100" cy="288" rx="64" ry="8" fill="#3B2649" opacity="0.14" />

      {/* strap from loop to charm */}
      <path d="M114 50 C176 66 182 170 160 236" fill="none" strokeWidth="4" strokeLinecap="round" style={{ stroke: deep, transition: FADE }} opacity="0.4" />

      {/* loop */}
      <circle cx="100" cy="40" r="17" fill="none" strokeWidth="13" style={{ stroke: deep, transition: FADE }} opacity="0.2" />
      <circle cx="100" cy="40" r="17" fill="none" strokeWidth="9" style={{ stroke: shell, transition: FADE }} />

      {/* locking cap + nozzle slot */}
      <rect x="66" y="228" width="68" height="40" rx="14" style={{ fill: shell, transition: FADE }} />
      <rect x="66" y="228" width="68" height="40" rx="14" style={{ fill: deep, transition: FADE }} opacity="0.24" />
      <rect x="83" y="244" width="34" height="12" rx="6" style={{ fill: deep, transition: FADE }} opacity="0.4" />

      {/* shell */}
      <path d={SHELL_PATH} style={{ fill: shell, transition: FADE }} />
      {finish !== "matte" && <path d={SHELL_PATH} fill={`url(#${sheen})`} />}
      <path d={SHELL_PATH} fill={`url(#${shade})`} />
      <ellipse cx="68" cy="104" rx="22" ry="38" transform="rotate(-16 68 104)" fill={`url(#${shine})`} />

      <text
        x="100"
        y="142"
        textAnchor="middle"
        fontSize="36"
        fontWeight="800"
        letterSpacing="-1.5"
        style={{ fill: deep, transition: FADE, fontFamily: "var(--font-poppins), sans-serif" }}
      >
        LUMI
      </text>

      {/* RFID tap-chip badge: contactless arcs opening to the right */}
      {chip && (
        <g transform="translate(100 192)">
          <circle r="25" fill="#FFF7ED" strokeWidth="3.5" style={{ stroke: deep, transition: FADE }} />
          <circle cx="-10" cy="0" r="3" fill="#C2477A" />
          <g fill="none" strokeWidth="3" strokeLinecap="round" style={{ stroke: deep, transition: FADE }}>
            <path d="M-3 -8 A9 9 0 0 1 -3 8" />
            <path d="M4 -15 A17 17 0 0 1 4 15" />
          </g>
        </g>
      )}

      {/* sun charm */}
      <g transform="translate(160 256)">
        {Array.from({ length: SPIKES }, (_, i) => (
          <ellipse
            key={i}
            cx="0"
            cy="-17"
            rx="4.6"
            ry="6.4"
            transform={`rotate(${(360 / SPIKES) * i})`}
            style={{ fill: charm, transition: FADE }}
          />
        ))}
        <circle r="13" style={{ fill: charm, transition: FADE }} />
        <circle r="13" fill="none" strokeWidth="2" style={{ stroke: deep, transition: FADE }} opacity="0.3" />
        <circle r="6.5" fill="#fff" opacity="0.4" />
      </g>
    </svg>
  );
}
