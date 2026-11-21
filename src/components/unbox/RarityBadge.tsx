import { cn } from "@/lib/cn";
import { RARITIES, type RarityId } from "@/lib/rarity";

/** Tier pill with stars, matching the collection cards. */
export function RarityBadge({ rarity, className }: { rarity: RarityId; className?: string }) {
  const r = RARITIES[rarity];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-[0.16em]",
        r.badge,
        className,
      )}
    >
      <span aria-hidden className="tracking-normal">
        {"★".repeat(r.stars)}
      </span>
      <span>{r.label}</span>
      <span className="sr-only">, {r.stars} of 4 stars</span>
    </span>
  );
}
