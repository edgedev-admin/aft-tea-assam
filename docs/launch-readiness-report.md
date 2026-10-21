# AFT Techno Trade Launch Readiness Report

Review date: 21 October 2026

## 1. Executive summary

**Release decision: CONDITIONAL GO — EXTERNAL ACTION REQUIRED**

The repository is technically buildable and the audited local production output is stable. A clean Node 24 install, lint, type-check, enquiry tests, production build and production dependency audit all pass. Automated Chromium coverage found no document overflow, broken images, missing primary landmarks or metadata failures across the current route/viewport matrix. Lighthouse returned 100 for Accessibility, Best Practices and SEO.

Public promotion is not authorised yet. The Resend domain and new restricted Sending-access key are user-confirmed and the local configuration passes non-disclosing checks, but encrypted Vercel configuration, live delivery verification, Vercel WAF configuration, legal approval, company/licence/claim verification, and media/font rights remain external release blockers. The current public domain is on Vercel, but it does not prove that this audited working tree has been deployed.

## 2. Vercel architecture

- The application is a Next.js 16.4.1 App Router project with static pages and one Node.js Route Handler at `/api/enquiries`.
- `package.json` pins Node `24.x`, matching the current Vercel runtime plan documented in the deployment checklist.
- The enquiry function declares the Node.js runtime and a 15-second maximum duration.
- No `vercel.json` is required for the current configuration. Headers, Preview indexing behavior and route settings are defined in Next.js source.
- Render-specific configuration and the Render-only health route were removed. Vercel is the only documented target.
- Preview builds were generated locally with `VERCEL_ENV=preview`. The rendered page returned `X-Robots-Tag: noindex, nofollow, noarchive`, emitted matching HTML metadata and served a `robots.txt` that disallows all crawling.
- Direct HTTPS checks on 20 October 2026 showed `afttechnotrade.com` returning a Vercel `308` to `https://www.afttechnotrade.com/`, and `www` returning `200` with Vercel HSTS. This is routing evidence for the existing public deployment, not deployment evidence for the audited code.

## 3. Security findings

| Severity | Location | Finding, correction and evidence | Remaining action |
| --- | --- | --- | --- |
| Critical, corrected | `package.json`, `package-lock.json` | Next.js 16.4.0 was within the affected range of October 2026 security advisories. Next and its ESLint config are pinned to 16.4.1. The post-upgrade build passes. | Keep Dependabot/platform advisories enabled and patch promptly. |
| High, development only | `eslint-config-next` transitive chain | Full `npm audit` reports five entries from `fast-glob`/`micromatch`/`braces`. The registry has no patched `braces` release above 3.0.3; npm proposes an incompatible downgrade to Next 14 tooling. The chain runs in local linting and is absent from the production audit. | Track the upstream fix. Do not process attacker-controlled glob patterns through local lint tooling. |
| Medium, externally pending | Resend/Vercel settings | A new domain-restricted Sending-access key is present only in ignored local `.env`; its shape and the verified sender configuration passed non-disclosing checks. No live key exists in source or reviewed history. | Add the key only to encrypted Vercel settings and verify provider acceptance without printing it. |
| Medium, external blocker | `/api/enquiries` | Strict validation, unknown-field rejection, a 24 KB body limit, origin/content-type checks, honeypot, minimum form age, escaping, timeout and Resend idempotency are implemented. The in-memory IP limiter is not durable across Vercel instances. | Add and verify a Vercel WAF rate-limit rule for POST `/api/enquiries`. |
| Medium, corrected | Preview output | Preview deployments could otherwise be indexed. Header, metadata and robots controls now all deny indexing when `VERCEL_ENV=preview`; live local Preview verification passed. | Recheck on an authorised Vercel Preview URL. |
| Low, accepted | Global response policy | `Referrer-Policy`, `X-Content-Type-Options`, `X-Frame-Options` and `Permissions-Policy` are present; `X-Powered-By` is disabled. A strict CSP was not added without nonce-aware production testing because a brittle policy could break Next hydration or required media. | Design and test a nonce-based CSP on Preview if the business requires it. |

