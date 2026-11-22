/**
 * Founder profile and contact links. Swap the URLs here and every page (investors, footer) updates.
 * No public email has been confirmed yet, so "contact" falls back to the investor inquiry form and
 * "Book a 15-Min Intro Call" falls back to LinkedIn messaging.
 */
export const FOUNDER = {
  name: "Sheik Arzuman",
  initials: "SA",
  role: "Founder, LUMI",
  bio: "Background in backend/IoT engineering and product management, building LUMI at the intersection of connected consumer hardware, sustainable refill packaging, and daily skincare.",
  credentials: [
    { school: "Amrita School of Business", detail: "MBA Candidate, Class of ’28" },
    { school: "VIT Chennai", detail: "B.Tech, Electronics & Communication Engineering" },
  ],
  location: "Coimbatore, Tamil Nadu",
  linkedin: "https://linkedin.com/in/sheikarzuman",
} as const;

/** Placeholder: set to a "mailto:" address once a public founder email is confirmed. */
const CONTACT_EMAIL_HREF = "";

/** Placeholder: set to a Cal.com / Calendly link to make "Book a 15-Min Intro Call" open a scheduler. */
const INTRO_CALL_HREF = "";

export const CONTACT = {
  href: CONTACT_EMAIL_HREF || "/investors#inquiry",
  label: CONTACT_EMAIL_HREF ? "Email the founder" : "Contact the founder",
  external: false,
} as const;

export const INTRO_CALL = {
  href: INTRO_CALL_HREF || FOUNDER.linkedin,
  external: true,
} as const;
