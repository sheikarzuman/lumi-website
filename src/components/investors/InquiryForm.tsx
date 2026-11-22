"use client";

import { useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "motion/react";
import { CalendarClock, Check } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { RevealText } from "@/components/ui/RevealText";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { useFormSubmit } from "@/hooks/useFormSubmit";
import { cn } from "@/lib/cn";
import { INTRO_CALL } from "@/lib/founder";
import { INVESTOR_CATEGORIES, validateInquiry } from "@/lib/forms";

const EMPTY = { name: "", email: "", organization: "", category: "", note: "", website: "" };
type Field = keyof typeof EMPTY;

const INPUT =
  "w-full rounded-2xl border border-plum/15 bg-white/80 px-5 py-4 text-plum placeholder:text-plum/40 focus:border-plum focus:outline-none focus:ring-2 focus:ring-sun";

function FieldShell({ id, label, error, children, optional }: { id: string; label: string; error?: string; children: React.ReactNode; optional?: boolean }) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-sm font-semibold">
        {label} {optional && <span className="font-normal text-plum/55">(optional)</span>}
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} role="alert" className="mt-1.5 text-sm text-berry">
          {error}
        </p>
      )}
    </div>
  );
}

/** "Request Pitch Deck & Intro Call" form, posting to /api/investor-inquiry. */
export function InquiryForm() {
  const [values, setValues] = useState(EMPTY);
  const { state, error, fieldErrors, submit, setFieldErrors } = useFormSubmit("/api/investor-inquiry");
  const set = (k: Field) => (e: { target: { value: string } }) => setValues((v) => ({ ...v, [k]: e.target.value }));
  const aria = (k: Field) => ({ "aria-invalid": Boolean(fieldErrors[k]), "aria-describedby": fieldErrors[k] ? `inq-${k}-error` : undefined });

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const check = validateInquiry(values);
    if (!check.ok) {
      setFieldErrors(check.errors as Record<string, string>);
      return;
    }
    void submit(values);
  };

  return (
    <section id="inquiry" className="relative overflow-hidden bg-blush/40 py-24 md:py-32">
      <div className="mx-auto grid max-w-6xl gap-12 px-6 md:px-12 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <SectionLabel n="04">For investors & partners</SectionLabel>
          <RevealText
            text={"Request the pitch deck\n& an intro call."}
            accent={["intro", "call."]}
            className="mt-4 font-display text-[clamp(2rem,4.4vw,3.6rem)] font-bold leading-[1.04] tracking-tight"
          />
          <p className="mt-5 max-w-md text-lg text-plum/75">
            Angels, micro-VCs, incubators and formulation or manufacturing partners: tell us a little about you and we&rsquo;ll
            share the full thesis.
          </p>
        </div>

        <div className="rounded-[2.5rem] bg-cream p-6 shadow-lift md:p-10">
          <AnimatePresence mode="wait" initial={false}>
            {state === "done" ? (
              <motion.div key="done" role="status" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="py-6 text-center">
                <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-mint">
                  <Check size={26} strokeWidth={3} />
                </span>
                <p className="mt-5 font-display text-2xl font-extrabold tracking-tight">Thanks, {values.name.split(" ")[0]}. Request received.</p>
                <p className="mx-auto mt-2 max-w-sm text-plum/70">We&rsquo;ll follow up at {values.email} with the deck. Want to talk sooner?</p>
                <a
                  href={INTRO_CALL.href}
                  {...(INTRO_CALL.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  className="mt-7 inline-flex items-center gap-2 rounded-full bg-plum px-7 py-4 font-semibold text-cream shadow-soft transition-transform hover:scale-[1.03]"
                >
                  <CalendarClock size={18} aria-hidden />
                  Book a 15-Min Intro Call
                </a>
              </motion.div>
            ) : (
              <motion.form key="form" onSubmit={onSubmit} noValidate exit={{ opacity: 0, y: -10 }} className="grid gap-5">
                <div className="grid gap-5 sm:grid-cols-2">
                  <FieldShell id="inq-name" label="Full name" error={fieldErrors.name}>
                    <input id="inq-name" autoComplete="name" value={values.name} onChange={set("name")} className={INPUT} {...aria("name")} />
                  </FieldShell>
                  <FieldShell id="inq-email" label="Work email" error={fieldErrors.email}>
                    <input id="inq-email" type="email" autoComplete="email" value={values.email} onChange={set("email")} className={INPUT} {...aria("email")} />
                  </FieldShell>
                </div>
                <FieldShell id="inq-organization" label="Organization / Fund / Angel Network" error={fieldErrors.organization}>
                  <input id="inq-organization" autoComplete="organization" value={values.organization} onChange={set("organization")} className={INPUT} {...aria("organization")} />
                </FieldShell>
                <FieldShell id="inq-category" label="Investor category" error={fieldErrors.category}>
                  <select id="inq-category" value={values.category} onChange={set("category")} className={cn(INPUT, !values.category && "text-plum/40")} {...aria("category")}>
                    <option value="" disabled>
                      Choose one
                    </option>
                    {INVESTOR_CATEGORIES.map((c) => (
                      <option key={c} value={c} className="text-plum">
                        {c}
                      </option>
                    ))}
                  </select>
                </FieldShell>
                <FieldShell id="inq-note" label="Note" optional error={fieldErrors.note}>
                  <textarea id="inq-note" rows={3} value={values.note} onChange={set("note")} className={cn(INPUT, "resize-none")} {...aria("note")} />
                </FieldShell>
                {/* honeypot: hidden from people and assistive tech */}
                <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden value={values.website} onChange={set("website")} className="hidden" />
                {error && state === "error" && (
                  <p role="alert" className="text-sm text-berry">
                    {error}
                  </p>
                )}
                <div className="flex flex-wrap items-center gap-4">
                  <Button type="submit" disabled={state === "sending"}>
                    {state === "sending" ? "Sending…" : "Request deck & intro call"}
                  </Button>
                  <p className="text-xs text-plum/60">Used only to reply to this request. Concept stage, nothing is on sale.</p>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
