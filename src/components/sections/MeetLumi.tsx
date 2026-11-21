"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { ProductArt } from "@/components/product/ProductArt";
import { INITIAL_SCENE_STATE, type SceneState } from "@/components/three/LumiModel";
import { ProductCanvas } from "@/components/three/ProductCanvas";
import { RevealText } from "@/components/ui/RevealText";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { StatusTag } from "@/components/ui/StatusTag";
import { usePointerParallax } from "@/hooks/usePointerParallax";
import { cn } from "@/lib/cn";
import { PARTS, VARIANTS } from "@/lib/lumi";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/** Chip colours per part, matching the deck's component legend. */
const PART_CHIPS = ["bg-blush", "bg-mint", "bg-lavender", "bg-sun", "bg-cream border-2 border-plum"];
/** Yaw (radians) that turns each part toward the camera while it is highlighted. */
const PART_SPIN = [-0.35, 0.55, 0.1, 0.65, -0.15];

const EXPLODE_START = 0.12;
const EXPLODE_END = 0.38;
const TOUR_START = 0.3;
const TOUR_END = 0.82;

const smooth = (t: number) => t * t * (3 - 2 * t);

function explodeAt(p: number) {
  if (p < EXPLODE_START) return 0;
  if (p < EXPLODE_END) return smooth((p - EXPLODE_START) / (EXPLODE_END - EXPLODE_START));
  if (p < TOUR_END) return 1;
  return 1 - smooth((p - TOUR_END) / (1 - TOUR_END));
}

function activeAt(p: number) {
  if (p < TOUR_START || p >= TOUR_END) return -1;
  const idx = Math.floor(((p - TOUR_START) / (TOUR_END - TOUR_START)) * PARTS.length);
  return Math.min(PARTS.length - 1, idx);
}

