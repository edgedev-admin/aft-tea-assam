import type { Metadata } from "next";
import { pageMetadata } from "../../lib/seo";
import { PhotographicGallery } from "../../components/photographic-gallery";
import { SiteFooter } from "../../components/site-footer";
import { SiteNavbar } from "../../components/site-navbar";

export const metadata: Metadata = pageMetadata({
  title: "Tea Gallery",
  description: "Explore authentic AFT Techno Trade photography from Assam tea gardens, harvesting, factory operations and product campaigns.",
  path: "/gallery",
});

export default function GalleryPage() {
  return <>
    <SiteNavbar />
    <main id="main">
      <PhotographicGallery />
    </main>
    <SiteFooter />
  </>;
}
