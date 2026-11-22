import { ArrowUpRight, GraduationCap, MapPin } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { CONTACT, EMAIL, FOUNDER, WHATSAPP, WHATSAPP_DISPLAY } from "@/lib/founder";

/** LinkedIn-style "in" mark (lucide ships no brand icons). Pass bg/text colour classes. */
export function LinkedInMark({ className = "bg-plum text-cream" }: { className?: string }) {
  return (
    <span aria-hidden className={`grid h-5 w-5 place-items-center rounded-[5px] text-[0.62rem] font-extrabold leading-none ${className}`}>
      in
    </span>
  );
}

const external = { target: "_blank", rel: "noopener noreferrer" } as const;

/** "Built by" editorial founder card. */
export function FounderCard() {
  return (
    <section id="founder" className="relative bg-cream py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6 md:px-12">
        <SectionLabel n="03">Built by</SectionLabel>
        <Reveal className="mt-10">
          <article className="grid gap-10 rounded-[2.5rem] bg-plum p-8 text-cream md:grid-cols-[auto_1fr] md:p-12">
            <div className="grid h-32 w-32 place-items-center rounded-full bg-[radial-gradient(circle_at_30%_30%,#FFE69A,#F5B2C7_60%,#CBB5EF)] font-display text-4xl font-extrabold text-plum md:h-40 md:w-40 md:text-5xl">
              {FOUNDER.initials}
            </div>
            <div>
              <p className="text-[0.7rem] font-bold uppercase tracking-[0.2em] text-sun">{FOUNDER.role}</p>
              <h2 className="mt-2 font-display text-[clamp(2rem,4vw,3.4rem)] font-extrabold leading-none tracking-tight">{FOUNDER.name}</h2>
              <p className="mt-5 max-w-2xl text-lg leading-relaxed text-cream/80">{FOUNDER.bio}</p>
              <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                {FOUNDER.credentials.map((c) => (
                  <li key={c.school} className="flex gap-3 rounded-2xl bg-cream/[0.07] p-4">
                    <GraduationCap size={20} className="mt-0.5 shrink-0 text-sun" aria-hidden />
                    <span>
                      <span className="block font-display font-bold">{c.school}</span>
                      <span className="text-sm text-cream/70">{c.detail}</span>
                    </span>
                  </li>
                ))}
              </ul>
              <p className="mt-5 flex items-center gap-2 text-sm text-cream/75">
                <MapPin size={16} aria-hidden /> Based in {FOUNDER.location}
              </p>
              <p className="mt-2 text-sm text-cream/75">
                {EMAIL} · WhatsApp {WHATSAPP_DISPLAY} · Instagram {FOUNDER.instagram.handle}
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <a href={FOUNDER.linkedin} {...external} className="inline-flex items-center gap-2 rounded-full bg-cream px-6 py-3 font-semibold text-plum transition-transform hover:scale-[1.03]">
                  <LinkedInMark />
                  LinkedIn
                </a>
                <a
                  href={CONTACT.href}
                  {...(CONTACT.external ? external : {})}
                  className="inline-flex items-center gap-2 rounded-full border-2 border-cream/40 px-6 py-3 font-semibold transition-colors hover:border-sun hover:text-sun"
                >
                  {CONTACT.label}
                  <ArrowUpRight size={16} aria-hidden />
                </a>
                <a
                  href={WHATSAPP.href}
                  {...external}
                  className="inline-flex items-center gap-2 rounded-full border-2 border-cream/40 px-6 py-3 font-semibold transition-colors hover:border-sun hover:text-sun"
                >
                  {WHATSAPP.label}
                  <ArrowUpRight size={16} aria-hidden />
                </a>
                <a
                  href={FOUNDER.instagram.href}
                  {...external}
                  className="inline-flex items-center gap-2 rounded-full border-2 border-cream/40 px-6 py-3 font-semibold transition-colors hover:border-sun hover:text-sun"
                >
                  Instagram
                  <ArrowUpRight size={16} aria-hidden />
                </a>
              </div>
            </div>
          </article>
        </Reveal>
      </div>
    </section>
  );
}
