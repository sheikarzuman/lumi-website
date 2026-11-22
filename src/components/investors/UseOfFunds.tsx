import { Reveal } from "@/components/ui/Reveal";
import { RevealText } from "@/components/ui/RevealText";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { StatusTag } from "@/components/ui/StatusTag";
import { SIX_MONTH_ROADMAP, USE_OF_FUNDS } from "@/lib/investor";

/** Pre-seed use of funds (stacked allocation bar + legend) and the first six months of the roadmap. */
export function UseOfFunds() {
  return (
    <section id="funds" className="relative bg-oat/60 py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6 md:px-12">
        <SectionLabel n="02">Pre-seed use of funds</SectionLabel>
        <RevealText
          text={"Every rupee goes toward\na product that can ship."}
          accent={["ship."]}
          className="mt-4 font-display text-[clamp(2rem,4.4vw,3.8rem)] font-bold leading-[1.04] tracking-tight"
        />

        <Reveal className="mt-12">
          <div className="rounded-[2rem] bg-cream p-6 shadow-soft md:p-8">
            <div
              role="img"
              aria-label={USE_OF_FUNDS.map((f) => `${f.pct}% ${f.label}`).join("; ")}
              className="flex h-14 w-full overflow-hidden rounded-full"
            >
              {USE_OF_FUNDS.map((f) => (
                <div key={f.label} className={`grid place-items-center font-display text-sm font-extrabold ${f.tone}`} style={{ width: `${f.pct}%` }}>
                  {f.pct}%
                </div>
              ))}
            </div>
            <ul className="mt-8 grid gap-4 sm:grid-cols-2">
              {USE_OF_FUNDS.map((f) => (
                <li key={f.label} className="flex items-start gap-4">
                  <span className={`mt-1 grid h-12 w-16 shrink-0 place-items-center rounded-2xl font-display text-lg font-extrabold ${f.tone}`}>
                    {f.pct}%
                  </span>
                  <span className="text-plum/80">{f.label}</span>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>

        <p className="mt-14 text-[0.7rem] font-bold uppercase tracking-[0.2em] text-plum/60">6-month roadmap</p>
        <ol className="mt-4 grid gap-5 md:grid-cols-2">
          {SIX_MONTH_ROADMAP.map((p, i) => (
            <Reveal key={p.when} delay={i * 0.1}>
              <li className={`h-full list-none rounded-[2rem] p-7 ${p.tone}`}>
                <p className="text-[0.7rem] font-bold uppercase tracking-[0.2em] text-plum/60">{p.when}</p>
                <h3 className="mt-1 font-display text-2xl font-extrabold tracking-tight">{p.title}</h3>
                <ul className="mt-4 space-y-2 text-plum/80">
                  {p.items.map((item) => (
                    <li key={item} className="flex gap-2">
                      <span aria-hidden className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-plum" />
                      {item}
                    </li>
                  ))}
                </ul>
              </li>
            </Reveal>
          ))}
        </ol>
        <div className="mt-8 flex flex-wrap items-center gap-3 text-sm text-plum/70">
          <StatusTag kind="proposed" tone="plum" label="Indicative plan" />
          <span>No commercial production until samples pass SPF, UVA, stability and safety tests.</span>
        </div>
      </div>
    </section>
  );
}
