"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight, ChevronRight } from "lucide-react";
import { CloudinaryImage } from "./cloudinary-image";
import type { AftMediaAsset } from "../lib/media/aft-assets";
import type { TeaCatalogProduct } from "../lib/products";
import styles from "./tea-interactive-showcases.module.css";

type Offering = Pick<TeaCatalogProduct, "id" | "label" | "name" | "description" | "availability" | "href" | "cta">;

export function EkoratoliExplorer({
  grades,
  macro,
  ctc,
  scoop
}: {
  grades: Offering[];
  macro: AftMediaAsset;
  ctc: AftMediaAsset;
  scoop: AftMediaAsset;
}) {
  const [activeId, setActiveId] = useState(grades[0]?.id ?? "");
  const active = grades.find((grade) => grade.id === activeId) ?? grades[0];

  return (
    <div className={styles.ctcExplorer}>
      <div className={styles.teaTextures} aria-label="Assam tea textures">
        <figure className={styles.textureMain}>
          <CloudinaryImage src={macro.src} alt={macro.alt} fill sizes="(max-width: 760px) 100vw, 48vw" quality={90} />
          <figcaption>Tea granules · close detail</figcaption>
        </figure>
        <figure className={styles.textureInset}>
          <CloudinaryImage src={scoop.src} alt={scoop.alt} fill sizes="(max-width: 760px) 45vw, 18vw" quality={90} />
        </figure>
        <figure className={styles.textureBottom}>
          <CloudinaryImage src={ctc.src} alt={ctc.alt} fill sizes="(max-width: 760px) 56vw, 24vw" quality={90} />
          <figcaption>CTC tea · tray study</figcaption>
        </figure>
      </div>

      <div className={styles.gradePanel}>
        <p className={styles.eyebrow}>Choose a commercial grade</p>
        <div className={styles.gradeSelector} aria-label="Ekoratoli tea grades">
          {grades.map((grade, index) => (
            <button
              type="button"
              key={grade.id}
              aria-pressed={active?.id === grade.id}
              className={active?.id === grade.id ? styles.gradeActive : undefined}
              onClick={() => setActiveId(grade.id)}
            >
              <span>0{index + 1}</span>{grade.name}<ChevronRight aria-hidden="true" size={17} />
            </button>
          ))}
        </div>
        {active && (
          <article className={styles.gradeDescription} key={active.id}>
            <span className={styles.gradeKicker}>{active.label}</span>
            <h3>{active.name}</h3>
            <p>{active.description}</p>
            <small>{active.availability}</small>
            <Link href={active.href}>{active.cta}<ArrowUpRight aria-hidden="true" size={16} /></Link>
          </article>
        )}
        <p className={styles.gradeCaveat}>Grade photography shows tea texture; the same verified image is used across selections.</p>
      </div>
    </div>
  );
}

export { AjantaProductExplorer } from "./ajanta-product-explorer";
