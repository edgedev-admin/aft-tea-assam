import HeroSection from "./hero";
import { AboutSection } from "../components/about-section";
import { ServicesSection } from "../components/services-section";
import { WhyChooseUsSection } from "../components/why-choose-us-section";
import { ResponsiveTestimonialsSection } from "../components/responsive-testimonials-section";
import { FAQSection } from "../components/faq-section";
import { SiteFooter } from "../components/site-footer";

/** The homepage deliberately mounts only the approved hero composition. */
export default function HomePage() {
  return <><HeroSection /><AboutSection /><ServicesSection /><WhyChooseUsSection /><ResponsiveTestimonialsSection /><FAQSection /><SiteFooter /></>;
}
