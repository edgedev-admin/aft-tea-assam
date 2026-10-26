import assert from "node:assert/strict";
import { afterEach, test } from "node:test";
import { buildEnquiryEmail, deliverEnquiry, EnquiryDeliveryError, parseEnquiry, type Enquiry } from "../lib/enquiries.ts";
import { GET, POST } from "../app/api/enquiries/route.ts";

const validEnquiry: Enquiry = {
  name: "Test Buyer",
  email: "buyer@example.com",
  phone: "+91 90000 00000",
  business: "Example Tea Co",
  type: "Wholesale / Bulk Supply",
  quantity: "100-500 kg",
  destination: "Kolkata, India",
  message: "We would like to discuss a commercial Assam tea requirement.",
  source: "contact",
  productContext: undefined,
  companyWebsite: undefined,
  formStartedAt: Date.now() - 2_000,
};

const originalFetch = globalThis.fetch;
const originalEnv = {
  RESEND_API_KEY: process.env.RESEND_API_KEY,
  CONTACT_FROM_EMAIL: process.env.CONTACT_FROM_EMAIL,
  CONTACT_TO_EMAIL: process.env.CONTACT_TO_EMAIL,
  SITE_URL: process.env.SITE_URL,
};

afterEach(() => {
  globalThis.fetch = originalFetch;
  for (const [key, value] of Object.entries(originalEnv)) {
    if (value === undefined) delete process.env[key];
    else process.env[key] = value;
  }
});

function configureEmail() {
  process.env.RESEND_API_KEY = "re_test_key";
  process.env.CONTACT_FROM_EMAIL = "AFT Enquiries <enquiries@example.com>";
  process.env.CONTACT_TO_EMAIL = "hmtea2019@gmail.com";
  process.env.SITE_URL = "https://afttechnotrade.com";
}

function request(payload: unknown, key: string, ip: string) {
  return new Request("https://afttechnotrade.com/api/enquiries", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Idempotency-Key": key,
      Origin: "https://afttechnotrade.com",
      "x-forwarded-for": ip,
    },
    body: JSON.stringify(payload),
  });
}

test("validates the complete enquiry contract and rejects unknown fields", () => {
  assert.equal(parseEnquiry(validEnquiry).success, true);
  assert.equal(parseEnquiry({ ...validEnquiry, unexpected: "field" }).success, false);
  assert.equal(parseEnquiry({ ...validEnquiry, email: "invalid" }).success, false);
  assert.equal(parseEnquiry({ ...validEnquiry, message: "short" }).success, false);
});

test("escapes customer content in the HTML email", () => {
  const email = buildEnquiryEmail({ ...validEnquiry, name: "<script>alert(1)</script>", message: "Tea & <b>details</b>" }, "AFT-TEST");
  assert.doesNotMatch(email.html, /<script>/);
  assert.match(email.html, /&lt;script&gt;/);
  assert.match(email.html, /Tea &amp; &lt;b&gt;details&lt;\/b&gt;/);
  assert.match(email.text, /Tea & <b>details<\/b>/);
});

test("sends Resend-compatible HTML and text with reply-to and idempotency", async () => {
  let sentBody: Record<string, unknown> | undefined;
  let sentHeaders: Headers | undefined;
  const fakeFetch: typeof fetch = async (_input, init) => {
    sentBody = JSON.parse(String(init?.body));
    sentHeaders = new Headers(init?.headers);
    return Response.json({ id: "email_123" });
  };
  const id = await deliverEnquiry(validEnquiry, "AFT-TEST", "submission_123456789", {
    apiKey: "re_test",
    from: "AFT <enquiries@example.com>",
    to: "hmtea2019@gmail.com",
  }, fakeFetch);
  assert.equal(id, "email_123");
  assert.equal(sentBody?.reply_to, validEnquiry.email);
  assert.equal(sentBody?.to instanceof Array, true);
  assert.equal(sentHeaders?.get("Idempotency-Key"), "submission_123456789");
});

