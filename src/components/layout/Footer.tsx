import { CONTACT, FOUNDER } from "@/lib/founder";
import { FORMULATION_TARGETS, PRICING, ROADMAP, TAGLINE } from "@/lib/lumi";
import { cn } from "@/lib/cn";

const STATUS_ROWS = [
  { label: "Formulation", status: "Not finalised", note: "No test results exist." },
  { label: "Manufacturer", status: "None selected", note: "A qualified cosmetic partner is needed." },
  { label: "NGO partner", status: "Prospective", note: "Nothing confirmed. No meals funded yet." },
  { label: "Pricing", status: "Assumption", note: `Starter kit ₹${PRICING.kit}, ${PRICING.cartridgeMl} ml refill ₹${PRICING.refill} (MRP incl. GST). Not final.` },
  { label: "Availability", status: "Not for sale", note: "No product exists to buy yet." },
] as const;

export function Footer() {
  return (
    <footer className="bg-plum px-6 pb-10 pt-4 text-cream md:px-12">
      <div className="mx-auto max-w-7xl">
        <div className="rounded-[2.5rem] bg-cream/[0.06] p-8 md:p-12">
          <div className="grid gap-12 lg:grid-cols-[1fr_1.4fr]">
            <div>
              <p className="font-display text-6xl font-extrabold tracking-tight">LUMI</p>
              <p className="mt-3 max-w-xs text-cream/75">{TAGLINE}</p>
              <p className="mt-8 text-[0.7rem] font-bold uppercase tracking-[0.2em] text-sun">Proposed targets, not claims</p>
              <ul className="mt-3 flex flex-wrap gap-2">
                {FORMULATION_TARGETS.map((t) => (
                  <li key={t} className="rounded-full border border-cream/25 px-3 py-1.5 text-xs">
                    {t}
                  </li>
                ))}
              </ul>
              <p className="mt-3 text-xs text-cream/55">*Subject to formulation and testing.</p>
            </div>

            <div>
              <p className="text-[0.7rem] font-bold uppercase tracking-[0.2em] text-sun">Where LUMI stands today</p>
              <dl className="mt-4 divide-y divide-cream/10">
                {STATUS_ROWS.map((r) => (
                  <div key={r.label} className="grid gap-1 py-3 sm:grid-cols-[8rem_9rem_1fr] sm:items-baseline sm:gap-4">
                    <dt className="font-display font-semibold">{r.label}</dt>
                    <dd className="text-sm font-bold text-sun">{r.status}</dd>
                    <dd className="text-sm text-cream/70">{r.note}</dd>
                  </div>
                ))}
              </dl>

              <p className="mt-8 text-[0.7rem] font-bold uppercase tracking-[0.2em] text-sun">Roadmap · validate before we manufacture</p>
              <ol className="mt-4 grid gap-3 sm:grid-cols-4">
                {ROADMAP.map((p) => (
                  <li key={p.phase} className={cn("rounded-2xl p-4 text-plum", p.tone)}>
                    <p className="text-[0.68rem] font-bold uppercase tracking-[0.14em] opacity-70">
                      {p.phase} · {p.when}
                    </p>
                    <p className="mt-1 font-display text-sm font-bold leading-tight">{p.title}</p>
                  </li>
                ))}
              </ol>
              <p className="mt-3 text-xs text-cream/55">
                Gate: no commercial production until samples pass SPF, UVA, stability and safety tests, regulatory
                requirements are confirmed and unit costs are quoted. Timeline is indicative.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-5 rounded-[2rem] bg-cream/[0.06] p-6 md:flex-row md:items-center md:justify-between md:p-8">
          <div className="flex items-center gap-4">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-[radial-gradient(circle_at_30%_30%,#FFE69A,#F5B2C7_60%,#CBB5EF)] font-display text-base font-extrabold text-plum">
              {FOUNDER.initials}
            </span>
            <div>
              <p className="text-[0.7rem] font-bold uppercase tracking-[0.2em] text-sun">Built by</p>
              <p className="font-display font-bold">
                {FOUNDER.name} <span className="font-normal text-cream/70">· {FOUNDER.role}</span>
              </p>
              <p className="text-xs text-cream/60">
                MBA Candidate, Amrita School of Business ’28 · B.Tech ECE, VIT Chennai · {FOUNDER.location}
              </p>
            </div>
          </div>
          <nav aria-label="Founder and investor links" className="flex flex-wrap gap-2 text-sm font-semibold">
            <a href={FOUNDER.linkedin} target="_blank" rel="noopener noreferrer" className="rounded-full border border-cream/25 px-4 py-2 transition-colors hover:border-sun hover:text-sun">
              LinkedIn
            </a>
            <a
              href={CONTACT.href}
              {...(CONTACT.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              className="rounded-full border border-cream/25 px-4 py-2 transition-colors hover:border-sun hover:text-sun"
            >
              Contact
            </a>
            <a href="/investors" className="rounded-full bg-sun px-4 py-2 text-plum transition-transform hover:scale-[1.03]">
              For Investors →
            </a>
          </nav>
        </div>

        <div className="mt-8 flex flex-col gap-2 text-xs text-cream/60 md:flex-row md:justify-between">
          <p>LUMI is a concept by Team 5 for MBA Challenge 05: Product &amp; Growth. Concept stage: all figures are proposals.</p>
          <p>Visuals are concept renders, not photographs of a prototype.</p>
        </div>
      </div>
    </footer>
  );
}
