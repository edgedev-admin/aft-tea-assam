import { createEnquiryReference, deliverEnquiry, EnquiryDeliveryError, parseEnquiry } from "../../../lib/enquiries.ts";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const maxDuration = 15;

const MAX_BODY_BYTES = 24_000;
const RATE_LIMIT = 5;
const RATE_WINDOW_MS = 10 * 60 * 1000;
const IDEMPOTENCY_TTL_MS = 24 * 60 * 60 * 1000;
const MIN_FORM_AGE_MS = 800;

type RateEntry = { count: number; resetAt: number };
type AcceptedEntry = { reference: string; expiresAt: number };

const globalStore = globalThis as typeof globalThis & {
  __aftEnquiryRates?: Map<string, RateEntry>;
  __aftAcceptedEnquiries?: Map<string, AcceptedEntry>;
};

const rates = globalStore.__aftEnquiryRates ??= new Map<string, RateEntry>();
const accepted = globalStore.__aftAcceptedEnquiries ??= new Map<string, AcceptedEntry>();

function response(body: Record<string, unknown>, status: number, headers?: HeadersInit) {
  return Response.json(body, {
    status,
    headers: {
      "Cache-Control": "no-store",
      ...headers,
    },
  });
}

function getConfig() {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const from = process.env.CONTACT_FROM_EMAIL?.trim();
  const to = process.env.CONTACT_TO_EMAIL?.trim();
  if (!apiKey || !from || !to || /[\r\n]/.test(from + to) || !from.includes("@") || !to.includes("@")) return null;
  return { apiKey, from, to };
}

function isAllowedOrigin(request: Request) {
  const origin = request.headers.get("origin");
  const fetchSite = request.headers.get("sec-fetch-site");
  if (fetchSite && !["same-origin", "same-site", "none"].includes(fetchSite)) return false;
  if (!origin) return true;

  const allowed = new Set([new URL(request.url).origin]);
  const configuredSite = process.env.SITE_URL?.trim();
  if (configuredSite) {
    try { allowed.add(new URL(configuredSite).origin); } catch { return false; }
  }
  return allowed.has(origin);
}

function clientKey(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return forwarded || request.headers.get("x-real-ip")?.trim() || "unknown";
}

function checkRateLimit(key: string, now = Date.now()) {
  for (const [storedKey, entry] of rates) if (entry.resetAt <= now) rates.delete(storedKey);
  const current = rates.get(key);
  if (!current) {
    rates.set(key, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return { allowed: true, retryAfter: 0 };
  }
  if (current.count >= RATE_LIMIT) return { allowed: false, retryAfter: Math.ceil((current.resetAt - now) / 1000) };
  current.count += 1;
  return { allowed: true, retryAfter: 0 };
}

function idempotencyKey(request: Request) {
  const value = request.headers.get("idempotency-key")?.trim();
  return value && /^[A-Za-z0-9_-]{16,100}$/.test(value) ? value : null;
}

export async function GET() {
  return response({ configured: Boolean(getConfig()) }, 200);
}

export async function POST(request: Request) {
  if (!isAllowedOrigin(request)) return response({ ok: false, code: "origin_rejected" }, 403);
  if (!request.headers.get("content-type")?.toLowerCase().startsWith("application/json")) return response({ ok: false, code: "invalid_content_type" }, 415);

  const length = Number(request.headers.get("content-length") || 0);
  if (length > MAX_BODY_BYTES) return response({ ok: false, code: "payload_too_large" }, 413);

  const key = idempotencyKey(request);
  if (!key) return response({ ok: false, code: "invalid_idempotency_key" }, 400);

  const now = Date.now();
  for (const [storedKey, entry] of accepted) if (entry.expiresAt <= now) accepted.delete(storedKey);
  const previous = accepted.get(key);
  if (previous) return response({ ok: true, status: "accepted", reference: previous.reference, duplicate: true }, 202);

  let rawBody: string;
  try {
    rawBody = await request.text();
  } catch {
    return response({ ok: false, code: "invalid_payload" }, 400);
  }
  if (new TextEncoder().encode(rawBody).byteLength > MAX_BODY_BYTES) return response({ ok: false, code: "payload_too_large" }, 413);

  let parsedJson: unknown;
  try {
    parsedJson = JSON.parse(rawBody);
  } catch {
    return response({ ok: false, code: "invalid_json" }, 400);
  }

  const parsed = parseEnquiry(parsedJson);
  if (!parsed.success) {
    const fieldErrors = parsed.error.flatten().fieldErrors;
    return response({ ok: false, code: "validation_failed", fieldErrors }, 400);
  }
  if (parsed.data.companyWebsite) return response({ ok: false, code: "invalid_submission" }, 400);
  if (parsed.data.formStartedAt > now + 60_000 || parsed.data.formStartedAt < now - 24 * 60 * 60 * 1000) {
    return response({ ok: false, code: "expired_form" }, 400);
  }
  if (now - parsed.data.formStartedAt < MIN_FORM_AGE_MS) return response({ ok: false, code: "invalid_submission" }, 400);

  const rate = checkRateLimit(clientKey(request), now);
  if (!rate.allowed) return response({ ok: false, code: "rate_limited" }, 429, { "Retry-After": String(rate.retryAfter) });

  const config = getConfig();
  if (!config) return response({ ok: false, code: "service_unavailable" }, 503);

  const reference = createEnquiryReference(key);
  try {
    await deliverEnquiry(parsed.data, reference, key, config);
    accepted.set(key, { reference, expiresAt: now + IDEMPOTENCY_TTL_MS });
    return response({ ok: true, status: "accepted", reference }, 202);
  } catch (error) {
    if (error instanceof EnquiryDeliveryError) {
      if (error.kind === "timeout") return response({ ok: false, code: "provider_timeout" }, 504);
      return response({ ok: false, code: "provider_unavailable" }, 502);
    }
    return response({ ok: false, code: "unexpected_error" }, 500);
  }
}
