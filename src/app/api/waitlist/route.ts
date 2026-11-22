import { validateWaitlist } from "@/lib/forms";
import { clientKey, deliver, json, rateLimited, readJson } from "@/lib/server/intake";

/** POST /api/waitlist — Drop 01 early-access sign-up (email or WhatsApp). */
export async function POST(req: Request): Promise<Response> {
  if (rateLimited(clientKey(req, "waitlist"))) {
    return json({ ok: false, error: "Too many attempts. Please try again in a minute." }, 429);
  }
  const body = await readJson(req);
  if (body === null) return json({ ok: false, error: "Invalid request." }, 400);

  // Honeypot: real visitors never see or fill the "website" field.
  if (typeof (body as Record<string, unknown>).website === "string" && (body as Record<string, unknown>).website !== "") {
    return json({ ok: true });
  }

  const result = validateWaitlist(body);
  if (!result.ok) return json({ ok: false, error: "Please check the form.", fields: result.errors }, 400);

  try {
    await deliver("waitlist", { ...result.data });
    return json({ ok: true });
  } catch (err) {
    console.error("[lumi-intake] waitlist delivery failed", err);
    return json({ ok: false, error: "We couldn't save that just now. Please try again shortly." }, 502);
  }
}
