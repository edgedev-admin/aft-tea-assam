import assert from "node:assert/strict";
import { existsSync,readFileSync } from "node:fs";
import {createHash} from "node:crypto";
import { test } from "node:test";
import { museumGalleries, museumPhotographs,pavilionAssets } from "../lib/tea-museum-exhibits.ts";
import { storyPhotos } from "../lib/photographic-stories.ts";
import { studioProducts } from "../lib/tea-studio-products.ts";

test("museum photographs have existing public originals and verified publication metadata", () => {
  assert.equal(museumPhotographs.length, 3);
  for (const image of Object.values(museumPhotographs)) {
    const source = storyPhotos.find(photo => photo.id === image.id);
    assert(source);
    assert.equal(source.publicationApproval, "not-applicable");
    assert.equal(source.containsPeople, false);
    assert.equal(source.sourceFile, image.sourceFile);
    assert(existsSync(new URL(`../public${image.src}`, import.meta.url)));
    assert(image.width >= 2200 && image.height >= 1467);
    assert(Math.abs(image.width / image.height - 1.5) < .002);
    assert(image.alt.length > 15);
    assert(!/enhanced|generated/i.test(image.sourceFile));
  }
});

test("four gallery accents share the same baked pavilion and genuine photo provenance", () => {
  assert.deepEqual(Object.keys(museumGalleries), studioProducts.map(product => product.id));
  assert.equal(new Set(Object.values(museumGalleries).map(gallery => gallery.accent)).size, 4);
  assert.equal(new Set(Object.values(museumGalleries).map(gallery => gallery.wash)).size, 4);
  for (const gallery of Object.values(museumGalleries)) {
    for (const colour of [gallery.accent, gallery.wash]) assert.match(colour, /^#[0-9a-f]{6}$/);
  }
  const manifest=JSON.parse(readFileSync(new URL("../assets/tea-pavilion/bake-manifest.json",import.meta.url),"utf8"));
  for(const source of manifest.photoSources){const bytes=readFileSync(new URL(`../${source.source}`,import.meta.url));assert.equal(createHash("sha256").update(bytes).digest("hex"),source.sha256);}
  for(const asset of Object.values(pavilionAssets)){assert(existsSync(new URL(`../public${asset.src}`,import.meta.url)));assert(asset.width>=768&&asset.height>=992);}
});
