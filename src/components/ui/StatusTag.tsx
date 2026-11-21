import { cn } from "@/lib/cn";

type Kind = "proposed" | "target" | "prospective" | "assumption" | "mockup";
type Tone = "sun" | "plum" | "ghost" | "white";

const LABELS: Record<Kind, string> = {
  proposed: "Proposed",
  target: "Target, not a claim",
  prospective: "Prospective, not confirmed",
  assumption: "Preliminary assumption",
  mockup: "Concept visual",
};

const TONES: Record<Tone, string> = {
  sun: "bg-sun text-plum",
  plum: "bg-plum text-cream",
  ghost: "bg-cream/15 text-cream",
  white: "bg-white/70 text-plum",
};

/** Marks anything that is proposed rather than validated — used wherever a claim could be misread as fact. */
export function StatusTag({
  kind = "proposed",
  tone = "sun",
  className,
  label,
}: {
  kind?: Kind;
  tone?: Tone;
  className?: string;
  label?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[0.68rem] font-bold uppercase tracking-[0.14em]",
        TONES[tone],
        className,
      )}
    >
      <span aria-hidden className={cn("h-1.5 w-1.5 rounded-full bg-current", tone === "ghost" && "bg-sun")} />
      {label ?? LABELS[kind]}
    </span>
  );
}
