import assert from "node:assert/strict";
import { afterEach, test } from "node:test";
import { organizationData, pageMetadata, productStructuredData, SITE_URL } from "../lib/seo.ts";
import sitemap from "../app/sitemap.ts";
import robots from "../app/robots.ts";

const originalEnv = process.env.VERCEL_ENV;
afterEach(() => { if (originalEnv === undefined) delete process.env.VERCEL_ENV; else process.env.VERCEL_ENV = originalEnv; });

test("page and social metadata share a canonical production URL and accurate title", () => {
  process.env.VERCEL_ENV = "production";
  const result = pageMetadata({ title: "Assam Tea", description: "Tea from Upper Assam.", path: "/teas" });
  assert.deepEqual(result.title, { absolute: "Assam Tea | AFT Techno Trade" });
  assert.equal(result.alternates?.canonical, `${SITE_URL}/teas`);
  assert.equal(result.openGraph?.title, "Assam Tea | AFT Techno Trade");
  assert.equal(result.twitter?.description, "Tea from Upper Assam.");
  assert.deepEqual(result.robots, { index: true, follow: true });
});

test("preview metadata, robots and sitemap prevent preview indexing", () => {
  process.env.VERCEL_ENV = "preview";
  const result = pageMetadata({ title: "Contact", description: "Contact AFT.", path: "/contact" });
  assert.deepEqual(result.robots, { index: false, follow: false, noarchive: true });
  assert.equal(result.alternates?.canonical, `${SITE_URL}/contact`);
  assert.deepEqual(sitemap(), []);
  assert.deepEqual(robots().rules, [{ userAgent: "*", disallow: "/" }]);
});

test("sitemap excludes redirects and noindex legal drafts", () => {
  process.env.VERCEL_ENV = "production";
  const urls = sitemap().map((entry) => entry.url);
  assert.equal(new Set(urls).size, urls.length);
  assert(urls.includes(`${SITE_URL}/teas/golden-pearl`));
  for (const path of ["/golden-pearl", "/privacy", "/terms", "/api/enquiries"]) assert(!urls.includes(`${SITE_URL}${path}`));
  assert.equal(robots().sitemap, `${SITE_URL}/sitemap.xml`);
});

test("structured data includes both contacts without unverified commercial offers", () => {
  assert.deepEqual(organizationData.contactPoint.map((point) => point.telephone), ["+919435746167", "+917086047498"]);
  const data = productStructuredData({ name: "Golden Pearl", slug: "golden-pearl", description: "Handcrafted tea.", image: "/images/story/golden-pearl-jar.png", brand: "Nahorchukbari" });
  assert.equal(data["@graph"][0]["@type"], "Product");
  assert(!JSON.stringify(data).includes('"offers"'));
  assert(!JSON.stringify(data).includes('"aggregateRating"'));
  assert.equal(data["@graph"][1]["@type"], "BreadcrumbList");
});
