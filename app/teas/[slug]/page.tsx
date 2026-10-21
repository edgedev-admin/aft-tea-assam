import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Leaf } from "lucide-react";
import { notFound } from "next/navigation";
import { SiteNavbar } from "../../../components/site-navbar";
import { SiteFooter } from "../../../components/site-footer";
import { Reveal, RevealHeading, RevealImage } from "../../../components/reveal";
import { getProduct, products, relatedProducts } from "../../../lib/products";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) return {};
  return {
    title: product.seoTitle,
    description: product.seoDescription,
    alternates: { canonical: `/teas/${product.slug}` }
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();
  const related = relatedProducts(product.slug);
  return <><SiteNavbar/><main id="main" className="detail-page">
    <section className="detail-hero">
      <div className="detail-hero-inner">
        <RevealImage className="detail-pack" style={{ "--detail-bg": product.background } as React.CSSProperties}><Image src={product.image} alt={`${product.name} visual`} width={900} height={900} priority/></RevealImage>
        <div>
          <div className="crumbs"><Link href="/teas">Our Teas</Link> / {product.name}</div>
          <Reveal><p className="detail-kicker"><Leaf size={14}/> {product.category}</p></Reveal>
          <h1><RevealHeading text={product.name}/></h1>
          <Reveal delay={.14}><p>{product.description}</p></Reveal>
          <Reveal delay={.18}><div className="detail-meta"><span>{product.teaType}</span><span>{product.brand}</span><span>{product.enquiryEligible ? "Enquiry available" : "Details only"}</span></div></Reveal>
          <Reveal delay={.22}><Link href={`/contact?product=${product.slug}`}>Enquire about this tea <ArrowUpRight size={15}/></Link></Reveal>
        </div>
      </div>
    </section>
    <section className="detail-info">
      <div className="detail-info-grid">
        <article className="detail-story"><h2>About this tea</h2><p>{product.fullDescription}</p></article>
        <article><h2>Product notes</h2><ul>{product.characteristics.map((item) => <li key={item}>{item}</li>)}</ul></article>
        <article><h2>Tea experience</h2><p>{product.experience}</p><p><strong>Availability:</strong> {product.availability}</p>{product.note && <p>{product.note}</p>}{product.sourceUrl && <a href={product.sourceUrl} target="_blank" rel="noreferrer">Read independent auction coverage <ArrowUpRight size={14}/></a>}</article>
        <article><h2>Related teas</h2><ul>{related.map((item) => <li key={item.id}><Link href={`/teas/${item.slug}`}>{item.name}</Link></li>)}</ul></article>
      </div>
    </section>
  </main><SiteFooter/></>;
}
