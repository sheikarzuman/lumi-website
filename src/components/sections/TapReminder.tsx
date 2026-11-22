"use client";

import { ArrowUpRight, BellRing, CloudSun, Nfc } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { RevealText } from "@/components/ui/RevealText";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { StatusTag } from "@/components/ui/StatusTag";
import { TAP_STEPS } from "@/lib/lumi";

const STEP_ICONS = [Nfc, CloudSun, BellRing] as const;
const DEMO_HREF = "/app?shell=golden-hour";

export function TapReminder() {
  return (
    <section id="tap" className="relative overflow-hidden bg-cream py-24 md:py-32">
      <div aria-hidden className="pointer-events-none absolute -left-32 top-10 h-96 w-96 rounded-full bg-sky/50 blur-3xl" />
      <div className="relative mx-auto max-w-6xl px-6 md:px-12">
        <SectionLabel n="05c">Tap to remind</SectionLabel>
        <RevealText
          text={"Tap your LUMI.\nWe'll remind you."}
          accent={["remind", "you."]}
          accentClass="text-berry"
          className="mt-4 font-display text-[clamp(2rem,4.4vw,3.8rem)] font-bold leading-[1.04] tracking-tight"
        />
        <p className="mt-5 max-w-2xl text-lg text-plum/75">
          A passive RFID chip sits in the cap, with no battery. Hold your phone to it and the LUMI app checks your live UV
          Index and weather: on a high-UV day it sets a shorter reapply timer, and on a rainy or overcast day with low UV it
          tells you to skip it.
        </p>

        <ol className="mt-12 grid gap-5 md:grid-cols-3">
          {TAP_STEPS.map((step, i) => {
            const Icon = STEP_ICONS[i];
            return (
              <Reveal key={step.title} delay={i * 0.1}>
                <li className={`h-full list-none rounded-[2rem] p-7 ${step.tone}`}>
                  <span className="grid h-12 w-12 place-items-center rounded-full bg-cream/80">
                    <Icon size={22} />
                  </span>
                  <p className="mt-5 text-[0.7rem] font-bold uppercase tracking-[0.2em] text-plum/60">Step {i + 1}</p>
                  <h3 className="mt-1 font-display text-2xl font-extrabold tracking-tight">{step.title}</h3>
                  <p className="mt-2 text-plum/75">{step.body}</p>
                </li>
              </Reveal>
            );
          })}
        </ol>

        <div className="mt-10 flex flex-wrap items-center gap-4">
          <a
            href={DEMO_HREF}
            className="inline-flex items-center gap-2 rounded-full bg-plum px-7 py-4 font-semibold text-cream shadow-soft transition-transform hover:scale-[1.03]"
          >
            Try the reminder app
            <ArrowUpRight size={18} strokeWidth={2.4} />
          </a>
          <StatusTag kind="proposed" label="Proposed feature. Prototype app only" />
        </div>
      </div>
    </section>
  );
}
