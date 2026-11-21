import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export function SectionLabel({
  n,
  children,
  className,
  invert = false,
}: {
  n: string;
  children: ReactNode;
  className?: string;
  invert?: boolean;
}) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.22em]",
        invert ? "text-cream" : "text-plum",
        className,
      )}
    >
      <span
        className={cn(
          "grid h-7 min-w-7 place-items-center rounded-full px-2 text-[0.7rem] tracking-normal",
          invert ? "bg-cream text-plum" : "bg-plum text-cream",
        )}
      >
        {n}
      </span>
      {children}
    </div>
  );
}
