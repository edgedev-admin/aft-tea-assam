import type { Metadata } from "next";
import { AboutExperience } from "../../components/about-experience";
import { SiteFooter } from "../../components/site-footer";
import { SiteNavbar } from "../../components/site-navbar";

export const metadata: Metadata = {
  title: { absolute: "About AFT Techno Trade | Our Story in Upper Assam" },
  description: "Discover the story of AFT Techno Trade, established in 2018 in Upper Assam, and learn about our tea craftsmanship, manufacturing, collections, and commitment to quality.",
  alternates: { canonical: "/about" }
};

export default function AboutPage() {
  return <>
    <SiteNavbar />
    <main id="main">
      <AboutExperience />
    </main>
    <SiteFooter />
  </>;
}
