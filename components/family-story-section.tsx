"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { PeopleMontage } from "./people-montage";
import styles from "./family-story-section.module.css";

export function FamilyStorySection() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start 92%", "end 42%"],
  });
  const headY = useTransform(scrollYProgress, [0, 0.3], [20, 0]);
  const tailY = useTransform(scrollYProgress, [0.12, 0.42], [18, 0]);
  const mediaY = useTransform(scrollYProgress, [0.04, 0.48], [26, 0]);
  const mediaClip = useTransform(
    scrollYProgress,
    [0.04, 0.48],
    ["inset(5% 0 5% 0)", "inset(0% 0 0% 0)"],
  );

  return (
    <section
      id="editorial-story"
      ref={sectionRef}
      className={styles.section}
      aria-labelledby="family-story-title"
    >
      <div className={styles.shell}>
        <motion.header className={styles.head} style={{ y: headY }}>
          <p className={styles.eyebrow}>The people behind AFT</p>
          <h2 id="family-story-title">Built by people who know Assam tea.</h2>
          <p>
            Our story began in Upper Assam, where tea growing is part of everyday
            life and knowledge is passed through experience.
          </p>
        </motion.header>

        <motion.div className={styles.media} style={{ clipPath: mediaClip, y: mediaY }}>
          <PeopleMontage variant="homepage" />
        </motion.div>

        <motion.div className={styles.tail} style={{ y: tailY }}>
          <p>
            Established in 2018, AFT Techno Trade grew from these local roots into
            a tea manufacturing enterprise. Behind that journey are the people,
            shared ambitions and dedication that continue to shape our work.
          </p>
          <Link href="/about">
            Discover Our Story <ArrowUpRight aria-hidden="true" size={16} />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
