# Cloudinary Media and Performance Migration

Date: 2026-10-22

Branch: `perf/cloudinary-media-optimization`

Status: **Conditional go for Vercel Preview. Do not promote directly to production.**

## Scope

This migration keeps the existing layouts, copy, product artwork, motion sequence, navigation, forms, and local source files. It moves delivery of the approved high-cost media to Cloudinary, adds responsive transformations, and reduces scroll-time layout work. The original files remain in `public/` as the versioned source of truth and local fallback.

The authoritative asset inventory is `lib/cloudinary-manifest.json`. It contains 26 approved files:

- 1 hero video.
- 1 hero poster.
- 2 company photographs.
- 3 product packshots.
- 14 desktop campaign artworks.
- 5 mobile campaign artworks.

Fonts, the official SVG seal, and small editorial images remain local. The unused `public/aft-hero2.mp4` was deliberately excluded.

## Root Causes

1. The home page served the 15.61 MiB 1920 x 1080 hero MP4 to both desktop and mobile.
2. The hero poster and campaign images were delivered as large local source files without delivery-time format or width selection.
3. The scroll mosaic kept multiple high-resolution scenes mounted and animated five tiles through `left`, `top`, `width`, and `height`, increasing layout and paint work.
4. The navbar read `window.scrollY` and updated React state on every scroll event, contributing a measured forced-reflow path.
5. Mobile used the same layout-resize strategy for the expanding center tile despite its tighter frame budget.

## Implementation

### Upload and provenance

`scripts/upload-media-to-cloudinary.ts` is a fixed allowlist migration, not a general upload endpoint. It:

- Loads credentials only from server-side environment variables.
- Authenticates through the official Cloudinary Node SDK.
- Uses stable public IDs under `aft-techno-trade/`.
- Records each source SHA-256, source path, category, and alt text as upload metadata.
- Refuses to overwrite an existing public ID when its source hash differs.
- Skips matching resources and avoids rewriting an unchanged manifest.

The post-migration verification run skipped all 26 resources and reported `manifest unchanged`, confirming idempotency and no duplicate uploads.

### Delivery

- `CloudinaryImage` keeps the existing `next/image` API and uses a custom loader only for manifest assets. Unmapped images retain normal Next.js delivery.
- Images use bounded responsive widths with `f_auto`, `q_auto:good` or `q_auto:best`, and `c_limit`.
- The hero uses separate 960px mobile and 1920px desktop H.264 MP4 variants with automatic quality, progressive delivery, muted inline autoplay, and no audio track.
- The hero poster is an optimized Cloudinary image. Reduced-motion users and browsers that reject autoplay keep the poster visible.
- The original local source path remains the fallback when the public Cloudinary environment variable is absent.

This avoids double optimization: mapped assets are transformed by Cloudinary through the custom loader instead of first passing through the Next.js image optimizer.

### Scroll rendering

- The four surrounding expansion tiles now use compositor transforms from their measured mosaic geometry.
- Desktop retains layout-resize for the center artwork to preserve maximum settled sharpness.
- Mobile uses a transform-based center expansion to reduce repeated layout and paint work during touch scrolling.
- Tile geometry is pixel-rounded, paint/layout containment is applied locally, and scene layers use strict containment.
- The original mosaic-to-expansion-to-campaign sequence, reverse scrolling, focal points, and off-white gutters are unchanged.
- Navbar scroll state now comes from an `IntersectionObserver` sentinel instead of a per-scroll `window.scrollY` read.

## Measured Delivery Results

Measurements used Chrome DevTools with cache disabled for the initial page-load sample. The baseline is the currently deployed production site; the optimized build was served locally with `next start`. Transfer-size comparisons are meaningful, but local LCP and TTFB are not direct hosting comparisons. A Vercel Preview measurement remains required before release.

| Test | Before | Optimized | Change |
| --- | ---: | ---: | ---: |
| Desktop home transfer, 1440 x 900 | 36.95 MB | 12.18 MB | -67.0% |
| Mobile home transfer, 390 x 844, DPR 3 | 19.22 MB | 7.16 MB | -62.7% |
| Desktop hero video | 16.36 MB | 9.68 MB | -40.9% |
| Mobile hero video | 16.36 MB | 4.29 MB | -73.8% |
| Hero poster, 1440px | 1.99 MB | 0.108 MB | -94.5% |
| Collection campaign, 1920px | 3.29 MB | 0.658 MB | -80.0% |
| Representative packshot, 900px | 4.63 MB | 0.204 MB | -95.6% |

The transformed video responses support byte ranges and stable immutable caching after the first transformation. The mobile request selected the 960px variant and the desktop request selected the 1920px variant on fresh loads.

## Runtime Results

