"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { ArrowRight, Recycle } from "lucide-react";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";
import { Reveal } from "@/components/ui/Reveal";
import { RevealText } from "@/components/ui/RevealText";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { StatusTag } from "@/components/ui/StatusTag";
import { cn } from "@/lib/cn";
import { LOOP_RULES, LOOP_STEPS, loopReward } from "@/lib/loop";

const ORBIT_SECONDS = 14;
const ORBIT_DOTS = [0, 90, 180, 270] as const;

/** Cartridges circling a return arrow: the "send it back, keep it going" idea in motion. */
function LoopOrbit() {
  return (
    <div className="relative mx-auto aspect-square w-full max-w-xs">
      <motion.div
        aria-hidden
        className="absolute inset-0"
        animate={{ rotate: 360 }}
        transition={{ duration: ORBIT_SECONDS, repeat: Infinity, ease: "linear" }}
      >
        <svg viewBox="0 0 200 200" className="h-full w-full">
          <circle cx="100" cy="100" r="78" fill="none" stroke="#3B2649" strokeWidth="3" strokeDasharray="4 9" strokeLinecap="round" />
          {ORBIT_DOTS.map((deg) => (
            <g key={deg} transform={`rotate(${deg} 100 100) translate(100 22)`}>
              <rect x="-11" y="-16" width="22" height="32" rx="8" fill="#B9E4CD" stroke="#3B2649" strokeWidth="3" />
              <rect x="-6" y="-22" width="12" height="8" rx="3" fill="#B9E4CD" stroke="#3B2649" strokeWidth="3" />
            </g>
          ))}
        </svg>
      </motion.div>
      <div className="absolute inset-[22%] grid place-items-center rounded-full bg-white shadow-soft">
        <div className="text-center">
          <Recycle size={30} className="mx-auto text-leaf" aria-hidden />
          <p className="mt-1 font-display text-3xl font-extrabold leading-none tracking-tight">
            {LOOP_RULES.minCartridges}-{LOOP_RULES.maxCartridges}
          </p>
          <p className="mt-1 text-[0.65rem] font-bold uppercase tracking-[0.16em] text-plum-soft">cartridges</p>
        </div>
      </div>
    </div>
  );
}

