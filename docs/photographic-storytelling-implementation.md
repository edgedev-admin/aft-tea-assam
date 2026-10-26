# Photographic Storytelling Implementation

## Creative Direction

Brief inference: evolve the existing AFT editorial identity into a documentary-led FMCG experience without changing the information architecture or established hero, product mosaic, people montage, navigation, forms or footer.

- Visual variance: 6/10. Editorial asymmetry and large photography remain disciplined by the existing grid.
- Motion intensity: 5/10. Dragging, snapping and small state transitions support storytelling without adding scroll hijacking.
- Information density: 5/10. Photography carries more of the narrative while verified copy remains readable.
- Design system: the existing custom AFT system using Assam green, warm ivory, tea red and golden accents.

## Source Audit

The source library was found at `C:/Users/ABHISHEK KUMAR/Downloads/aft more images/` and contains 47 assets. The full filename, dimensions, orientation, source size, subject, crop guidance and rights status are recorded in `docs/photographic-asset-inventory.csv`.

Contact sheets are stored locally in `artifacts/photo-audit/`:

- `root-products-contact-sheet.jpg`
- `garden-contact-sheet.jpg`
- `factory-contact-sheet.jpg`

The supplied originals were not overwritten. Public derivatives were resized with high-quality bicubic interpolation, exported at 88 to 90 JPEG quality where applicable and saved without source EXIF metadata.

## Curated Selection

| Story role | Source | Selection reason |
| --- | --- | --- |
| The land | `Tea Garden/A7408304.JPG` | Strong centered path gives the opening slide depth and a natural visual invitation. |
| The leaf | `Tea Garden/A7408468.JPG` | Sharp macro detail clearly communicates fresh growth. |
| The people | Existing published montage poster | Uses already-published company media while new identifiable portraits await consent confirmation. |
| The harvest | `Factory/A7408354.JPG` | Shows fresh leaf at the next stage without assigning an uncertain process label. |
| The factory | `Factory/A7408408.JPG` | Wide operational view with clear machinery and fresh leaf. |
| The craft | `Factory/A7408424.JPG` | Strong infrastructure image that remains truthful at a broad production level. |
| Finished tea | `Ajanta Tea   Gold Classic Assam Tea.png` | Authentic approved product campaign composition with readable packaging. |
| About landscape | `Tea Garden/A7408299.JPG` | Atmospheric but factual tea garden view without identifiable people. |
| Wholesale foundation | `Factory/A7408437.JPG` | Clear facility exterior that supports commercial credibility. |
| Golden Pearl | `Nahorchukbari_Golden_Pearl_Web_Transparent.png` | Accurate transparent product presentation supplied by the company. |

## Homepage Carousel

`GardenStoryCarousel` uses Embla Carousel as the only drag and snap engine. It supports mouse dragging, touch swiping, previous and next controls, keyboard arrow navigation, numbered indicators, a live counter and a progress line. Manual interaction is primary and autoplay is intentionally omitted.

Images use stable aspect ratios, native Next.js lazy loading and responsive `sizes`. The active slide occupies most of the viewport while the next slide remains partially visible. Motion is limited to Embla translation, restrained image settling and progress feedback. Reduced-motion styles remove decorative transitions.

The section sits after the people montage and before the scroll-driven product mosaic, preserving the narrative sequence:

`People -> Land -> Leaf -> Process -> Finished tea -> Product mosaic`

## Page Enhancements

### Homepage

- Added the signature garden-to-cup carousel.
- Preserved the hero video, people montage, product mosaic and scroll sequence.
- Added the supplied Golden Pearl jar to the historical milestone presentation.

### About

- Replaced illustrative hero and landscape media with authentic garden photography.
- Replaced generic tea preparation photographs with factory leaf and machinery images.
- Added the supplied Golden Pearl jar while preserving the verified one-kilogram auction language.
- Kept the existing people montage.

### Our Craft

- Replaced the illustrative hero with authentic factory machinery.
- Converted the sticky abstract process panel into a photographic process stage.
- Kept stage descriptions broad where the exact machine or production step is not independently confirmed.

### Wholesale

- Replaced the generic landscape with the authentic factory exterior.
- Added a restrained three-image operational sequence covering fresh leaf, machinery and factory infrastructure.
- Preserved the enquiry form and all commercial disclaimers.

### Our Teas and Product Pages