test("classifies provider rejection and timeout without reporting acceptance", async () => {
  await assert.rejects(
    deliverEnquiry(validEnquiry, "AFT-TEST", "submission_123456789", { apiKey: "x", from: "a@example.com", to: "b@example.com" }, async () => new Response("rejected", { status: 422 })),
    (error) => error instanceof EnquiryDeliveryError && error.kind === "rejected" && error.providerStatus === 422,
  );
  await assert.rejects(
    deliverEnquiry(validEnquiry, "AFT-TEST", "submission_123456789", { apiKey: "x", from: "a@example.com", to: "b@example.com" }, async () => { throw new DOMException("aborted", "AbortError"); }),
    (error) => error instanceof EnquiryDeliveryError && error.kind === "timeout",
  );
});

test("reports configuration readiness without exposing configuration", async () => {
  delete process.env.RESEND_API_KEY;
  delete process.env.CONTACT_FROM_EMAIL;
  delete process.env.CONTACT_TO_EMAIL;
  assert.deepEqual(await GET().then((response) => response.json()), { configured: false });
  configureEmail();
  assert.deepEqual(await GET().then((response) => response.json()), { configured: true });
});

test("validates the browser origin against the incoming host when Next rewrites its internal URL", async () => {
  const headers = { Host: "127.0.0.1:3100", Origin: "http://127.0.0.1:3100", "x-forwarded-proto": "http", "Content-Type": "application/json", "Idempotency-Key": "origin_regression_123456789" };
  const response = await POST(new Request("http://localhost:3100/api/enquiries", { method: "POST", headers, body: "{}" }));
  assert.equal(response.status, 400);
  assert.equal((await response.json()).code, "validation_failed");
  const rejected = await POST(new Request("http://localhost:3100/api/enquiries", { method: "POST", headers: { ...headers, Origin: "https://untrusted.invalid" }, body: "{}" }));
  assert.equal(rejected.status, 403);
});

test("accepts a provider-confirmed enquiry once and deduplicates a retry", async () => {
  configureEmail();
  let sends = 0;
  globalThis.fetch = async () => { sends += 1; return Response.json({ id: "email_accepted" }); };
  const key = "accepted_submission_123456789";
  const first = await POST(request(validEnquiry, key, "203.0.113.10"));
  const second = await POST(request(validEnquiry, key, "203.0.113.10"));
  assert.equal(first.status, 202);
  assert.equal(second.status, 202);
  assert.equal(sends, 1);
  assert.equal((await second.json()).duplicate, true);
});

test("rejects honeypot submissions, invalid origins, and excess requests", async () => {
  configureEmail();
  globalThis.fetch = async () => Response.json({ id: "email_accepted" });
  const bot = await POST(request({ ...validEnquiry, companyWebsite: "spam.example" }, "honeypot_submission_123456", "203.0.113.20"));
  assert.equal(bot.status, 400);

  const tooFast = await POST(request({ ...validEnquiry, formStartedAt: Date.now() }, "fast_submission_123456789", "203.0.113.21"));
  assert.equal(tooFast.status, 400);

  const wrongOrigin = new Request("https://afttechnotrade.com/api/enquiries", {
    method: "POST",
    headers: { "Content-Type": "application/json", "Idempotency-Key": "wrong_origin_submission_123", Origin: "https://evil.example" },
    body: JSON.stringify(validEnquiry),
  });
  assert.equal((await POST(wrongOrigin)).status, 403);

  delete process.env.RESEND_API_KEY;
  const statuses: number[] = [];
  for (let index = 0; index < 6; index += 1) {
    statuses.push((await POST(request(validEnquiry, `rate_limit_submission_${index}_12345`, "203.0.113.30"))).status);
  }
  assert.deepEqual(statuses, [503, 503, 503, 503, 503, 429]);
});
