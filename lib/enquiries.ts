import { createHash } from "node:crypto";
import { z } from "zod";
import { allEnquiryTypes } from "./enquiry-options.ts";

const optionalText = (max: number) => z.string().trim().max(max).optional().transform((value) => value || undefined);

export const enquirySchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.email().max(254),
  phone: optionalText(40),
  business: optionalText(120),
  type: z.enum(allEnquiryTypes),
  quantity: optionalText(80),
  destination: optionalText(160),
  message: z.string().trim().min(10).max(4000),
  source: z.enum(["contact", "wholesale"]),
  productContext: optionalText(120),
  companyWebsite: optionalText(200),
  formStartedAt: z.number().int().positive(),
}).strict();

export type Enquiry = z.infer<typeof enquirySchema>;

export type EnquiryConfig = {
  apiKey: string;
  from: string;
  to: string;
};

export class EnquiryDeliveryError extends Error {
  readonly kind: "rejected" | "timeout" | "network";
  readonly providerStatus?: number;

  constructor(kind: "rejected" | "timeout" | "network", providerStatus?: number) {
    super(`Enquiry delivery ${kind}`);
    this.kind = kind;
    this.providerStatus = providerStatus;
  }
}

export function parseEnquiry(value: unknown) {
  return enquirySchema.safeParse(value);
}

export function createEnquiryReference(idempotencyKey: string, now = new Date()) {
  const day = now.toISOString().slice(0, 10).replaceAll("-", "");
  const digest = createHash("sha256").update(idempotencyKey).digest("hex").slice(0, 8).toUpperCase();
  return `AFT-${day}-${digest}`;
}

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  })[character] ?? character);
}

function cleanSubject(value: string) {
  return value.replace(/[\r\n]+/g, " ").replace(/[^\p{L}\p{N}\s&/(),.'+-]/gu, "").trim().slice(0, 90);
}

export function buildEnquiryEmail(enquiry: Enquiry, reference: string, submittedAt = new Date()) {
  const businessOrName = enquiry.business || enquiry.name;
  const subject = cleanSubject(`[AFT Enquiry] ${enquiry.type} - ${businessOrName}`);
  const fields = [
    ["Enquiry reference", reference],
    ["Submitted", submittedAt.toISOString()],
    ["Source", enquiry.source === "wholesale" ? "Wholesale page" : "Contact page"],
    ["Customer name", enquiry.name],
    ["Customer email", enquiry.email],
    ["Phone / WhatsApp", enquiry.phone],
    ["Business / organisation", enquiry.business],
    ["Enquiry category", enquiry.type],
    ["Approximate quantity", enquiry.quantity],
    ["Delivery destination", enquiry.destination],
    ["Product context", enquiry.productContext],
  ].filter((field): field is [string, string] => Boolean(field[1]));

  const rows = fields.map(([label, value]) => `<tr><td style="padding:10px 12px;border-bottom:1px solid #e3e0d8;color:#66746b;font:600 12px Arial,sans-serif;vertical-align:top">${escapeHtml(label)}</td><td style="padding:10px 12px;border-bottom:1px solid #e3e0d8;color:#1c2821;font:400 14px Arial,sans-serif;vertical-align:top">${escapeHtml(value)}</td></tr>`).join("");
  const textFields = fields.map(([label, value]) => `${label}: ${value}`).join("\n");

  return {
    subject,
    html: `<!doctype html><html><body style="margin:0;background:#f8f6f1;padding:24px"><main style="max-width:680px;margin:0 auto;background:#ffffff;border:1px solid #d9d5cb"><header style="padding:28px 30px;background:#153b2b;color:#ffffff"><p style="margin:0 0 8px;color:#f3c846;font:700 11px Arial,sans-serif;letter-spacing:1px">AFT TECHNO TRADE</p><h1 style="margin:0;font:400 26px Georgia,serif">New website enquiry</h1></header><table role="presentation" style="width:100%;border-collapse:collapse"><tbody>${rows}</tbody></table><section style="padding:24px 30px"><h2 style="margin:0 0 10px;color:#1c2821;font:400 20px Georgia,serif">Message</h2><p style="margin:0;white-space:pre-wrap;color:#34453b;font:400 14px/1.7 Arial,sans-serif">${escapeHtml(enquiry.message)}</p></section><footer style="padding:18px 30px;border-top:1px solid #e3e0d8;color:#71816b;font:400 11px/1.5 Arial,sans-serif">Submitted through the AFT Techno Trade website. Reply to this email to respond to ${escapeHtml(enquiry.name)}.</footer></main></body></html>`,
    text: `New enquiry - AFT Techno Trade\n\n${textFields}\n\nMessage:\n${enquiry.message}\n\nSubmitted through the AFT Techno Trade website.`,
  };
}

export async function deliverEnquiry(
  enquiry: Enquiry,
  reference: string,
  idempotencyKey: string,
  config: EnquiryConfig,
  fetchImplementation: typeof fetch = fetch,
) {
  const email = buildEnquiryEmail(enquiry, reference);
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10_000);

  try {
    const response = await fetchImplementation("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${config.apiKey}`,
        "Content-Type": "application/json",
        "Idempotency-Key": idempotencyKey,
      },
      body: JSON.stringify({
        from: config.from,
        to: [config.to],
        reply_to: enquiry.email,
        subject: email.subject,
        html: email.html,
        text: email.text,
      }),
      signal: controller.signal,
    });

    if (!response.ok) throw new EnquiryDeliveryError("rejected", response.status);
    const result = await response.json() as { id?: string };
    if (!result.id) throw new EnquiryDeliveryError("rejected", response.status);
    return result.id;
  } catch (error) {
    if (error instanceof EnquiryDeliveryError) throw error;
    if (error instanceof DOMException && error.name === "AbortError") throw new EnquiryDeliveryError("timeout");
    throw new EnquiryDeliveryError("network");
  } finally {
    clearTimeout(timeout);
  }
}
