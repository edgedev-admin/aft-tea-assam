import type { Metadata } from "next";
import { AftPage, AftSection } from "../../components/aft-page";
import { CloudinaryImage } from "../../components/cloudinary-image";

export const metadata: Metadata = {
  title: "Tea Gallery",
  description: "View AFT Techno Trade's supplied tea imagery, including product packaging and illustrative views of Assam tea and finished leaf.",
  alternates: { canonical: "/gallery" }
};

const images = [
  ["/images/tea/assam-dawn.png", "Illustrative view of an Assam tea landscape"],
  ["/images/tea/about-1.jpg", "Tea leaf detail"],
  ["/images/products/ajanta-gold.jpg", "Ajanta Gold photographed package"],
  ["/images/products/high-societea.jpg", "High Societea photographed package"],
  ["/images/products/kolkata-street-masala-chai.jpg", "Kolkata Street Masala Chai photographed package"],
  ["/images/tea/product-3.jpg", "Finished black tea leaf"]
] as const;

export default function GalleryPage() {
  return <AftPage kicker="Gallery" title={"A closer look at\nour world of tea."} intro="Supplied product photography sits alongside illustrative tea imagery. Where an image is not documented as an AFT facility, garden or team photograph, the caption says so." image="/images/tea/assam-dawn.png">
    <AftSection kicker="Tea in view" title="Product, leaf and place"><div className="aft-gallery">{images.map(([src, alt]) => <figure key={src}><CloudinaryImage src={src} alt={alt} fill sizes="(max-width: 760px) 50vw, 33vw"/><figcaption>{alt}</figcaption></figure>)}</div></AftSection>
  </AftPage>;
}
