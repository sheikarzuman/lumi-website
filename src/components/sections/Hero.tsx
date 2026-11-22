"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import { ProductArt } from "@/components/product/ProductArt";
import { ProductCanvas } from "@/components/three/ProductCanvas";
import { INITIAL_SCENE_STATE, type SceneState } from "@/components/three/LumiModel";
import { useIntro } from "@/components/layout/ClientShell";
import { Button } from "@/components/ui/Button";
import { RevealText } from "@/components/ui/RevealText";
import { usePointerParallax } from "@/hooks/usePointerParallax";
import { cn } from "@/lib/cn";
import { TAGLINE, VARIANTS } from "@/lib/lumi";
import { SHOWCASE_SHELLS } from "@/lib/rarity";

const WORDMARK = ["L", "U", "M", "I"];
const CYCLE_MS = 4200;
/** The shell shown when the page opens; the auto-cycle then continues from here. */
const FIRST_SHELL_INDEX = Math.max(0, SHOWCASE_SHELLS.findIndex((s) => s.id === "aurora"));

interface FloaterSpec {
  variant: number;
  className: string;
  rotate: number;
  depth: number;
  delay: number;
}

const FLOATERS: FloaterSpec[] = [
  { variant: 0, className: "left-[3%] top-[22%] w-[22vw] max-w-[190px]", rotate: -16, depth: 34, delay: 0 },
  { variant: 1, className: "right-[4%] top-[17%] w-[20vw] max-w-[170px]", rotate: 14, depth: -28, delay: 1.2 },
  { variant: 3, className: "left-[9%] bottom-[30%] hidden w-[14vw] max-w-[120px] md:block", rotate: 12, depth: 22, delay: 2.1 },
  { variant: 4, className: "right-[8%] bottom-[28%] hidden w-[15vw] max-w-[140px] md:block", rotate: -12, depth: -18, delay: 0.6 },
  { variant: 2, className: "left-[36%] top-[7%] hidden w-[9vw] max-w-[78px] opacity-80 md:block", rotate: 8, depth: 48, delay: 1.7 },
  { variant: 5, className: "right-[32%] top-[9%] hidden w-[8vw] max-w-[68px] opacity-80 md:block", rotate: -10, depth: -44, delay: 2.6 },
];

function Floater({
  spec,
  mx,
  my,
  scrollY,
  ready,
}: {
  spec: FloaterSpec;
  mx: MotionValue<number>;
  my: MotionValue<number>;
  scrollY: MotionValue<number>;
  ready: boolean;
}) {
  const v = VARIANTS[spec.variant];
  const x = useTransform(mx, (n) => n * spec.depth * 2);
  const y = useTransform([my, scrollY], ([a, b]: number[]) => a * spec.depth * 2 - b * spec.depth * 6);

  return (
    <motion.div style={{ x, y }} className={cn("pointer-events-none absolute z-10", spec.className)}>
      <motion.div
        initial={{ scale: 0, opacity: 0, rotate: spec.rotate - 40 }}
        animate={ready ? { scale: 1, opacity: 1, rotate: 0 } : undefined}
        transition={{ type: "spring", stiffness: 90, damping: 14, delay: 0.5 + spec.delay * 0.12 }}
      >
        <div
          className="animate-float-slow drop-shadow-[0_22px_24px_rgba(59,38,73,0.22)]"
          style={{ "--r": `${spec.rotate}deg`, animationDelay: `${-spec.delay * 2}s` } as React.CSSProperties}
        >
          <ProductArt shell={v.shell} deep={v.deep} charm={v.charm} title={`${v.name} LUMI (concept visual)`} />
        </div>
      </motion.div>
    </motion.div>
  );
}

