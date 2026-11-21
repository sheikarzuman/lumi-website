"use client";

import { useRef } from "react";
import { motion, useInView } from "motion/react";
import { cn } from "@/lib/cn";

interface RevealTextProps {
  text: string;
  as?: "h1" | "h2" | "h3" | "p" | "div";
  className?: string;
  delay?: number;
  stagger?: number;
  /** Words (punctuation ignored) to colour with `accentClass` */
  accent?: string[];
  accentClass?: string;
  /** When provided, animation is driven by this flag instead of scroll-into-view */
  play?: boolean;
}

const EASE = [0.2, 0.8, 0.2, 1] as const;

/** Masked word-by-word reveal. Use "\n" for explicit line breaks. */
export function RevealText({
  text,
  as: Tag = "h2",
  className,
  delay = 0,
  stagger = 0.06,
  accent = [],
  accentClass = "text-berry",
  play,
}: RevealTextProps) {
  let wordIndex = 0;
  const lines = text.split("\n");

  // Observe the heading itself: each word starts translated outside its own overflow mask,
  // and IntersectionObserver treats a fully clipped element as never visible.
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -12% 0px" });
  const active = play ?? inView;

  return (
    <div ref={ref}>
      <Tag className={className} aria-label={text.replace(/\n/g, " ")}>
        {lines.map((line, li) => (
          <span key={li} className="block" aria-hidden>
            {line.split(" ").map((word) => {
              const i = wordIndex++;
              const isAccent = accent.includes(word.replace(/[.,!?]/g, ""));
              return (
                <span
                  key={`${li}-${i}`}
                  className="mr-[0.22em] inline-block overflow-hidden pb-[0.14em] align-bottom"
                >
                  <motion.span
                    className={cn("inline-block origin-bottom-left", isAccent && accentClass)}
                    initial={{ y: "115%", rotate: 5 }}
                    animate={active ? { y: 0, rotate: 0 } : { y: "115%", rotate: 5 }}
                    transition={{ duration: 0.95, ease: EASE, delay: delay + i * stagger }}
                  >
                    {word}
                  </motion.span>
                </span>
              );
            })}
          </span>
        ))}
      </Tag>
    </div>
  );
}
