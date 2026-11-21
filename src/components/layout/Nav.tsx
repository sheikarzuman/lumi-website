"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Menu, X } from "lucide-react";
import { NAV_LINKS, SECTION_IDS } from "@/lib/lumi";
import { scrollToId } from "@/lib/scroll";
import { cn } from "@/lib/cn";
import { useIntro } from "./ClientShell";

function useActiveSection() {
  const [active, setActive] = useState<string>("top");

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id);
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    SECTION_IDS.forEach((id) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, []);

  return active;
}

export function Nav() {
  const { ready } = useIntro();
  const active = useActiveSection();
  const [open, setOpen] = useState(false);

  const go = (id: string) => {
    setOpen(false);
    // let the overlay close before scrolling so Lenis isn't fighting the scroll lock
    window.setTimeout(() => scrollToId(id), open ? 250 : 0);
  };

  return (
    <>
      <motion.header
        initial={{ y: -90, opacity: 0 }}
        animate={ready ? { y: 0, opacity: 1 } : { y: -90, opacity: 0 }}
        transition={{ duration: 0.9, ease: [0.2, 0.8, 0.2, 1] }}
        className="fixed inset-x-0 top-4 z-50 flex justify-center px-4"
      >
        <nav
          aria-label="Primary"
          className="flex items-center gap-1 rounded-full border border-plum/10 bg-cream/92 px-2 py-2 shadow-soft backdrop-blur-xl"
        >
          <button
            onClick={() => go("top")}
            className="px-4 font-display text-xl font-extrabold tracking-tight"
            aria-label="LUMI — back to top"
          >
            LUMI
          </button>
          <div className="hidden items-center lg:flex">
            {NAV_LINKS.map((l) => (
              <button
                key={l.id}
                onClick={() => go(l.id)}
                className={cn(
                  "rounded-full px-4 py-2 text-sm font-medium transition-colors",
                  active === l.id ? "bg-plum text-cream" : "hover:bg-plum/8",
                )}
              >
                {l.label}
              </button>
            ))}
          </div>
          <button
            onClick={() => go("join")}
            className="ml-1 rounded-full bg-sun px-5 py-2.5 text-sm font-semibold transition-transform hover:scale-[1.04]"
          >
            Join the journey
          </button>
          <button
            onClick={() => setOpen(true)}
            className="grid h-10 w-10 place-items-center rounded-full hover:bg-plum/8 lg:hidden"
            aria-label="Open menu"
            aria-expanded={open}
          >
            <Menu size={20} />
          </button>
        </nav>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            key="menu"
            className="fixed inset-0 z-[80] flex flex-col bg-plum px-8 pb-10 pt-6 text-cream lg:hidden"
            initial={{ clipPath: "circle(0% at 90% 5%)" }}
            animate={{ clipPath: "circle(150% at 90% 5%)" }}
            exit={{ clipPath: "circle(0% at 90% 5%)" }}
            transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
          >
            <div className="flex items-center justify-between">
              <span className="font-display text-xl font-extrabold">LUMI</span>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close menu"
                className="grid h-11 w-11 place-items-center rounded-full bg-cream/10"
              >
                <X size={22} />
              </button>
            </div>
            <div className="mt-12 flex flex-1 flex-col justify-center gap-2">
              {[...NAV_LINKS, { id: "join", label: "Join the journey" }].map((l, i) => (
                <motion.button
                  key={l.id}
                  onClick={() => go(l.id)}
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.25 + i * 0.06, duration: 0.6 }}
                  className="text-left font-display text-4xl font-bold leading-tight"
                >
                  {l.label}
                </motion.button>
              ))}
            </div>
            <p className="text-sm text-cream/60">Concept stage — all product details are proposals.</p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
