/* eslint-disable @next/next/no-img-element -- ImageResponse renders native elements into a PNG; next/image is not supported here. */
import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { challengersTrophy as event } from "../../../lib/campaigns/challengers-trophy-2026";

export const alt = "Challengers Trophy 3.0 · 9–12 December 2026 · Dikom, Assam · AFT Community Spotlight";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function CampaignImage() {
  const [seal, font] = await Promise.all([
    readFile(join(process.cwd(), "public/branding/aft-circular-seal.svg")),
    readFile(join(process.cwd(), "public/fonts/Mogtan-Exfonte686.otf")),
  ]);
  return new ImageResponse(<div style={{ display: "flex", width: "100%", height: "100%", background: "#082219", color: "#fff8ea", padding: "48px 60px", flexDirection: "column", justifyContent: "space-between", fontFamily: "AFT", borderBottom: "14px solid #8d1f16" }}>
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}><span style={{ fontSize: 20 }}>AFT COMMUNITY SPOTLIGHT / DIKOM, ASSAM</span>{/* The original emblem, never a reconstructed tournament poster. */}<img src={`data:image/svg+xml;base64,${seal.toString("base64")}`} width={90} height={90} alt="AFT circular emblem" style={{ background: "#fff8ea", borderRadius: "50%", padding: 5 }} /></div>
    <div style={{ display: "flex", flexDirection: "column", fontSize: 84, lineHeight: 1.08 }}><span>CHALLENGERS</span><span style={{ color: "#d9a22a" }}>TROPHY 3.0</span></div>
    <div style={{ display: "flex", borderTop: "1px solid #53725b", paddingTop: 24, flexDirection: "column", gap: 12, fontSize: 23 }}><span>{event.dates.toUpperCase()} · DIKOM NAHORTOLI PLAYGROUND</span><span style={{ fontSize: 18, color: "#d9a22a" }}>PLAY HARD. DREAM BIG.</span></div>
  </div>, { ...size, fonts: [{ name: "AFT", data: font, weight: 400, style: "normal" }] });
}