| Lab check | Before | Optimized |
| --- | ---: | ---: |
| Desktop LCP | 8.776 s, including 5.776 s deployed TTFB | 0.241 s local |
| Mobile LCP, CPU 4x | 2.280 s deployed | 0.799 s local |
| CLS | 0.00 | 0.00 |
| Desktop scroll average frame interval | 8.01 ms | 6.94 ms |
| Desktop scroll p95 / p99 | 13.9 / 27.8 ms | 7.1 / 7.2 ms |
| Desktop frames over 16.7 ms | 12 | 0 |
| Mobile scroll average frame interval, CPU 4x | 23.77 ms | 18.46 ms |
| Mobile scroll p95 / p99, CPU 4x | 41.7 / 48.6 ms | 34.7 / 41.7 ms |
| Mobile frames over 33.3 ms | 43 | 19 |
| Mobile long tasks | 1 | 0 |

The optimized desktop scroll run was captured from the production build on a 144 Hz display. Mobile still misses a 60 Hz frame budget during parts of the image-heavy sequence under 4x CPU throttling, but its average, tail latency, severe-frame count, and long-task count all improved. The navbar’s previous application-attributed forced reflow no longer appeared; the remaining measured reflow came from the automated `scrollTo` test harness.

Chrome still estimates approximately 1.7 MB of possible image-delivery savings across below-the-fold campaign and family-story imagery, with zero estimated FCP or LCP impact. Those images intentionally retain higher delivery quality for packaging legibility and later fullscreen use. Further reductions should be evaluated visually on a preview rather than applied blindly.

## Visual and Responsive QA

- Lossless browser screenshots were inspected at intermediate and full collection-expansion states on desktop and 390px mobile.
- The center artwork remained aligned with the genuine row-two tile, readable during expansion, and sharp at rest, with no source-swap flicker.
- The original campaign artwork and warm off-white mosaic gutters remain unchanged.
- Widths tested: 320, 360, 390, 430, 768, 1024, 1440, and 1920 pixels.
- All tested widths had zero horizontal overflow and zero broken images.
- Mobile route smoke tests passed for `/about`, `/teas`, `/craft`, `/wholesale`, `/contact`, `/gallery`, and `/teas/ajanta-gold`.
- No runtime errors were found. One non-blocking Next.js CSS preload warning appeared during repeated automated route navigation.

Physical iPhone Safari and Low Power Mode were not available in this environment. The implementation uses `playsInline`, muted autoplay, a visible poster fallback, autoplay rejection handling, and a reduced-motion no-video path, but these behaviors must still be confirmed on a real iPhone before production promotion.

## Security and Cost

- `.env` remains ignored and was not modified.
- No Cloudinary credential value appears in tracked or untracked commit candidates.
- Only `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` is read by browser-delivery code. API key and secret usage is isolated to the migration script.
- No public upload endpoint, unsigned preset, or runtime admin API was added.
- Production dependency audit: 0 vulnerabilities.
- Full dependency audit: 5 high-severity findings in the existing ESLint-only development chain (`braces` through `micromatch`, `fast-glob`, and `eslint-config-next`). npm's proposed fix is an unsafe Next ESLint configuration downgrade and was not applied.

Cloudinary usage after upload and test transformations:

| Metric | Usage |
| --- | ---: |
| Plan | Free |
| Credits | 1.02 / 25 (4.08%) |
| Storage | 266,695,083 bytes |
| Bandwidth | 278,521,662 bytes |
| Transformations | 513 |
| Source resources | 218 |
| Derived resources | 77 |

The test generated many one-time responsive variants across the viewport matrix. Ongoing bandwidth and derived-resource growth should be reviewed after real preview traffic.

## Validation

- `npm run lint`: pass.
- `npx tsc --noEmit`: pass.
- `npm run test:enquiries`: 7/7 pass.
- `npm run build`: pass; 19 routes generated.
- `npm audit --omit=dev`: pass with 0 vulnerabilities.
- Cloudinary authenticated ping and transformed delivery: pass.
- Migration idempotency: pass, 26/26 skipped and manifest unchanged.

## Vercel Preview Checklist

Configure these values in the Vercel Preview environment before evaluating the branch:

```text
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
CLOUDINARY_API_KEY
CLOUDINARY_API_SECRET
```

Only the public cloud name is required by the deployed application at runtime; the key and secret are needed only when deliberately running the migration script. Keeping the server credentials available only in the intended Vercel environments limits accidental exposure.

Before production promotion:

1. Confirm the Vercel Preview deployment completed for this branch.
2. Repeat desktop and mobile Lighthouse traces against the preview URL.
3. Test the hero in physical iPhone Safari, including Low Power Mode.
4. Scroll the complete product sequence forward and backward on a mid-range Android device.
5. Confirm Cloudinary credit growth is acceptable after preview traffic.
6. Verify enquiry delivery in the preview environment without submitting test data to production.

## References

- Cloudinary Node.js SDK: https://cloudinary.com/documentation/node_integration
- Cloudinary upload API: https://cloudinary.com/documentation/node_image_and_video_upload
- Cloudinary video optimization: https://cloudinary.com/documentation/video_optimization
- Cloudinary transformation reference: https://cloudinary.com/documentation/transformation_reference