export function Loop() {
  const [returned, setReturned] = useState<number>(LOOP_RULES.minCartridges);
  const reward = loopReward(returned);

  return (
    <section id="loop" className="relative overflow-hidden bg-mint/45 py-24 md:py-32">
      <div aria-hidden className="pointer-events-none absolute -right-40 -top-32 h-[34rem] w-[34rem] rounded-full bg-sun/60 blur-3xl" />
      <div aria-hidden className="pointer-events-none absolute -left-40 bottom-0 h-[30rem] w-[30rem] rounded-full bg-blush/50 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-6 md:px-12">
        <div className="grid items-center gap-10 md:grid-cols-[1.3fr_1fr]">
          <div>
            <SectionLabel n="06">LUMI LOOP</SectionLabel>
            <RevealText
              text={"Mail it back.\nKeep it going."}
              accent={["going."]}
              accentClass="text-leaf"
              className="mt-4 font-display text-[clamp(3rem,8.5vw,7.5rem)] font-extrabold leading-[0.95] tracking-[-0.04em]"
            />
            <Reveal delay={0.2}>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-plum-soft md:text-xl">
                The proposed model: collect{" "}
                <strong className="text-plum">
                  {LOOP_RULES.minCartridges} to {LOOP_RULES.maxCartridges} empty cartridges
                </strong>
                , mail them back to us, and we plan to <strong className="text-plum">recycle and reuse</strong> them. You
                earn <strong className="text-plum">reward points and coupons</strong> for closing the loop.
              </p>
              <StatusTag kind="proposed" label="Proposed model, nothing is running yet" className="mt-5" />
            </Reveal>
          </div>
          <Reveal pop>
            <div className="rounded-[2.5rem] bg-white/70 p-6 shadow-soft backdrop-blur">
              <LoopOrbit />
              <p className="mt-4 text-center font-display text-lg font-bold">Send back. Reuse. Get rewarded.</p>
            </div>
          </Reveal>
        </div>

        <div className="mt-16 grid items-stretch gap-4 md:grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr]">
          {LOOP_STEPS.map((step, i) => (
            <div key={step.title} className="contents">
              <Reveal delay={i * 0.12}>
                <article className="relative h-full overflow-hidden rounded-[1.75rem] bg-white p-6 pt-8 shadow-soft">
                  <div aria-hidden className={cn("absolute inset-x-0 top-0 h-3", step.tone)} />
                  <p className="text-[0.68rem] font-bold uppercase tracking-[0.18em] text-plum-soft">Step {i + 1}</p>
                  <h3 className="mt-1 font-display text-xl font-bold leading-tight tracking-tight">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-plum-soft">{step.body}</p>
                </article>
              </Reveal>
              {i < LOOP_STEPS.length - 1 && (
                <motion.div
                  aria-hidden
                  initial={{ opacity: 0, x: -8 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + i * 0.12 }}
                  className="hidden items-center justify-center md:flex"
                >
                  <ArrowRight size={26} strokeWidth={2.6} />
                </motion.div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_1.15fr]">
          <Reveal>
            <div className="flex h-full flex-col justify-between rounded-[2.25rem] bg-white p-8 shadow-soft md:p-10">
              <div>
                <p className="font-display text-[clamp(2.4rem,5vw,4rem)] font-extrabold leading-none tracking-tight text-leaf">
                  Points and coupons
                </p>
                <p className="mt-5 leading-relaxed text-plum-soft">
                  Every returned cartridge earns Loop Points. Points would turn into coupons on your next refill, and a
                  full pack of {LOOP_RULES.maxCartridges} would also unlock a free collectible charm. The values on this
                  page are illustrative and will be set once the programme is designed.
                </p>
              </div>
              <p className="mt-6 inline-flex items-center gap-2 text-sm font-semibold">
                <Recycle size={18} className="text-leaf" aria-hidden />
                Reused only where testing shows it is safe. Everything else is recycled.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="rounded-[2.25rem] bg-plum p-8 text-cream shadow-lift md:p-10">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-[0.7rem] font-bold uppercase tracking-[0.2em] text-sun">Illustrative rewards</p>
                <StatusTag kind="assumption" tone="ghost" />
              </div>
              <label htmlFor="returned" className="mt-5 block text-lg">
                If you mailed back <strong className="font-display text-2xl text-sun">{returned}</strong> cartridges…
              </label>
              <input
                id="returned"
                type="range"
                min={LOOP_RULES.minCartridges}
                max={LOOP_RULES.maxCartridges}
                step={1}
                value={returned}
                onChange={(e) => setReturned(Number(e.target.value))}
                className="lumi-range mt-4 w-full"
              />
              <div className="mt-8 grid grid-cols-2 gap-4">
                <div className="rounded-3xl bg-cream/10 p-5">
                  <p className="font-display text-4xl font-extrabold tracking-tight md:text-5xl">
                    <AnimatedNumber value={reward.points} />
                  </p>
                  <p className="mt-1 text-sm text-cream/70">Loop Points</p>
                </div>
                <div className="rounded-3xl bg-cream/10 p-5">
                  <p className="font-display text-lg font-extrabold leading-snug tracking-tight">{reward.perk}</p>
                  <p className="mt-1 text-sm text-cream/70">would be unlocked</p>
                </div>
              </div>
              <p className="mt-4 text-xs text-cream/60">
                {LOOP_RULES.pointsPerCartridge} points per cartridge, plus {LOOP_RULES.bonusPointsAtMax} bonus points for a full
                pack of {LOOP_RULES.maxCartridges}. A thought experiment, not an offer.
              </p>
            </div>
          </Reveal>
        </div>

        <Reveal className="mt-6">
          <div className="flex flex-col gap-4 rounded-[2rem] border-2 border-plum bg-sun p-7 md:flex-row md:items-center md:gap-8 md:p-9">
            <StatusTag kind="prospective" tone="plum" className="shrink-0 self-start" />
            <p className="leading-relaxed">
              <strong>The LUMI Loop is a proposal, not a live programme.</strong> No return scheme, recycling partner or
              reward system has been set up or confirmed, and <strong>no cartridges are being collected yet</strong>. Reuse
              depends on safety and regulatory testing.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
