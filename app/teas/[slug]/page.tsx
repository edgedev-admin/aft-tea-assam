import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, Leaf } from "lucide-react";
import { notFound } from "next/navigation";
import { SiteNavbar } from "../../../components/site-navbar";
import { SiteFooter } from "../../../components/site-footer";
import { CloudinaryImage } from "../../../components/cloudinary-image";
import { WhatsAppAction } from "../../../components/whatsapp-action";
import { StructuredData } from "../../../components/structured-data";
import { pageMetadata, productStructuredData } from "../../../lib/seo";
import { Reveal, RevealHeading, RevealImage } from "../../../components/reveal";
import { getProduct, products, relatedProducts } from "../../../lib/products";
import styles from "./product-detail.module.css";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) return {};
  return pageMetadata({
    title: product.seoTitle,
    description: product.seoDescription,
    path: `/teas/${product.slug}`,
    image: product.image,
  });
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();
  const related = relatedProducts(product.slug);
  return <><SiteNavbar/><main id="main" className="detail-page">
    <StructuredData data={productStructuredData(product)} />
    <section className="detail-hero">
      <div className="detail-hero-inner">
        <RevealImage className="detail-pack" style={{ "--detail-bg": product.background } as React.CSSProperties}><CloudinaryImage src={product.image} alt={`${product.name} visual`} width={900} height={900} priority sizes="(max-width: 760px) 100vw, 50vw" /></RevealImage>
        <div>
          <div className="crumbs"><Link href="/teas">Our Teas</Link> / {product.name}</div>
          <Reveal><p className="detail-kicker"><Leaf size={14}/> {product.category}</p></Reveal>
          <h1><RevealHeading text={product.name}/></h1>
          <Reveal delay={.14}><p>{product.description}</p></Reveal>
          <Reveal delay={.18}><div className="detail-meta"><span>{product.teaType}</span><span>{product.brand}</span><span>{product.enquiryEligible ? "Enquiry available" : "Details only"}</span></div></Reveal>
          <Reveal delay={.22}><div className={styles.enquiryActions}><Link href={`/contact?product=${product.slug}`}>Enquire about this tea <ArrowUpRight size={15}/></Link><WhatsAppAction productName={product.name} /></div></Reveal>
        </div>
      </div>
    </section>
    <section className={styles.campaign} aria-labelledby="product-campaign-title">
      <div className={styles.campaignInner}>
        <figure><CloudinaryImage src={product.gallery[1]} alt={`${product.name} campaign presentation`} fill quality={90} sizes="(max-width: 820px) 100vw, 68vw" /></figure>
        <div className={styles.campaignCopy}><span>Product in view</span><h2 id="product-campaign-title">The character of {product.name}.</h2><p>{product.description}</p></div>
      </div>
    </section>
    <section className="detail-info">
      <div className="detail-info-grid">
        <article className="detail-story"><h2>About this tea</h2><p>{product.fullDescription}</p></article>
        <article><h2>Product notes</h2><ul>{product.characteristics.map((item) => <li key={item}>{item}</li>)}</ul></article>
        <article><h2>Tea experience</h2><p>{product.experience}</p><p><strong>Availability:</strong> {product.availability}</p>{product.note && <p>{product.note}</p>}{product.sourceUrl && <a href={product.sourceUrl} target="_blank" rel="noopener noreferrer">Read independent auction coverage <ArrowUpRight size={14}/></a>}</article>
        <article><h2>Related teas</h2><ul>{related.map((item) => <li key={item.id}><Link href={`/teas/${item.slug}`}>{item.name}</Link></li>)}</ul></article>
      </div>
    </section>
  </main><SiteFooter productName={product.name}/></>;
}
