"use client";

import type { ReactNode } from "react";
import { motion } from "motion/react";

interface RevealProps {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  /** Scale-in instead of slide-up */
  pop?: boolean;
}

/** Scroll-triggered fade/slide (or pop) entrance. Stagger by passing increasing `delay`. */
export function Reveal({ children, delay = 0, y = 36, className, pop = false }: RevealProps) {
  return (
    <motion.div
      className={className}
      initial={pop ? { opacity: 0, scale: 0.86, y: 20 } : { opacity: 0, y }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ duration: 0.85, ease: [0.2, 0.8, 0.2, 1], delay }}
    >
      {children}
    </motion.div>
  );
}
