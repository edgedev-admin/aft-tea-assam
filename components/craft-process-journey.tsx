"use client";

import {
  Blend,
  Box,
  Coffee,
  FlameKindling,
  Leaf,
  Rows3,
  Wind,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { craftStages, type CraftStage } from "../lib/craft-process";
import styles from "../app/craft/craft.module.css";

const stageIcons = {
  leaf: Leaf,
  wind: Wind,
  paths: Blend,
  heat: FlameKindling,
  grade: Rows3,
  cup: Coffee,
  pack: Box,
} satisfies Record<CraftStage["icon"], typeof Leaf>;

export function CraftProcessJourney() {
  const [activeStage, setActiveStage] = useState(0);
  const stepRefs = useRef<Array<HTMLElement | null>>([]);

  useEffect(() => {
    const steps = stepRefs.current.filter((step): step is HTMLElement => Boolean(step));
    if (!steps.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visible) setActiveStage(Number((visible.target as HTMLElement).dataset.stage));
      },
      { rootMargin: "-28% 0px -45% 0px", threshold: [0, 0.15, 0.35, 0.6, 0.85] },
    );

    steps.forEach((step) => observer.observe(step));
    return () => observer.disconnect();
  }, []);

  function moveToStage(index: number) {
    stepRefs.current[index]?.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  return (
    <section className={styles.process} id="process" aria-labelledby="process-title">
      <div className={styles.shell}>
        <header className={styles.processIntro}>
          <p className={styles.eyebrow}>The making of Assam tea</p>
          <h2 id="process-title">From green leaf to finished tea.</h2>
          <p>Every stage has its purpose. From leaf selection and withering to processing, grading and cupping, the decisions made along the way help shape the tea&apos;s final character.</p>
        </header>

        <div className={styles.processLayout}>
          <div className={styles.processVisual} aria-hidden="true">
            <div className={styles.visualTopline}>
              <span>From leaf to liquor</span>
              <span>{craftStages[activeStage].number} / 07</span>
            </div>

            <div className={styles.visualStage}>
              {craftStages.map((stage, index) => {
                const Icon = stageIcons[stage.icon];
                return (
                  <div className={`${styles.visualPanel} ${index === activeStage ? styles.visualPanelActive : ""}`} key={stage.number}>
                    <Icon strokeWidth={1.15} />
                    <p>{stage.label}</p>
                    <strong>{stage.title}</strong>
                  </div>
                );
              })}
              <div className={styles.visualRings} />
            </div>

            <div className={styles.processRail}>
              <span style={{ width: `${((activeStage + 1) / craftStages.length) * 100}%` }} />
            </div>
            <div className={styles.processDots}>
              {craftStages.map((stage, index) => (
                <button
                  className={index === activeStage ? styles.processDotActive : ""}
                  key={stage.number}
                  type="button"
                  onClick={() => moveToStage(index)}
                  aria-label={`Go to stage ${stage.number}: ${stage.label}`}
                  aria-current={index === activeStage ? "step" : undefined}
                >
                  {stage.number}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.processSteps}>
            {craftStages.map((stage, index) => {
              const Icon = stageIcons[stage.icon];
              return (
                <article
                  className={`${styles.processStep} ${index === activeStage ? styles.processStepActive : ""}`}
                  data-stage={index}
                  key={stage.number}
                  ref={(node) => { stepRefs.current[index] = node; }}
                >
                  <div className={styles.mobileStageIcon}><Icon size={22} strokeWidth={1.5} /></div>
                  <div className={styles.stepMeta}>
                    <span>{stage.number}</span>
                    <p>{stage.label}</p>
                  </div>
                  <h3>{stage.title}</h3>
                  <p className={styles.stepDescription}>{stage.description}</p>
                  <p className={styles.stepDetail}>{stage.detail}</p>
                </article>
              );
            })}
          </div>
        </div>

        <p className={styles.processNote}>This is the broad production and supply journey. Exact handling and processing conditions vary by tea style and intended cup.</p>
      </div>
    </section>
  );
}
