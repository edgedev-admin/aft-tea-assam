"use client";

import { ArrowRight } from "lucide-react";
import { type AnchorHTMLAttributes, type ReactNode, useEffect, useRef, useState } from "react";
import { aftAssets } from "../lib/media/aft-assets";
import { supplyDisciplines } from "../lib/wholesale";
import { CloudinaryImage } from "./cloudinary-image";
import styles from "../app/wholesale/wholesale.module.css";

const supplyVisuals = [
  { src: aftAssets.teaLeavesAndTextures.ctcGranules.src, alt: aftAssets.teaLeavesAndTextures.ctcGranules.alt, caption: "CTC granules · a close view of tea texture" },
  { src: aftAssets.specialtyTeas.goldenPearlJar.src, alt: aftAssets.specialtyTeas.goldenPearlJar.alt, caption: "Nahorchukbari Golden Pearl presentation" },
  { src: aftAssets.teaLeavesAndTextures.granulesPouring.src, alt: aftAssets.teaLeavesAndTextures.granulesPouring.alt, caption: "Tea granules entering a metal tray" },
  { src: aftAssets.manufacturingAndQuality.packagingLine.src, alt: aftAssets.manufacturingAndQuality.packagingLine.alt, caption: "A worker alongside a tea packaging line" },
] as const;

function publishEnquiryType(type: string) {
  window.dispatchEvent(new CustomEvent("aft:wholesale-enquiry", { detail: { type } }));
}

type EnquiryLinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href" | "onClick"> & {
  type: string;
  className?: string;
  children: ReactNode;
};

export function WholesaleEnquiryLink({ type, className, children, ...props }: EnquiryLinkProps) {
  return <a {...props} className={className} href="#wholesale-enquiry" onClick={() => publishEnquiryType(type)}>{children}</a>;
}

export function WholesaleSupplyShowcase() {
  const [active, setActive] = useState(0);
  const chapterRefs = useRef<Array<HTMLElement | null>>([]);

  useEffect(() => {
    if (window.matchMedia("(max-width: 820px)").matches) return;
    const chapters = chapterRefs.current.filter((chapter): chapter is HTMLElement => Boolean(chapter));
    const observer = new IntersectionObserver((entries) => {
      const current = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (current) setActive(Number((current.target as HTMLElement).dataset.chapter));
    }, { rootMargin: "-28% 0px -45% 0px", threshold: [0, 0.2, 0.45, 0.7] });
    chapters.forEach((chapter) => observer.observe(chapter));
    return () => observer.disconnect();
  }, []);

  function selectCategory(index: number) {
    setActive(index);
    if (!window.matchMedia("(max-width: 820px)").matches) {
      chapterRefs.current[index]?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }

  const current = supplyDisciplines[active];
  const visual = supplyVisuals[active];

  return (
    <section className={styles.supply} id="supply-options" aria-labelledby="supply-title">
      <div className={styles.shell}>
        <header className={styles.supplyIntro}>
          <p className={styles.eyebrow}>02 / Our supply portfolio</p>
          <h2 id="supply-title">The right tea for the way you trade.</h2>
          <p>Explore commercial CTC, specialty selections, custom blending and private-label or bulk supply discussions. Each enquiry is considered against the buyer&apos;s brief.</p>
        </header>

        <div className={styles.supplySelector} role="group" aria-label="Choose a supply category">
          {supplyDisciplines.map((discipline, index) => <button type="button" key={discipline.number} onClick={() => selectCategory(index)} aria-pressed={index === active}>
            <span>{discipline.number}</span>{discipline.label}
          </button>)}
        </div>

        <div className={styles.supplyLayout}>
          <aside className={`${styles.supplyStage} ${styles[`supplyStage_${current.key}`]}`} aria-label={`${current.label} supply category`}>
            <div className={styles.stagePhoto}>
              <CloudinaryImage key={visual.src} src={visual.src} alt={visual.alt} fill quality={90} sizes="(max-width: 1050px) 42vw, 44vw" style={current.key === "specialty" ? { objectFit: "contain" } : undefined} />
              <span className={styles.stagePhotoCaption}>{visual.caption}</span>
              <span className={styles.stagePhotoNumber}>{current.number} / 04</span>
            </div>
            <div className={styles.stageBody}>
              <p>{current.label}</p>
              <div className={styles.stageMarkers}>{current.markers.map((marker) => <span key={marker}>{marker}</span>)}</div>
            </div>
            <div className={styles.stageProgress}><span style={{ width: `${((active + 1) / supplyDisciplines.length) * 100}%` }} /></div>
          </aside>

          <div className={styles.supplyChapters}>
            {supplyDisciplines.map((discipline, index) => (
              <article className={`${styles.supplyChapter} ${styles[`supplyChapter_${discipline.key}`]} ${index === active ? styles.supplyChapterActive : ""}`} data-chapter={index} key={discipline.number} ref={(node) => { chapterRefs.current[index] = node; }}>
                <div className={styles.chapterMeta}><span>{discipline.number}</span><p>{discipline.label}</p></div>
                <figure className={styles.chapterImage}>
                  <CloudinaryImage src={supplyVisuals[index].src} alt={supplyVisuals[index].alt} fill quality={90} sizes="(max-width: 820px) calc(100vw - 40px), 0px" style={discipline.key === "specialty" ? { objectFit: "contain" } : undefined} />
                  <figcaption>{supplyVisuals[index].caption}</figcaption>
                </figure>
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
