"use client";

import { useEffect, useRef } from "react";
import { motion, useInView, useSpring, useTransform } from "motion/react";

interface AnimatedNumberProps {
  value: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
}

/** Springs to `value` the first time it scrolls into view, and again whenever `value` changes. */
export function AnimatedNumber({ value, decimals = 0, prefix = "", suffix = "", className }: AnimatedNumberProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -15% 0px" });
  const spring = useSpring(0, { stiffness: 70, damping: 22, mass: 0.9 });
  const text = useTransform(
    spring,
    (v) =>
      prefix +
      v.toLocaleString("en-IN", { minimumFractionDigits: decimals, maximumFractionDigits: decimals }) +
      suffix,
  );

  useEffect(() => {
    if (inView) spring.set(value);
  }, [inView, value, spring]);

  return (
    <motion.span ref={ref} className={className}>
      {text}
    </motion.span>
  );
}
