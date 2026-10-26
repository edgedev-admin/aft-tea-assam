import Link from "next/link";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { cloudinaryImageUrl, cloudinaryVideoUrl, usesCloudinary } from "../lib/cloudinary-media";
import { CloudinaryHeroVideo } from "./cloudinary-hero-video";
import styles from "./video-hero.module.css";

export function VideoHero() {
  const posterSource = usesCloudinary("/aft-hero.mp4") ? "/aft-hero.mp4" : "/images/tea/assam-dawn.png";
  const mobilePoster = cloudinaryImageUrl(posterSource, { width: 720, quality: 90, portrait: true });
  const mobileVideo = cloudinaryVideoUrl("/aft-hero.mp4", 720, { portrait: true });
  const desktopVideo = cloudinaryVideoUrl("/aft-hero.mp4", 1920);

  return <section className="video-hero" aria-labelledby="home-hero-title">
      <CloudinaryHeroVideo
        desktopSrc={desktopVideo}
        mobileSrc={mobileVideo}
        posterSource={posterSource}
        mobilePoster={mobilePoster}
      />
    <div className="video-hero-shade" aria-hidden="true" />
    <div className="video-hero-inner">
      <div className="video-hero-copy">
        <p className="hero-kicker">AFT Techno Trade &bull; Upper Assam</p>
        <h1 id="home-hero-title" className={styles.headline}>
          <span className={styles.line}>Rooted in Assam</span>
          <span className={styles.line}>Crafted for every cup</span>
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
