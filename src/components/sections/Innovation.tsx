"use client";

import { useRef, useState } from "react";
import { motion, useMotionValueEvent, useScroll, useTransform, type MotionValue } from "motion/react";
import { Luggage, Recycle, Repeat } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { RevealText } from "@/components/ui/RevealText";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { StatusTag } from "@/components/ui/StatusTag";
import { cn } from "@/lib/cn";
import { ExplodedView } from "./ExplodedView";

const PLUM = "#3B2649";

const STEPS = [
  { title: "Unlock the cap", body: "The locking cap twists aside. The shell and its charm stay put." },
  { title: "Slide out the empty cartridge", body: "Only the used cartridge leaves. Nothing else gets thrown away." },
  { title: "Slide in the spare 60 ml cartridge", body: "The starter kit has two: one inside, one spare. A fresh, sealed unit, swapped when empty." },
  { title: "Lock and go", body: "Clip it back on your bag. Same shell, same charm, ready to reapply." },
] as const;

const STEP_BREAKS = [0.22, 0.5, 0.78];

const BENEFITS = [
  {
    icon: Luggage,
    title: "Portable",
    body: "A pebble-sized shell with a loop for the clip and charm, so it goes wherever your bag goes.",
    tone: "bg-blush",
  },
  {
    icon: Repeat,
    title: "Refillable",
    body: "Swap a sealed 60 ml cartridge and keep the shell and charm you already love. The starter kit comes with a spare inside.",
    tone: "bg-mint",
    note: "Proposed pricing: starter kit ₹899 (shell, charm and two 60 ml cartridges), refill ₹449. MRP incl. GST. Preliminary team assumption, not a supplier quote.",
  },
  {
    icon: Recycle,
    title: "Less to throw away",
    body: "Reusing the shell could mean less packaging per unit. The environmental impact has not been measured and will be quantified during development.",
    tone: "bg-lavender",
  },
] as const;

function Sparkle({ x, y, p }: { x: number; y: number; p: MotionValue<number> }) {
  const opacity = useTransform(p, [0.82, 0.9, 1], [0, 1, 1]);
  const scale = useTransform(p, [0.82, 0.92, 1], [0, 1.2, 1]);
  return (
    <motion.path
      style={{ opacity, scale }}
      d={`M${x} ${y - 16} L${x + 5} ${y - 5} L${x + 16} ${y} L${x + 5} ${y + 5} L${x} ${y + 16} L${x - 5} ${y + 5} L${x - 16} ${y} L${x - 5} ${y - 5} Z`}
      fill="#FFC93C"
    />
  );
}