- Added a product-led editorial campaign composition for Ajanta Gold, Ajanta Elaichi, High Societea and Kolkata Street Masala Chai.
- Added real campaign photography to individual product pages.
- Replaced the generic Golden Pearl visual with the supplied transparent jar.
- Did not classify the Garden Fresh Tea tote as an available product.

### Gallery

- Rebuilt `/gallery` as a stable responsive archive with category filters.
- Added an accessible native-dialog lightbox with Escape, previous and next controls, keyboard arrows, focus containment and background scroll locking.
- New identifiable portraits remain excluded until publication permission is confirmed.

## Local Media Mapping

Web derivatives live in `public/images/story/`. Planned Cloudinary public IDs are registered in `scripts/upload-media-to-cloudinary.ts` under:

- `aft-techno-trade/gardens/`
- `aft-techno-trade/factory/`
- `aft-techno-trade/products/`
- `aft-techno-trade/campaigns/`

No new assets were uploaded during implementation. The new people photographs require publication approval. The migration remains secure, refuses public-ID overwrites and does not expose API credentials.

## Adding Future Photography

1. Keep the original outside `public/` and never overwrite it.
2. Record the source in `docs/photographic-asset-inventory.csv`.
3. Confirm provenance, visible sensitive information and publication rights.
4. Create a metadata-free web derivative without upscaling.
5. Add the derivative to `public/images/story/`.
6. Add one typed entry to `lib/photographic-stories.ts`.
7. Reference the entry from `gardenJourneySlides`, `productCampaigns` or the gallery data as appropriate.
8. Add only approved assets to the secure Cloudinary migration list.
9. Re-run lint, TypeScript, build, browser interaction checks and responsive screenshots.

## Approvals Still Required

- Publication consent for every new image containing identifiable tea garden or factory workers.
- Confirmation that the new factory photographs may be publicly associated with AFT operations.
- Product artwork approval for the four new Ajanta campaign files and Golden Pearl jar.
- Confirmation of the commercial identity and availability of the Garden Fresh Tea woven tote.
- Confirmation before any new source is uploaded to Cloudinary or deployed to a Vercel Preview.

## Validation Status

Completed on the production build:

- `npm run lint`: passed.
- `npx tsc --noEmit`: passed.
- `npm run test:enquiries`: 7 tests passed. Node reports the existing module-type warning for the TypeScript test file.
- `npm run build`: passed with all 19 static or generated pages completed.
- `npm audit --omit=dev`: passed with zero known vulnerabilities after the targeted `zod` patch upgrade from 4.6.5 to 4.6.6 or newer within the declared patch range.
- Mobile Lighthouse at 390px with reduced motion: homepage and gallery each scored 100 for Accessibility, Best Practices, SEO and Agentic Browsing.
- Carousel keyboard navigation, controls and reduced-motion behavior passed. Gallery filtering, native-dialog focus return, Escape, arrow navigation and body scroll locking passed.
- Browser checks at 320, 360, 390, 430, 768, 1024, 1440 and 1920 widths found no document-level horizontal overflow or broken images on the homepage, About, Gallery, Teas, Craft, Wholesale and Golden Pearl routes.
- A final production-server pass across those routes at 390px reported no console warnings or errors.

### Performance measurements

Tests used a 390 x 844 viewport at DPR 2, Fast 4G and 4x CPU slowdown. These are lab measurements without CrUX field data and should be interpreted as directional rather than as a production SLA.

| Measurement | LCP | CLS | TTFB | Estimated image waste |
| --- | ---: | ---: | ---: | ---: |
| Existing public production baseline, one cold run | 2,015 ms | 0.00 | 48 ms | 216.8 kB |
| First local production build, before responsive montage poster | 2,042 ms | 0.00 | 13 ms | 639.7 kB |
| Final local production build, three cold runs | 2,206-2,584 ms; median 2,476 ms | 0.00 | 7-21 ms | 178.8 kB |

The carousel remains below the fold and its images are lazy loaded. The largest avoidable image issue in the first local build was the raw 1920 x 1080 montage poster. It now renders through the responsive image pipeline behind the video, reducing the estimated image-delivery waste by roughly 72 percent within the local build. LCP remained dominated by render delay and varied between cold runs; no claim of an LCP improvement is made from this sample.

PNG screenshots are stored in `artifacts/photographic-storytelling/`, covering the homepage carousel, gallery, Ajanta campaigns, Craft process, Wholesale origin and About story on representative desktop and mobile viewports.

No Cloudinary upload, Vercel Preview or production deployment was performed.
