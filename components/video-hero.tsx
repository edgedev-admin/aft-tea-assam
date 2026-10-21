import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import styles from "./video-hero.module.css";

export function VideoHero() {
  return <section className="video-hero" aria-labelledby="home-hero-title">
    <div className="video-hero-media" aria-hidden="true">
      <video
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        poster="/images/tea/assam-dawn.png"
      >
        <source
          src="/aft-hero.mp4"
          type="video/mp4"
          media="(prefers-reduced-motion: no-preference)"
        />
      </video>
      <div className="video-hero-fallback">
        <Image src="/images/tea/assam-dawn.png" alt="" fill priority sizes="100vw" />
      </div>
    </div>
    <div className="video-hero-shade" aria-hidden="true" />
    <div className="video-hero-inner">
      <div className="video-hero-copy">
        <p className="hero-kicker">AFT Techno Trade &bull; Upper Assam</p>
        <h1 id="home-hero-title" className={styles.headline}>
          <span className={styles.line}>Rooted in Assam.</span>
          <span className={styles.line}>Crafted for every cup.</span>
        </h1>
        <p className="lede">From everyday Assam CTC to carefully made specialty teas, we bring the character of Upper Assam to tea drinkers and professional buyers.</p>
        <div className="hero-actions">
          <Link className="brand-button" href="/teas">Explore our teas <ArrowUpRight size={16} /></Link>
          <Link className="brand-button secondary" href="/wholesale">Wholesale enquiries <ArrowUpRight size={16} /></Link>
        </div>
      </div>
    </div>
    <a className="scroll-cue" href="#editorial-story" aria-label="Scroll to company story">
      <span>Scroll</span>
      <ArrowDown size={16} />
    </a>
  </section>;
}
