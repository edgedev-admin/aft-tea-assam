# Contact Enquiry Operations

The enquiry service is part of the Next.js application deployed on Vercel. There is no separate Express or Render service.

## Request path

`Browser -> POST /api/enquiries -> server validation and abuse checks -> Resend -> hmtea2019@gmail.com`

- `GET /api/enquiries` reports only whether required delivery configuration is present. It never returns configuration values.
- `POST /api/enquiries` is a Node.js Route Handler with a 15-second Vercel function limit and a 10-second provider timeout.
- Enquiries are not intentionally stored in an application database.
- Success means Resend returned an email identifier. It does not prove inbox delivery.

## Required server variables

| Variable | Purpose |
| --- | --- |
| `RESEND_API_KEY` | Server-only, Sending-access Resend credential. Store it only in encrypted Vercel environment settings. |
| `CONTACT_FROM_EMAIL` | Verified sender: `AFT Techno Trade <enquiries@afttechnotrade.com>`. |
| `CONTACT_TO_EMAIL` | Fixed business recipient: `hmtea2019@gmail.com`. |
| `SITE_URL` | Production origin: `https://www.afttechnotrade.com`. |

Set these in Vercel Project Settings, never in a committed file and never with a `NEXT_PUBLIC_` prefix. Use separate Preview values or leave delivery unconfigured until an authorised test recipient and sender are available.

## Resend setup

The AFT sending domain is reported verified and a new domain-restricted Sending-access key is stored only in the ignored local `.env`. Repository checks confirm that the key is not tracked or present in reviewed Git history.

1. Configure the four variables in the authorised Vercel Preview environment without copying the key into source or documentation.
2. Confirm `CONTACT_FROM_EMAIL` is `AFT Techno Trade <enquiries@afttechnotrade.com>`.
3. Use a separately authorised Preview recipient or explicitly approve delivery to the business inbox.
4. Submit one authorised contact enquiry and one wholesale enquiry.
5. Confirm the browser receives HTTP 202 and an AFT reference.
6. Confirm Resend reports provider acceptance.
7. Confirm the message arrived at `hmtea2019@gmail.com`, formatting is intact and Reply-To is the test sender.

Official Resend domain guidance: https://resend.com/docs/dashboard/domains/introduction

## Abuse controls

The application uses strict Zod validation, a 24 KB request limit, content-type enforcement, same-origin checks, a honeypot, a minimum form-completion interval, bounded field lengths, HTML escaping, subject sanitisation, fixed sender and recipient configuration, provider timeout handling and no-store responses.

Resend receives the browser-generated submission UUID as an idempotency key and retains that key for 24 hours. This is the durable cross-instance duplicate-send safeguard. The application also keeps a short-lived process-local accepted-request cache for faster retries, but that cache is explicitly not treated as durable on Vercel.

The process-local IP counter is defense in depth only. Before production, configure a Vercel WAF rate-limit rule for `POST /api/enquiries`, initially matching the application threshold of five requests per ten minutes per IP. Review Firewall logs for false positives and abuse. Do not claim distributed rate limiting is active until the dashboard rule is verified.

## Failure semantics

- `202`: Resend accepted the request. Inbox delivery remains a separate check.
- `400`: invalid JSON, schema, idempotency token, honeypot or implausibly fast/stale form.
- `403`: rejected origin.
- `413`: oversized body.
- `415`: unsupported content type.
- `429`: process-local rate limit; production WAF should reject earlier.
- `502`: Resend/network rejection.
- `503`: server delivery configuration missing.
- `504`: provider timeout.
