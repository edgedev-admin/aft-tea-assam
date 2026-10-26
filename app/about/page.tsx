import type { Metadata } from "next";
import { pageMetadata } from "../../lib/seo";
import { AboutExperience } from "../../components/about-experience";
import { SiteFooter } from "../../components/site-footer";
import { SiteNavbar } from "../../components/site-navbar";

export const metadata: Metadata = pageMetadata({
  title: "About AFT Techno Trade | Assam Tea Manufacturing & Our Story",
  description: "Discover AFT Techno Trade's roots in Upper Assam, manufacturing journey, Golden Pearl milestone and commitment to Assam tea craftsmanship.",
  path: "/about",
});

export default function AboutPage() {
  return <>
    <SiteNavbar />
    <main id="main">
      <AboutExperience />
    </main>
    <SiteFooter />
  </>;
}