Secret-shaped scanning found only the documented `.env.example` placeholder and a test-only fake key. No real key, private-key block, unsafe `NEXT_PUBLIC_` secret, dangerous HTML injection, dynamic evaluation, browser storage tracking or application cookie write was found in reviewed source or tracked history. `npm audit --omit=dev` reports zero known production vulnerabilities.

## 4. Email delivery status

| Layer | Status | Evidence |
| --- | --- | --- |
| Client validation and honest unavailable state | Pass | Labels, required fields, privacy link, status region and disabled local-unconfigured state were browser checked. |
| API contract and abuse controls | Pass | Seven automated tests pass, including schema, escaping, origin, honeypot, rate, timeout, rejection and deduplication behavior. |
| Provider request construction | Pass in mocked tests | HTML/text payload, Reply-To and idempotency key are asserted. |
| Real Resend provider acceptance | Pending, blocker | The verified domain and new restricted key are ready locally, but acceptance must be tested from an authorised Vercel Preview. |
| Inbox delivery and Reply-To | Pending, blocker | Submit both contact and wholesale forms on Preview and verify the received message plus reply target. |

The app stores no enquiry database. Vercel/Resend logs and the receiving Gmail mailbox can retain records, so an approved retention/deletion workflow is still required.

## 5. UI/UX findings

- The current audit covered 110 route/viewport combinations: 11 representative routes at 320, 360, 390, 430, 768, 820, 1024, 1280, 1440 and 1920 pixel widths.
- No document-level horizontal overflow, broken image, missing `main`, missing `h1`, missing canonical or missing footer legal link was found.
- One genuine 320px `/teas` final-CTA min-content overflow was corrected; the horizontal tea chapter track remains intentionally scrollable within its own bounded control.
- The mobile drawer was checked at 390px: official 68px circular seal, centered one-line company name, independent close control, body lock, initial close focus, Escape close and focus restoration all passed.
- The contact form at 390px retained explicit labels and readable validation/status behavior.
- Privacy and Terms working drafts are readable on mobile and linked from the footer and enquiry form.
- Chromium coverage is strong. Current physical iPhone Safari and Android Chrome checks remain external acceptance work.

## 6. Accessibility

- Lighthouse mobile navigation audit: Accessibility 100, Best Practices 100, SEO 100 and zero failed audits.
- Every audited route exposed a primary `main` and `h1`; form controls use native labels and error/status semantics.
- Keyboard drawer behavior, Escape closing, focus restoration and body-scroll restoration passed.
- Reduced-motion product scenes already use static alternatives. The autoplay hero source now has a `prefers-reduced-motion: no-preference` media condition and the video is hidden in reduced mode.
- Browser verification under reduced motion showed `currentSrc` empty, `readyState` 0 and no media request. Normal motion showed the MP4 playing with `readyState` 4.
- Manual screen-reader testing on VoiceOver/TalkBack and physical-device zoom/reflow remain recommended Preview checks.

## 7. Performance

The previously reported 13-second local Lighthouse LCP was not reproducible under controlled tracing. Three cold mobile traces at 390x844, Fast 4G and 4x CPU produced LCP values of 1,721 ms, 1,757 ms and 1,739 ms: median 1,739 ms, 36 ms spread, CLS 0. The LCP element was the hero headline text, not the video or poster. The representative breakdown was 5 ms TTFB plus 1,717 ms render delay.

The old report was internally inconsistent: its legacy summary showed 13 seconds while its trace LCP breakdown identified roughly 252 ms. The evidence supports a local audit lifecycle/tooling anomaly rather than a reproduced page regression. There is no CrUX field data and no lab INP value should be treated as field evidence.

The page still transfers about 18.95 MB on a normal-motion cold load. `aft-hero.mp4` contributes about 16.36 MB and the poster about 1.99 MB. This did not become the measured LCP element, but it is the dominant bandwidth and network-quiet cost. Reduced-motion users now avoid the MP4 entirely. A visually approved mobile encode or adaptive media delivery is the highest-value nonblocking performance follow-up. The unused `aft-hero2.mp4` should not be deleted until ownership and future use are confirmed.

