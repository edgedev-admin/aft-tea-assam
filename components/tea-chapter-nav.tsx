"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./tea-chapter-nav.module.css";

type Chapter = { id: string; index: string; name: string };

export function TeaChapterNav({ chapters }: { chapters: Chapter[] }) {
  const [active, setActive] = useState(chapters[0]?.id ?? "");
  const trackRef = useRef<HTMLDivElement>(null);
  const linksRef = useRef(new Map<string, HTMLAnchorElement>());

  useEffect(() => {
    const sections = chapters.map(({ id }) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible) {
        setActive(visible.target.id);
      } else if (sections[0] && window.scrollY < sections[0].offsetTop) {
        setActive(sections[0].id);
      }
    }, { rootMargin: "-25% 0px -58%", threshold: [0, .1, .35] });
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [chapters]);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const track = trackRef.current;
    const link = linksRef.current.get(active);
    if (!track || !link || track.scrollWidth <= track.clientWidth) return;
    const left = link.offsetLeft - (track.clientWidth - link.offsetWidth) / 2;
    track.scrollTo({ left, behavior: reduceMotion ? "auto" : "smooth" });
  }, [active]);

  return <nav className={styles.navigator} aria-label="Tea collections">
    <div className={styles.track} ref={trackRef}>
      {chapters.map((chapter) => <a
        href={`#${chapter.id}`}
        className={active === chapter.id ? styles.active : undefined}
        aria-current={active === chapter.id ? "location" : undefined}
        key={chapter.id}
        ref={(node) => { if (node) linksRef.current.set(chapter.id, node); else linksRef.current.delete(chapter.id); }}
      ><span>{chapter.index}</span>{chapter.name}</a>)}
    </div>
  </nav>;
}
