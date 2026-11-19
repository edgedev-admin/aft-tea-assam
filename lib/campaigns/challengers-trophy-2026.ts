export const challengersTrophy = {
  id: "challengers_trophy_2026",
  path: "/csr/challengers-trophy-2026",
  name: "Challengers Trophy 3.0",
  organiser: "Jyoti Jana Kalyan Sangha",
  venue: "Dikom Nahortoli Playground",
  startDate: "2026-12-09",
  endDate: "2026-12-12",
  dates: "9–12 December 2026",
  finalDate: "12 December 2026",
  format: "Light Cosco Day & Night Knock-Out Cricket Tournament",
  performer: "Michel Pator",
  // Keep the archive, but stop enquiry handoffs once the last advertised day ends in Assam.
  archiveAt: "2026-12-13T00:00:00+05:30",
  socialImage: "/csr/challengers-trophy-2026/opengraph-image",
} as const;

// Supplied event contacts. WhatsApp availability is not independently verified.
export const eventContacts = [
  { id: "event-contact-1", display: "+91 9127131534", international: "919127131534" },
  { id: "event-contact-2", display: "+91 9859098252", international: "919859098252" },
  { id: "event-contact-3", display: "+91 9957250489", international: "919957250489" },
  { id: "event-contact-4", display: "+91 7576865179", international: "917576865179" },
  { id: "event-contact-5", display: "+91 9864780298", international: "919864780298" },
] as const;

export type EventEnquiryType = "registration" | "sponsorship" | "general";
export type EventEnquiry = { team: string; person: string; phone: string };
export type EventErrors = Partial<Record<keyof EventEnquiry, string>>;

function clean(value: string) {
  return value.replace(/[\u0000-\u001f\u007f]/g, " ").replace(/\s+/g, " ").trim();
}

export function validateEventEnquiry(input: EventEnquiry): { values: EventEnquiry; errors: EventErrors } {
  const values = { team: clean(input.team), person: clean(input.person), phone: clean(input.phone) };
  const errors: EventErrors = {};
  if (values.team.length < 2 || values.team.length > 120) errors.team = "Enter your team name (2–120 characters).";
  if (values.person.length < 2 || values.person.length > 100) errors.person = "Enter the contact person’s name (2–100 characters).";
  const digits = values.phone.replace(/\D/g, "");
  const mobile = digits.length === 12 && digits.startsWith("91") ? digits.slice(2) : digits.length === 11 && digits.startsWith("0") ? digits.slice(1) : digits;
  if (!/^\+?[\d ()-]+$/.test(values.phone) || (values.phone.startsWith("+") && !/^91\d{10}$/.test(digits)) || !/^[6-9]\d{9}$/.test(mobile) || /^(\d)\1+$/.test(mobile) || values.phone.length > 24) errors.phone = "Enter a valid 10-digit Indian mobile number (+91 optional).";
  else values.phone = `+91 ${mobile}`;
  return { values, errors };
}

export function registrationDestination(value?: string): string | null {
  if (!value || !/^\+?[\d ()-]+$/.test(value.trim())) return null;
  const number = value.replace(/\D/g, "");
  return /^[1-9]\d{7,14}$/.test(number) ? number : null;
}

export function eventHasEnded(now: number = Date.now()) {
  return now >= Date.parse(challengersTrophy.archiveAt);
}

export function eventEnquiryMessage(input: EventEnquiry | EventEnquiryType) {
  if (typeof input === "string") {
    if (input === "sponsorship") return `Hello, I am interested in discussing sponsorship opportunities for Challengers Trophy 3.0 (${challengersTrophy.dates}).\n\nPlease share the relevant sponsorship information.\n\nThank you.`;
    if (input === "general") return `Hello, I would like to enquire about Challengers Trophy 3.0 (${challengersTrophy.dates}) at ${challengersTrophy.venue}.\n\nPlease share the relevant tournament information and organiser guidance.\n\nThank you.`;
    if (input !== "registration") throw new Error("Choose a supported event enquiry type.");
    return `Hello, I would like to enquire about team registration for Challengers Trophy 3.0 (${challengersTrophy.dates}).\n\nPlease confirm team availability and provide the official registration and payment instructions.\n\nThank you.`;
  }
  const { values, errors } = validateEventEnquiry(input);
  if (Object.keys(errors).length) throw new Error("Complete the event enquiry fields before continuing.");
  return `Hello, I would like to enquire about team registration for Challengers Trophy 3.0.\n\nTeam Name: ${values.team}\nContact Person: ${values.person}\nPhone Number: ${values.phone}\n\nTournament: ${challengersTrophy.dates}\nVenue: ${challengersTrophy.venue}\n\nPlease confirm team availability and provide the official registration and payment instructions.\n\nThank you.`;
}

export function eventWhatsAppUrl(destination: string | null, input: EventEnquiry | EventEnquiryType = "registration", now: number = Date.now()) {
  const number = registrationDestination(destination ?? undefined);
  if (!number || !eventContacts.some((contact) => contact.international === number) || eventHasEnded(now)) return null;
  return `https://wa.me/${number}?text=${encodeURIComponent(eventEnquiryMessage(input))}`;
}

export type CampaignEventName = "landing_view" | "registration_cta_click" | "registration_form_open" | "form_validation_success" | "whatsapp_handoff_click" | "sponsorship_enquiry_click";
export type CampaignPlacement = "hero" | "prizes" | "community" | "sticky" | "final" | "form";
export type CampaignAttribution = Partial<Record<"utm_source" | "utm_medium" | "utm_campaign" | "utm_content" | "utm_term", string>>;

export function campaignAttribution(search: string): CampaignAttribution {
  const params = new URLSearchParams(search);
  const result: CampaignAttribution = {};
  for (const key of ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"] as const) {
    const value = params.get(key);
    // Campaign slugs only: discard URLs, emails, phone-like digit runs and free-form text.
    if (value && /^[a-z][a-z0-9_-]{0,63}$/i.test(value) && !/\d{7}/.test(value)) result[key] = value;
  }
  return result;
}

export function campaignEventDetail(event: CampaignEventName, attribution: CampaignAttribution, placement: CampaignPlacement, type?: EventEnquiryType) {
  // Explicit payload construction prevents form fields or arbitrary objects entering analytics.
  return { event, campaign: challengersTrophy.id, path: challengersTrophy.path, placement, enquiry_type: type ?? null, attribution: campaignAttribution(new URLSearchParams(attribution).toString()) };
}
