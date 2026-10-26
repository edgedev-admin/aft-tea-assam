import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

const pngSignature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
function assertPng(bytes: Buffer, size: number) {
  assert(bytes.subarray(0, 8).equals(pngSignature));
  assert.equal(bytes.readUInt32BE(16), size);
  assert.equal(bytes.readUInt32BE(20), size);
}

test("favicon contains genuine 16, 32 and 48 pixel icon entries", async () => {
  const bytes = await readFile(new URL("../app/favicon.ico", import.meta.url));
  assert.equal(bytes.readUInt16LE(0), 0);
  assert.equal(bytes.readUInt16LE(2), 1);
  assert.equal(bytes.readUInt16LE(4), 3);
  [16, 32, 48].forEach((size, index) => {
    const entry = 6 + index * 16;
    assert.equal(bytes[entry], size);
    assert.equal(bytes[entry + 1], size);
    const length = bytes.readUInt32LE(entry + 8);
    const offset = bytes.readUInt32LE(entry + 12);
    assert(offset >= 54 && offset + length <= bytes.length);
    assertPng(bytes.subarray(offset, offset + length), size);
  });
});

test("App Router and Apple icons are square PNGs at their declared sizes", async () => {
  assertPng(await readFile(new URL("../app/icon.png", import.meta.url)), 192);
  assertPng(await readFile(new URL("../app/apple-icon.png", import.meta.url)), 180);
});
