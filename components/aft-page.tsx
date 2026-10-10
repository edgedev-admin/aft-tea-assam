import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Leaf } from "lucide-react";
import { SiteNavbar } from "./site-navbar";
import { SiteFooter } from "./site-footer";
import { Reveal, RevealHeading, RevealImage } from "./reveal";
import { FAQSection } from "./faq-section";
import "../app/page-shell.css";

export type AftCard = { eyebrow: string; title: string; text: string; href?: string; image?: string };

export function AftPage({ kicker, title, intro, image, children }: { kicker: string; title: string; intro: string; image: string; children: React.ReactNode }) {
  return <><SiteNavbar/><main className="aft-page"><section className="aft-page-hero"><Image src={image} alt="Assam tea landscape" fill priority sizes="100vw"/><div className="aft-page-hero-overlay"/><div className="aft-page-container aft-page-hero-copy"><Reveal><p className="aft-page-kicker"><Leaf size={13}/>{kicker}</p></Reveal><h1><RevealHeading text={title}/></h1><Reveal delay={.16}><p>{intro}</p></Reveal></div></section>{children}<FAQSection/></main><SiteFooter/></>;
}

export function AftSection({ kicker, title, text, children }: { kicker?: string; title?: string; text?: string; children?: React.ReactNode }) {
  return <section className="aft-page-section"><div className="aft-page-container">{kicker && <Reveal><p className="aft-page-kicker dark"><Leaf size={13}/>{kicker}</p></Reveal>}{title && <h2><RevealHeading text={title}/></h2>}{text && <Reveal delay={.12}><p className="aft-page-intro">{text}</p></Reveal>}{children}</div></section>;
}

export function EditorialPair({ image, alt, kicker, title, text, reverse = false }: { image: string; alt: string; kicker: string; title: string; text: string; reverse?: boolean }) {
  return <section className={`aft-page-section editorial ${reverse ? "reverse" : ""}`}><div className="aft-page-container editorial-grid"><RevealImage className="editorial-image"><Image src={image} alt={alt} fill sizes="(max-width: 760px) 100vw, 46vw"/></RevealImage><div className="editorial-copy"><Reveal><p className="aft-page-kicker dark"><Leaf size={13}/>{kicker}</p></Reveal><h2><RevealHeading text={title}/></h2><Reveal delay={.14}><p>{text}</p></Reveal></div></div></section>;
}

export function CardGrid({ cards }: { cards: AftCard[] }) {
  return <div className="aft-card-grid">{cards.map((card, index) => <Reveal as="article" delay={index * .08} className="aft-card" key={card.title}>{card.image && <div className="aft-card-image"><Image src={card.image} alt="" fill sizes="(max-width: 760px) 100vw, 33vw"/></div>}<p>{card.eyebrow}</p><h3>{card.title}</h3><span>{card.text}</span>{card.href && <Link href={card.href}>Discover <ArrowUpRight size={15}/></Link>}</Reveal>)}</div>;
}

export function PageCta({ title = "Let’s Talk Tea", text = "For business, product and wholesale enquiries, start a conversation with the AFT Tea Factory team." }: { title?: string; text?: string }) {
  return <section className="aft-page-cta"><div className="aft-page-container"><Reveal><p className="aft-page-kicker"><Leaf size={13}/>AFT Tea Factory</p><h2>{title}</h2><p>{text}</p><Link href="/contact">Contact Our Team <ArrowUpRight size={16}/></Link></Reveal></div></section>;
}
