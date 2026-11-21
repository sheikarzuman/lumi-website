"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { ArrowRight, HeartHandshake } from "lucide-react";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";
import { Reveal } from "@/components/ui/Reveal";
import { RevealText } from "@/components/ui/RevealText";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { StatusTag } from "@/components/ui/StatusTag";
import { cn } from "@/lib/cn";
import { CARES_FLOW, CARES_MODEL } from "@/lib/lumi";

const MAX_CARTRIDGES = 3000;
const DOTS = 40;
const MEALS_PER_DOT = MAX_CARTRIDGES / CARES_MODEL.cartridgesPerMeal / DOTS;

/** Three cartridges fold into one plate, on a loop: the "1 meal for every 3" idea in motion. */
function MealLoop() {
  const xs = [34, 112, 190];
  return (
    <svg viewBox="0 0 340 170" className="mx-auto block h-auto w-full max-w-sm" role="img" aria-label="Three cartridges become one meal">
      {xs.map((x, i) => (
        <motion.g
          key={x}
          animate={{ x: [0, 0, 134 - x, 134 - x], scale: [1, 1, 0.3, 0.3], opacity: [1, 1, 1, 0] }}
          transition={{ duration: 4.6, repeat: Infinity, times: [0, 0.22 + i * 0.03, 0.55, 0.6], ease: "easeInOut" }}
          style={{ transformOrigin: `${x + 34}px 80px` }}
        >
          <rect x={x} y="36" width="68" height="104" rx="22" fill="#B9E4CD" stroke="#3B2649" strokeWidth="4" />
          <rect x={x + 12} y="76" width="44" height="52" rx="14" fill="#E6F6EE" />
          <rect x={x + 22} y="22" width="24" height="16" rx="6" fill="#B9E4CD" stroke="#3B2649" strokeWidth="4" />
        </motion.g>
      ))}
      <motion.g
        animate={{ scale: [0, 0, 1.1, 1, 1, 0], opacity: [0, 0, 1, 1, 1, 0] }}
        transition={{ duration: 4.6, repeat: Infinity, times: [0, 0.55, 0.68, 0.74, 0.94, 1], ease: "easeOut" }}
        style={{ transformOrigin: "168px 92px" }}
      >
        <circle cx="168" cy="92" r="56" fill="#fff" stroke="#3B2649" strokeWidth="4" />
        <circle cx="168" cy="92" r="36" fill="#FFE69A" stroke="#3B2649" strokeWidth="3.5" />
        <path d="M150 92 Q168 70 186 92 Q168 114 150 92 Z" fill="#F5B2C7" stroke="#3B2649" strokeWidth="3" />
        <circle cx="168" cy="92" r="6" fill="#3B2649" />
      </motion.g>
    </svg>
  );
}