function RefillSequence({ progress: p }: { progress: MotionValue<number> }) {
  // cap: twist aside, then back on
  const capX = useTransform(p, [0, 0.2, 0.78, 0.98], [0, 150, 150, 0]);
  const capY = useTransform(p, [0, 0.2, 0.78, 0.98], [0, 70, 70, 0]);
  const capRot = useTransform(p, [0, 0.2, 0.78, 0.98], [0, 32, 32, 0]);
  // old cartridge: slides down, then away
  const oldY = useTransform(p, [0.22, 0.42], [0, 250]);
  const oldX = useTransform(p, [0.42, 0.52], [0, 200]);
  const oldOpacity = useTransform(p, [0.44, 0.54], [1, 0.4]);
  const oldTag = useTransform(p, [0.4, 0.48], [0, 1]);
  // new cartridge: rises into the shell
  const newY = useTransform(p, [0.5, 0.78], [260, 0]);
  const newOpacity = useTransform(p, [0.48, 0.55], [0, 1]);
  const newTag = useTransform(p, [0.52, 0.6, 0.72, 0.78], [0, 1, 1, 0]);
  const badge = useTransform(p, [0.86, 0.95], [0, 1]);
  const badgeY = useTransform(p, [0.86, 0.95], [16, 0]);
  const needle = useTransform(p, [0.8, 1], [-40, 18]);

  return (
    <svg viewBox="0 0 640 760" className="block h-full w-full" role="img" aria-label="Animated sequence: twist the cap, slide out the empty cartridge, slide in a sealed one, lock and go">
      {/* new cartridge (behind shell) */}
      <motion.g style={{ y: newY, opacity: newOpacity }}>
        <rect x="175" y="150" width="150" height="290" rx="38" fill="#B9E4CD" stroke={PLUM} strokeWidth="5" />
        <rect x="192" y="190" width="116" height="232" rx="28" fill="#E6F6EE" />
        <rect x="225" y="440" width="50" height="26" rx="10" fill="#B9E4CD" stroke={PLUM} strokeWidth="5" />
        <motion.g style={{ opacity: newTag }}>
          <rect x="10" y="300" width="124" height="40" rx="20" fill="#FFE69A" stroke={PLUM} strokeWidth="4" />
          <text x="72" y="326" textAnchor="middle" fontSize="16" fontWeight="700" fill={PLUM} style={{ fontFamily: "var(--font-dm-sans), sans-serif" }}>
            Spare · 60 ml
          </text>
        </motion.g>
      </motion.g>

      {/* old cartridge (behind shell) */}
      <motion.g style={{ y: oldY, x: oldX, opacity: oldOpacity }}>
        <rect x="175" y="150" width="150" height="290" rx="38" fill="#B9E4CD" stroke={PLUM} strokeWidth="5" />
        <rect x="192" y="372" width="116" height="50" rx="22" fill="#E6F6EE" />
        <rect x="225" y="440" width="50" height="26" rx="10" fill="#B9E4CD" stroke={PLUM} strokeWidth="5" />
        <motion.g style={{ opacity: oldTag }}>
          <rect x="190" y="96" width="120" height="40" rx="20" fill="#fff" stroke={PLUM} strokeWidth="4" />
          <text x="250" y="123" textAnchor="middle" fontSize="19" fontWeight="700" fill={PLUM} style={{ fontFamily: "var(--font-dm-sans), sans-serif" }}>
            Empty
          </text>
        </motion.g>
      </motion.g>

      {/* shell */}
      <circle cx="250" cy="84" r="24" fill="none" stroke="#9C8BB0" strokeWidth="10" />
      <path
        d="M250 110 C330 110 360 160 360 230 L360 400 C360 452 320 482 250 482 C180 482 140 452 140 400 L140 230 C140 160 170 110 250 110 Z"
        fill="#F5B2C7"
        stroke={PLUM}
        strokeWidth="5"
      />
      <text x="250" y="226" textAnchor="middle" fontSize="56" fontWeight="800" fill="#D2527F" letterSpacing="-2.5" style={{ fontFamily: "var(--font-poppins), sans-serif" }}>
        LUMI
      </text>
      <g transform="translate(250 322)">
        <circle r="46" fill="#FFF7ED" stroke={PLUM} strokeWidth="5" />
        {Array.from({ length: 12 }, (_, i) => (
          <line key={i} y1="-37" y2={i % 3 === 0 ? -27 : -32} stroke={PLUM} strokeWidth="3" strokeLinecap="round" transform={`rotate(${i * 30})`} />
        ))}
        <motion.line y2="-32" stroke="#C2477A" strokeWidth="5" strokeLinecap="round" style={{ rotate: needle }} />
        <circle r="5.5" fill="#C2477A" />
      </g>
      <g transform="translate(356 470)">
        {Array.from({ length: 10 }, (_, i) => (
          <ellipse key={i} cy="-26" rx="7" ry="10" fill="#FFE69A" stroke={PLUM} strokeWidth="3" transform={`rotate(${i * 36})`} />
        ))}
        <circle r="21" fill="#FFE69A" stroke={PLUM} strokeWidth="3.5" />
        <circle r="10" fill="#fff" opacity="0.5" />
      </g>

      {/* locking cap (front) */}
      <motion.g style={{ x: capX, y: capY, rotate: capRot }}>
        <rect x="184" y="456" width="132" height="56" rx="18" fill="#CBB5EF" stroke={PLUM} strokeWidth="5" />
        <rect x="222" y="474" width="56" height="16" rx="8" fill={PLUM} opacity="0.35" />
      </motion.g>

      <Sparkle x={120} y={150} p={p} />
      <Sparkle x={388} y={190} p={p} />
      <Sparkle x={112} y={390} p={p} />

      <motion.g style={{ opacity: badge, y: badgeY }}>
        <rect x="150" y="640" width="200" height="54" rx="27" fill="#3B2649" />
        <text x="250" y="675" textAnchor="middle" fontSize="22" fontWeight="700" fill="#FFF7ED" style={{ fontFamily: "var(--font-dm-sans), sans-serif" }}>
          Ready to reapply
        </text>
      </motion.g>
    </svg>
  );
}

