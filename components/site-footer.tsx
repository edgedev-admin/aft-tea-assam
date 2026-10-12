"use client";

import { FormEvent, useState } from "react";
import { ArrowRight, Leaf, Mail, Sprout } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import "../app/footer.css";

type FooterLink = { label: string; href: string };
const exploreLinks: FooterLink[] = [{ label: "Home", href: "/" }, { label: "About Us", href: "/about" }, { label: "Our Craft", href: "/craft" }, { label: "Gallery", href: "/gallery" }, { label: "Company Initiatives", href: "/projects" }];
const productLinks: FooterLink[] = [{ label: "Our Teas", href: "/teas" }, { label: "Golden Pearl", href: "/golden-pearl" }, { label: "Wholesale Enquiries", href: "/wholesale" }, { label: "Contact", href: "/contact" }];

function FooterColumn({ title, links }: { title: string; links: FooterLink[] }) {
  return <section className="footer-column"><h2>{title}</h2><span className="footer-column-line"/><nav aria-label={`${title} links`}>{links.map((link) => <a href={link.href} key={link.label}>{link.label}</a>)}</nav></section>;
}

function NewsletterForm() {
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const email = new FormData(event.currentTarget).get("email")?.toString().trim() ?? "";
    if (!/^\S+@\S+\.\S+$/.test(email)) { setIsError(true); setMessage("Please enter a valid email address."); return; }
    setIsError(false);
    setMessage("Thanks — newsletter sign-up is not connected yet. Please contact our team to subscribe.");
  }
  return <div className="newsletter-copy"><h2>Stay Connected with AFT Tea</h2><p>Get updates about our tea offerings, company news, and speciality tea developments.</p><form className="newsletter-form" onSubmit={submit} noValidate><label className="sr-only" htmlFor="footer-email">Email address</label><input id="footer-email" name="email" type="email" placeholder="Your email address" aria-describedby="newsletter-feedback" onChange={() => message && setMessage("")}/><button type="submit">Subscribe <Leaf size={15}/></button></form><p id="newsletter-feedback" className={`newsletter-feedback ${isError ? "is-error" : ""}`} aria-live="polite">{message}</p></div>;
}

function ConsultationCTA() {
  return <div className="footer-consultation"><span className="consultation-icon"><Sprout size={30}/></span><div><h2>Let&apos;s Talk Tea</h2><p>Discuss wholesale enquiries, sourcing requirements, and speciality tea opportunities with our team.</p><a href="mailto:?subject=AFT%20Tea%20Factory%20enquiry">Contact Our Team <ArrowRight size={16}/></a></div></div>;
}

export function SiteFooter() {
  const year = new Date().getFullYear();
  return <footer className="site-footer"><div className="footer-foliage foliage-upper" aria-hidden="true"><Leaf/><Leaf/><Leaf/></div><div className="footer-foliage foliage-left" aria-hidden="true"><Leaf/><Leaf/><Leaf/></div><div className="footer-foliage foliage-lower" aria-hidden="true"><Leaf/><Leaf/><Leaf/></div><div className="footer-shell"><div className="footer-grid"><section className="footer-brand"><Link href="/" className="footer-logo" aria-label="AFT Techno Trade home"><span className="footer-mark" aria-hidden="true"><Image src="/aft-tea-factory-logo.png" alt="" width={120} height={120}/></span><span>AFT Techno<br/>Trade</span></Link><div className="brand-divider"><span/><Sprout size={15}/><span/></div><p>Rooted in Assam, AFT Techno Trade brings together tea-growing knowledge, manufacturing expertise, and a commitment to distinctive Assam tea.</p></section><FooterColumn title="Explore" links={exploreLinks}/><FooterColumn title="Tea & Products" links={productLinks}/><section className="footer-column footer-contact"><h2>Contact</h2><span className="footer-column-line"/><Link href="/contact" className="contact-link"><Mail size={18}/><span><small>Business enquiries</small>Contact Our Team</span></Link><p>Based in the Dikom/Lahowal area of Dibrugarh, Assam.</p></section></div><div className="footer-panel"><NewsletterForm/><ConsultationCTA/></div><div className="footer-divider" aria-hidden="true"><span/><Sprout size={18}/><span/></div><div className="footer-bottom"><p>© {year} AFT Techno Trade. All rights reserved.</p></div></div></footer>;
}
