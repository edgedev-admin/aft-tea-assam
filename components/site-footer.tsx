"use client";

import { ArrowUp, ArrowUpRight, Mail, MapPin, Phone } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { FaFacebookF, FaInstagram, FaXTwitter } from "react-icons/fa6";
import { businessContacts, COMPANY_CONTACT, phoneHref } from "../lib/company";
import { WhatsAppAction } from "./whatsapp-action";
import "../app/footer.css";

type FooterLink = { label: string; href: string };

const exploreLinks: FooterLink[] = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  { label: "Our Craft", href: "/craft" },
  { label: "Gallery", href: "/gallery" },
  { label: "Contact", href: "/contact" }
];

const teaLinks: FooterLink[] = [
  { label: "All Teas", href: "/teas" },
  { label: "Nahorchukbari", href: "/teas#nahorchukbari" },
  { label: "Ekoratoli", href: "/teas#ekoratoli" },
  { label: "Ajanta Tea", href: "/teas#ajanta-tea" },
  { label: "Golden Pearl", href: "/teas/golden-pearl" }
];

const businessLinks: FooterLink[] = [
  { label: "Wholesale Enquiries", href: "/wholesale" },
  { label: "Bulk CTC Supply", href: "/wholesale#supply-options" },
  { label: "Custom Blending", href: "/wholesale#supply-options" },
  { label: "Private-Label Supply", href: "/wholesale#supply-options" }
];

function FooterColumn({ title, links }: { title: string; links: FooterLink[] }) {
  return <section className="footer-column"><h2>{title}</h2><nav aria-label={`${title} links`}>{links.map((link) => <Link href={link.href} key={link.label}>{link.label}</Link>)}</nav></section>;
}

export function SiteFooter({ productName }: { productName?: string } = {}) {
  const year = new Date().getFullYear();

  function scrollToTop() {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
  }

  return <footer className="site-footer">
    <div className="footer-accent" aria-hidden="true" />
    <div className="footer-shell">
      <div className="footer-topline">
        <p>Manufactured in Upper Assam. Made for many kinds of cup.</p>
        <button className="back-to-top" type="button" onClick={scrollToTop} aria-label="Back to top">
          <span>Back to top</span><i aria-hidden="true"><ArrowUp size={17}/></i>
        </button>
      </div>

      <div className="footer-grid">
        <section className="footer-brand" aria-labelledby="footer-brand-name">
          <Link href="/" className="footer-logo" aria-label="AFT Techno Trade home">
            <Image src="/branding/aft-circular-seal.svg" alt="" width={72} height={72}/>
            <span id="footer-brand-name">AFT Techno Trade</span>
          </Link>
          <p>Established in 2018, AFT Techno Trade brings together tea manufacturing, specialty craftsmanship and wholesale supply from Dikom and Lahowal.</p>
          <Link className="footer-brand-link" href="/about">Our company <ArrowUpRight size={15}/></Link>
        </section>

        <FooterColumn title="Explore" links={exploreLinks}/>
        <FooterColumn title="Our Teas" links={teaLinks}/>
        <FooterColumn title="Business" links={businessLinks}/>

        <section className="footer-column footer-contact" aria-labelledby="footer-contact-title">
          <h2 id="footer-contact-title">Contact</h2>
          <div className="footer-location"><MapPin size={18}/><p><strong>AFT Techno Trade</strong><span>Dikom &amp; Lahowal<br/>Dibrugarh, Assam 786010</span></p></div>
          {businessContacts.map((contact) => <div className="footer-phone-row" key={contact.id}><a className="footer-detail-link" href={phoneHref(contact)} aria-label={`Call ${contact.label}: ${contact.display}`}><Phone size={15}/>{contact.display}</a></div>)}
          <a className="footer-detail-link" href={COMPANY_CONTACT.emailHref}><Mail size={15}/>{COMPANY_CONTACT.email}</a>
          <WhatsAppAction productName={productName} />
          <div className="footer-socials"><a href="https://www.instagram.com/aftteaindia/" target="_blank" rel="noopener noreferrer" aria-label="AFT Tea India on Instagram"><FaInstagram aria-hidden="true"/></a><a href="https://www.facebook.com/AFTTeaIndia" target="_blank" rel="noopener noreferrer" aria-label="AFT Tea India on Facebook"><FaFacebookF aria-hidden="true"/></a><a href="https://x.com/AFTTeaIndia" target="_blank" rel="noopener noreferrer" aria-label="AFT Tea India on X"><FaXTwitter aria-hidden="true"/></a></div>
          <Link className="footer-contact-link" href="/contact">Start an enquiry <ArrowUpRight size={15}/></Link>
        </section>
      </div>

      <div className="footer-bottom">
        <p>&copy; {year} AFT Techno Trade. All rights reserved.</p>
        <nav className="footer-legal" aria-label="Legal information">
          <Link href="/privacy">Privacy</Link>
          <Link href="/terms">Terms</Link>
          <Link href="/contact">Contact</Link>
        </nav>
        <p>Assam, India</p>
      </div>
    </div>
  </footer>;
}
