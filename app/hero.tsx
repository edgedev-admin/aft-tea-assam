import Image from "next/image";
import "./hero.css";
import "./hero-video.css";
import { ArrowUpRight, CalendarDays, Check, Leaf, MapPin } from "lucide-react";
import { SiteNavbar } from "../components/site-navbar";
import { Reveal, RevealHeading } from "../components/reveal";

const image = (id: string) => `https://framerusercontent.com/images/${id}.png`;
const portraits = ["qu2dxD8AIhFdbskvvU5Brz7lCeE", "VICL3a2uLcII0fmbjq1CkyjhI9g", "XU9QOzdsFxK6adCaQsmXTX4rOX0"];

function StatsCard() {
  const values = [[CalendarDays, "2019", "Commercial Production"], [Leaf, "₹99,999", "2022 Auction Result"], [MapPin, "Assam", "Dibrugarh Region"]] as const;
  return <Reveal as="aside" className="hero-stats" delay={.38}><div className="stat-row">{values.map(([Icon, value, label], index) => <div className={`hero-stat hero-stat-${index + 1}`} key={label}><span className="stat-icon"><Icon size={18}/></span><strong>{value}</strong><small>{label}</small></div>)}</div><div className="stat-message"><span className="check"><Check size={16}/></span><p><b>Rooted in small tea-growing communities.</b><br/>Distinctive Assam tea, made with purpose.</p></div></Reveal>;
}

export default function Hero() {
  return <main id="home" className="hero-page"><SiteNavbar/><section className="hero"><video className="hero-background" autoPlay muted loop playsInline preload="metadata" aria-hidden="true"><source src="/aft-hero.mp4" type="video/mp4"/></video><div className="hero-overlay"/><div className="hero-shell"><div className="hero-copy"><Reveal><p className="eyebrow">Premium Assam Tea · Est. 2019</p></Reveal><h1 className="hero-title-desktop"><RevealHeading text={"Rooted in Assam.\nCrafted for Distinction."}/></h1><h1 className="hero-title-mobile"><RevealHeading text={"Rooted in\nAssam.\nCrafted for\nDistinction."}/></h1><Reveal delay={.2}><p className="lede">From Assam’s tea-growing roots to distinctive speciality tea, AFT brings together local knowledge, manufacturing expertise and a commitment to exceptional tea.</p></Reveal><Reveal delay={.28}><div className="actions"><a className="quote-button" href="/contact">Get a Quote <ArrowUpRight size={15}/></a><a className="project-button" href="/teas">Explore Our Teas <ArrowUpRight size={15}/></a></div></Reveal><Reveal delay={.34}><div className="social-proof"><div className="avatars">{portraits.map((photo, index) => <Image key={photo} src={image(photo)} alt="AFT Tea Factory grower" width={38} height={38} className="avatar" style={{ zIndex: portraits.length - index }}/>)}</div><span className="proof-badge">AFT</span><p>Based in the Dikom/Lahowal area<br/>of Dibrugarh, Assam</p></div></Reveal></div><StatsCard/></div></section></main>;
}
