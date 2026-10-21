"use client";

import Link from "next/link";
import { ArrowUpRight, Sprout } from "lucide-react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform
} from "framer-motion";
import { useRef } from "react";
import styles from "./golden-pearl-story.module.css";

const subdued = "#F0B7AA";
const emphasised = "#FFFFFF";

const collections = [
  {
    name: "Nahorchukbari",
    description: "Handcrafted Golden Pearl, golden bud selections and fine orthodox leaf grades for specialty tea buyers.",
    href: "/teas#nahorchukbari",
    cta: "Explore specialty tea"
  },
  {
    name: "Ekoratoli",
    description: "Commercial BP, PF, PD and clonal CTC offerings developed for brisk, full-bodied milk tea.",
    href: "/teas#ekoratoli",
    cta: "Explore CTC grades"
  },
  {
    name: "Ajanta Tea",
    description: "Classic Assam, premium and spiced consumer teas for the varied rhythms of the everyday cup.",
    href: "/teas#ajanta-tea",
    cta: "Explore Ajanta Tea"
  }
] as const;

export function GoldenPearlStory() {
  const storyRef = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: storyRef,
    offset: ["start start", "end end"]
  });
  const crafted = useTransform(scrollYProgress, [0.04, 0.24], [subdued, emphasised]);
  const byHand = useTransform(scrollYProgress, [0.16, 0.42], [subdued, emphasised]);
  const recognised = useTransform(scrollYProgress, [0.4, 0.68], [subdued, emphasised]);
  const atAuction = useTransform(scrollYProgress, [0.6, 0.88], [subdued, emphasised]);
  const reducedStyle = reduceMotion ? { color: emphasised } : undefined;

  return (
    <div className={styles.sequence}>
      <section ref={storyRef} className={styles.redStory} aria-labelledby="golden-pearl-statement">
        <div className={styles.storySticky}>
          <div className={styles.shell}>
            <p className={styles.eyebrow}>Nahorchukbari <span aria-hidden="true">·</span> Golden Pearl</p>
            <h2 id="golden-pearl-statement" className={styles.headline}>
              <span className={styles.headlineLine}>
                <motion.span className={styles.headlineChunk} style={reducedStyle ?? { color: crafted }}>Crafted</motion.span>{" "}
                <motion.span className={styles.headlineChunk} style={reducedStyle ?? { color: byHand }}>by hand.</motion.span>
              </span>
              <span className={styles.headlineLine}>
                <motion.span className={styles.headlineChunk} style={reducedStyle ?? { color: recognised }}>Recognised</motion.span>{" "}
                <motion.span className={styles.headlineChunk} style={reducedStyle ?? { color: atAuction }}>at auction.</motion.span>
              </span>
            </h2>
            <div className={styles.storyFooter}>
              <p>On 14 February 2022, one kilogram of Golden Pearl, handcrafted at Nahorchukbari in Upper Assam, was sold for ₹99,999 at the Guwahati Tea Auction Centre.</p>
              <Link href="/teas/golden-pearl">
                Discover the Golden Pearl Story <ArrowUpRight aria-hidden="true" size={17}/>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.achievement} aria-labelledby="golden-pearl-achievement">
        <div className={styles.shell}>
          <div className={styles.achievementGrid}>
            <div className={styles.statBlock}>
              <p className={styles.darkEyebrow}>A moment in Assam tea craft</p>
              <p className={styles.stat} aria-label="99,999 rupees per kilogram">₹99,999<span>/kg</span></p>
              <small>Historical auction result</small>
            </div>
            <div className={styles.achievementCopy}>
              <h2 id="golden-pearl-achievement">A landmark Golden Pearl auction sale.</h2>
              <p className={styles.date}>14 February 2022 <span aria-hidden="true">·</span> Guwahati Tea Auction Centre</p>
              <p>Handcrafted at Nahorchukbari in Lahowal, Golden Pearl became part of a memorable chapter in Assam&apos;s specialty tea story.</p>
              <Link href="/teas/golden-pearl">
                Read the Full Story <ArrowUpRight aria-hidden="true" size={17}/>
              </Link>
            </div>
          </div>

          <div className={styles.collections}>
            <header className={styles.collectionsHeading}>
              <p><Sprout aria-hidden="true" size={15}/> Our tea collections</p>
              <h2>Three identities. One Upper Assam foundation.</h2>
            </header>
            <div className={styles.collectionList}>
              {collections.map((collection) => (
                <article key={collection.name}>
                  <h3>{collection.name}</h3>
                  <p>{collection.description}</p>
                  <Link href={collection.href}>
                    {collection.cta} <ArrowUpRight aria-hidden="true" size={15}/>
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
