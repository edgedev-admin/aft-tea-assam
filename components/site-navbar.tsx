"use client";

import { ArrowUpRight, Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import "../app/hero.css";

const links = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Our Teas", href: "/teas" },
  { label: "Our Craft", href: "/craft" },
];
const mobileLinks = [
  ...links,
  { label: "Golden Pearl", href: "/golden-pearl" },
  { label: "Wholesale", href: "/wholesale" },
  { label: "Gallery", href: "/gallery" },
  { label: "Projects", href: "/projects" },
  { label: "Contact", href: "/contact" },
];
const enquiryHref = "/contact";

export function SiteNavbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const updateScrollState = () => setIsScrolled(window.scrollY > 12);
    updateScrollState();
    window.addEventListener("scroll", updateScrollState, { passive: true });
    return () => window.removeEventListener("scroll", updateScrollState);
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  return <header className={`site-header ${isScrolled ? "is-scrolled" : ""}`}>
    <div className="nav-shell">
      <Link className="brand" href="/" aria-label="AFT Techno Trade home">
        <span className="brand-logo" aria-hidden="true"><Image src="/aft-tea-factory-logo.png" alt="" width={120} height={120} priority /></span>
        <span>AFT Tea Factory<small>AFT Techno Trade</small></span>
      </Link>
      <nav aria-label="Primary navigation">
        {links.map((link) => <Link className={pathname === link.href ? "active" : ""} href={link.href} key={link.label}>{link.label}</Link>)}
        <Link className={pathname === enquiryHref ? "active" : ""} href={enquiryHref}>Contact</Link>
      </nav>
      <Link className="nav-cta" href={enquiryHref}>Get a Quote <ArrowUpRight size={16} /></Link>
      <button className="menu" type="button" aria-label={isOpen ? "Close navigation" : "Open navigation"} aria-expanded={isOpen} aria-controls="mobile-navigation" onClick={() => setIsOpen((open) => !open)}>
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>
    </div>
    {isOpen && <button className="mobile-menu-backdrop" type="button" aria-label="Close navigation" onClick={() => setIsOpen(false)}/>}
    <div id="mobile-navigation" className={`drawer ${isOpen ? "is-open" : ""}`} aria-hidden={!isOpen}>
      <p className="mobile-menu-title">Explore AFT</p>
      <nav aria-label="Mobile navigation">
        {mobileLinks.map((link, index) => <Link className={pathname === link.href ? "active" : ""} href={link.href} onClick={() => setIsOpen(false)} key={link.label}><small>{String(index + 1).padStart(2, "0")}</small><span>{link.label}</span><ArrowUpRight size={18}/></Link>)}
      </nav>
      <div className="mobile-menu-secondary"><p>Discover AFT</p><Link href="/about" onClick={() => setIsOpen(false)}>Our Story</Link><Link href="/teas" onClick={() => setIsOpen(false)}>Tea Collection</Link></div>
      <Link className="nav-cta" href={enquiryHref} onClick={() => setIsOpen(false)}>Get in Touch <ArrowUpRight size={16} /></Link>
    </div>
  </header>;
}
