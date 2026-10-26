import assert from "node:assert/strict";
import { test } from "node:test";
import { businessContacts, phoneHref } from "../lib/company.ts";
import { generalWhatsAppMessage, whatsappContextForPath, whatsappMessage, whatsappUrl, wholesaleWhatsAppMessage } from "../lib/whatsapp.ts";

test("both business numbers have valid tel and WhatsApp destinations", () => {
  assert.deepEqual(businessContacts.map((contact) => contact.international), ["919435746167", "917086047498"]);
  for (const contact of businessContacts) {
    assert.equal(phoneHref(contact), `tel:+${contact.international}`);
    const url = new URL(whatsappUrl(contact));
    assert.equal(url.origin, "https://wa.me");
    assert.equal(url.pathname, `/${contact.international}`);
    assert.equal(url.searchParams.get("text"), generalWhatsAppMessage);
    assert.deepEqual([...url.searchParams.keys()], ["text"]);
  }
});

test("wholesale context is selected by route for both contacts", () => {
  for (const contact of businessContacts) {
    assert.equal(new URL(whatsappUrl(contact, whatsappContextForPath("/wholesale"))).searchParams.get("text"), wholesaleWhatsAppMessage);
    assert.equal(new URL(whatsappUrl(contact, whatsappContextForPath("/contact"))).searchParams.get("text"), generalWhatsAppMessage);
  }
});

test("product names remain intact and cannot introduce URL parameters", () => {
  const name = "Golden Pearl & Assam Tea? #1 / চাহ";
  for (const contact of businessContacts) {
    const context = whatsappContextForPath("/teas/golden-pearl", name);
    const url = new URL(whatsappUrl(contact, context));
    assert.equal(url.searchParams.get("text"), `Hello AFT Techno Trade, I am interested in ${name}. Please share more information about this tea and the enquiry process.`);
    assert.deepEqual([...url.searchParams.keys()], ["text"]);
    assert.equal(url.hash, "");
  }
});

test("invalid destinations and missing product names fail safely", () => {
  for (const international of ["+919435746167", "919435746167?x=1", "09435746167", ""]) assert.throws(() => whatsappUrl({ international }));
  assert.throws(() => whatsappMessage({ kind: "product", productName: " " }));
});
