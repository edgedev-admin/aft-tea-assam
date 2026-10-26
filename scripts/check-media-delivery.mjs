import fs from "node:fs";
import nextEnv from "@next/env";
import { inspectMp4 } from "./inspect-video.mjs";

nextEnv.loadEnvConfig(process.cwd(), false, { info() {}, error() {} });
fs.mkdirSync("artifacts", { recursive: true });
const manifest = JSON.parse(fs.readFileSync("lib/cloudinary-manifest.json", "utf8"));
const hero = manifest.assets.find((asset) => asset.localPath === "public/aft-hero.mp4");
const base = `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/video/upload`;
const end = `/v${hero.version}/${hero.publicId}.mp4`;
const media = [
  ["desktop", `${base}/f_mp4,q_auto:good,vc_h264:main,ac_none,c_limit,w_1920,fl_progressive${end}`],
  ["mobile", `${base}/f_mp4,q_auto:good,vc_h264:main,ac_none,c_fill,g_center,w_606,h_1076,fl_progressive${end}`],
];
const results = [];
for (const [name, url] of media) {
  try {
    const response = await fetch(url, { signal: AbortSignal.timeout(45000) });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = Buffer.from(await response.arrayBuffer());
    fs.writeFileSync(`artifacts/hero-${name}.mp4`, data);
    const range = await fetch(url, { headers: { Range: "bytes=0-1023" }, signal: AbortSignal.timeout(15000) });
    const headers = { status: response.status, type: response.headers.get("content-type"), cache: response.headers.get("cache-control"), rangeStatus: range.status, contentRange: range.headers.get("content-range"), acceptRanges: range.headers.get("accept-ranges") };
    await range.body?.cancel();
    const result = { ...inspectMp4(data, name), headers };
    results.push(result);
    console.log(JSON.stringify(result));
  } catch (error) { const result = { file: name, error: error.cause?.code || error.message }; results.push(result); console.log(JSON.stringify(result)); }
}
for (const original of ["https://www.afttechnotrade.com/", "https://afttechnotrade.com/"]) {
  try {
    let url = original;
    const chain = [];
    for (let i = 0; i < 4; i++) {
      const response = await fetch(url, { redirect: "manual", signal: AbortSignal.timeout(15000) });
      const location = response.headers.get("location");
      chain.push({ url, status: response.status, location, server: response.headers.get("server"), robots: response.headers.get("x-robots-tag") });
      await response.body?.cancel();
      if (!location) break;
      url = new URL(location, url).href;
    }
    results.push({ domain: original, chain });console.log(JSON.stringify({ domain: original, chain }));
  } catch (error) { const result = { domain: original, error: error.cause?.code || error.message };results.push(result);console.log(JSON.stringify(result)); }
}
fs.writeFileSync("artifacts/media-delivery.json", JSON.stringify(results, null, 2));
