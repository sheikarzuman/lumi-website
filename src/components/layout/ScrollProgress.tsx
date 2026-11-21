"use client";

import { motion, useScroll, useSpring } from "motion/react";

/** Thin gradient bar across the top that fills as the page is scrolled. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 24, mass: 0.3 });

  return (
    <motion.div
      aria-hidden
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-[90] h-1.5 origin-left bg-gradient-to-r from-blush via-lavender to-sun"
    />
  );
}
