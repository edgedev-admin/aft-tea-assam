import assert from "node:assert/strict";
import { afterEach, test } from "node:test";
import { META_PIXEL_ID, campaignMetaEvent, challengersMetaCampaign, metaPixelEnabled } from "../lib/meta-pixel.ts";

const originalEnabled = process.env.NEXT_PUBLIC_META_PIXEL_ENABLED;
afterEach(() => {
  if (originalEnabled === undefined) delete process.env.NEXT_PUBLIC_META_PIXEL_ENABLED;
  else process.env.NEXT_PUBLIC_META_PIXEL_ENABLED = originalEnabled;
});

test("Meta Pixel uses the approved public identifier and requires explicit deployment enablement", () => {
  assert.equal(META_PIXEL_ID, "966296406185417");
  delete process.env.NEXT_PUBLIC_META_PIXEL_ENABLED;
  assert.equal(metaPixelEnabled(), false);
  process.env.NEXT_PUBLIC_META_PIXEL_ENABLED = "true";
  assert.equal(metaPixelEnabled(), true);
  process.env.NEXT_PUBLIC_META_PIXEL_ENABLED = "TRUE";
  assert.equal(metaPixelEnabled(), false);
});

test("campaign event mappings contain static campaign metadata only", () => {
  assert.deepEqual(campaignMetaEvent("registration_form_open"), { command: "trackCustom", name: "CSRRegistrationStarted", parameters: { campaign_id: challengersMetaCampaign.id } });
  assert.deepEqual(campaignMetaEvent("form_validation_success"), { command: "trackCustom", name: "CSRRegistrationIntent", parameters: { campaign_id: challengersMetaCampaign.id } });
  assert.deepEqual(campaignMetaEvent("whatsapp_handoff_click"), { command: "track", name: "Contact", parameters: { campaign_id: challengersMetaCampaign.id, contact_channel: "whatsapp" } });
  assert.equal(campaignMetaEvent("landing_view"), null);
  assert.equal(campaignMetaEvent("registration_cta_click"), null);
  const serialized = JSON.stringify(campaignMetaEvent("whatsapp_handoff_click"));
  for (const forbidden of ["phone", "team", "person", "email", "Lead", "CompleteRegistration", "Purchase"]) assert(!serialized.includes(forbidden));
});
