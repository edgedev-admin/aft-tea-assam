import type { CSSProperties, ReactNode } from "react";

type RevealProps = { children: ReactNode; delay?: number; className?: string; style?: CSSProperties; as?: "div" | "article" | "aside" };

export function Reveal({ children, className, style, as = "div" }: RevealProps) {
  const Component = as;
  return <Component className={className} style={style}>{children}</Component>;
}

export function RevealImage({ children, className, style }: Omit<RevealProps, "as">) {
  return <div className={className} style={style}>{children}</div>;
}

export function RevealHeading({ text, accentText }: { text: string; accentText?: string }) {
  const normalizedText = text.replace(/\\n/g, "\n");
  const lines = normalizedText.split("\n");
  return <span className="motion-heading">{lines.map((line, lineIndex) => <span className="motion-heading-line" key={`${line}-${lineIndex}`}>{accentText && line.includes(accentText) ? line.split(accentText).map((part, index, parts) => <span key={`${part}-${index}`}>{part}{index < parts.length - 1 && <span className="motion-heading-accent">{accentText}</span>}</span>) : line}</span>)}</span>;
}
