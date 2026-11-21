"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion, useMotionTemplate, useMotionValue, useSpring } from "motion/react";
import { Check } from "lucide-react";
import { ProductArt } from "@/components/product/ProductArt";
import { Button } from "@/components/ui/Button";
import { RevealText } from "@/components/ui/RevealText";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { VARIANTS } from "@/lib/lumi";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const RING_SECONDS = 70;

export function FinalCta() {
  const ref = useRef<HTMLElement>(null);
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  const mx = useSpring(useMotionValue(50), { stiffness: 50, damping: 20 });
  const my = useSpring(useMotionValue(50), { stiffness: 50, damping: 20 });
  const glow = useMotionTemplate`radial-gradient(38rem circle at ${mx}% ${my}%, rgba(255,230,154,0.28), transparent 60%)`;

  const onMove = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse" || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    mx.set(((e.clientX - r.left) / r.width) * 100);
    my.set(((e.clientY - r.top) / r.height) * 100);
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!EMAIL_PATTERN.test(email.trim())) {
      setError("Please enter a valid email address.");
      return;
    }
    // Concept stage: there is no backend yet, so nothing is stored or sent.
    setError("");
    setDone(true);
  };

  return (
    <section
      id="join"
      ref={ref}
      onPointerMove={onMove}
      className="grain relative isolate flex min-h-[100svh] items-center overflow-hidden bg-plum py-28 text-cream"
    >
      <motion.div aria-hidden style={{ background: glow }} className="absolute inset-0 -z-10" />
      <div aria-hidden className="animate-breathe pointer-events-none absolute left-1/2 top-1/2 -z-10 aspect-square w-[90vmin] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,230,154,0.35)_0%,rgba(245,178,199,0.18)_40%,transparent_68%)]" />

      {/* orbiting collection */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[min(150vw,1100px)] w-[min(150vw,1100px)] -translate-x-1/2 -translate-y-1/2"
        animate={{ rotate: 360 }}
        transition={{ duration: RING_SECONDS, repeat: Infinity, ease: "linear" }}
      >
        {VARIANTS.map((v, i) => {
          const angle = (i / VARIANTS.length) * 360;
          return (
            <div
              key={v.id}
              className="absolute left-1/2 top-1/2 w-[clamp(64px,11vw,130px)]"
              style={{ transform: `rotate(${angle}deg) translateY(calc(min(75vw, 550px) * -1)) rotate(${-angle}deg)` }}
            >
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: RING_SECONDS, repeat: Infinity, ease: "linear" }}
                className="-translate-x-1/2 -translate-y-1/2 opacity-90 drop-shadow-[0_20px_30px_rgba(0,0,0,0.35)]"
              >
                <ProductArt shell={v.shell} deep={v.deep} charm={v.charm} />
              </motion.div>
            </div>
          );
        })}
      </motion.div>

      <div className="relative mx-auto w-full max-w-5xl px-6 text-center md:px-12">
        <SectionLabel n="08" invert className="justify-center">
          The LUMI journey
        </SectionLabel>
        <RevealText
          text={"Carry your\nsunshine."}
          accent={["sunshine."]}
          accentClass="text-sun"
          className="mt-6 font-display text-[clamp(3.2rem,11vw,9.5rem)] font-extrabold leading-[0.92] tracking-[-0.05em]"
        />
        <motion.p
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="mx-auto mt-8 max-w-xl text-lg leading-relaxed text-cream/80"
        >
          LUMI is still a concept. Follow the journey from formulation to launch, one proven stage at a time.
        </motion.p>

        <div className="mx-auto mt-10 min-h-[8.5rem] max-w-xl">
          <AnimatePresence mode="wait" initial={false}>
            {done ? (
              <motion.div
                key="done"
                initial={{ opacity: 0, scale: 0.9, y: 16 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="rounded-[2rem] bg-cream p-7 text-plum"
                role="status"
              >
                <span className="mx-auto mb-3 grid h-11 w-11 place-items-center rounded-full bg-mint">
                  <Check size={22} strokeWidth={3} />
                </span>
                <p className="font-display text-xl font-bold">Thank you. You are on the journey.</p>
                <p className="mt-1 text-sm text-plum-soft">
                  This is a concept-stage preview: this form does not store or send your email yet.
                </p>
              </motion.div>
            ) : open ? (
              <motion.form
                key="form"
                onSubmit={submit}
                noValidate
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-3"
              >
                <div className="flex flex-col gap-3 rounded-[2rem] bg-cream/10 p-2 backdrop-blur sm:flex-row sm:rounded-full">
                  <label htmlFor="join-email" className="sr-only">
                    Email address
                  </label>
                  <input
                    id="join-email"
                    type="email"
                    autoComplete="email"
                    autoFocus
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    aria-invalid={Boolean(error)}
                    aria-describedby={error ? "join-error" : undefined}
                    className="min-w-0 flex-1 rounded-full bg-transparent px-6 py-4 text-cream placeholder:text-cream/50 focus:outline-none"
                  />
                  <Button type="submit" variant="sun">
                    Count me in
                  </Button>
                </div>
                {error && (
                  <p id="join-error" role="alert" className="text-sm text-blush">
                    {error}
                  </p>
                )}
                <p className="text-xs text-cream/60">
                  Concept-stage preview: this form does not store or send your email yet.
                </p>
              </motion.form>
            ) : (
              <motion.div key="cta" exit={{ opacity: 0, y: -10 }}>
                <Button variant="sun" onClick={() => setOpen(true)} className="px-10 py-5 text-lg">
                  Join the LUMI Journey
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
