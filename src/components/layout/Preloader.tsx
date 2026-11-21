"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

const LETTERS = ["L", "U", "M", "I"];
const HOLD_MS = 1750;
const HANDOFF_MS = 500;

/** Opening curtain: wordmark rises, then the plum panel wipes upward to reveal the hero. */
export function Preloader({ onDone }: { onDone: () => void }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    const hide = window.setTimeout(() => {
      setVisible(false);
      document.body.style.overflow = "";
    }, HOLD_MS);
    const handoff = window.setTimeout(onDone, HOLD_MS + HANDOFF_MS);
    return () => {
      window.clearTimeout(hide);
      window.clearTimeout(handoff);
      document.body.style.overflow = "";
    };
  }, [onDone]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="preloader"
          role="status"
          aria-label="Loading LUMI"
          className="fixed inset-0 z-[100] grid place-items-center bg-plum"
          initial={{ clipPath: "inset(0 0 0% 0)" }}
          exit={{ clipPath: "inset(0 0 100% 0)" }}
          transition={{ duration: 0.95, ease: [0.76, 0, 0.24, 1] }}
        >
          <div className="relative">
            <motion.div
              aria-hidden
              className="absolute -top-10 left-1/2 h-24 w-24 -translate-x-1/2 rounded-full bg-sun blur-2xl"
              initial={{ scale: 0.4, opacity: 0 }}
              animate={{ scale: 1.4, opacity: 0.7 }}
              transition={{ duration: 1.4, ease: "easeOut" }}
            />
            <div className="relative flex overflow-hidden font-display text-[22vw] font-extrabold leading-[0.95] text-cream sm:text-[9rem]">
              {LETTERS.map((l, i) => (
                <motion.span
                  key={l}
                  className="inline-block"
                  initial={{ y: "110%" }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.8, ease: [0.2, 0.8, 0.2, 1], delay: 0.1 + i * 0.09 }}
                >
                  {l}
                </motion.span>
              ))}
            </div>
            <div className="mx-auto mt-4 h-1 w-40 overflow-hidden rounded-full bg-cream/20">
              <motion.div
                className="h-full rounded-full bg-sun"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: HOLD_MS / 1000 - 0.2, ease: "easeInOut" }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
