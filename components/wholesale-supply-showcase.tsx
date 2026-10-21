"use client";

import { ArrowRight } from "lucide-react";
import { type AnchorHTMLAttributes, type ReactNode, useEffect, useRef, useState } from "react";
import { supplyDisciplines } from "../lib/wholesale";
import styles from "../app/wholesale/wholesale.module.css";

function publishEnquiryType(type: string) {
  window.dispatchEvent(new CustomEvent("aft:wholesale-enquiry", { detail: { type } }));
}

type EnquiryLinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href" | "onClick"> & {
  type: string;
  className?: string;
  children: ReactNode;
};

export function WholesaleEnquiryLink({ type, className, children, ...props }: EnquiryLinkProps) {
  return (
    <a {...props} className={className} href="#wholesale-enquiry" onClick={() => publishEnquiryType(type)}>
      {children}
    </a>
  );
}

export function WholesaleSupplyShowcase() {
  const [active, setActive] = useState(0);
  const chapterRefs = useRef<Array<HTMLElement | null>>([]);

  useEffect(() => {
    const chapters = chapterRefs.current.filter((chapter): chapter is HTMLElement => Boolean(chapter));
    const observer = new IntersectionObserver(
      (entries) => {
        const current = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (current) setActive(Number((current.target as HTMLElement).dataset.chapter));
      },
      { rootMargin: "-28% 0px -45% 0px", threshold: [0, 0.2, 0.45, 0.7] },
    );

    chapters.forEach((chapter) => observer.observe(chapter));
    return () => observer.disconnect();
  }, []);

  function moveTo(index: number) {
    chapterRefs.current[index]?.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  const current = supplyDisciplines[active];

  return (
    <section className={styles.supply} id="supply-options" aria-labelledby="supply-title">
      <div className={styles.shell}>
        <header className={styles.supplyIntro}>
          <p className={styles.eyebrow}>02 / Our supply portfolio</p>
          <h2 id="supply-title">The right tea for the way you trade.</h2>
          <p>Every business has its own requirements for strength, aroma, grade, presentation and price position. AFT Techno Trade&apos;s portfolio brings together different Assam tea styles for commercial and specialty applications.</p>
        </header>

        <div className={styles.supplyLayout}>
          <aside className={`${styles.supplyStage} ${styles[`supplyStage_${current.key}`]}`} aria-hidden="true">
            <div className={styles.stageTopline}><span>Supply discipline</span><span>{current.number} / 04</span></div>
            <div className={styles.stageBody}>
              <p>{current.label}</p>
              <strong>{current.title}</strong>
              <div className={styles.stageMarkers}>{current.markers.map((marker) => <span key={marker}>{marker}</span>)}</div>
            </div>
            <div className={styles.stageProgress}><span style={{ width: `${((active + 1) / supplyDisciplines.length) * 100}%` }} /></div>
            <div className={styles.stageControls}>
              {supplyDisciplines.map((discipline, index) => (
                <button
                  className={index === active ? styles.stageControlActive : ""}
                  type="button"
                  key={discipline.number}
                  onClick={() => moveTo(index)}
                  aria-label={`Go to ${discipline.label}`}
                  aria-current={index === active ? "step" : undefined}
                >{discipline.number}</button>
              ))}
            </div>
          </aside>

          <div className={styles.supplyChapters}>
            {supplyDisciplines.map((discipline, index) => (
              <article
                className={`${styles.supplyChapter} ${styles[`supplyChapter_${discipline.key}`]} ${index === active ? styles.supplyChapterActive : ""}`}
                data-chapter={index}
                key={discipline.number}
                ref={(node) => { chapterRefs.current[index] = node; }}
              >
                <div className={styles.chapterMeta}><span>{discipline.number}</span><p>{discipline.label}</p></div>
                <h3>{discipline.title}</h3>
                <p>{discipline.description}</p>
                <div className={styles.mobileMarkers}>{discipline.markers.map((marker) => <span key={marker}>{marker}</span>)}</div>
                <small>{discipline.detail}</small>
                <WholesaleEnquiryLink type={discipline.enquiryType}>{discipline.cta}<ArrowRight size={16} /></WholesaleEnquiryLink>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
