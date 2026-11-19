import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { test } from "node:test";
import { studioProducts, studioEnquiryMessage } from "../lib/tea-studio-products.ts";
import { whatsappUrl } from "../lib/whatsapp.ts";
import { cinematicEase, studioCameraFraming, studioInspectionYaw, studioTransitionDuration, studioTransitionFrame, studioTransitionTiming } from "../lib/tea-studio-motion.ts";

const manifest = JSON.parse(readFileSync(new URL("../public/3d/asset-manifest.json", import.meta.url), "utf8"));

test("all four supplied GLBs are byte-identical to the handoff and self-contained", () => {
  assert.equal(studioProducts.length, 4);
  for (const product of studioProducts) {
    const source = manifest.products.find((entry: { id: string }) => entry.id === product.id);
    assert(source); assert.equal(product.frontAzimuth, 0); assert.equal(source.front, "+Z");
    const bytes = readFileSync(new URL(`../public${product.model}`, import.meta.url));
    assert.equal(createHash("sha256").update(bytes).digest("hex"), source.sha256);
    assert.equal(bytes.readUInt32LE(0), 0x46546c67); assert.equal(bytes.readUInt32LE(4), 2); assert.equal(bytes.readUInt32LE(8), bytes.length);
    const gltf = JSON.parse(bytes.subarray(20, 20 + bytes.readUInt32LE(12)).toString("utf8"));
    assert(gltf.images.length === 5 && gltf.images.every((image: { bufferView?: number; uri?: string }) => image.bufferView !== undefined && !image.uri));
    assert(gltf.buffers.every((buffer: { uri?: string }) => !buffer.uri));
    assert.equal(gltf.meshes.length, 6); assert(!gltf.cameras?.length); assert(!gltf.animations?.length);
    assert.equal(gltf.meshes.reduce((sum: number, mesh: { primitives: { indices: number }[] }) => sum + mesh.primitives.reduce((n, primitive) => n + gltf.accessors[primitive.indices].count / 3, 0), 0), 12800);
    assert.equal(readFileSync(new URL(`../public${product.poster}`, import.meta.url)).length, source.posterBytes);
    assert.equal(source.physicalDimensionsVerified, false); assert.equal(source.productionReady, false);
  }
});

test("studio enquiries use the selected identity and both business destinations safely", () => {
  for (const product of studioProducts) for (const international of ["919435746167", "917086047498"]) {
    const url = new URL(whatsappUrl({ international }, { kind: "product", productName: product.name }, studioEnquiryMessage(product.name)));
    assert.equal(url.pathname, `/${international}`); assert.equal(url.searchParams.size, 1);
    assert.match(url.searchParams.get("text")!, new RegExp(product.name)); assert.match(url.searchParams.get("text")!, /AFT Tea Studio/);
  }
  const injection = new URL(whatsappUrl({ international: "919435746167" }, { kind: "general" }, "Tea &redirect=https://example.invalid"));
  assert.equal(injection.searchParams.size, 1); assert.equal(injection.searchParams.get("redirect"), null);
  assert.match(studioEnquiryMessage(), /wholesale grades, custom blending/);
});

test("registry keeps genuine routes and omits unverified commerce specifications", () => {
  assert.deepEqual(studioProducts.map((item) => item.href), ["/teas/ajanta-gold", "/teas#ajanta-tea", "/teas/high-societea", "/teas/kolkata-street-masala-chai"]);
  for (const item of studioProducts) { assert.equal(item.kind, "model"); assert(!Object.hasOwn(item, "price")); assert(!Object.hasOwn(item, "weight")); }
});

test("each studio mood has a calibrated front view and genuine rendered fallback", () => {
  assert.equal(new Set(studioProducts.map(product => product.scene.background)).size, 4);
  assert.equal(new Set(studioProducts.map(product => product.scene.accent)).size, 4);
  for (const product of studioProducts) {
    assert(product.scene.azimuth > 0 && product.scene.azimuth < .15);
    assert(product.scene.occupancy >= .75 && product.scene.occupancy <= .85);
    for (const colour of [product.scene.background, product.scene.floor, product.scene.accent, product.scene.rim]) assert.match(colour, /^#[0-9a-f]{6}$/);
    for (const file of Object.values(product.studioPoster)) {
      const bytes = readFileSync(new URL(`../public${file}`, import.meta.url));
      assert.equal(bytes.toString("ascii", 0, 4), "RIFF");
      assert.equal(bytes.toString("ascii", 8, 12), "WEBP");
      assert(bytes.length > 10_000 && bytes.length < 250_000);
    }
  }
});

test("cinematic phases keep a ready-model handoff inside the continuous shot", () => {
  assert.equal(studioTransitionDuration, 940);
  assert.deepEqual(studioTransitionFrame(-1), { phase: "exit", progress: 0, handoff: 0 });
  assert.deepEqual(studioTransitionFrame(260), { phase: "enter", progress: 0, handoff: 0 });
  assert.equal(studioTransitionFrame(260 + studioTransitionTiming.handoff / 2).handoff, .5);
  assert.equal(studioTransitionFrame(260 + studioTransitionTiming.handoff).handoff, 1);
  assert.deepEqual(studioTransitionFrame(940), { phase: "settle", progress: 1, handoff: 1 });
  assert.deepEqual(studioTransitionFrame(5000), studioTransitionFrame(940));
  let previous = 0;
  for (let i = 0; i <= 100; i++) { const ease = cinematicEase(i / 100); assert(ease >= previous && ease <= 1); previous = ease; }
  assert.equal(cinematicEase(-1), 0); assert.equal(cinematicEase(2), 1);
});

test("camera calibration preserves product size and safe regions at every required width", () => {
  for (const width of [320, 360, 375, 390, 430, 768, 1024, 1440, 1920]) {
    const height = width < 768 ? 844 : 900, size = { x: .18, y: .28, z: .08 };
    const fit = studioCameraFraming(size, width, height, .8);
    assert(Number.isFinite(fit.distance) && fit.distance > .28 && fit.distance < 2);
    assert(fit.targetY < 0 && Math.abs(fit.targetY) < .1);
    const heightOnScreen = size.y / (2 * (fit.distance - size.z / 2) * Math.tan(33 * Math.PI / 360)) * height;
    assert(heightOnScreen <= (height - (width < 768 ? 110 + 224 : 100 + 166)) * .8 + .001);
  }
});

test("front, back and three-quarter inspection rotate the packet instead of orbiting the camera",()=>{
  for(const product of studioProducts){
    assert.equal(studioInspectionYaw(product,"front"),.1-product.frontAzimuth);
    assert.equal(studioInspectionYaw(product,"back"),.1-product.frontAzimuth-Math.PI);
    assert.equal(studioInspectionYaw(product,"three-quarter"),.1-product.frontAzimuth-.42);
    assert.equal(studioInspectionYaw(product,"reset"),.1-product.frontAzimuth-product.scene.azimuth);
  }
});