export function Hero() {
  const { ready } = useIntro();
  const sectionRef = useRef<HTMLElement>(null);
  const scene = useRef<SceneState>({ ...INITIAL_SCENE_STATE });
  const [colorIdx, setColorIdx] = useState(FIRST_SHELL_INDEX);
  const [auto, setAuto] = useState(true);
  const { x: mx, y: my } = usePointerParallax();

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end start"] });
  const wordY = useTransform(scrollYProgress, [0, 1], [0, 220]);
  const wordScale = useTransform(scrollYProgress, [0, 1], [1, 1.12]);
  const sunRotate = useTransform(scrollYProgress, [0, 1], [0, 90]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.55], [1, 0]);

  // feed pointer into the 3D scene without re-rendering React
  useEffect(() => {
    const offX = mx.on("change", (v) => (scene.current.px = v));
    const offY = my.on("change", (v) => (scene.current.py = v));
    return () => {
      offX();
      offY();
    };
  }, [mx, my]);

  // cycle through the six shells until the visitor picks one
  useEffect(() => {
    if (!auto || !ready) return;
    const id = window.setInterval(() => setColorIdx((i) => (i + 1) % SHOWCASE_SHELLS.length), CYCLE_MS);
    return () => window.clearInterval(id);
  }, [auto, ready]);

  const variant = SHOWCASE_SHELLS[colorIdx];

  return (
    <section id="top" ref={sectionRef} className="grain relative isolate min-h-[100svh] overflow-hidden">
      <div aria-hidden className="bg-aurora absolute inset-0 -z-20" />

      {/* sunlight */}
      <motion.div
        aria-hidden
        style={{ rotate: sunRotate }}
        className="pointer-events-none absolute -right-[18%] -top-[30%] -z-10 aspect-square w-[85vmax]"
      >
        <div className="sun-rays animate-spin-slow absolute inset-0" />
      </motion.div>
      <div
        aria-hidden
        className="animate-breathe pointer-events-none absolute -right-[6%] -top-[10%] -z-10 aspect-square w-[44vmax] rounded-full bg-[radial-gradient(circle,#fff3bf_0%,rgba(255,230,154,0.55)_38%,transparent_68%)]"
      />

      {/* wordmark */}
      <motion.div
        aria-hidden
        style={{ y: wordY, scale: wordScale }}
        className="pointer-events-none absolute inset-x-0 top-[12svh] z-0 flex select-none justify-center"
      >
        <div className="flex font-display text-[min(31vw,27rem)] font-extrabold leading-[0.9] tracking-[-0.05em] text-plum">
          {WORDMARK.map((l, i) => (
            <span key={l} className="inline-block overflow-hidden pb-[0.06em]">
              <motion.span
                className="inline-block"
                initial={{ y: "110%", rotate: 6 }}
                animate={ready ? { y: 0, rotate: 0 } : undefined}
                transition={{ duration: 1.1, ease: [0.2, 0.8, 0.2, 1], delay: 0.1 + i * 0.1 }}
              >
                {l}
              </motion.span>
            </span>
          ))}
        </div>
      </motion.div>

      {FLOATERS.map((f) => (
        <Floater key={f.variant} spec={f} mx={mx} my={my} scrollY={scrollYProgress} ready={ready} />
      ))}

      {/* 3D hero product */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={ready ? { opacity: 1 } : undefined}
        transition={{ duration: 1.2, ease: [0.2, 0.8, 0.2, 1], delay: 0.35 }}
        className="pointer-events-none absolute inset-x-0 top-[10svh] z-20 h-[44svh] md:top-0 md:h-[min(100svh,860px)]"
      >
        <ProductCanvas
          variant={variant}
          finish={variant.finish}
          state={scene}
          className="h-full w-full"
          fallback={
            <div className="grid h-full place-items-center">
              <div className="w-[min(60vw,320px)] animate-float">
                <ProductArt shell={variant.shell} deep={variant.deep} charm={variant.charm} finish={variant.finish} />
              </div>
            </div>
          }
        />
      </motion.div>

      {/* copy + CTAs */}
      <motion.div
        style={{ opacity: contentOpacity }}
        className="absolute inset-x-0 bottom-0 z-30 grid items-end gap-8 px-6 pb-8 md:grid-cols-[minmax(0,34rem)_1fr] md:px-12 md:pb-12"
      >
        <div>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={ready ? { opacity: 1, y: 0 } : undefined}
            transition={{ delay: 0.9, duration: 0.8 }}
            className="mb-3 max-w-md rounded-2xl bg-sun/90 px-4 py-2.5 text-[0.8rem] leading-snug shadow-soft backdrop-blur md:mb-4 md:py-3 md:text-sm"
          >
            <strong className="font-bold">Concept stage:</strong> formulation, manufacturer and NGO partner are not yet
            finalised.
          </motion.p>
          <RevealText
            as="h1"
            text={TAGLINE}
            play={ready}
            delay={0.7}
            accent={["wherever"]}
            className="font-display text-[clamp(1.9rem,4.6vw,3.5rem)] font-bold leading-[1.06] tracking-tight"
          />
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={ready ? { opacity: 1, y: 0 } : undefined}
            transition={{ delay: 1.35, duration: 0.8 }}
            className="mt-6 flex flex-wrap items-center gap-3"
          >
            <Button href="#problem">Discover LUMI</Button>
            <Button href="#meet" variant="ghost">
              Explore the Product
            </Button>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={ready ? { opacity: 1 } : undefined}
          transition={{ delay: 1.6 }}
          className="flex items-end justify-between gap-6 md:flex-col md:items-end md:justify-end"
        >
          <div className="hidden rounded-3xl bg-cream/70 p-3 shadow-soft backdrop-blur-md sm:block">
            <p className="mb-2 px-1 text-[0.68rem] font-bold uppercase tracking-[0.18em] text-plum-soft">
              Shell · {variant.name}
            </p>
            <div className="flex gap-2" role="group" aria-label="Choose a shell colour">
              {SHOWCASE_SHELLS.map((v, i) => (
                <button
                  key={v.id}
                  aria-label={`${v.name} shell`}
                  aria-pressed={i === colorIdx}
                  onClick={() => {
                    setAuto(false);
                    setColorIdx(i);
                  }}
                  className={cn(
                    "h-7 w-7 rounded-full border-2 transition-transform hover:scale-110",
                    i === colorIdx ? "scale-110 border-plum" : "border-cream",
                  )}
                  style={{ background: v.shell }}
                />
              ))}
            </div>
          </div>
          <div className="hidden items-center gap-3 text-xs font-semibold uppercase tracking-[0.22em] md:flex">
            Scroll
            <span className="relative block h-12 w-px overflow-hidden bg-plum/20">
              <motion.span
                className="absolute inset-x-0 top-0 h-5 bg-plum"
                animate={{ y: ["-100%", "260%"] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
              />
            </span>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
