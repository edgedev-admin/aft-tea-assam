import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { request as httpRequest } from "node:http";
import nextEnv from "@next/env";

nextEnv.loadEnvConfig(process.cwd(), false, { info() {}, error() {} });
const base = process.argv[2] || "http://127.0.0.1:3100";
const checks = [];
const check = (name, pass, detail) => { checks.push({ name, pass, detail }); console.log(`${pass ? "PASS" : "FAIL"} ${name}: ${typeof detail === "string" ? detail : JSON.stringify(detail)}`); };
const request = (route, init = {}) => fetch(`${base}${route}`, { redirect: "manual", signal: AbortSignal.timeout(20000), ...init });
const appPaths = JSON.parse(fs.readFileSync(".next/server/app-paths-manifest.json", "utf8"));
const prerendered = JSON.parse(fs.readFileSync(".next/prerender-manifest.json", "utf8")).routes;
const routes = [...new Set([
  ...Object.keys(appPaths).filter((route) => route.endsWith("/page") && !route.includes("[")).map((route) => route.slice(0, -5) || "/"),
  ...Object.keys(prerendered),
])].filter((route) => !route.startsWith("/_") && !route.startsWith("/api/") && !["/sitemap.xml", "/robots.txt", "/golden-pearl"].includes(route));

for (const route of routes) {
  const response = await request(route);
  const html = await response.text();
  const canonical = html.match(/<link[^>]+rel="canonical"[^>]+href="([^"]+)"/)?.[1];
  check(`route ${route}`, response.status === 200 && canonical && new URL(canonical).href === `https://www.afttechnotrade.com${route === "/" ? "/" : route}`, { status: response.status, canonical });
}

const root = await request("/");
check("security response headers", root.headers.get("x-content-type-options") === "nosniff" && root.headers.get("x-frame-options") === "DENY" && !root.headers.has("x-powered-by"), { nosniff: root.headers.get("x-content-type-options"), frame: root.headers.get("x-frame-options"), referrer: root.headers.get("referrer-policy"), permissions: root.headers.get("permissions-policy") });
await root.body?.cancel();
const legacy = await request("/golden-pearl");
check("permanent legacy redirect", legacy.status === 308 && legacy.headers.get("location") === "/teas/golden-pearl", { status: legacy.status, location: legacy.headers.get("location") });await legacy.body?.cancel();
const host = await new Promise((resolve, reject) => {
  const req = httpRequest(`${base}/teas?check=canonical`, { headers: { Host: "afttechnotrade.com" } }, (res) => { res.resume();res.on("end", () => resolve({ status: res.statusCode, location: res.headers.location })); });
  req.on("error", reject);req.end();
});
check("canonical host redirect", host.status === 308 && host.location === "https://www.afttechnotrade.com/teas?check=canonical", host);
const sitemap = await request("/sitemap.xml").then((response) => response.text());
const locations = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1]);
check("sitemap canonical URLs", locations.length === 12 && locations.every((url) => url.startsWith("https://www.afttechnotrade.com")) && !locations.includes("https://www.afttechnotrade.com/golden-pearl"), { urls: locations.length });
const robots = await request("/robots.txt").then((response) => response.text());
check("production indexing", robots.includes("Allow: /") && robots.includes("https://www.afttechnotrade.com/sitemap.xml") && !robots.includes("Disallow: /"), robots.trim());
const readiness = await request("/api/enquiries").then((response) => response.json());
check("enquiry service configured", readiness.configured === true && Object.keys(readiness).join(",") === "configured", readiness);
const invalid = await request("/api/enquiries", { method: "POST", headers: { "Content-Type": "application/json", Origin: base, "Idempotency-Key": "release_invalid_request_0001" }, body: JSON.stringify({ name: "x" }) });
check("server validation rejects incomplete enquiries", invalid.status === 400, { status: invalid.status });
const rejected = await request("/api/enquiries", { method: "POST", headers: { "Content-Type": "application/json", Origin: "https://untrusted.invalid" }, body: "{}" });
check("foreign origins rejected", rejected.status === 403, { status: rejected.status });
for (const file of ["/videos/aft-people-montage.mp4", "/videos/aft-people-montage-mobile.mp4"]) {
  const response = await request(file, { headers: { Range: "bytes=0-1023" } });
  check(`range ${file}`, response.status === 206 && response.headers.get("content-type")?.includes("video/mp4"), { status: response.status, range: response.headers.get("content-range") });await response.body?.cancel();
}

const safeGit = ["-c", `safe.directory=${process.cwd().replaceAll("\\", "/")}`];
const tracked = spawnSync("git", [...safeGit, "ls-files", "-z"], { encoding: "utf8" });
const files = tracked.stdout.split("\0").filter(Boolean);
const trackedEnvs = files.filter((file) => /(^|\/)\.env($|\.)/.test(file) && !file.endsWith(".env.example"));
check("environment files excluded from Git", tracked.status === 0 && trackedEnvs.length === 0, { trackedEnvironmentFiles: trackedEnvs });
const secrets = ["RESEND_API_KEY", "CLOUDINARY_API_SECRET", "CLOUDINARY_API_KEY"].map((key) => [key, process.env[key]]).filter(([, value]) => value && value.length >= 8);
const leaks = [];
const scan = (file, scope) => {
  const stat = fs.statSync(file);
  if (!stat.isFile() || stat.size > 12000000 || !/\.(?:[cm]?[jt]sx?|json|md|css|example|yml|yaml)$/.test(file)) return;
  const text = fs.readFileSync(file, "utf8");
  for (const [key, value] of secrets) if (text.includes(value)) leaks.push({ file, key, scope });
};
for (const file of files) if (fs.existsSync(file)) scan(file, "tracked-source");
function walk(dir) { if (!fs.existsSync(dir)) return;for (const entry of fs.readdirSync(dir, { withFileTypes: true })) { const file = path.join(dir, entry.name);if (entry.isDirectory()) walk(file);else scan(file, "client-bundle"); } }
walk(".next/static");
check("known secret values absent from tracked source and client bundles", leaks.length === 0, { matches: leaks });
const whitespace = spawnSync("git", [...safeGit, "diff", "--check"], { encoding: "utf8" });
check("git diff whitespace", whitespace.status === 0, whitespace.status === 0 ? "clean" : whitespace.stdout.trim());
fs.mkdirSync("artifacts", { recursive: true });
fs.writeFileSync("artifacts/release-http-checks.json", JSON.stringify({ base, checkedAt: new Date().toISOString(), checks }, null, 2));
if (checks.some((result) => !result.pass)) process.exitCode = 1;
