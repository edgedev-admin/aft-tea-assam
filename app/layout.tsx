import type { Metadata } from "next";
import localFont from "next/font/local";
import { organizationData, SITE_URL } from "../lib/seo";
import { StructuredData } from "../components/structured-data";
import "./base.css";
import "./mobile-optimizations.css";
import "./responsive-polish.css";
import "./brand.css";
import "./recovery.css";
import "./content-overrides.css";
import "./product-motion.css";

const inter = localFont({ src: "../public/fonts/Inter-Latin.woff2", weight: "100 900", variable: "--font-sans", display: "swap" });
const playfair = localFont({ src: "../public/fonts/PlayfairDisplay-Latin.woff2", weight: "400", variable: "--font-display", display: "swap" });
const aftEnglishLogo = localFont({ src: "../public/fonts/Mogtan-Exfonte686.otf", variable: "--font-aft-logo-en", display: "swap" });
const aftAssameseLogo = localFont({ src: "../public/fonts/Li Purno Pran Unicode.ttf", variable: "--font-aft-logo-as", display: "swap" });
const isVercelPreview = process.env.VERCEL_ENV === "preview";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: "AFT Techno Trade", template: "%s | AFT Techno Trade" },
  description: "AFT Techno Trade manufactures, processes and supplies Assam tea from Dikom and Lahowal, including specialty teas, CTC grades and the Ajanta Tea collection.",
  applicationName: "AFT Techno Trade",
  keywords: ["AFT Techno Trade", "Upper Assam tea", "Assam CTC tea", "Golden Pearl tea", "Nahorchukbari", "Ekoratoli", "Ajanta Tea", "tea wholesale"],
  robots: isVercelPreview ? { index: false, follow: false, noarchive: true } : undefined,
  openGraph: {
    title: "AFT Techno Trade",
    description: "Tea manufacturing, specialty craftsmanship and wholesale supply from Dikom and Lahowal in Upper Assam.",
    siteName: "AFT Techno Trade",
    type: "website",
    images: [{ url: "/images/tea/assam-dawn.png", width: 1680, height: 945, alt: "Tea landscape associated with AFT Techno Trade" }]
  },
  twitter: {
    card: "summary_large_image",
    title: "AFT Techno Trade",
    description: "Tea manufacturing, specialty craftsmanship and wholesale supply from Dikom and Lahowal in Upper Assam.",
    images: ["/images/tea/assam-dawn.png"]
  }
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en"><body className={`${inter.variable} ${playfair.variable} ${aftEnglishLogo.variable} ${aftAssameseLogo.variable}`}><a className="skip-link" href="#main">Skip to content</a><StructuredData data={organizationData} />{children}</body></html>; }
