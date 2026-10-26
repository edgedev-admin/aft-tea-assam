import type { Metadata } from "next";
import { pageMetadata } from "../lib/seo";
import { SiteNavbar } from "../components/site-navbar";
import { SiteFooter } from "../components/site-footer";
import { FamilyStorySection } from "../components/family-story-section";
import { FinalContactCta } from "../components/final-contact-cta";
import { GoldenPearlStory } from "../components/golden-pearl-story";
import { GoldenPearlNewspaper } from "../components/golden-pearl-newspaper";
import { GardenStoryCarousel } from "../components/garden-story-carousel";
import { ScrollProductExperience } from "../components/scroll-product-experience";
import { VideoHero } from "../components/video-hero";
import { BusinessPartnershipCta } from "../components/business-partnership-cta";

export const metadata: Metadata = pageMetadata({
  title: "Assam Tea Manufacturing & Wholesale",
  description: "AFT Techno Trade brings together Upper Assam tea manufacturing, specialty craftsmanship, Ajanta Tea products and commercial supply from Dikom and Lahowal.",
  path: "/",
});

export default function HomePage() {
  return <><SiteNavbar/><main id="main" className="brand-home">
    <VideoHero />

    <FamilyStorySection />

    <ScrollProductExperience />

    <GoldenPearlStory />

    <GoldenPearlNewspaper />

    <GardenStoryCarousel />

    <FinalContactCta />

    <BusinessPartnershipCta />
  </main><SiteFooter/></>;
}
