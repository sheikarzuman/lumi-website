"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValue, useSpring } from "motion/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Link from "next/link";
import { ArrowRight, Gift } from "lucide-react";
import { ProductArt } from "@/components/product/ProductArt";
import { RevealText } from "@/components/ui/RevealText";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { StatusTag } from "@/components/ui/StatusTag";
import { cn } from "@/lib/cn";
import { VARIANTS } from "@/lib/lumi";
import { COLLECTION, RARITIES, RARITY_ORDER, oddsPerShell, type CollectionShell } from "@/lib/rarity";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const TILT_MAX = 9;

function ProductCard({ index, shell }: { index: number; shell: CollectionShell }) {
  const [charmIdx, setCharmIdx] = useState<number | null>(null);
  const charm = charmIdx === null ? shell.charm : VARIANTS[charmIdx].shell;
  const rarity = RARITIES[shell.rarity];
  const isChase = shell.rarity !== "common";
  const hasFoil = shell.finish !== "matte";
  const ring = isChase ? `0 0 0 3px ${shell.deep}, 0 0 ${hasFoil ? 56 : 28}px ${shell.shell}, ` : "";

  const rx = useSpring(useMotionValue(0), { stiffness: 160, damping: 16 });
  const ry = useSpring(useMotionValue(0), { stiffness: 160, damping: 16 });

  const onMove = (e: React.PointerEvent<HTMLElement>) => {
    if (e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    ry.set(((e.clientX - r.left) / r.width - 0.5) * TILT_MAX * 2);
    rx.set(-((e.clientY - r.top) / r.height - 0.5) * TILT_MAX * 2);
  };
  const resetTilt = () => {
    rx.set(0);
    ry.set(0);
  };

  return (
    <motion.article
      onPointerMove={onMove}
      onPointerLeave={resetTilt}
      style={{
        rotateX: rx,
        rotateY: ry,
        transformPerspective: 1000,
        backgroundColor: `color-mix(in srgb, ${shell.shell} 62%, white)`,
        boxShadow: `${ring}0 30px 70px -24px rgba(59, 38, 73, 0.38)`,
      }}
      className="group relative flex h-[min(66svh,580px)] min-h-[470px] w-[78vw] max-w-[390px] shrink-0 snap-center flex-col rounded-[2.5rem] p-6 text-plum"
    >
      {hasFoil && <span aria-hidden className="foil-sheen pointer-events-none absolute inset-0 rounded-[2.5rem]" />}
      <header className="relative flex items-start justify-between">
        <div>
          <p className="text-[0.7rem] font-bold uppercase tracking-[0.2em] text-plum/60">
            No. {String(index + 1).padStart(2, "0")}
          </p>
          <div className="relative h-9 overflow-hidden">
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.h3
                key={shell.id}
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "-100%" }}
                transition={{ duration: 0.45, ease: [0.2, 0.8, 0.2, 1] }}
                className="font-display text-3xl font-extrabold leading-9 tracking-tight"
              >
                {shell.name}
              </motion.h3>
            </AnimatePresence>
          </div>
        </div>
        <span
          className={cn(
            "rounded-full px-3 py-1 text-[0.68rem] font-bold uppercase tracking-[0.14em]",
            rarity.badge,
          )}
        >
          <span aria-hidden>{"★".repeat(rarity.stars)} </span>
          {rarity.label}
        </span>
      </header>

      <div className="relative my-2 grid flex-1 place-items-center">
        <span
          aria-hidden
          className="absolute aspect-square w-[78%] rounded-full bg-white/45 transition-transform duration-700 group-hover:scale-110"
        />
        <span
          aria-hidden
          className="absolute aspect-square w-[58%] rounded-full bg-white/50 transition-transform duration-700 group-hover:scale-125"
        />
        <span
          className="animate-float relative block w-[56%] drop-shadow-[0_26px_26px_rgba(59,38,73,0.25)] transition-transform duration-500 group-hover:scale-105"
          style={{ "--r": `${index % 2 ? 4 : -4}deg`, animationDelay: `${-index * 1.3}s` } as React.CSSProperties}
        >
          <ProductArt
            shell={shell.shell}
            deep={shell.deep}
            charm={charm}
            finish={shell.finish}
            title={`${shell.name} LUMI shell, ${rarity.label} (concept visual)`}
          />
        </span>
      </div>

      <footer className="relative space-y-3">
        <div className="flex items-center justify-between gap-3">
          <p className="text-[0.7rem] font-bold uppercase tracking-[0.18em] text-plum/65">Charm</p>
          <div className="flex gap-1.5" role="group" aria-label={`Charm colour for ${shell.name} shell`}>
            {VARIANTS.map((v, i) => {
              const selected = (charmIdx ?? -1) === i;
              return (
                <button
                  key={v.id}
                  aria-label={`${v.name} charm`}
                  aria-pressed={selected}
                  onClick={() => setCharmIdx(selected ? null : i)}
                  className={cn(
                    "h-6 w-6 rounded-full border-2 transition-transform hover:scale-125",
                    selected ? "scale-110 border-plum" : "border-white/80",
                  )}
                  style={{ background: v.shell }}
                />
              );
            })}
          </div>
        </div>
        <p className="text-sm text-plum/70">
          <span className="font-semibold">
            {rarity.label}, about {Math.round(oddsPerShell(shell.rarity) * 10) / 10}% of shells.
          </span>{" "}
          Mix in any charm.
        </p>
      </footer>
    </motion.article>
  );
}