## 8. SEO

- Production metadata uses `https://www.afttechnotrade.com` for canonical URLs, sitemap and Open Graph references.
- The apex host currently redirects permanently to `www`.
- Production robots remain indexable; Preview uses three independent no-index controls.
- Page titles, descriptions, canonical tags, primary headings and legal footer links were present in the route matrix.
- Lighthouse SEO scored 100.
- Privacy and Terms drafts intentionally remain `noindex` until approved; that is a release gate, not a production SEO target.

## 9. Legal and editorial readiness

Detailed findings are in `docs/legal-compliance-review.md`. The Privacy Notice and Terms are complete working drafts, clearly marked for company and qualified legal approval. They accurately describe the enquiry-only commercial flow, Vercel/Resend/Gmail processing and absence of optional analytics found in source.

Release blockers are: approval and publication of the legal drafts; a retention/privacy-request workflow; confirmation of legal entity/proprietor, service address, founder roles, GST/FSSAI records and public wording; confirmation of AFT/Ajanta and other brand relationships; product/ingredient/advertising claim approval; and documented commercial rights for all local/remote media and bundled fonts.

The review uses the official phased DPDP commencement notifications and current FSSAI advertising/claims and labelling material listed in the legal report. It does not claim that every DPDP provision is already in force.

## 10. Deployment validation

| Command/check | Result |
| --- | --- |
| `npm ci --cache .npm-cache --no-audit` | Pass after lockfile repair; 365 packages installed from a clean tree |
| `npm run lint` | Pass |
| `npx tsc --noEmit` | Pass |
| `npm run test:enquiries` | Pass, 7/7; nonblocking module-type warning only |
| Preview `npm run build` | Pass, 19 generated routes |
| Production `npm run build` | Pass, 19 generated routes |
| `npm audit --omit=dev` | Pass, 0 vulnerabilities |
| Full `npm audit` | 5 high findings in one development-only lint chain; no compatible upstream patch currently published |
| `git diff --check` | Pass; line-ending notices only |
| Lighthouse mobile navigation | 100 Accessibility / 100 Best Practices / 100 SEO, 0 failures |
| Public domain headers | Apex 308 to `www`; `www` 200; Vercel HSTS present |

## 11. Outstanding actions

**Blockers**

1. Configure the new Resend key and the three non-secret mail/site values as encrypted Vercel Preview and Production environment variables.
2. Add the Vercel WAF rule for POST `/api/enquiries` and confirm it from firewall events.
3. Deploy an authorised Preview and prove provider acceptance, inbox receipt and Reply-To with both enquiry forms.
4. Obtain company/legal approval for Privacy and Terms, approve retention/privacy operations, then remove draft/noindex status.
5. Verify company entity, GST/FSSAI/licence details, founder titles, trademarks/brand relationships and all food/product claims.
6. Document commercial rights for every video, photograph, campaign, logo and bundled font used publicly.

**Important**

1. Test the authorised Preview on current iPhone Safari and Android Chrome.
2. Rerun route/header/canonical/form checks and three performance traces on the Vercel Preview URL.
3. Produce an adaptive/mobile hero-video encode after visual approval; monitor transfer and playback on constrained networks.
4. Track the upstream `braces` advisory fix in Next's development lint chain.
5. Establish launch monitoring for API errors, Resend events and WAF blocks.

**Optional**

1. Develop and Preview-test a nonce-aware CSP.
2. Confirm whether unused `aft-hero2.mp4` can be removed.
3. Add licensed font notices to the repository when rights documentation is supplied.

## 12. Final decision

**CONDITIONAL GO — EXTERNAL ACTION REQUIRED**

The codebase is suitable for an authorised Vercel Preview and external acceptance testing. It is not approved for public production promotion until every blocker above is closed and recorded. No deployment or Git push was performed during this audit.
