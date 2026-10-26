"use client";

import { ArrowUpRight, ChevronRight, Mail, Menu, Phone, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { COMPANY_CONTACT } from "../lib/company";
import { AnimatedBrandLogo } from "./animated-brand-logo";
import "../app/hero.css";
import "../app/navbar-polish.css";

const links = [
  { label: "Home", href: "/" },
  { label: "Our Teas", href: "/teas" },
  { label: "About Us", href: "/about" },
  { label: "Our Craft", href: "/craft" },
  { label: "Wholesale", href: "/wholesale" },
  { label: "Gallery", href: "/gallery" },
];
const mobileLinks = [
  ...links,
  { label: "Contact", href: "/contact" },
];
const enquiryHref = "/contact";
type NavbarTheme = "overlay-dark" | "solid-light";

const overlayDarkRoutes = new Set([
  "/",
  "/about",
  "/craft",
  "/projects",
  "/wholesale"
]);

function navbarThemeFor(pathname: string): NavbarTheme {
  return overlayDarkRoutes.has(pathname) ? "overlay-dark" : "solid-light";
}

function activeState(pathname: string, href: string) {
  if (pathname === href) return "page" as const;
  if (href !== "/" && pathname.startsWith(`${href}/`)) return "location" as const;
  return undefined;
}

export function SiteNavbar() {
  const pathname = usePathname();
  const navbarTheme = navbarThemeFor(pathname);
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const usesDarkForeground = isScrolled || navbarTheme === "solid-light";
  const scrollSentinelRef = useRef<HTMLSpanElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);
  const shouldRestoreFocus = useRef(false);

  function closeDrawer(restoreFocus = true) {
    shouldRestoreFocus.current = restoreFocus;
    setIsOpen(false);
  }

  useEffect(() => {
    const sentinel = scrollSentinelRef.current;
    if (!sentinel) return;
    const observer = new IntersectionObserver(
      ([entry]) => setIsScrolled(!entry.isIntersecting),
      { threshold: 0 }
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isOpen) {
      if (shouldRestoreFocus.current) menuButtonRef.current?.focus();
      shouldRestoreFocus.current = false;
      return;
    }

    const focusTimer = window.setTimeout(() => closeButtonRef.current?.focus(), 50);
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeDrawer();
        return;
      }
      if (event.key !== "Tab") return;

      const focusable = Array.from(drawerRef.current?.querySelectorAll<HTMLElement>("a[href], button:not([disabled])") ?? []);
      const first = focusable[0];
      const last = focusable.at(-1);
      if (!first || !last) return;
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      window.clearTimeout(focusTimer);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = previousOverflow; };
  }, [isOpen]);

  return <><span ref={scrollSentinelRef} className="nav-scroll-sentinel" aria-hidden="true"/><header className={`site-header nav-theme-${navbarTheme}${isScrolled ? " is-scrolled" : ""}`} data-navbar-theme={navbarTheme}>
    <div className="utility-strip">
      <div className="utility-strip-inner">
        <p>{COMPANY_CONTACT.utilityLabel}</p>
        <nav className="utility-contact-links" aria-label="Direct contact">
          <a href={COMPANY_CONTACT.emailHref}><Mail size={13} aria-hidden="true" />Email Us</a>
          <a href={COMPANY_CONTACT.phoneHref}><Phone size={13} aria-hidden="true" />Call Our Team</a>
        </nav>
      </div>
    </div>
    <div className="nav-shell">
      <button ref={menuButtonRef} className="menu" type="button" aria-label={isOpen ? "Close navigation" : "Open navigation"} aria-expanded={isOpen} aria-controls="mobile-navigation" onClick={() => isOpen ? closeDrawer() : setIsOpen(true)}>
        {isOpen ? <X size={22} /> : <Menu size={22} />}
      </button>
      <Link className="brand" href="/">
        <span className="motion-sr-only">A.F.T TECHNO TRADE</span>
        <AnimatedBrandLogo tone={usesDarkForeground ? "dark" : "light"} />
      </Link>
      <nav aria-label="Primary navigation">
        {links.map((link) => {
          const current = activeState(pathname, link.href);
          return <Link className={current ? "active" : ""} href={link.href} aria-current={current} key={link.label}>{link.label}</Link>;
        })}
        <Link className={pathname === enquiryHref ? "active" : ""} href={enquiryHref} aria-current={pathname === enquiryHref ? "page" : undefined}>Contact</Link>
      </nav>
      <Link className="nav-cta" href={enquiryHref}>Enquire <ArrowUpRight size={16} /></Link>
    </div>
    {isOpen && <button className="mobile-menu-backdrop" type="button" aria-label="Close navigation" onClick={() => closeDrawer()}/>}
    <div ref={drawerRef} id="mobile-navigation" className={`drawer ${isOpen ? "is-open" : ""}`} role="dialog" aria-modal="true" aria-label="Mobile navigation" aria-hidden={!isOpen}>
      <div className="mobile-drawer-head">
        <Link className="mobile-drawer-brand" href="/" aria-label="AFT Techno Trade home" onClick={() => closeDrawer(false)}>
          <Image className="mobile-drawer-seal" src="/branding/aft-circular-seal.svg" alt="" width={72} height={72} />
          <span className="mobile-menu-title">AFT Techno Trade</span>
        </Link>
        <button ref={closeButtonRef} className="mobile-drawer-close" type="button" aria-label="Close navigation" onClick={() => closeDrawer()}><X size={20}/></button>
      </div>
      <nav aria-label="Mobile navigation">
        {mobileLinks.map((link) => {
          const current = activeState(pathname, link.href);
          return <Link className={current ? "active" : ""} href={link.href} aria-current={current} onClick={() => closeDrawer(false)} key={link.label}><span>{link.label}</span><ChevronRight size={17}/></Link>;
        })}
      </nav>
      <Link className="nav-cta" href={enquiryHref} onClick={() => closeDrawer(false)}>Enquire <ArrowUpRight size={16} /></Link>
    </div>
  </header></>;
}