export function Collection() {
  const root = useRef<HTMLElement>(null);
  const pin = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
        const distance = () => Math.max(0, (track.current?.scrollWidth ?? 0) - window.innerWidth);
        gsap.to(track.current, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: pin.current,
            start: "top top",
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 0.8,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              if (bar.current) bar.current.style.transform = `scaleX(${self.progress})`;
            },
          },
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section id="collection" ref={root} className="relative bg-plum text-cream">
      <div
        ref={pin}
        className="relative flex flex-col justify-center gap-8 overflow-hidden py-24 md:h-[100svh] md:min-h-[700px] md:gap-10 md:py-0"
      >
        <div aria-hidden className="pointer-events-none absolute -left-40 top-10 h-96 w-96 rounded-full bg-lavender/20 blur-3xl" />
        <div aria-hidden className="pointer-events-none absolute -right-32 bottom-0 h-96 w-96 rounded-full bg-blush/20 blur-3xl" />

        <header className="relative z-10 flex flex-col gap-4 px-6 md:flex-row md:items-end md:justify-between md:px-12 md:pt-20">
          <div>
            <SectionLabel n="04" invert>
              Product collection
            </SectionLabel>
            <RevealText
              text={"Ten shells.\nFour rarities."}
              accent={["rarities."]}
              accentClass="text-sun"
              className="mt-4 font-display text-[clamp(2rem,4.4vw,3.8rem)] font-bold leading-[1.04] tracking-tight"
            />
          </div>
          <div className="flex items-center gap-4 text-sm text-cream/70">
            <span className="hidden md:inline">Keep scrolling</span>
            <div className="h-1.5 w-28 overflow-hidden rounded-full bg-cream/15 md:w-44">
              <div ref={bar} className="h-full origin-left scale-x-0 rounded-full bg-sun" />
            </div>
            <ArrowRight size={18} className="hidden md:block" />
            <span className="md:hidden">Swipe →</span>
          </div>
        </header>

        <div className="hide-scrollbar relative z-10 overflow-x-auto md:overflow-visible">
          <div ref={track} className="flex w-max snap-x snap-mandatory items-center gap-5 px-6 md:snap-none md:gap-8 md:px-12">
            <div className="flex h-[min(66svh,580px)] min-h-[470px] w-[78vw] max-w-[390px] shrink-0 snap-center flex-col justify-between rounded-[2.5rem] border-2 border-cream/20 p-7">
              <p className="font-display text-3xl font-bold leading-tight">
                Pick a shell.
                <br />
                Pick a charm.
                <br />
                <span className="text-sun">Make it yours.</span>
              </p>
              <div className="space-y-4 text-cream/75">
                <p>
                  The colour tells you how rare it is. Six pastel commons, two rares, an epic foil and one secret gold,
                  each with an interchangeable charm.
                </p>
                <ul className="space-y-1.5 text-sm">
                  {RARITY_ORDER.map((id) => (
                    <li key={id} className="flex items-center justify-between gap-3">
                      <span className="font-semibold text-cream">
                        <span aria-hidden className="text-sun">
                          {"★".repeat(RARITIES[id].stars)}{" "}
                        </span>
                        {RARITIES[id].label}
                      </span>
                      <span>{RARITIES[id].oddsPct}%</span>
                    </li>
                  ))}
                </ul>
                <div className="flex flex-wrap items-center gap-3">
                  <StatusTag kind="proposed" label="Proposed colourways and odds" />
                  <Link
                    href="/unbox"
                    className="inline-flex items-center gap-1.5 rounded-full bg-sun px-3.5 py-1.5 text-xs font-bold text-plum transition-transform hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sun"
                  >
                    <Gift size={14} aria-hidden /> Try a blind box pull
                  </Link>
                </div>
              </div>
            </div>

            {COLLECTION.map((s, i) => (
              <ProductCard key={s.id} index={i} shell={s} />
            ))}

            <div className="flex h-[min(66svh,580px)] min-h-[470px] w-[78vw] max-w-[390px] shrink-0 snap-center flex-col justify-between rounded-[2.5rem] bg-sun p-7 text-plum md:mr-12">
              <p className="font-display text-3xl font-bold leading-tight">Collect them. Swap them. Wear them.</p>
              <div className="space-y-4">
                <p className="text-plum/80">
                  Collectible charm drops are part of the proposed retention plan. Nothing is on sale yet.
                </p>
                <StatusTag kind="proposed" tone="plum" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
