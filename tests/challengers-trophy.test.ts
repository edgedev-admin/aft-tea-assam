import assert from "node:assert/strict";
import { test } from "node:test";
import { campaignAttribution, campaignEventDetail, challengersTrophy, eventContacts, eventEnquiryMessage, eventHasEnded, eventWhatsAppUrl, registrationDestination, validateEventEnquiry, type EventEnquiry } from "../lib/campaigns/challengers-trophy-2026.ts";

const fixtureDestination = eventContacts[0].international;
const fixture: EventEnquiry = { team: "Dikom XI & Friends", person: "Test Captain", phone: "+1 202 555 0102" };
const during = Date.parse("2026-12-10T15:00:00+05:30");

test("event destination fails closed and never falls back to AFT's contacts", () => {
  assert.equal(registrationDestination(), null);
  assert.equal(registrationDestination(""), null);
  assert.equal(registrationDestination("https://wa.me/919435746167"), null);
  assert.equal(registrationDestination("+91 91271 31534"), fixtureDestination);
  assert.equal(eventWhatsAppUrl(null, fixture, during), null);
  assert.equal(eventWhatsAppUrl("919435746167", fixture, during), null);
  assert.equal(eventWhatsAppUrl("917086047498", fixture, during), null);
});

test("all five published event contacts have the correct country code and encoded registration message", () => {
  assert.deepEqual(eventContacts.map((contact) => contact.international), ["919127131534", "919864780298", "919957250489", "917576865179", "919101442606"]);
  for (const contact of eventContacts) {
    const url = new URL(eventWhatsAppUrl(contact.international, fixture, during)!);
    assert.equal(url.pathname, `/${contact.international}`);
    assert.equal(url.searchParams.get("text"), eventEnquiryMessage(fixture));
  }
});

test("team registration uses exactly the requested three-field WhatsApp message", () => {
  const url = new URL(eventWhatsAppUrl(fixtureDestination, fixture, during)!);
  assert.equal(url.origin, "https://wa.me");
  assert.equal(url.pathname, `/${fixtureDestination}`);
  assert.equal(url.searchParams.get("text"), eventEnquiryMessage(fixture));
  assert.equal(url.searchParams.size, 1);
  assert.match(url.searchParams.get("text")!, /Team Name: Dikom XI & Friends/);
  assert.equal(url.searchParams.get("text"), `Hello, I would like to enquire about registering my team for Challengers Trophy 3.0.\n\nTeam Name: Dikom XI & Friends\nContact Person: Test Captain\nPhone Number: +1 202 555 0102\n\nPlease confirm team availability, registration procedure and official payment details.\n\nThank you.`);
  assert(!url.searchParams.get("text")!.includes("District"));
});

test("sponsorship and general enquiries use distinct, factual messages", () => {
  const sponsorship = eventEnquiryMessage("sponsorship");
  assert.match(sponsorship, /Please share the relevant sponsorship information/);
  assert(!sponsorship.includes("₹3,000"));
  const general = eventEnquiryMessage("general");
  assert.match(general, /relevant tournament information/);
  assert(!general.includes("registered successfully"));
  assert(!eventEnquiryMessage("registration").includes("[Team"));
  assert.match(eventEnquiryMessage("sponsorship"), /sponsorship opportunities/);
  assert.throws(() => eventEnquiryMessage("invented" as "registration"));
});

test("required fields, phone format and length bounds are validated", () => {
  const invalid = validateEventEnquiry({ team: "", person: "", phone: "bad" });
  assert.deepEqual(Object.keys(invalid.errors), ["team", "person", "phone"]);
  assert.equal(Object.keys(validateEventEnquiry(fixture).errors).length, 0);
  assert(validateEventEnquiry({ ...fixture, team: "a".repeat(121) }).errors.team);
  assert(validateEventEnquiry({ ...fixture, phone: "0000000000" }).errors.phone);
  assert.deepEqual(Object.keys(validateEventEnquiry({ ...fixture, location: "Discard", type: "sponsorship" } as EventEnquiry).values), ["team", "person", "phone"]);
  assert.throws(() => eventEnquiryMessage({ ...fixture, person: "" }));
});

test("message values cannot inject a second message field or URL parameter", () => {
  const input = { ...fixture, team: "Team\nPhone: injected &redirect=https://example.invalid" };
  const url = new URL(eventWhatsAppUrl(fixtureDestination, input, during)!);
  assert.equal(url.searchParams.size, 1);
  assert.equal(url.searchParams.get("redirect"), null);
  assert(!url.searchParams.get("text")!.includes("\nPhone: injected"));
});

test("archive closes handoffs after the final day in Assam, including already-open pages", () => {
  assert.equal(eventHasEnded(Date.parse("2026-12-11T23:59:59+05:30")), false);
  assert.equal(eventHasEnded(Date.parse(challengersTrophy.archiveAt)), true);
  assert.equal(eventWhatsAppUrl(fixtureDestination, fixture, Date.parse(challengersTrophy.archiveAt)), null);
});

test("tracking payloads accept campaign slugs and exclude personal form data", () => {
  const attribution = campaignAttribution("?utm_source=instagram&utm_medium=paid_social&utm_campaign=challengers_2026&utm_content=poster_a&utm_term=upper_assam&phone=919435746167&name=Test");
  assert.equal(Object.keys(attribution).length, 5);
  const detail = campaignEventDetail("whatsapp_handoff_click", attribution, "form", "registration");
  assert.equal(detail.event, "whatsapp_handoff_click");
  assert(!JSON.stringify(detail).includes(fixture.person));
  assert(!JSON.stringify(detail).includes("919435746167"));
  assert.deepEqual(campaignAttribution("?utm_content=person@example.com&utm_term=phone919435746167&utm_campaign=full%20name"), {});
  assert(!Object.hasOwn(detail, "phone"));
  assert(!Object.hasOwn(detail, "team"));
});
