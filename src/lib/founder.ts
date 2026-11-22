/**
 * Founder profile and contact links. Swap the URLs here and every page (investors, footer) updates.
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

/** Public founder contact details, shown on /investors and in the footer. */
export const EMAIL = "sheikarzu@gmail.com";
const WHATSAPP_DIGITS = "916369411388";
export const WHATSAPP_DISPLAY = "+91 63694 11388";

const waLink = (text: string) => `https://wa.me/${WHATSAPP_DIGITS}?text=${encodeURIComponent(text)}`;

/** LUMI's Instagram account, linked from the footer and the Reels section. */
export const INSTAGRAM = {
  handle: "@lumi__in",
  href: "https://www.instagram.com/lumi__in/",
} as const;

export const CONTACT = {
  href: `mailto:${EMAIL}?subject=${encodeURIComponent("LUMI inquiry")}`,
  label: "Email the founder",
  external: false,
} as const;

export const WHATSAPP = {
  href: waLink("Hi Sheik, I found LUMI and would like to connect."),
  label: "WhatsApp",
  external: true,
} as const;

/** "Book a 15-Min Intro Call" opens a WhatsApp chat until a scheduler link exists. */
export const INTRO_CALL = {
  href: waLink("Hi Sheik, I'd like to book a 15-minute intro call about LUMI."),
  external: true,
} as const;
