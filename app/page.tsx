import type { Metadata } from "next";
import { SiteNavbar } from "../components/site-navbar";
import { SiteFooter } from "../components/site-footer";
import { FamilyStorySection } from "../components/family-story-section";
import { FinalContactCta } from "../components/final-contact-cta";
import { GoldenPearlStory } from "../components/golden-pearl-story";
import { ScrollProductExperience } from "../components/scroll-product-experience";
import { VideoHero } from "../components/video-hero";

export const metadata: Metadata = {
  title: "Assam Tea Manufacturing & Wholesale",
  description: "AFT Techno Trade brings together Upper Assam tea manufacturing, specialty craftsmanship, Ajanta Tea products and commercial supply from Dikom and Lahowal.",
  alternates: { canonical: "/" }
};

export default function HomePage() {
  return <><SiteNavbar/><main id="main" className="brand-home">
    <VideoHero />

    <FamilyStorySection />

    <ScrollProductExperience />

    <GoldenPearlStory />

    <FinalContactCta />
  </main><SiteFooter/></>;
}