export function Cares() {
  const [cartridges, setCartridges] = useState(1500);
  const meals = Math.floor(cartridges / CARES_MODEL.cartridgesPerMeal);
  const rupees = cartridges * CARES_MODEL.rupeesPerCartridge;
  const kits = cartridges / CARES_MODEL.cartridgesPerKit;
  const filled = Math.round(meals / MEALS_PER_DOT);

  return (
    <section id="cares" className="relative overflow-hidden bg-mint/45 py-24 md:py-32">
      <div aria-hidden className="pointer-events-none absolute -right-40 -top-32 h-[34rem] w-[34rem] rounded-full bg-sun/60 blur-3xl" />
      <div aria-hidden className="pointer-events-none absolute -left-40 bottom-0 h-[30rem] w-[30rem] rounded-full bg-blush/50 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-6 md:px-12">
        <div className="grid items-center gap-10 md:grid-cols-[1.3fr_1fr]">
          <div>
            <SectionLabel n="06">LUMI CARES</SectionLabel>
            <RevealText
              text={"Glow on.\nGive back."}
              accent={["back."]}
              accentClass="text-leaf"
              className="mt-4 font-display text-[clamp(3rem,8.5vw,7.5rem)] font-extrabold leading-[0.95] tracking-[-0.04em]"
            />
            <Reveal delay={0.2}>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-plum-soft md:text-xl">
                The proposed model: for every <strong className="text-plum">three LUMI cartridges</strong> sold, we plan
                to fund <strong className="text-plum">one meal</strong> for a child in need.
              </p>
              <StatusTag kind="proposed" label="Proposed model, nothing funded yet" className="mt-5" />
            </Reveal>
          </div>
          <Reveal pop>
            <div className="rounded-[2.5rem] bg-white/70 p-6 shadow-soft backdrop-blur">
              <MealLoop />
              <p className="mt-2 text-center font-display text-lg font-bold">3 cartridges → 1 meal</p>
            </div>
          </Reveal>
        </div>

        {/* flow */}
        <div className="mt-16 grid items-stretch gap-4 md:grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr]">
          {CARES_FLOW.map((step, i) => (
            <div key={step.title} className="contents">
              <Reveal delay={i * 0.12}>
                <article className="relative h-full overflow-hidden rounded-[1.75rem] bg-white p-6 pt-8 shadow-soft">
                  <div aria-hidden className={cn("absolute inset-x-0 top-0 h-3", step.tone)} />
                  <h3 className="font-display text-xl font-bold leading-tight tracking-tight">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-plum-soft">{step.body}</p>
                  {i === 2 && <StatusTag kind="prospective" className="mt-4" />}
                </article>
              </Reveal>
              {i < CARES_FLOW.length - 1 && (
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

        {/* numbers + calculator */}
        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_1.15fr]">
          <Reveal>
            <div className="flex h-full flex-col justify-between rounded-[2.25rem] bg-white p-8 shadow-soft md:p-10">
              <div>
                <p className="font-display text-[clamp(2.6rem,5.5vw,4.4rem)] font-extrabold leading-none tracking-tight text-leaf">
                  ₹{CARES_MODEL.rupeesPerCartridge} per cartridge
                </p>
                <p className="mt-5 leading-relaxed text-plum-soft">
                  Budgeted at ₹{CARES_MODEL.rupeesPerMeal} per meal across {CARES_MODEL.cartridgesPerMeal} cartridges, so
                  a starter kit (two cartridges) carries ₹{CARES_MODEL.rupeesPerCartridge * CARES_MODEL.cartridgesPerKit}.
                  It is already included in the unit economics. The final rate will be agreed with the partner.
                </p>
              </div>
              <p className="mt-6 inline-flex items-center gap-2 text-sm font-semibold">
                <HeartHandshake size={18} className="text-berry" />
                Proposed: a QR on pack linking to a quarterly report of meals funded and delivered.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="rounded-[2.25rem] bg-plum p-8 text-cream shadow-lift md:p-10">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-[0.7rem] font-bold uppercase tracking-[0.2em] text-sun">Illustrative calculator</p>
                <StatusTag kind="assumption" tone="ghost" />
              </div>
              <label htmlFor="cartridges" className="mt-5 block text-lg">
                If <strong className="font-display text-2xl text-sun">{cartridges.toLocaleString("en-IN")}</strong>{" "}
                cartridges were sold…
              </label>
              <input
                id="cartridges"
                type="range"
                min={0}
                max={MAX_CARTRIDGES}
                step={3}
                value={cartridges}
                onChange={(e) => setCartridges(Number(e.target.value))}
                className="lumi-range mt-4 w-full"
              />
              <div className="mt-8 grid grid-cols-2 gap-4">
                <div className="rounded-3xl bg-cream/10 p-5">
                  <p className="font-display text-4xl font-extrabold tracking-tight md:text-5xl">
                    <AnimatedNumber value={meals} />
                  </p>
                  <p className="mt-1 text-sm text-cream/70">meals would be funded</p>
                </div>
                <div className="rounded-3xl bg-cream/10 p-5">
                  <p className="font-display text-4xl font-extrabold tracking-tight md:text-5xl">
                    <AnimatedNumber value={rupees} prefix="₹" />
                  </p>
                  <p className="mt-1 text-sm text-cream/70">
                    contributed (≈ {Math.round(kits).toLocaleString("en-IN")} starter kits)
                  </p>
                </div>
              </div>
              <div className="mt-6 flex flex-wrap gap-1.5" aria-hidden>
                {Array.from({ length: DOTS }, (_, i) => (
                  <span
                    key={i}
                    className={cn(
                      "h-3 w-3 rounded-full transition-all duration-500",
                      i < filled ? "scale-100 bg-sun" : "scale-75 bg-cream/20",
                    )}
                    style={{ transitionDelay: `${i * 8}ms` }}
                  />
                ))}
              </div>
              <p className="mt-2 text-xs text-cream/60">Each dot ≈ {MEALS_PER_DOT} meals. A thought experiment, not a forecast.</p>
            </div>
          </Reveal>
        </div>

        {/* explicit disclosure */}
        <Reveal className="mt-6">
          <div className="flex flex-col gap-4 rounded-[2rem] border-2 border-plum bg-sun p-7 md:flex-row md:items-center md:gap-8 md:p-9">
            <StatusTag kind="prospective" tone="plum" className="shrink-0 self-start" />
            <p className="leading-relaxed">
              <strong>NGO partnerships are prospective, not confirmed.</strong> We are exploring established
              organisations, but no partner has been selected, no terms are agreed and <strong>no meals have been funded
              yet</strong>. The partner is set up in Phase 3 of the roadmap.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
