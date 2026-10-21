"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { CloudinaryImage } from "./cloudinary-image";
import styles from "./family-story-section.module.css";

export function FamilyStorySection() {
  const sectionRef = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start 92%", "end 42%"]
  });
  const copyY = useTransform(scrollYProgress, [0, 0.28], [22, 0]);
  const parentsClip = useTransform(
    scrollYProgress,
    [0.04, 0.48],
    ["inset(11% 0 0 0)", "inset(0% 0 0 0)"]
  );
  const parentsY = useTransform(scrollYProgress, [0.04, 0.48], [28, 0]);
  const sonClip = useTransform(
    scrollYProgress,
    [0.2, 0.68],
    ["inset(0 0 16% 0)", "inset(0 0 0% 0)"]
  );
  const sonY = useTransform(scrollYProgress, [0.2, 0.68], [32, 0]);

  return (
    <section
      id="editorial-story"
      ref={sectionRef}
      className={styles.section}
      aria-labelledby="family-story-title"
    >
      <div className={styles.shell}>
        <motion.div
          className={styles.copy}
          style={reduceMotion ? undefined : { y: copyY }}
        >
          <p className={styles.eyebrow}>The people behind AFT</p>
          <h2 id="family-story-title">The people behind the name.</h2>
          <p>
            Behind AFT Techno Trade is a family story rooted in Upper Assam. The
            business was built through shared ambition, steady work and a close
            connection to the region&apos;s tea industry.
          </p>
          <p>
            Since 2018, that commitment has shaped its work in tea manufacturing,
            specialty craftsmanship and commercial supply from Dikom and Lahowal.
          </p>
          <Link href="/about">
            Discover Our Story <ArrowUpRight aria-hidden="true" size={16} />
          </Link>
        </motion.div>

        <div className={styles.media}>
          <motion.figure
            className={`${styles.figure} ${styles.parents}`}
            style={reduceMotion ? undefined : { clipPath: parentsClip, y: parentsY }}
          >
            <div className={styles.parentsImage}>
              <CloudinaryImage
                src="/images/company/parents-at-home (2).jpeg"
                alt="Parents in the family behind AFT Techno Trade standing outside their home"
                fill
                quality={90}
                sizes="(max-width: 720px) calc(100vw - 36px), (max-width: 1100px) 52vw, 29vw"
              />
            </div>
            <figcaption>Family, at home in Upper Assam.</figcaption>
          </motion.figure>

          <motion.figure
            className={`${styles.figure} ${styles.son}`}
            style={reduceMotion ? undefined : { clipPath: sonClip, y: sonY }}
          >
            <div className={styles.sonImage}>
              <CloudinaryImage
                src="/images/company/son-office.png"
                alt="A member of the family behind AFT Techno Trade seated in the company office"
                fill
                quality={90}
                sizes="(max-width: 720px) calc(100vw - 36px), (max-width: 1100px) 52vw, 25vw"
              />
            </div>
            <figcaption>At work in the AFT Techno Trade office.</figcaption>
          </motion.figure>
        </div>
      </div>
    </section>
  );
}
