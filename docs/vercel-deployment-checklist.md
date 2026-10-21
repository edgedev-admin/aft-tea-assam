# Vercel Deployment Checklist

This is the deployment runbook for AFT Techno Trade. It does not authorise a production deployment.

Local audit evidence from 21 October 2026: clean `npm ci` passed after regenerating the lockfile with npm 11.6.2; Preview and Production builds both passed with 19 generated routes; Preview no-index headers, metadata and `robots.txt` were verified live on localhost. The current public apex-to-`www` redirect and Vercel HSTS also respond correctly, but the audited working tree has not been deployed. No local `.vercel/project.json` link is present, so GitHub integration and Preview creation must be verified after the branch push.

## Project configuration

- [ ] Import the repository into the authorised Vercel team.
- [ ] Set the project root to the repository root (`.`).
- [ ] Confirm Vercel detects Next.js and the npm lockfile.
- [ ] Use `npm ci` for installation and `npm run build` for the build.
- [ ] Confirm Node.js `24.x`; `package.json` pins the major version supported by Vercel.
- [ ] Keep Fluid Compute/default function settings unless monitoring demonstrates another need.
- [ ] Confirm `/api/enquiries` is a Node.js function with the route-level 15-second maximum duration.
- [ ] Do not add a separate Render service or duplicate email backend.

No `vercel.json` is required. Next.js supplies the route, header and function configuration used by this project.

## Environment separation

Configure these as encrypted server variables in Vercel Project Settings:

| Variable | Production | Preview |
| --- | --- | --- |
| `RESEND_API_KEY` | New domain-restricted Sending-access key | Separate restricted test key, or omit |
| `CONTACT_FROM_EMAIL` | `AFT Techno Trade <enquiries@afttechnotrade.com>` | Same verified sender, or omit |
| `CONTACT_TO_EMAIL` | `hmtea2019@gmail.com` | Approved test recipient, not customer data |
| `SITE_URL` | `https://www.afttechnotrade.com` | Production URL is acceptable because the request origin is also allowed dynamically |

- [ ] Never prefix a secret with `NEXT_PUBLIC_`.
- [ ] Copy the new key from the ignored local environment into encrypted Vercel settings without exposing it in build logs.
- [ ] Ensure Preview does not send to the production inbox unless the company explicitly authorises the test.
- [ ] Redeploy after every environment-variable change; Vercel does not apply changes retroactively.

## Email and firewall

- [x] Verify `afttechnotrade.com` in Resend (user-confirmed 21 October 2026).
- [ ] Confirm `CONTACT_FROM_EMAIL` exactly matches an allowed sender.
- [ ] Add a Vercel WAF rate-limit rule for request path `/api/enquiries` and method `POST`.
- [ ] Start with five requests per ten minutes per source IP, matching the application fallback.
- [ ] Confirm the rule action, scope and plan support in the Vercel dashboard.
- [ ] Review allowed/blocked events after launch and tune only from evidence.
- [ ] Keep the honeypot, validation and Resend 24-hour idempotency key in place.

## Domains, TLS and indexing

- [ ] Assign `www.afttechnotrade.com` as the primary production domain.
- [ ] Assign `afttechnotrade.com` and permanently redirect it to `www` in Project Settings.
- [ ] Confirm Vercel-managed TLS and HSTS at the edge.
- [ ] Confirm production canonical tags, sitemap and robots use `https://www.afttechnotrade.com`.
- [ ] Confirm Preview responses include `X-Robots-Tag: noindex`; the app adds a fallback header and disallowing `robots.txt` when `VERCEL_ENV=preview`.
- [ ] Do not assign a public custom domain to Preview without rechecking noindex behavior.

## Preview acceptance

- [ ] Deploy a Preview only after company approval. Do not promote it.
- [ ] Verify all static routes and four tea detail routes return 200.
- [ ] Verify `/golden-pearl` redirects to `/teas/golden-pearl` and an unknown route returns 404.
- [ ] Confirm security headers and no global `no-store` on static pages.
- [ ] Confirm `GET /api/enquiries` exposes only `{ "configured": true|false }`.
- [ ] Run an authorised contact and wholesale submission; check 202, provider acceptance, inbox receipt and Reply-To.
- [ ] Test desktop Chrome plus current iPhone Safari and Android Chrome on physical devices.
- [ ] Rerun Lighthouse against the Preview URL at least three times and record the median/spread.
- [ ] Inspect video transfer, LCP element, CLS, console errors, missing images, broken links and horizontal overflow.

## Production gate

Do not approve production until all Blockers in `docs/launch-readiness-report.md` are closed, the legal drafts are approved, media/font rights are documented and the live email path has been verified end to end.

Official references:

- https://vercel.com/docs/environment-variables
- https://vercel.com/docs/functions/runtimes/node-js/node-js-versions
- https://vercel.com/docs/functions/configuring-functions/duration
- https://vercel.com/kb/guide/add-rate-limiting-vercel
- https://vercel.com/docs/domains/working-with-domains/deploying-and-redirecting
- https://vercel.com/docs/headers/response-headers
