"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { ProductArt } from "@/components/product/ProductArt";
import { Reveal } from "@/components/ui/Reveal";
import { RevealText } from "@/components/ui/RevealText";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { StatusTag } from "@/components/ui/StatusTag";
import { VARIANTS } from "@/lib/lumi";

const MARQUEE_WORDS = ["Protection", "meets", "personality", "✺"];
const WAYS = [
  { title: "On your bag", body: "Clip it to a strap or zip. It rides along, in reach.", variant: 1 },
  { title: "On your keys", body: "Swap the charm, swap the mood. Same shell, new look.", variant: 2 },
  { title: "On your belt loop", body: "Easy to reach, easy to reapply with one hand.", variant: 4 },
] as const;

function MarqueeRow({ reverse = false, outline = false }: { reverse?: boolean; outline?: boolean }) {
  const row = Array.from({ length: 2 }, () => MARQUEE_WORDS).flat();
  return (
    <div className="flex overflow-hidden" aria-hidden>
      <div
        className="animate-marquee flex shrink-0 items-center gap-8 whitespace-nowrap pr-8"
        style={reverse ? { animationDirection: "reverse" } : undefined}
      >
        {[...row, ...row].map((w, i) => (
          <span
            key={i}
            className={
              "font-display text-[clamp(3.5rem,10vw,9rem)] font-extrabold leading-none tracking-[-0.04em] " +
              (outline ? "text-outline-plum" : i % 4 === 3 ? "text-berry" : "text-plum")
            }
          >
            {w}
          </span>
        ))}
      </div>
    </div>
  );
}

function Seal() {
  return (
    <div className="relative grid h-32 w-32 place-items-center rounded-full bg-sun shadow-soft md:h-40 md:w-40">
      <svg viewBox="0 0 160 160" className="animate-spin-slow absolute inset-0 h-full w-full" aria-hidden>
        <defs>
          <path id="seal-circle" d="M80 80 m-58 0 a58 58 0 1 1 116 0 a58 58 0 1 1 -116 0" />
        </defs>
        <text fontSize="13" fontWeight="700" letterSpacing="3.4" fill="#3B2649" style={{ fontFamily: "var(--font-dm-sans), sans-serif" }}>
          <textPath href="#seal-circle">CONCEPT STAGE · CLIP · WEAR · REAPPLY ·</textPath>
        </text>
      </svg>
      <span className="font-display text-3xl font-extrabold">✺</span>
    </div>
  );
}

export function Experience() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const photoY = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);
  const photoScale = useTransform(scrollYProgress, [0, 1], [1.2, 1.08]);

  return (
    <section id="experience" ref={ref} className="relative overflow-hidden bg-cream py-24 md:py-32">
      <div aria-hidden className="pointer-events-none absolute -left-32 top-40 h-[28rem] w-[28rem] rounded-full bg-lavender/50 blur-3xl" />
      <div aria-hidden className="pointer-events-none absolute -right-32 top-[55%] h-[30rem] w-[30rem] rounded-full bg-blush/50 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-6 md:px-12">
        <SectionLabel n="07">Brand experience</SectionLabel>
        <RevealText
          text={"Sunscreen,\nbut make it an accessory."}
          accent={["accessory."]}
          className="mt-4 max-w-4xl font-display text-[clamp(2.2rem,5.6vw,5rem)] font-bold leading-[1.02] tracking-tight"
        />
      </div>

      <div className="relative mt-10 space-y-2 md:mt-14">
        <MarqueeRow />
        <MarqueeRow reverse outline />
      </div>

      <div className="relative mx-auto mt-16 grid max-w-7xl items-start gap-12 px-6 md:mt-24 md:grid-cols-12 md:gap-8 md:px-12">
        {/* lifestyle photo, parallax inside a rounded mask */}
        <div className="relative md:col-span-7">
          <div className="relative aspect-[5/4] overflow-hidden rounded-[2.5rem] shadow-lift md:rounded-[3.5rem]">
            <motion.div style={{ y: photoY, scale: photoScale }} className="absolute inset-0">
              <Image
                src="/images/lumi-lifestyle.jpg"
                alt="Six pastel LUMI clip-ons with sun charms, clipped to bags on a linen towel (concept visual)"
                fill
                sizes="(min-width: 768px) 58vw, 100vw"
                className="object-cover"
              />
            </motion.div>
          </div>
          <div className="absolute -bottom-10 left-4 z-10 md:-left-10 md:-bottom-14">
            <Seal />
          </div>
          <p className="mt-4 text-xs text-plum-soft md:mt-6">Concept visual. LUMI is not yet a physical product.</p>
        </div>

        <div className="md:col-span-5 md:pt-24">
          <Reveal>
            <p className="font-display text-[clamp(1.8rem,3.2vw,2.8rem)] font-bold leading-[1.12] tracking-tight">
              Protection <span className="text-berry">meets personality.</span>
            </p>
            <p className="mt-6 text-lg leading-relaxed text-plum-soft">
              Most sunscreen lives in a drawer because nobody wants to be seen with it. LUMI is designed the other way
              round: a pebble-soft shell, a metal clip and a collectible charm, made to be worn and shown off, so it
              is already with you when it is time to reapply.
            </p>
          </Reveal>
        </div>
      </div>

      <div className="relative mx-auto mt-28 max-w-7xl px-6 md:mt-40 md:px-12">
        <Reveal>
          <h3 className="font-display text-3xl font-bold tracking-tight md:text-5xl">
            Three ways to wear it. <span className="text-berry">Zero drawers.</span>
          </h3>
        </Reveal>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {WAYS.map((w, i) => {
            const v = VARIANTS[w.variant];
            return (
              <Reveal key={w.title} delay={i * 0.12}>
                <motion.article
                  whileHover={{ y: -10, rotate: i % 2 ? 1.2 : -1.2 }}
                  transition={{ type: "spring", stiffness: 260, damping: 18 }}
                  className="relative flex h-full flex-col overflow-hidden rounded-[2.25rem] p-7"
                  style={{ background: `color-mix(in srgb, ${v.shell} 60%, white)` }}
                >
                  <div className="mx-auto w-28 drop-shadow-[0_18px_18px_rgba(59,38,73,0.22)]">
                    <ProductArt shell={v.shell} deep={v.deep} charm={v.charm} />
                  </div>
                  <h4 className="mt-5 font-display text-2xl font-bold tracking-tight">{w.title}</h4>
                  <p className="mt-2 flex-1 text-plum/75">{w.body}</p>
                  <StatusTag kind="mockup" label="Concept" tone="white" className="mt-5 self-start" />
                </motion.article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
