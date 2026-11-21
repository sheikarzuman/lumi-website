"use client";

import type { ReactNode } from "react";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/cn";
import { scrollToId } from "@/lib/scroll";
import { Magnetic } from "./Magnetic";

type Variant = "primary" | "ghost" | "light" | "sun";

interface ButtonProps {
  children: ReactNode;
  /** "#section-id" scrolls smoothly; omit for a plain button */
  href?: string;
  onClick?: () => void;
  variant?: Variant;
  className?: string;
  type?: "button" | "submit";
  disabled?: boolean;
}

const BASE =
  "group relative inline-flex items-center justify-center overflow-hidden rounded-full px-7 py-4 text-[0.95rem] font-semibold tracking-tight transition-colors duration-300 disabled:opacity-60";

const VARIANTS: Record<Variant, { shell: string; sweep: string; hoverText: string }> = {
  primary: { shell: "bg-plum text-cream shadow-soft", sweep: "bg-sun", hoverText: "group-hover:text-plum" },
  ghost: { shell: "border-2 border-plum text-plum", sweep: "bg-plum", hoverText: "group-hover:text-cream" },
  light: { shell: "bg-cream text-plum shadow-soft", sweep: "bg-sun", hoverText: "" },
  sun: { shell: "bg-sun text-plum shadow-soft", sweep: "bg-blush", hoverText: "" },
};

export function Button({
  children,
  href,
  onClick,
  variant = "primary",
  className,
  type = "button",
  disabled,
}: ButtonProps) {
  const v = VARIANTS[variant];
  const inner = (
    <>
      <span
        aria-hidden
        className={cn(
          "absolute inset-0 -translate-x-full rounded-full transition-transform duration-500 ease-[cubic-bezier(.2,.8,.2,1)] group-hover:translate-x-0",
          v.sweep,
        )}
      />
      <span className={cn("relative z-10 flex items-center gap-2 transition-colors duration-300", v.hoverText)}>
        {children}
        <ArrowUpRight
          size={18}
          strokeWidth={2.4}
          className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
        />
      </span>
    </>
  );
  const classes = cn(BASE, v.shell, className);

  return (
    <Magnetic>
      {href ? (
        <a
          href={href}
          className={classes}
          onClick={(e) => {
            if (href.startsWith("#")) {
              e.preventDefault();
              scrollToId(href.slice(1));
            }
            onClick?.();
          }}
        >
          {inner}
        </a>
      ) : (
        <button type={type} onClick={onClick} disabled={disabled} className={classes}>
          {inner}
        </button>
      )}
    </Magnetic>
  );
}
