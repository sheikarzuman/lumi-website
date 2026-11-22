import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";

/** Bottom-of-homepage banner linking to the investor thesis. */
export function InvestorTeaser() {
  return (
    <section aria-label="For investors" className="bg-cream px-6 py-16 md:px-12 md:py-20">
      <Reveal>
        <a
          href="/investors"
          className="group mx-auto flex max-w-6xl flex-col gap-6 rounded-[2.5rem] bg-plum p-8 text-cream shadow-lift transition-transform hover:scale-[1.01] md:flex-row md:items-center md:justify-between md:p-12"
        >
          <div>
            <p className="text-[0.7rem] font-bold uppercase tracking-[0.2em] text-sun">For investors · Pre-seed</p>
            <p className="mt-3 max-w-2xl font-display text-[clamp(1.5rem,3vw,2.4rem)] font-bold leading-tight tracking-tight">
              Building or backing consumer hardware &amp; beauty-tech? Explore the LUMI investor thesis
            </p>
          </div>
          <span className="inline-flex shrink-0 items-center gap-2 self-start rounded-full bg-sun px-6 py-3 font-semibold text-plum md:self-center">
            View thesis
            <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" aria-hidden />
          </span>
        </a>
      </Reveal>
    </section>
  );
}
