"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

type LogoLanguage = "en" | "as";
type LogoTone = "light" | "dark";
type LogoSize = "desktop" | "compact";

type AnimatedBrandLogoProps = {
  tone?: LogoTone;
  size?: LogoSize;
  animated?: boolean;
  forcedLanguage?: LogoLanguage;
};

const languages: Record<LogoLanguage, { left: string; right: string; lang?: string }> = {
  en: { left: "A.F.T", right: "TECHNO TRADE" },
  as: { left: "এ এফ টি", right: "টেকনট্ৰেড", lang: "as" }
};

export function AnimatedBrandLogo({
  tone = "light",
  size = "desktop",
  animated = true,
  forcedLanguage
}: AnimatedBrandLogoProps) {
  const [language, setLanguage] = useState<LogoLanguage>("en");
  const activeLanguage = forcedLanguage ?? language;

  useEffect(() => {
    if (!animated || forcedLanguage) return;

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (motionQuery.matches) return;

    let timer: number | undefined;
    const start = () => {
      if (timer) return;
      timer = window.setInterval(() => {
        setLanguage((current) => current === "en" ? "as" : "en");
      }, 5500);
    };
    const stop = () => {
      if (!timer) return;
      window.clearInterval(timer);
      timer = undefined;
    };

    const handleVisibility = () => {
      if (document.hidden) {
        stop();
      } else {
        start();
      }
    };

    start();
    document.addEventListener("visibilitychange", handleVisibility);
    return () => {
      stop();
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [animated, forcedLanguage]);

  const languageClasses = useMemo(() => ({
    en: activeLanguage === "en" ? "is-active" : "",
    as: activeLanguage === "as" ? "is-active" : ""
  }), [activeLanguage]);

  return <span className={`animated-brand-logo ${tone} ${size}`} aria-hidden="true">
    <span className="brand-word-cell brand-word-left">
      <span className={`brand-word brand-word-en brand-word-en-left ${languageClasses.en}`}>{languages.en.left}</span>
      <span className={`brand-word brand-word-as brand-word-as-left ${languageClasses.as}`} lang={languages.as.lang}>{languages.as.left}</span>
    </span>
    <span className="brand-seal-wrap">
      <Image src="/branding/aft-circular-seal.svg" alt="" width={120} height={120} priority draggable={false} />
    </span>
    <span className="brand-word-cell brand-word-right">
      <span className={`brand-word brand-word-en brand-word-en-right ${languageClasses.en}`}>{languages.en.right}</span>
      <span className={`brand-word brand-word-as brand-word-as-right ${languageClasses.as}`} lang={languages.as.lang}>{languages.as.right}</span>
    </span>
  </span>;
}
