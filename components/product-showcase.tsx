"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { useEffect, useState } from "react";
import type { TeaProduct } from "../lib/products";

export function ProductShowcase({ products }: { products: TeaProduct[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = products[activeIndex];
  const goTo = (step: number) => setActiveIndex((index) => (index + step + products.length) % products.length);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (media.matches || products.length < 2) return;
    const id = window.setInterval(() => {
      setActiveIndex((index) => (index + 1) % products.length);
    }, 5200);
    return () => window.clearInterval(id);
  }, [products.length]);

  return <section
    id="product-showcase"
    className={`flagship-showcase ${active.id === "high-societea" ? "dark-slide" : ""}`}
    style={{ "--showcase-bg": active.background, "--showcase-accent": active.accent } as React.CSSProperties}
    aria-labelledby="product-showcase-title"
  >
    <div className="flagship-copy">
      <p className="section-kicker">Product offerings</p>
      <h2 id="product-showcase-title">{active.name}</h2>
      <p>{active.description}</p>
      <div className="showcase-meta">
        <span>{active.category}</span>
        <span>{active.teaType}</span>
        <span>{active.brand}</span>
      </div>
      <Link className="campaign-cta" href={`/teas/${active.slug}`}>View product <ArrowUpRight size={15} /></Link>
    </div>
    <div className="flagship-visual">
      <Image src={active.image} alt={`${active.name} package`} width={960} height={960} priority />
    </div>
    <div className="showcase-arrows" aria-label="Product carousel controls">
      <button type="button" onClick={() => goTo(-1)} aria-label="Show previous product">Previous</button>
      <button type="button" onClick={() => goTo(1)} aria-label="Show next product">Next</button>
    </div>
    <div className="showcase-tabs" role="tablist" aria-label="Featured tea packages">
      {products.map((product, index) => <button
        type="button"
        role="tab"
        aria-selected={index === activeIndex}
        aria-controls="product-showcase-title"
        className={index === activeIndex ? "active" : ""}
        onClick={() => setActiveIndex(index)}
        key={product.id}
      >
        <span>{String(index + 1).padStart(2, "0")}</span>
        {product.name}
      </button>)}
    </div>
  </section>;
}
