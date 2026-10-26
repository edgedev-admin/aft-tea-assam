"use client";

import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import styles from "./business-partnership-cta.module.css";

export function BusinessPartnershipCta() {
  const sectionRef = useRef<HTMLElement>(null);
  const [hasEntered, setHasEntered] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setHasEntered(true);
        observer.disconnect();
      },
      { threshold: 0.25 },
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className={styles.section}
      data-entered={hasEntered ? "true" : "false"}
      aria-labelledby="business-partnership-title"
    >
      <div className={styles.inner}>
        <div className={styles.copy}>
          <p className={styles.eyebrow}>Partner with AFT</p>
          <h2 id="business-partnership-title">Brew Success. Grow With AFT.</h2>
          <p className={styles.body}>
            Explore wholesale, distribution and business supply opportunities with
            AFT Techno Trade.
          </p>
        </div>

        <div className={styles.emblem} aria-hidden="true">
          <Image
            src="/branding/aft-circular-seal.svg"
            alt=""
            width={112}
            height={112}
            sizes="112px"
          />
        </div>

        <div className={styles.actions}>
          <Link className={styles.primary} href="/contact">
            Become Our Partner <ArrowRight aria-hidden="true" size={17} />
          </Link>
        </div>
      </div>
    </section>
  );
}
