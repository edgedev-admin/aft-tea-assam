"use client";

import { useState } from "react";
import { aftAssets } from "../lib/media/aft-assets";
import type { CatalogOffering } from "../lib/products";
import { CloudinaryImage } from "./cloudinary-image";
import styles from "../app/craft/craft.module.css";

export function CraftGradeExplorer({ grades }: { grades: CatalogOffering[] }) {
  const [selected, setSelected] = useState(0);
  const active = grades[selected] ?? grades[0];
  if (!active) return null;

  return <div className={styles.gradeExplorer}>
    <figure className={styles.gradeImage}>
      <CloudinaryImage src={aftAssets.teaLeavesAndTextures.ctcGranules.src} alt={aftAssets.teaLeavesAndTextures.ctcGranules.alt} fill quality={90} sizes="(max-width: 800px) calc(100vw - 40px), 35vw" />
      <figcaption>CTC granules · illustrative texture, not grade identification</figcaption>
    </figure>
    <div className={styles.gradeSelector}>
      <div className={styles.gradeTabs} role="group" aria-label="Select a documented Ekoratoli CTC grade">
        {grades.map((grade, index) => <button key={grade.name} type="button" onClick={() => setSelected(index)} aria-label={grade.name} aria-pressed={selected === index}>{grade.name.match(/\(([^)]+)\)/)?.[1]}</button>)}
      </div>
      <p className={styles.eyebrowGold}>Ekoratoli · wholesale CTC</p>
      <h4 aria-live="polite">{active.name}</h4>
      <p>{active.description}</p>
      <span>Bulk lots by enquiry</span>
    </div>
  </div>;
}
