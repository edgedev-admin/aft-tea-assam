export const META_PIXEL_ID = "966296406185417";
export const META_PIXEL_SCRIPT_SRC = "https://connect.facebook.net/en_US/fbevents.js";
export const META_PIXEL_CONSENT_KEY = "aft.advertising-consent.v1";

export type AdvertisingConsent = "unknown" | "granted" | "denied";
export type MetaPixelCommand = "track" | "trackCustom";

export const challengersMetaCampaign = {
  id: "challengers_trophy_3_2026",
  path: "/csr/challengers-trophy-2026",
  contentName: "Challengers Trophy 3.0",
} as const;

export function metaPixelEnabled() {
  // This public build-time flag must only be set for the production deployment.
  // It keeps localhost and Vercel Preview traffic out of the live business pixel.
  return process.env.NEXT_PUBLIC_META_PIXEL_ENABLED === "true";
}

export function isAdvertisingConsent(value: string | null): value is Exclude<AdvertisingConsent, "unknown"> {
  return value === "granted" || value === "denied";
}

export function campaignMetaEvent(event: string): { command: MetaPixelCommand; name: string; parameters: Record<string, string> } | null {
  const campaign = { campaign_id: challengersMetaCampaign.id };
  switch (event) {
    case "registration_form_open":
      return { command: "trackCustom", name: "CSRRegistrationStarted", parameters: campaign };
    case "form_validation_success":
      return { command: "trackCustom", name: "CSRRegistrationIntent", parameters: campaign };
    case "whatsapp_handoff_click":
      return { command: "track", name: "Contact", parameters: { ...campaign, contact_channel: "whatsapp" } };
    default:
      return null;
  }
}
