"use client";

import { motion } from "motion/react";
import { Button } from "@/components/ui/Button";
import { RevealText } from "@/components/ui/RevealText";
import { THESIS } from "@/lib/investor";

const EASE = [0.2, 0.8, 0.2, 1] as const;

/** Thesis header: stage badge, headline, subhead and the two primary actions. */
export function InvestorHero() {
  return (
    <section id="top" className="grain relative isolate overflow-hidden bg-cream pb-20 pt-36 md:pb-28 md:pt-44">
      <div aria-hidden className="bg-aurora pointer-events-none absolute inset-0 -z-10 opacity-60" />
      <div className="mx-auto max-w-6xl px-6 md:px-12">
        <motion.span
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE }}
          className="inline-flex items-center gap-2 rounded-full bg-plum px-4 py-2 text-[0.72rem] font-bold uppercase tracking-[0.16em] text-cream"
        >
          <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-sun" />
          {THESIS.badge}
        </motion.span>
        <RevealText
          as="h1"
          play
          delay={0.15}
          text={THESIS.headline}
          accent={["wearable,", "recurring-revenue"]}
          className="mt-7 max-w-5xl font-display text-[clamp(2.4rem,6.2vw,5.6rem)] font-extrabold leading-[0.98] tracking-[-0.04em]"
        />
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8, ease: EASE }}
          className="mt-8 max-w-3xl text-lg leading-relaxed text-plum/75 md:text-xl"
        >
          {THESIS.subhead}
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8, ease: EASE }}
          className="mt-10 flex flex-wrap gap-3"
        >
          <Button href="#inquiry">Request pitch deck</Button>
          <Button href="#founder" variant="ghost">
            Meet the founder
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