export function Innovation() {
  const wrap = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState(0);
  const { scrollYProgress } = useScroll({ target: wrap, offset: ["start start", "end end"] });

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const next = STEP_BREAKS.filter((b) => v > b).length;
    setStep((s) => (s === next ? s : next));
  });

  const fill = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section id="innovation" className="relative bg-oat/60">
      {/* ---------- scroll-driven refill sequence ---------- */}
      <div ref={wrap} className="relative h-[430svh]">
        <div className="sticky top-0 grid h-[100svh] min-h-[640px] grid-rows-[auto_minmax(0,1fr)] overflow-hidden md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] md:grid-rows-1">
          <div className="relative z-10 flex flex-col justify-center px-6 pt-24 md:px-12 md:pt-0">
            <SectionLabel n="05">Product innovation</SectionLabel>
            <RevealText
              text={"Refill,\ndon’t replace."}
              accent={["replace."]}
              className="mt-4 font-display text-[clamp(2.2rem,5vw,4.6rem)] font-bold leading-[1.02] tracking-tight"
            />
            <p className="mt-4 max-w-md text-plum-soft md:text-lg">
              Keep the shell and the charm. Swap only the cartridge. Scroll to see how the proposed mechanism works.
            </p>

            <ol className="mt-6 space-y-2 md:mt-8">
              {STEPS.map((s, i) => (
                <li
                  key={s.title}
                  className={cn(
                    "flex gap-4 rounded-2xl px-4 py-3 transition-all duration-500",
                    step === i ? "bg-white shadow-soft" : "opacity-45",
                    step !== i && "max-md:hidden",
                  )}
                >
                  <span
                    className={cn(
                      "grid h-8 w-8 shrink-0 place-items-center rounded-full font-display text-sm font-bold transition-colors",
                      step >= i ? "bg-plum text-cream" : "bg-plum/10",
                    )}
                  >
                    {i + 1}
                  </span>
                  <span>
                    <span className="block font-display font-bold leading-tight">{s.title}</span>
                    <span
                      className={cn(
                        "grid text-sm text-plum-soft transition-all duration-500",
                        step === i ? "mt-1 grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
                      )}
                    >
                      <span className="overflow-hidden">{s.body}</span>
                    </span>
                  </span>
                </li>
              ))}
            </ol>
            <div className="mt-5 h-1.5 w-full max-w-md overflow-hidden rounded-full bg-plum/10" aria-hidden>
              <motion.div style={{ width: fill }} className="h-full rounded-full bg-gradient-to-r from-blush via-lavender to-mint" />
            </div>
          </div>

          <div className="relative flex min-h-0 items-center justify-center px-6 pb-6 md:px-8 md:pb-0">
            <div className="relative h-full max-h-[760px] w-full max-w-[640px] overflow-hidden rounded-[2.5rem] bg-white shadow-lift">
              <RefillSequence progress={scrollYProgress} />
              <StatusTag kind="proposed" label="Proposed mechanism" className="absolute left-5 top-5" />
            </div>
          </div>
        </div>
      </div>

      {/* ---------- benefits ---------- */}
      <div className="mx-auto max-w-7xl px-6 py-24 md:px-12 md:py-32">
        <Reveal>
          <h3 className="max-w-3xl font-display text-3xl font-bold leading-tight tracking-tight md:text-5xl">
            Portable by design. <span className="text-berry">Refillable by habit.</span>
          </h3>
        </Reveal>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {BENEFITS.map((b, i) => (
            <Reveal key={b.title} delay={i * 0.12}>
              <article className="flex h-full flex-col rounded-[2rem] bg-white p-8 shadow-soft transition-transform duration-500 hover:-translate-y-2">
                <span className={cn("mb-6 grid h-14 w-14 place-items-center rounded-2xl", b.tone)}>
                  <b.icon size={26} strokeWidth={2} />
                </span>
                <h4 className="font-display text-2xl font-bold tracking-tight">{b.title}</h4>
                <p className="mt-3 flex-1 leading-relaxed text-plum-soft">{b.body}</p>
                {"note" in b && (
                  <p className="mt-5 rounded-2xl bg-sun/70 p-4 text-sm leading-snug">{b.note}</p>
                )}
              </article>
            </Reveal>
          ))}
        </div>

        {/* ---------- interactive exploded view ---------- */}
        <div className="mt-28">
          <Reveal>
            <SectionLabel n="05b">Explore the anatomy</SectionLabel>
            <h3 className="mt-4 max-w-3xl font-display text-3xl font-bold leading-tight tracking-tight md:text-5xl">
              Five parts. <span className="text-berry">Pull them apart.</span>
            </h3>
            <p className="mt-4 max-w-2xl text-plum-soft md:text-lg">
              Drag the slider, press play, or hover a part. This is a proposed design and has not yet been prototyped.
            </p>
          </Reveal>
          <div className="mt-10">
            <ExplodedView />
          </div>
        </div>
      </div>
    </section>
  );
}
