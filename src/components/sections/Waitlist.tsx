"use client";

import { useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Check } from "lucide-react";
import { ProductArt } from "@/components/product/ProductArt";
import { Button } from "@/components/ui/Button";
import { RevealText } from "@/components/ui/RevealText";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { StatusTag } from "@/components/ui/StatusTag";
import { useFormSubmit } from "@/hooks/useFormSubmit";
import { validateWaitlist } from "@/lib/forms";
import { PRICING } from "@/lib/lumi";
import { RARITIES, findShell } from "@/lib/rarity";

const GOLDEN = findShell("golden-hour");

/** Drop 01 early-access waitlist (email or WhatsApp), posting to /api/waitlist. */
export function Waitlist() {
  const [contact, setContact] = useState("");
  const [website, setWebsite] = useState("");
  const { state, error, fieldErrors, submit, setFieldErrors } = useFormSubmit("/api/waitlist");
  const fieldError = fieldErrors.contact;

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const check = validateWaitlist({ contact });
    if (!check.ok) {
      setFieldErrors(check.errors as Record<string, string>);
      return;
    }
    void submit({ contact, source: "homepage-waitlist", website });
  };

  return (
    <section id="waitlist" className="relative overflow-hidden bg-sun/45 py-24 md:py-32">
      <div aria-hidden className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-blush/60 blur-3xl" />
      <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-6 md:px-12 lg:grid-cols-[1.2fr_0.8fr]">
        <div>
          <SectionLabel n="07b">Early access</SectionLabel>
          <RevealText
            text={"Join Drop 01\nWaitlist."}
            accent={["Drop", "01"]}
            className="mt-4 font-display text-[clamp(2.2rem,5vw,4.4rem)] font-extrabold leading-[1] tracking-tight"
          />
          <p className="mt-5 max-w-xl text-lg text-plum/80">
            Get early access to the ₹{PRICING.kit} Starter Kit and first-pull odds on the {RARITIES.secret.oddsPct}% Secret{" "}
            {GOLDEN.name} shell.
          </p>

          <div className="mt-8 min-h-[7.5rem] max-w-xl">
            <AnimatePresence mode="wait" initial={false}>
              {state === "done" ? (
                <motion.div key="done" role="status" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-4 rounded-[2rem] bg-cream p-6 shadow-soft">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-mint">
                    <Check size={22} strokeWidth={3} />
                  </span>
                  <div>
                    <p className="font-display text-lg font-bold">You&rsquo;re on the Drop 01 list.</p>
                    <p className="text-sm text-plum/70">We&rsquo;ll reach out when early access opens. Nothing is on sale yet.</p>
                  </div>
                </motion.div>
              ) : (
                <motion.form key="form" onSubmit={onSubmit} noValidate exit={{ opacity: 0, y: -10 }} className="space-y-3">
                  <div className="flex flex-col gap-3 rounded-[2rem] bg-cream p-2 shadow-soft sm:flex-row sm:rounded-full">
                    <label htmlFor="waitlist-contact" className="sr-only">
                      Email or WhatsApp number
                    </label>
                    <input
                      id="waitlist-contact"
                      inputMode="email"
                      autoComplete="email"
                      value={contact}
                      onChange={(e) => setContact(e.target.value)}
                      placeholder="Email or WhatsApp (+91…)"
                      aria-invalid={Boolean(fieldError)}
                      aria-describedby={fieldError ? "waitlist-error" : "waitlist-note"}
                      className="min-w-0 flex-1 rounded-full bg-transparent px-6 py-4 placeholder:text-plum/45 focus:outline-none"
                    />
                    <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden value={website} onChange={(e) => setWebsite(e.target.value)} className="hidden" />
                    <Button type="submit" disabled={state === "sending"}>
                      {state === "sending" ? "Joining…" : "Join the waitlist"}
                    </Button>
                  </div>
                  {(fieldError || (state === "error" && error)) && (
                    <p id="waitlist-error" role="alert" className="text-sm text-berry">
                      {fieldError ?? error}
                    </p>
                  )}
                  <p id="waitlist-note" className="text-xs text-plum/65">
                    We&rsquo;ll only use this to contact you about LUMI Drop 01. Concept stage: pricing and odds are proposals.
                  </p>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-xs">
          <div className="absolute inset-0 -z-10 rounded-full bg-[radial-gradient(circle,rgba(246,196,83,0.45),transparent_65%)]" />
          <ProductArt shell={GOLDEN.shell} deep={GOLDEN.deep} charm={GOLDEN.charm} finish={GOLDEN.finish} />
          <div className="mt-4 flex justify-center">
            <StatusTag kind="proposed" tone="plum" label={`${"★".repeat(RARITIES.secret.stars)} Secret · ${RARITIES.secret.oddsPct}% proposed odds`} />
          </div>
        </div>
      </div>
    </section>
  );
}
