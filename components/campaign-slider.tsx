"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { useState } from "react";
import type { TeaProduct } from "../lib/products";
import { CloudinaryImage } from "./cloudinary-image";

export function CampaignSlider({ products }: { products: TeaProduct[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = products[activeIndex];
  const goTo = (step: number) => setActiveIndex((index) => (index + step + products.length) % products.length);

  return <section className="yellow-campaign" aria-labelledby="campaign-title">
    <div className="campaign-topline">
      <h2 id="campaign-title">From our tea collection</h2>
      <div className="campaign-controls" aria-label="Campaign controls">
        <button type="button" onClick={() => goTo(-1)} aria-label="Show previous campaign">Prev</button>
        <button type="button" onClick={() => goTo(1)} aria-label="Show next campaign">Next</button>
      </div>
    </div>
    <div className="campaign-feature" style={{ "--campaign-accent": active.accent } as React.CSSProperties}>
      <figure>
        <CloudinaryImage src={active.image} alt={`${active.name} package`} width={980} height={980} sizes="(max-width: 800px) 100vw, 50vw" />
      </figure>
      <article>
        <p>{active.category}</p>
        <h3>{active.name}</h3>
        <span>{active.description}</span>
        <Link href={`/teas/${active.slug}`}>View product <ArrowUpRight size={15} /></Link>
      </article>
    </div>
  </section>;
}
