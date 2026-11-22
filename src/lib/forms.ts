/**
 * Shared, dependency-free validation for the waitlist and investor forms.
 * Runs on the client (instant feedback) and again in the API routes (never trust the client).
 */

export const INVESTOR_CATEGORIES = [
  "Angel Investor",
  "Micro-VC / Fund",
  "Incubator / Grant Body",
  "Formulation / Manufacturing Partner",
] as const;
export type InvestorCategory = (typeof INVESTOR_CATEGORIES)[number];

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_DIGITS_MIN = 7;
const PHONE_DIGITS_MAX = 15;
const LIMITS = { name: 120, email: 254, organization: 160, note: 1000, contact: 254 } as const;

export type FieldErrors<K extends string> = Partial<Record<K, string>>;
export type Result<T, K extends string> = { ok: true; data: T } | { ok: false; errors: FieldErrors<K> };

const str = (v: unknown): string => (typeof v === "string" ? v.trim() : "");

export const isEmail = (v: string): boolean => v.length <= LIMITS.email && EMAIL.test(v);

/** WhatsApp number: optional "+", digits with spaces/dashes/brackets, 7–15 digits in total. */
export function normalisePhone(v: string): string | null {
  if (!/^\+?[\d\s\-()]+$/.test(v)) return null;
  const digits = v.replace(/\D/g, "");
  if (digits.length < PHONE_DIGITS_MIN || digits.length > PHONE_DIGITS_MAX) return null;
  return `${v.startsWith("+") ? "+" : ""}${digits}`;
}

export interface WaitlistEntry {
  contact: string;
  channel: "email" | "whatsapp";
  source: string;
}

export function validateWaitlist(input: unknown): Result<WaitlistEntry, "contact"> {
  const body = (input ?? {}) as Record<string, unknown>;
  const raw = str(body.contact);
  const source = str(body.source).slice(0, 40) || "homepage";
  if (!raw) return { ok: false, errors: { contact: "Enter your email or WhatsApp number." } };
  if (raw.includes("@")) {
    return isEmail(raw.toLowerCase())
      ? { ok: true, data: { contact: raw.toLowerCase(), channel: "email", source } }
      : { ok: false, errors: { contact: "That email doesn't look right." } };
  }
  const phone = normalisePhone(raw);
  return phone
    ? { ok: true, data: { contact: phone, channel: "whatsapp", source } }
    : { ok: false, errors: { contact: "Enter a valid email or WhatsApp number (with country code)." } };
}

export interface InvestorInquiry {
  name: string;
  email: string;
  organization: string;
  category: InvestorCategory;
  note: string;
}
type InquiryField = keyof InvestorInquiry;

export function validateInquiry(input: unknown): Result<InvestorInquiry, InquiryField> {
  const b = (input ?? {}) as Record<string, unknown>;
  const data = {
    name: str(b.name),
    email: str(b.email).toLowerCase(),
    organization: str(b.organization),
    category: str(b.category),
    note: str(b.note),
  };
  const errors: FieldErrors<InquiryField> = {};
  if (!data.name) errors.name = "Please add your name.";
  else if (data.name.length > LIMITS.name) errors.name = "That name is too long.";
  if (!isEmail(data.email)) errors.email = "Please use a valid work email.";
  if (!data.organization) errors.organization = "Add your organisation, fund or network.";
  else if (data.organization.length > LIMITS.organization) errors.organization = "That's too long.";
  if (!(INVESTOR_CATEGORIES as readonly string[]).includes(data.category)) errors.category = "Choose a category.";
  if (data.note.length > LIMITS.note) errors.note = `Keep the note under ${LIMITS.note} characters.`;
  return Object.keys(errors).length > 0
    ? { ok: false, errors }
    : { ok: true, data: { ...data, category: data.category as InvestorCategory } };
}
