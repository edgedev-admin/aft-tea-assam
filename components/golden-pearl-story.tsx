"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import {
  motion,
  useScroll,
  useTransform
} from "framer-motion";
import { useRef } from "react";
import { usePrefersReducedMotion } from "../lib/use-prefers-reduced-motion";
import styles from "./golden-pearl-story.module.css";

const subdued = "#F0B7AA";
const emphasised = "#FFFFFF";

const collections = [
  {
    name: "Nahorchukbari",
    positioning: "The Art of Specialty Tea",
    description: "Handcrafted specialty selections reflecting the possibilities of carefully made Assam tea.",
    href: "/teas#nahorchukbari",
    cta: "Explore specialty tea"
  },
  {
    name: "Ekoratoli",
    positioning: "Strength for Everyday Markets",
    description: "Commercial CTC grades developed for the requirements of wholesale and professional tea buyers.",
    href: "/teas#ekoratoli",
    cta: "Explore CTC grades"
  },
  {
    name: "Ajanta Tea",
    positioning: "Assam Tea for Everyday Moments",
    description: "Classic Assam, premium blends and flavoured consumer teas created for different tastes and occasions.",
    href: "/teas#ajanta-tea",
    cta: "Explore Ajanta Tea"
  }
] as const;

export function GoldenPearlStory() {
  const storyRef = useRef<HTMLElement>(null);
  const reduceMotion = usePrefersReducedMotion();
  const { scrollYProgress } = useScroll({
    target: storyRef,
    offset: ["start start", "end end"]
  });
  const every = useTransform(scrollYProgress, [0.04, 0.24], [subdued, emphasised]);
  const remarkableCup = useTransform(scrollYProgress, [0.16, 0.42], [subdued, emphasised]);
  const begins = useTransform(scrollYProgress, [0.4, 0.68], [subdued, emphasised]);
  const atOrigin = useTransform(scrollYProgress, [0.6, 0.88], [subdued, emphasised]);
  const reducedStyle = reduceMotion ? { color: emphasised } : undefined;

  return (
    <div className={styles.sequence}>
      <section ref={storyRef} className={styles.redStory} aria-labelledby="golden-pearl-statement">
        <div className={styles.storySticky}>
          <div className={styles.shell}>
            <p className={styles.eyebrow}>Upper Assam <span aria-hidden="true">·</span> The art of tea</p>
            <h2 id="golden-pearl-statement" className={styles.headline}>
              <span className={styles.headlineLine}>
                <motion.span className={styles.headlineChunk} style={reducedStyle ?? { color: every }}>Every</motion.span>{" "}
                <motion.span className={styles.headlineChunk} style={reducedStyle ?? { color: remarkableCup }}>remarkable cup</motion.span>
              </span>
              <span className={styles.headlineLine}>
                <motion.span className={styles.headlineChunk} style={reducedStyle ?? { color: begins }}>begins</motion.span>{" "}
                <motion.span className={styles.headlineChunk} style={reducedStyle ?? { color: atOrigin }}>at its origin.</motion.span>
              </span>
            </h2>
            <div className={styles.storyFooter}>
              <p>Rooted in the tea-growing communities of Upper Assam, AFT Techno Trade brings together local knowledge, manufacturing expertise and a dedication to distinctive Assam tea.</p>
              <Link href="/craft">
                Explore Our Craft <ArrowUpRight aria-hidden="true" size={17}/>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.achievement} aria-labelledby="tea-portfolio-title">
        <div className={styles.shell}>
          <div className={styles.collections}>
            <header className={styles.collectionsHeading}>
              <p className={styles.portfolioEyebrow}>The AFT Tea Portfolio</p>
              <h2 id="tea-portfolio-title">From everyday strength to rare tea craft.</h2>
              <p className={styles.collectionsIntroduction}>Rooted in Upper Assam, our collections bring together distinctive specialty teas, commercial CTC grades and familiar consumer favourites.</p>
            </header>
            <div className={styles.collectionList}>
              {collections.map((collection) => (
                <article key={collection.name}>
                  <div className={styles.collectionIdentity}>
                    <h3>{collection.name}</h3>
                    <p>{collection.positioning}</p>
                  </div>
                  <div className={styles.collectionDetails}>
                    <p>{collection.description}</p>
                    <Link href={collection.href}>
                      {collection.cta} <ArrowUpRight aria-hidden="true" size={15}/>
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
