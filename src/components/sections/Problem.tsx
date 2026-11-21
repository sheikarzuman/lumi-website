"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Backpack, Hand, Sparkles } from "lucide-react";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";
import { Reveal } from "@/components/ui/Reveal";
import { RevealText } from "@/components/ui/RevealText";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { cn } from "@/lib/cn";
import { MARKET_STATS, PAIN_POINTS, PROBLEM_STAGES, TARGET_CONSUMERS } from "@/lib/lumi";
import { ProblemScene } from "./ProblemScene";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const PAIN_ICONS = [Hand, Backpack, Sparkles];
const PERSON_HOME_X = 232;
const PERSON_AWAY_X = 890;
const FEET_Y = 540;
const HAND_Y = 462;

export function Problem() {
  const root = useRef<HTMLElement>(null);
  const pin = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(
        {
          motion: "(prefers-reduced-motion: no-preference)",
          reduce: "(prefers-reduced-motion: reduce)",
        },
        (ctx) => {
          const { reduce } = ctx.conditions as { reduce: boolean };
          const caps = gsap.utils.toArray<HTMLElement>(".ps-cap");
          const dots = gsap.utils.toArray<HTMLElement>(".ps-dot");

          gsap.set(".ps-sun", { x: 520, y: 480, scale: 0.85 });
          gsap.set(".ps-person", { x: PERSON_HOME_X, y: FEET_Y });
          gsap.set(".ps-spark", { transformOrigin: "50% 50%", scale: 0, opacity: 0 });
          gsap.set(".ps-bubble", { transformOrigin: "0px -228px", scale: 0.4, opacity: 0 });
          gsap.set(caps.slice(1), { autoAlpha: 0, y: 28 });

          if (reduce) {
            // static fallback: show the final frame's story without scroll-driven motion
            gsap.set(".ps-sun", { x: 760, y: 130 });
            gsap.set(".ps-sky-noon", { opacity: 1 });
            gsap.set(".ps-person", { x: PERSON_AWAY_X });
            gsap.set(".ps-bubble", { opacity: 1, scale: 1 });
            gsap.set(".ps-bottle", { opacity: 0 });
            gsap.set(".ps-meter", { attr: { width: 20 }, fill: "#C2477A" });
            gsap.set(caps, { autoAlpha: 0 });
            gsap.set(caps[3], { autoAlpha: 1, y: 0 });
            return;
          }

          gsap.to(".ps-rays", { rotation: 360, duration: 40, repeat: -1, ease: "none", transformOrigin: "50% 50%" });

          const hand = root.current?.querySelector<SVGLineElement>(".ps-hand");
          const clock = { angle: 0 };
          const tether = root.current?.querySelector<SVGLineElement>(".ps-tether");
          const person = { x: PERSON_HOME_X };

          const tl = gsap.timeline({
            defaults: { ease: "none" },
            scrollTrigger: {
              trigger: pin.current,
              start: "top top",
              end: "+=340%",
              scrub: 0.7,
              pin: true,
              anticipatePin: 1,
            },
          });

          // ---- stage 1 (0 → 1): applied at home ----
          tl.to(".ps-spark", { scale: 1, opacity: 1, duration: 0.2, stagger: 0.06, ease: "back.out(2)" }, 0.1)
            .to(".ps-spark", { scale: 0, opacity: 0, duration: 0.2, stagger: 0.05 }, 0.65)
            .to(".ps-sun", { x: 570, y: 340, scale: 1, duration: 1, ease: "power1.out" }, 0)
            .to(".ps-cloud", { x: 60, duration: 4 }, 0)
            .to(".ps-cloud-2", { x: -80, duration: 4 }, 0);

          // ---- stage 2 (1 → 2): into the drawer, out the door ----
          tl.to(".ps-drawer", { x: 44, duration: 0.25, ease: "power2.out" }, 1)
            .to(".ps-drawer-knob", { x: 44, duration: 0.25, ease: "power2.out" }, 1)
            .to(".ps-bottle", { y: 46, opacity: 0, duration: 0.35, ease: "power2.in" }, 1.25)
            .to([".ps-drawer", ".ps-drawer-knob"], { x: 0, duration: 0.25, ease: "power2.inOut" }, 1.6)
            .to(person, { x: 560, duration: 1, onUpdate: () => syncPerson() }, 1)
            .to(".ps-person", { x: 560, duration: 1 }, 1)
            .to(".ps-sun", { x: 650, y: 230, duration: 1, ease: "power1.inOut" }, 1)
            .to(".ps-sky-noon", { opacity: 0.55, duration: 1 }, 1)
            .to(".ps-meter", { attr: { width: 230 }, fill: "#C8D86B", duration: 1 }, 1)
            .to(".ps-bob", { y: -9, duration: 0.125, repeat: 7, yoyo: true, ease: "sine.inOut" }, 1);

          // ---- stage 3 (2 → 3): hours outdoors ----
          tl.to(person, { x: PERSON_AWAY_X, duration: 1, onUpdate: () => syncPerson() }, 2)
            .to(".ps-person", { x: PERSON_AWAY_X, duration: 1 }, 2)
            .to(".ps-sun", { x: 790, y: 120, duration: 1, ease: "power1.inOut" }, 2)
            .to(".ps-sky-noon", { opacity: 1, duration: 1 }, 2)
            .to(".ps-meter", { attr: { width: 120 }, fill: "#FFC93C", duration: 1 }, 2)
            .to(".ps-sun-glow", { scale: 1.35, duration: 1 }, 2)
            .to(".ps-bob", { y: -9, duration: 0.125, repeat: 7, yoyo: true, ease: "sine.inOut" }, 2);

          // ---- stage 4 (3 → 4): reapplication skipped ----
          tl.to(".ps-bubble", { scale: 1, opacity: 1, duration: 0.3, ease: "back.out(2)" }, 3.15)
            .to(".ps-meter", { attr: { width: 22 }, fill: "#C2477A", duration: 0.8 }, 3)
            .to(".ps-mouth-happy", { opacity: 0, duration: 0.1 }, 3.2)
            .to(".ps-mouth-flat", { opacity: 1, duration: 0.1 }, 3.2)
            .to(".ps-still", { opacity: 1, duration: 0.3 }, 3.3)
            .to(".ps-tether", { opacity: 0.25, duration: 0.5 }, 3.3);

          // continuous clock: 0 → 3 turns across stages 2–4
          tl.to(
            clock,
            {
              angle: 1080,
              duration: 3,
              onUpdate: () => hand?.setAttribute("transform", `rotate(${clock.angle})`),
            },
            1,
          );

          // ---- captions + step dots ----
          [0, 1, 2].forEach((i) => {
            const at = i + 0.88;
            tl.to(caps[i], { autoAlpha: 0, y: -28, duration: 0.18, ease: "power1.in" }, at)
              .fromTo(caps[i + 1], { autoAlpha: 0, y: 28 }, { autoAlpha: 1, y: 0, duration: 0.25, ease: "power1.out" }, at + 0.1)
              .to(dots[i], { scale: 1, opacity: 0.35, duration: 0.2 }, at)
              .to(dots[i + 1], { scale: 1.5, opacity: 1, duration: 0.2 }, at + 0.1);
          });
          tl.to({}, { duration: 0.01 }, 4); // hold the final frame

          function syncPerson() {
            // keeps the dashed tether anchored to the dresser and the person's hand
            tether?.setAttribute("x2", String(person.x + 38));
            tether?.setAttribute("y2", String(HAND_Y));
          }
        },
      );

      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section id="problem" ref={root} className="relative bg-cream">
      {/* ---------- pinned storytelling ---------- */}
      <div ref={pin} className="relative h-[100svh] min-h-[620px] overflow-hidden">
        <div className="absolute inset-0 grid grid-rows-[auto_minmax(0,1fr)] md:grid-cols-[minmax(0,0.85fr)_minmax(0,1.5fr)] md:grid-rows-1">
          <div className="relative z-10 flex flex-col justify-center px-6 pt-24 md:px-12 md:pt-0">
            <SectionLabel n="02">The problem</SectionLabel>
            <RevealText
              text={"Sunscreen is hard to\ncarry and reapply."}
              accent={["reapply."]}
              className="mt-4 font-display text-[clamp(1.8rem,4vw,3.6rem)] font-bold leading-[1.04] tracking-tight"
            />

            <div className="relative mt-5 h-[7.5rem] md:mt-8 md:h-44">
              {PROBLEM_STAGES.map((s, i) => (
                <div key={s.step} className="ps-cap absolute inset-0">
                  <p className="flex items-center gap-3 text-sm font-bold uppercase tracking-[0.2em] text-berry">
                    <span className="font-display">{s.step}</span>
                    <span aria-hidden className="h-px w-8 bg-berry" />
                    {s.title}
                  </p>
                  <p className="mt-3 max-w-sm text-base leading-relaxed text-plum-soft md:text-lg">{s.body}</p>
                  {i === 0 && <span className="sr-only">Scroll to continue the story.</span>}
                </div>
              ))}
            </div>

            <div className="mt-2 flex gap-2" aria-hidden>
              {PROBLEM_STAGES.map((s, i) => (
                <span
                  key={s.step}
                  className="ps-dot h-2.5 w-2.5 rounded-full bg-plum"
                  style={{ transform: i === 0 ? "scale(1.5)" : undefined, opacity: i === 0 ? 1 : 0.35 }}
                />
              ))}
            </div>
          </div>

          <div className="relative flex items-center px-4 pb-6 md:px-0 md:pb-0 md:pr-10">
            <div className="w-full overflow-hidden rounded-[2rem] shadow-lift ring-4 ring-cream md:rounded-[2.75rem]">
              <ProblemScene />
            </div>
          </div>
        </div>
      </div>

      {/* ---------- why it happens ---------- */}
      <div className="mx-auto max-w-7xl px-6 py-24 md:px-12 md:py-32">
        <Reveal>
          <h3 className="max-w-2xl font-display text-3xl font-bold leading-tight tracking-tight md:text-5xl">
            Three small frictions. <span className="text-berry">One skipped reapplication.</span>
          </h3>
        </Reveal>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {PAIN_POINTS.map((p, i) => {
            const Icon = PAIN_ICONS[i];
            return (
              <Reveal key={p.title} delay={i * 0.12}>
                <article className="relative h-full overflow-hidden rounded-[2rem] bg-white p-8 pt-10 shadow-soft transition-transform duration-500 hover:-translate-y-2">
                  <div aria-hidden className={cn("absolute inset-x-0 top-0 h-3", p.tone)} />
                  <span className={cn("mb-6 grid h-12 w-12 place-items-center rounded-2xl", p.tone)}>
                    <Icon size={22} strokeWidth={2.2} />
                  </span>
                  <h4 className="font-display text-2xl font-bold tracking-tight">{p.title}</h4>
                  <p className="mt-3 leading-relaxed text-plum-soft">{p.body}</p>
                </article>
              </Reveal>
            );
          })}
        </div>

        <Reveal delay={0.1} className="mt-8">
          <div className="rounded-[2rem] bg-plum p-7 text-cream md:p-9">
            <p className="max-w-4xl text-lg leading-relaxed md:text-xl">
              <span className="font-bold text-sun">To validate in Phase 1: </span>
              a consumer survey and interviews with students and young professionals will test how often reapplication
              is skipped, and why.
            </p>
          </div>
        </Reveal>

        {/* ---------- market ---------- */}
        <div className="mt-28">
          <Reveal>
            <h3 className="font-display text-3xl font-bold tracking-tight md:text-5xl">
              A growing market with a <span className="text-berry">convenience gap.</span>
            </h3>
          </Reveal>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {MARKET_STATS.map((s, i) => (
              <Reveal key={s.label} delay={i * 0.1} pop>
                <div className="relative h-full overflow-hidden rounded-[2rem] bg-white p-8 pt-10 shadow-soft">
                  <div aria-hidden className={cn("absolute inset-x-0 top-0 h-3", s.tone)} />
                  <p className="font-display text-5xl font-extrabold tracking-tight md:text-6xl">
                    <AnimatedNumber value={s.value} decimals={s.decimals} prefix={s.prefix} suffix={s.suffix} />
                  </p>
                  <p className="mt-4 leading-relaxed text-plum-soft">{s.label}</p>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal>
            <p className="mb-4 mt-12 text-sm font-bold uppercase tracking-[0.2em] text-plum-soft">
              Initial target consumers (to be validated)
            </p>
          </Reveal>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {TARGET_CONSUMERS.map((t, i) => (
              <Reveal key={t.title} delay={i * 0.08}>
                <div className={cn("h-full rounded-3xl p-6", t.tone)}>
                  <h4 className="font-display text-lg font-bold leading-snug">{t.title}</h4>
                  <p className="mt-1 text-sm text-plum/80">{t.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <p className="mt-6 text-sm text-plum-soft">
            Source: Grand View Research, India Sunscreen Market Report (2025). Estimates differ by publisher; to be
            cross-checked.
          </p>
        </div>
      </div>
    </section>
  );
}
