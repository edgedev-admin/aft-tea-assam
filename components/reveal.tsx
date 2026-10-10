"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

const editorialEase = [0.22, 1, 0.36, 1] as const;
const viewport = { once: true, amount: 0.2 } as const;
type RevealProps = { children: ReactNode; delay?: number; className?: string; as?: "div" | "article" | "aside" };

export function Reveal({ children, delay = 0, className, as = "div" }: RevealProps) {
  const reduce = useReducedMotion();
  const Component = as === "article" ? motion.article : as === "aside" ? motion.aside : motion.div;
  return <Component className={className} initial={reduce ? false : { opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={viewport} transition={{ duration: reduce ? 0.01 : .82, delay, ease: editorialEase }}>{children}</Component>;
}

export function RevealImage({ children, className, delay = 0 }: Omit<RevealProps, "as">) {
  const reduce = useReducedMotion();
  return <motion.div className={className} initial={reduce ? false : { opacity: 0, scale: 1.03 }} whileInView={{ opacity: 1, scale: 1 }} viewport={viewport} transition={{ duration: reduce ? 0.01 : .95, delay, ease: editorialEase }}>{children}</motion.div>;
}

export function RevealHeading({ text, accentText }: { text: string; accentText?: string }) {
  const reduce = useReducedMotion();
  const normalizedText = text.replace(/\\n/g, "\n");
  const lines = normalizedText.split("\n");
  return <><span className="motion-sr-only">{normalizedText.replace(/\n/g, " ")}</span><span aria-hidden="true" className="motion-heading" role="presentation">{lines.map((line, lineIndex) => { const words = line.split(/(\s+)/); const lineStart = lines.slice(0, lineIndex).join("\n").length + (lineIndex ? 1 : 0); const accentStart = accentText ? line.indexOf(accentText) : -1; return <span className="motion-heading-line" key={`${line}-${lineIndex}`}>{words.map((word, wordIndex) => { const wordStart = words.slice(0, wordIndex).join("").length; if (/^\s+$/.test(word)) return <span className="motion-heading-space" key={`space-${wordIndex}`}>{word}</span>; return <span className="motion-heading-word" key={`${word}-${wordIndex}`}>{Array.from(word).map((character, characterIndex) => { const index = wordStart + characterIndex; const accent = accentStart >= 0 && index >= accentStart && index < accentStart + accentText!.length; return <motion.span className={`motion-heading-character ${accent ? "motion-heading-accent" : ""}`} key={`${character}-${characterIndex}`} initial={reduce ? false : { opacity: 0, y: "105%" }} whileInView={{ opacity: 1, y: 0 }} viewport={viewport} transition={{ duration: reduce ? 0.01 : .8, delay: .05 + (lineStart + wordStart + characterIndex) * .025, ease: editorialEase }}>{character}</motion.span>; })}</span>; })}</span>; })}</span></>;
}
