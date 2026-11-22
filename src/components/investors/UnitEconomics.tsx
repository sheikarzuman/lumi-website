import { Reveal } from "@/components/ui/Reveal";
import { RevealText } from "@/components/ui/RevealText";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { StatusTag } from "@/components/ui/StatusTag";
import { UNIT_CARDS } from "@/lib/investor";

/** Unit economics & retention loop: kit, refills, collectible + connected retention. */
export function UnitEconomics() {
  return (
    <section id="economics" className="relative bg-cream py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6 md:px-12">
        <SectionLabel n="01">Unit economics & retention loop</SectionLabel>
        <RevealText
          text={"Sell the shell once.\nRefill the habit."}
          accent={["Refill"]}
          className="mt-4 font-display text-[clamp(2rem,4.4vw,3.8rem)] font-bold leading-[1.04] tracking-tight"
        />
        <ol className="mt-12 grid gap-5 md:grid-cols-3">
          {UNIT_CARDS.map((card, i) => (
            <Reveal key={card.eyebrow} delay={i * 0.1}>
              <li className={`flex h-full list-none flex-col rounded-[2rem] p-7 ${card.tone}`}>
                <p className="text-[0.7rem] font-bold uppercase tracking-[0.2em] text-plum/60">
                  {String(i + 1).padStart(2, "0")} · {card.eyebrow}
                </p>
                <p className="mt-4 font-display text-5xl font-extrabold tracking-tight">{card.price}</p>
                <p className="mt-1 text-xs font-semibold uppercase tracking-[0.14em] text-plum/60">{card.priceNote}</p>
                <p className="mt-5 flex-1 text-plum/80">{card.body}</p>
              </li>
            </Reveal>
          ))}
        </ol>
        <div className="mt-8 flex flex-wrap items-center gap-3 text-sm text-plum/70">
          <StatusTag kind="assumption" tone="plum" />
          <span>Pricing, refill cadence and drop rates are proposals pending costing, formulation and validation.</span>
        </div>
      </div>
    </section>
  );
}
