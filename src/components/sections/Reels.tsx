import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { ReelPlayer } from "@/components/ui/ReelPlayer";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { StatusTag } from "@/components/ui/StatusTag";
import { INSTAGRAM } from "@/lib/founder";

const REELS = [
  {
    id: "shells",
    title: "Ten shells. Four rarities.",
    body: "Six pastel commons, two rares, an epic foil and one secret gold, with the proposed drop rate for each tier.",
    label: "LUMI concept reel: the ten proposed shells and their proposed drop rates",
    cta: { href: "/unbox", text: "Pull a blind box" },
  },
  {
    id: "tap",
    title: "Tap. Timer. Done.",
    body: "Hold your phone to the passive chip and LUMI sets a reminder from your live UV Index and weather. No battery in the shell.",
    label: "LUMI concept reel: tapping the RFID chip starts a reapply reminder",
    cta: { href: "/app", text: "Try the reminder demo" },
  },
] as const;

/** The two concept reels made for Instagram, playable on the site. */
export function Reels() {
  return (
    <section id="reels" className="relative overflow-hidden bg-plum py-24 text-cream md:py-32">
      <div aria-hidden className="pointer-events-none absolute -right-32 top-0 h-96 w-96 rounded-full bg-lavender/20 blur-3xl" />
      <div aria-hidden className="pointer-events-none absolute -left-40 bottom-0 h-96 w-96 rounded-full bg-blush/15 blur-3xl" />
      <div className="relative mx-auto max-w-6xl px-6 md:px-12">
        <SectionLabel n="05d" invert>
          Watch
        </SectionLabel>
        <h2 className="mt-4 font-display text-[clamp(2rem,4.4vw,3.8rem)] font-bold leading-[1.04] tracking-tight">
          LUMI in <span className="text-sun">motion.</span>
        </h2>
        <p className="mt-5 max-w-2xl text-lg text-cream/75">
          Two short reels rendered from the same 3D model you can spin on this site. Concept visuals, nothing is on sale.
        </p>

        <div className="mt-14 grid gap-14 md:grid-cols-2 md:gap-10">
          {REELS.map((r, i) => (
            <Reveal key={r.id} delay={i * 0.1}>
              <article className="flex flex-col items-center gap-6 text-center">
                <ReelPlayer src={`/reels/${r.id}.mp4`} poster={`/reels/${r.id}-poster.jpg`} label={r.label} />
                <div className="max-w-sm">
                  <h3 className="font-display text-2xl font-extrabold tracking-tight">{r.title}</h3>
                  <p className="mt-2 text-cream/70">{r.body}</p>
                  <Link
                    href={r.cta.href}
                    className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-sun px-5 py-2.5 text-sm font-bold text-plum transition-transform hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sun"
                  >
                    {r.cta.text} <ArrowUpRight size={16} aria-hidden />
                  </Link>
                </div>
              </article>
            </Reveal>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center gap-5">
          <a
            href={INSTAGRAM.href}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-full border-2 border-cream/40 px-6 py-3 font-semibold transition-colors hover:border-sun hover:text-sun focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sun"
          >
            Follow {INSTAGRAM.handle} on Instagram <ArrowUpRight size={16} aria-hidden />
          </a>
          <StatusTag kind="mockup" tone="ghost" label="Concept visuals · proposed odds" />
        </div>
      </div>
    </section>
  );
}
