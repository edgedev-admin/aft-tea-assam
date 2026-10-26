"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { aftAssets } from "../lib/media/aft-assets";
import { craftStages } from "../lib/craft-process";
import { CloudinaryImage } from "./cloudinary-image";
import styles from "../app/craft/craft.module.css";

const stageImages = [
  { src: aftAssets.teaLeavesAndTextures.freshLeafInspection.src, alt: aftAssets.teaLeavesAndTextures.freshLeafInspection.alt, caption: "Hands examining fresh tea leaf." },
  { src: "/images/story/factory-leaf-receiving.jpg", alt: "Fresh tea leaves spread across factory receiving troughs", caption: "Fresh leaf spread across receiving troughs." },
  { src: "/images/story/factory-machinery.jpg", alt: "Tea leaves moving through factory processing machinery", caption: "Tea leaves among processing machinery." },
  { src: aftAssets.manufacturingAndQuality.processingInspection.src, alt: aftAssets.manufacturingAndQuality.processingInspection.alt, caption: "Enhanced processing inspection image; provenance is unconfirmed." },
  { src: aftAssets.teaLeavesAndTextures.ctcGranules.src, alt: aftAssets.teaLeavesAndTextures.ctcGranules.alt, caption: "CTC granules shown as a general tea detail, not a specific grade." },
  { src: aftAssets.teaLeavesAndTextures.woodenScoop.src, alt: aftAssets.teaLeavesAndTextures.woodenScoop.alt, caption: "Finished dry tea; no cupping-room photograph is available." },
  { src: aftAssets.manufacturingAndQuality.packagingLine.src, alt: aftAssets.manufacturingAndQuality.packagingLine.alt, caption: "A worker alongside a tea packaging line." },
] as const;

export function CraftProcessJourney() {
  const [activeStage, setActiveStage] = useState(0);
  const stepRefs = useRef<Array<HTMLElement | null>>([]);
  const touchStart = useRef<number | null>(null);

  useEffect(() => {
    if (window.matchMedia("(max-width: 800px)").matches) return;
    const steps = stepRefs.current.filter((step): step is HTMLElement => Boolean(step));
    if (!steps.length) return;
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible) setActiveStage(Number((visible.target as HTMLElement).dataset.stage));
    }, { rootMargin: "-28% 0px -45% 0px", threshold: [0, 0.15, 0.35, 0.6, 0.85] });
    steps.forEach((step) => observer.observe(step));
    return () => observer.disconnect();
  }, []);

  function moveToStage(index: number) {
    const next = (index + craftStages.length) % craftStages.length;
    setActiveStage(next);
    if (!window.matchMedia("(max-width: 800px)").matches) {
      stepRefs.current[next]?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }

  const active = craftStages[activeStage];
  const activeImage = stageImages[activeStage];

  return (
    <section className={styles.process} id="process" aria-labelledby="process-title">
      <div className={styles.shell}>
        <header className={styles.processIntro}>
          <p className={styles.eyebrow}>The making of Assam tea</p>
          <h2 id="process-title">From green leaf to finished tea.</h2>
          <p>Seven points in the journey, with different routes for specialty leaf and CTC tea.</p>
        </header>

        <div className={styles.processLayout}>
          <div className={styles.processVisual} aria-hidden="true">
            <div className={styles.visualTopline}><span>From leaf to liquor</span><span>{active.number} / 07</span></div>
            <div className={styles.visualStage}>
              {craftStages.map((stage, index) => (index === activeStage || index === (activeStage + 1) % craftStages.length) && <div className={`${styles.visualPanel} ${index === activeStage ? styles.visualPanelActive : ""}`} key={stage.number}>
                <CloudinaryImage src={stageImages[index].src} alt="" fill quality={90} sizes="(max-width: 1050px) 42vw, 44vw" />
                <div><p>{stage.label}</p><strong>{stageImages[index].caption}</strong></div>
              </div>)}
            </div>
            <div className={styles.processRail}><span style={{ width: `${((activeStage + 1) / craftStages.length) * 100}%` }} /></div>
            <div className={styles.processDots}>{craftStages.map((stage, index) => <button className={index === activeStage ? styles.processDotActive : ""} key={stage.number} type="button" onClick={() => moveToStage(index)} aria-label={`Go to stage ${stage.number}: ${stage.label}`} aria-current={index === activeStage ? "step" : undefined}>{stage.number}</button>)}</div>
          </div>

          <div className={styles.processSteps}>
            {craftStages.map((stage, index) => <article className={`${styles.processStep} ${index === activeStage ? styles.processStepActive : ""}`} data-stage={index} key={stage.number} ref={(node) => { stepRefs.current[index] = node; }}>
              <div className={styles.stepMeta}><span>{stage.number}</span><p>{stage.label}</p></div>
              <h3>{stage.title}</h3><p className={styles.stepDescription}>{stage.description}</p>
            </article>)}
          </div>
        </div>

        <div className={styles.mobileJourney}>
          <figure className={styles.mobileProcessImage} onTouchStart={(event) => { touchStart.current = event.touches[0]?.clientX ?? null; }} onTouchEnd={(event) => {
            if (touchStart.current === null) return;
            const endX = event.changedTouches[0]?.clientX;
            if (endX === undefined) return;
            const dx = endX - touchStart.current;
            if (Math.abs(dx) > 48) moveToStage(activeStage + (dx < 0 ? 1 : -1));
            touchStart.current = null;
          }}>
            <span className={styles.mobileNextImage}><CloudinaryImage src={stageImages[(activeStage + 1) % craftStages.length].src} alt="" fill quality={90} loading="eager" sizes="(max-width: 800px) calc(100vw - 40px), 0px" /></span>
            <CloudinaryImage key={activeImage.src} src={activeImage.src} alt={activeImage.alt} fill quality={90} sizes="(max-width: 800px) calc(100vw - 40px), 0px" />
            <figcaption><span>{active.number} / 07 · {active.label}</span><strong>{active.title}</strong></figcaption>
          </figure>
          <p className={styles.mobileProcessDescription} aria-live="polite">{active.description}</p>
          <p className={styles.mobileImageNote}>{activeImage.caption}</p>
          <div className={styles.mobileProcessControls}>
            <button type="button" onClick={() => moveToStage(activeStage - 1)} aria-label="Previous process stage"><ArrowLeft size={18} /></button>
            <div className={styles.mobileProcessDots}>{craftStages.map((stage, index) => <button type="button" key={stage.number} onClick={() => setActiveStage(index)} aria-label={`Show stage ${stage.number}: ${stage.label}`} aria-current={index === activeStage ? "step" : undefined} />)}</div>
            <button type="button" onClick={() => moveToStage(activeStage + 1)} aria-label="Next process stage"><ArrowRight size={18} /></button>
          </div>
          <p className={styles.processNote}>Specialty and CTC teas can follow different processing routes. The images illustrate tea, factory and packaging contexts; they do not identify an exact grade or processing condition.</p>
        </div>

        <p className={styles.desktopProcessNote}>Specialty and CTC teas can follow different processing routes. Enhanced inspection imagery is contextual; its documentary provenance has not been confirmed.</p>
      </div>
    </section>
  );
}
