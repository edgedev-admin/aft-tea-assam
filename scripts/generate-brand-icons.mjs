import fs from "node:fs/promises";
import sharp from "sharp";

// Rasterize the official SVG without changing its artwork or proportions.
const source = await fs.readFile(new URL("../public/branding/aft-circular-seal.svg", import.meta.url));
async function png(size) {
  const padding = Math.max(1, Math.round(size * 0.04));
  const seal = await sharp(source).resize(size - padding * 2, size - padding * 2).png().toBuffer();
  return sharp({ create: { width: size, height: size, channels: 4, background: "#fff8ea" } })
    .composite([{ input: seal, left: padding, top: padding }]).png().toBuffer();
}

await fs.writeFile(new URL("../app/icon.png", import.meta.url), await png(192));
await fs.writeFile(new URL("../app/apple-icon.png", import.meta.url), await png(180));

// PNG-compressed ICO entries preserve the same artwork at each native size.
const sizes = [16, 32, 48];
const images = await Promise.all(sizes.map(png));
const header = Buffer.alloc(6 + sizes.length * 16);
header.writeUInt16LE(1, 2);
header.writeUInt16LE(sizes.length, 4);
let offset = header.length;
for (let index = 0; index < sizes.length; index++) {
  const entry = 6 + index * 16;
  header[entry] = sizes[index];
  header[entry + 1] = sizes[index];
  header.writeUInt16LE(1, entry + 4);
  header.writeUInt16LE(32, entry + 6);
  header.writeUInt32LE(images[index].length, entry + 8);
  header.writeUInt32LE(offset, entry + 12);
  offset += images[index].length;
}
await fs.writeFile(new URL("../app/favicon.ico", import.meta.url), Buffer.concat([header, ...images]));
console.log("Generated official AFT icons: ICO 16/32/48, PNG 192, Apple PNG 180.");