export function MeetLumi() {
  const root = useRef<HTMLElement>(null);
  const pin = useRef<HTMLDivElement>(null);
  const scene = useRef<SceneState>({ ...INITIAL_SCENE_STATE });
  const [active, setActive] = useState(-1);
  const [colorIdx, setColorIdx] = useState(0);
  const { x: mx, y: my } = usePointerParallax();

  useEffect(() => {
    const offX = mx.on("change", (v) => (scene.current.px = v));
    const offY = my.on("change", (v) => (scene.current.py = v));
    return () => {
      offX();
      offY();
    };
  }, [mx, my]);

  useGSAP(
    () => {
      let last = -1;
      const trigger = ScrollTrigger.create({
        trigger: pin.current,
        start: "top top",
        end: "+=420%",
        pin: true,
        anticipatePin: 1,
        onUpdate: (self) => {
          const p = self.progress;
          scene.current.explode = explodeAt(p);
          const a = activeAt(p);
          if (a !== last) {
            last = a;
            setActive(a);
            gsap.to(scene.current, { spin: a >= 0 ? PART_SPIN[a] : p < 0.5 ? 0.25 : 0, duration: 1.1, ease: "power3.out", overwrite: true });
          }
        },
      });
      // gentle intro turn so the product reads as 3D before any scrolling
      gsap.fromTo(scene.current, { spin: -0.6 }, { spin: 0.25, duration: 2.2, ease: "power3.out", scrollTrigger: { trigger: root.current, start: "top 70%", once: true } });
      return () => trigger.kill();
    },
    { scope: root },
  );

  const variant = VARIANTS[colorIdx];
  const current = active >= 0 ? PARTS[active] : null;

  return (
    <section id="meet" ref={root} className="relative bg-cream">
      <div ref={pin} className="relative h-[100svh] min-h-[640px] overflow-hidden">
        {/* ambient backdrop */}
        <div
          aria-hidden
          className="absolute left-1/2 top-1/2 h-[80vmin] w-[80vmin] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-60 blur-3xl transition-colors duration-700 md:left-[66%]"
          style={{ background: variant.shell }}
        />
        <div
          aria-hidden
          className="text-outline-plum pointer-events-none absolute -bottom-[4vw] left-1/2 -translate-x-1/2 select-none font-display text-[34vw] font-extrabold leading-none tracking-[-0.06em] opacity-[0.07]"
        >
          LUMI
        </div>

        <div className="absolute inset-0 grid grid-rows-[minmax(0,1fr)_auto] md:grid-cols-[minmax(0,0.8fr)_minmax(0,1.3fr)] md:grid-rows-1">
          {/* copy */}
          <div className="relative z-10 order-2 flex flex-col justify-center px-6 pb-8 md:order-1 md:px-12 md:pb-0">
            <SectionLabel n="03">Meet LUMI</SectionLabel>
            <RevealText
              text={"The clip-on\nsunscreen."}
              accent={["sunscreen."]}
              className="mt-4 font-display text-[clamp(2rem,4.6vw,4.2rem)] font-bold leading-[1.02] tracking-tight"
            />
            <p className="mt-4 hidden max-w-md text-lg leading-relaxed text-plum-soft md:block">
              A proposed refillable sunscreen (target SPF 50+, subject to testing) that you wear as a clip-on charm.
              The starter kit: the shell, a charm and two 60 ml cartridges. Scroll to take it apart.
            </p>

            {/* desktop: full parts list */}
            <ol className="mt-8 hidden max-w-md space-y-1 md:block">
              {PARTS.map((part, i) => (
                <li
                  key={part.id}
                  className={cn(
                    "flex items-start gap-4 rounded-2xl px-4 py-3 transition-all duration-500",
                    active === i ? "scale-[1.02] bg-white shadow-soft" : "opacity-55",
                  )}
                >
                  <span className={cn("mt-1 h-5 w-5 shrink-0 rounded-md", PART_CHIPS[i])} />
                  <span>
                    <span className="block font-display text-base font-bold leading-tight">{part.name}</span>
                    <span
                      className={cn(
                        "grid text-sm text-plum-soft transition-all duration-500",
                        active === i ? "mt-1 grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
                      )}
                    >
                      <span className="overflow-hidden">{part.blurb}</span>
                    </span>
                  </span>
                </li>
              ))}
            </ol>

            {/* mobile: only the active part */}
            <div className="mt-5 min-h-[6.5rem] rounded-3xl bg-white/80 p-5 shadow-soft md:hidden">
              {current ? (
                <>
                  <p className="flex items-center gap-3 font-display text-lg font-bold">
                    <span className={cn("h-4 w-4 rounded", PART_CHIPS[active])} />
                    {current.name}
                  </p>
                  <p className="mt-1 text-plum-soft">{current.blurb}</p>
                </>
              ) : (
                <p className="text-plum-soft">
                  Proposed refillable clip-on sunscreen (target SPF 50+, subject to testing). Scroll to take it apart.
                </p>
              )}
            </div>

            <div className="mt-6 hidden max-w-md items-start gap-3 rounded-2xl bg-plum px-5 py-4 text-sm leading-relaxed text-cream md:flex">
              <StatusTag kind="proposed" label="Proposed design" className="mt-0.5 shrink-0" />
              <span>
                Not yet prototyped. Engineering to test heat exposure, leakage, formulation stability and cartridge
                compatibility.
              </span>
            </div>
          </div>

          {/* 3D */}
          <div className="relative order-1 md:order-2">
            <ProductCanvas
              variant={variant}
              state={scene}
              className="absolute inset-0"
              fallback={
                <div className="grid h-full place-items-center">
                  <div className="w-[min(50vw,300px)] animate-float">
                    <ProductArt shell={variant.shell} deep={variant.deep} charm={variant.charm} />
                  </div>
                </div>
              }
            />
            <div className="absolute bottom-3 right-4 z-10 flex items-center gap-2 rounded-full bg-cream/80 px-3 py-2 shadow-soft backdrop-blur md:bottom-8 md:right-10">
              <span className="pr-1 text-[0.68rem] font-bold uppercase tracking-[0.16em] text-plum-soft">Try a shell</span>
              {VARIANTS.map((v, i) => (
                <button
                  key={v.id}
                  aria-label={`${v.name} shell`}
                  aria-pressed={i === colorIdx}
                  onClick={() => setColorIdx(i)}
                  className={cn(
                    "h-6 w-6 rounded-full border-2 transition-transform hover:scale-110",
                    i === colorIdx ? "scale-110 border-plum" : "border-cream",
                  )}
                  style={{ background: v.shell }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
