import type { Metadata } from "next";
import { businessContacts, COMPANY_CONTACT } from "./company.ts";

export const SITE_URL = "https://www.afttechnotrade.com";
export const DEFAULT_SOCIAL_IMAGE = "/images/tea/assam-dawn.png";

export function pageMetadata({ title, description, path, image = DEFAULT_SOCIAL_IMAGE, index = true }: { title: string; description: string; path: string; image?: string; index?: boolean }): Metadata {
  const absoluteTitle = title.includes(COMPANY_CONTACT.name) ? title : `${title} | ${COMPANY_CONTACT.name}`;
  const preview = process.env.VERCEL_ENV === "preview";
  const url = new URL(path, SITE_URL).href;
  const socialImage = { url: new URL(image, SITE_URL).href, alt: `${title} — AFT Techno Trade` };
  return {
    title: { absolute: absoluteTitle }, description,
    alternates: { canonical: url },
    robots: preview ? { index: false, follow: false, noarchive: true } : { index, follow: true },
    openGraph: { title: absoluteTitle, description, url, siteName: COMPANY_CONTACT.name, type: "website", images: [socialImage] },
    twitter: { card: "summary_large_image", title: absoluteTitle, description, images: [socialImage] },
  };
}

export const organizationData = {
  "@context": "https://schema.org", "@type": "Organization", "@id": `${SITE_URL}/#organization`,
  name: COMPANY_CONTACT.name, url: SITE_URL, logo: `${SITE_URL}/aft-tea-factory-logo.png`,
  email: COMPANY_CONTACT.email, foundingDate: "2018",
  address: { "@type": "PostalAddress", addressLocality: "Dibrugarh", addressRegion: "Assam", postalCode: "786010", addressCountry: "IN" },
  contactPoint: businessContacts.map((contact) => ({ "@type": "ContactPoint", name: contact.label, contactType: "Business enquiries", telephone: `+${contact.international}`, email: COMPANY_CONTACT.email })),
  sameAs: ["https://www.instagram.com/aftteaindia/", "https://www.facebook.com/AFTTeaIndia", "https://x.com/AFTTeaIndia"],
};

export function productStructuredData(product: { name: string; slug: string; description: string; image: string; brand: string }) {
  return {
    "@context": "https://schema.org", "@graph": [
      { "@type": "Product", "@id": `${SITE_URL}/teas/${product.slug}#product`, name: product.name, url: `${SITE_URL}/teas/${product.slug}`, description: product.description, image: new URL(product.image, SITE_URL).href, brand: { "@type": "Brand", name: product.brand }, manufacturer: { "@id": `${SITE_URL}/#organization` } },
      { "@type": "BreadcrumbList", itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
        { "@type": "ListItem", position: 2, name: "Our Teas", item: `${SITE_URL}/teas` },
        { "@type": "ListItem", position: 3, name: product.name, item: `${SITE_URL}/teas/${product.slug}` },
      ] },
    ],
  };
}
