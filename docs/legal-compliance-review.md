# Legal and Editorial Compliance Review

Review date: 20 October 2026

## Status and scope

This is a technical/editorial readiness review, not formal legal certification. `app/privacy/page.tsx` and `app/terms/page.tsx` are complete working drafts, clearly marked for company and qualified legal review and currently set to `noindex`. They must be approved before public production release.

## Business identity

The supplied company document supports the public name **AFT Techno Trade**, establishment in 2018, operations in Dikom and Lahowal near Dibrugarh Airport, Assam 786010, phone `+91 94357 46167`, email `hmtea2019@gmail.com`, and founders named Noor Alam Khan, Imran Khan and Aslam Khan.

The same document calls the business a "Proprietorship / Small Enterprise" while also using "Founding Partners." The website therefore does not claim to be an LLP, private limited company or legal partnership and does not assign director or partner titles. The proprietor, exact legal structure, full service address, founder roles and whether GSTIN `18AMDPK0139P2ZS` should be public all require company-record verification.

The website describes activity in Dikom and Lahowal; it does not claim legal ownership of tea estates.

## Privacy and DPDP timeline

The official 13 November 2025 commencement notification phases the Digital Personal Data Protection Act, 2023:

- Act sections 1(2), 2, 18-26, 35 and 38-43, plus sections 44(1) and 44(3), commenced on Gazette publication.
- Act section 6(9) and section 27(1)(d) commence one year after publication, on 13 November 2026.
- Most core processing, consent, rights and duty provisions in sections 3-17, the remainder of section 27, sections 28-34, 36, 37 and section 44(2) commence eighteen months after publication, on 13 May 2027.

The notified DPDP Rules, 2025 are also phased: rules 1, 2 and 17-21 commenced on publication; rule 4 commences after one year; rules 3, 5-16, 22 and 23 after eighteen months. These dates matter: this review does not describe all provisions as already in force.

The draft Privacy Notice reflects actual processing found in code: enquiry fields are sent to a server-side Vercel Route Handler, validated, passed to Resend and delivered to a Gmail inbox. The application has no enquiry database. Provider delivery records, platform/security logs and mailbox copies may remain. No fixed retention period or deletion workflow is documented, so the draft uses retention criteria and makes approval of an operational schedule a blocker.

The form now provides a direct Privacy Notice link and states the response-only purpose. No newsletter, marketing opt-in or prechecked consent is present.

Official sources:

- DPDP Act enforcement timeline, G.S.R. 843(E): https://www.meity.gov.in/static/uploads/2025/11/c56ceae6c383460ca69577428d36828b.pdf
- DPDP Rules, 2025, G.S.R. 846(E): https://www.meity.gov.in/static/uploads/2025/11/53450e6e5dc0bfa85ebd78686cadad39.pdf

## Cookies, analytics and tracking

Repository scans found no Google Analytics, Vercel Analytics, Meta Pixel, advertising scripts, application cookie writes or local/session storage tracking. `@next/third-parties` was unused and removed. The draft does not claim that infrastructure produces no logs; it explains that Vercel, Resend and the email provider may process operational/security records.

No decorative cookie banner was added. A real consent mechanism must be designed before enabling non-essential tracking that requires consent.

## Terms and commercial flow

The Terms draft correctly treats the site as informational and enquiry-only. There is no cart, payment, checkout, shipping promise or automatic order formation. It distinguishes an enquiry from a quotation/order and makes availability, specification, pricing, tax, packaging and delivery subject to direct written confirmation. Refund and ecommerce terms were not invented.

Governing-law, venue and formal-notice wording remains for legal approval.

## Food claims and product information

The Food Safety and Standards (Advertising and Claims) Regulations, 2018 require claims to be truthful, unambiguous, meaningful and supportable. The FSSAI compendium places specific conditions on words such as "pure," "authentic," "genuine," "real," "traditional" and "original." The Labelling and Display Regulations, 2020 require relevant pre-packaged food and non-retail-container declarations, including FSSAI licence information where applicable.

The visible code contains no health, disease, antioxidant, organic, chemical-free, preservative-free or certification claims. Unsupported "Registered tea mark" text for Ekoratoli was removed. The site does not publish an FSSAI licence number because no verified licence record was supplied. Company approval must confirm current ingredients, flavour descriptions, packaged-product labels, business registration/licence and every marketing claim before launch.

Do not treat photographs of authentic packs as proof that every mark, formulation or label remains current. Do not remove symbols printed on original pack photography as part of a website audit.

Official sources:

- FSSAI Advertising and Claims Regulations and amendments: https://www.fssai.gov.in/food-law/regulations/amendments/advertising-claims
- FSSAI Advertising and Claims compendium: https://www.fssai.gov.in/upload/uploadfiles/files/Compendium_Advertising_Claims_Regulations_04_10_2022.pdf
- FSSAI Labelling and Display Regulations, version VII (3 April 2025): https://fssai.gov.in/upload/uploadfiles/files/Comp_Labelling%20Display_Version%20VII_03042025.pdf

## Golden Pearl

The public product copy describes Rs 99,999/kg as the result of a one-kilogram GTAC sale on 14 February 2022, purchased by Assam Tea Traders. It expressly says this is historical, not a current retail price or promise about future lots. No standing world-record claim is made. The external reporting link remains in the product record.

## Trademarks and brand relationships

The relationship between AFT Techno Trade and Ajanta Tea, current rights in Nahorchukbari and Ekoratoli names, High Societea/Societea naming, and any registered-mark status require documentary confirmation. The website avoids claiming trademark registration in text. Symbols embedded in supplied packaging photography remain unaltered.

## Media, copyright and fonts

The repository contains user-supplied product photographs and company portraits, local campaign artwork, two MP4 files, remote Framer-hosted photographs and an Unsplash image. No Wagh Bakri logo, domain, copied source file or named competitor asset was found in the repository scan. That does not prove rights ownership.

Before public launch, AFT must document commercial website rights or replace any asset without adequate provenance, especially:

- `public/aft-hero.mp4` and the unused `public/aft-hero2.mp4`.
- Remote `framerusercontent.com` portraits/landscapes and the Unsplash image.
- Company portraits, product campaigns, packaging artwork and circular seal.
- Mogtan/Exfonte and Li Purno Pran Unicode font files.

Inter and Playfair Display are commonly distributed under the SIL Open Font License, but the repository does not include font licence files. Preserve licence notices and verify the exact binaries. No licence evidence was found for Mogtan or Li Purno Pran; commercial web embedding/distribution approval is a release blocker.

## Required approval

**Blockers before public production:**

1. Company and qualified legal review of the Privacy Notice and Terms; remove draft/noindex status only after approval.
2. Approve a practical enquiry retention/deletion and privacy-request workflow.
3. Confirm legal entity/proprietor, address, founders' roles, GST/FSSAI records and public wording.
4. Confirm AFT/Ajanta and other brand/trademark relationships plus product/ingredient claims.
5. Document commercial rights for all media and all four bundled font families.

**Important operational follow-up:** monitor DPDP commencement milestones on 13 November 2026 and 13 May 2027 and review the notice and operating procedures before each date.
