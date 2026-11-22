import { validateInquiry } from "@/lib/forms";
import { clientKey, deliver, json, rateLimited, readJson } from "@/lib/server/intake";

/** POST /api/investor-inquiry — "Request Pitch Deck & Intro Call". */
export async function POST(req: Request): Promise<Response> {
  if (rateLimited(clientKey(req, "investor-inquiry"))) {
    return json({ ok: false, error: "Too many attempts. Please try again in a minute." }, 429);
  }
  const body = await readJson(req);
  if (body === null) return json({ ok: false, error: "Invalid request." }, 400);

  // Honeypot: real visitors never see or fill the "website" field.
  if (typeof (body as Record<string, unknown>).website === "string" && (body as Record<string, unknown>).website !== "") {
    return json({ ok: true });
  }

  const result = validateInquiry(body);
  if (!result.ok) return json({ ok: false, error: "Please check the highlighted fields.", fields: result.errors }, 400);

  try {
    await deliver("investor-inquiry", { ...result.data });
    return json({ ok: true });
  } catch (err) {
    console.error("[lumi-intake] investor inquiry delivery failed", err);
    return json({ ok: false, error: "We couldn't send that just now. Please try again or use the contact link." }, 502);
  }
}
