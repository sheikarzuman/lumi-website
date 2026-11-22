/**
 * Server-only module: import it from route handlers (app/api/*), never from client components.
 *
 * Server-side intake for the waitlist and investor forms: rate limiting and delivery.
 *
 * Delivery: if LUMI_FORMS_WEBHOOK_URL is set (e.g. a Google Apps Script, Zapier, Make or Slack webhook),
 * each submission is POSTed there as JSON. Without it, submissions are written to the server log only
 * (visible in Vercel → Logs) so nothing is silently dropped while no store is connected.
 */

const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 5;
const WEBHOOK_TIMEOUT_MS = 8000;
export const MAX_BODY_BYTES = 8 * 1024;

// Best effort on serverless (per instance), but it stops naive bursts and double-submits.
const hits = new Map<string, number[]>();

export function rateLimited(key: string, now = Date.now()): boolean {
  const recent = (hits.get(key) ?? []).filter((t) => now - t < WINDOW_MS);
  const limited = recent.length >= MAX_PER_WINDOW;
  hits.set(key, limited ? recent : [...recent, now]);
  return limited;
}

export function clientKey(req: Request, route: string): string {
  const fwd = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return `${route}:${fwd || req.headers.get("x-real-ip") || "unknown"}`;
}

export type SubmissionType = "waitlist" | "investor-inquiry";

export async function deliver(type: SubmissionType, data: Record<string, unknown>): Promise<void> {
  const payload = { type, submittedAt: new Date().toISOString(), data };
  const url = process.env.LUMI_FORMS_WEBHOOK_URL;
  if (!url) {
    console.info("[lumi-intake] no LUMI_FORMS_WEBHOOK_URL set; logging submission", JSON.stringify(payload));
    return;
  }
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(WEBHOOK_TIMEOUT_MS),
  });
  if (!res.ok) throw new Error(`Webhook responded ${res.status}`);
}

/** Parses a JSON body with a size cap; returns null when it is missing, too large or not JSON. */
export async function readJson(req: Request): Promise<unknown | null> {
  const text = await req.text();
  if (!text || text.length > MAX_BODY_BYTES) return null;
  try {
    return JSON.parse(text) as unknown;
  } catch {
    return null;
  }
}

export const json = (body: unknown, status = 200): Response => Response.json(body, { status });
