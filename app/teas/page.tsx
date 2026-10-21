import type { Metadata } from "next";
import { ArrowDown, ArrowRight, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { SiteFooter } from "../../components/site-footer";
import { SiteNavbar } from "../../components/site-navbar";
import { TeaChapterNav } from "../../components/tea-chapter-nav";
import { teaCatalogChapters, type TeaCatalogProduct } from "../../lib/products";
import styles from "./teas.module.css";

export const metadata: Metadata = {
  title: { absolute: "Our Teas | Assam Tea Collections | AFT Techno Trade" },
  description: "Explore AFT Techno Trade's Assam tea collections, from Nahorchukbari specialty teas and Ekoratoli CTC grades to Ajanta Tea and contemporary blends.",
  alternates: { canonical: "/teas" }
};

const chapterNav = teaCatalogChapters.map(({ id, index, name }) => ({ id, index, name }));

function ProductRow({ product, number, tone = "light" }: { product: TeaCatalogProduct; number: number; tone?: "light" | "dark" }) {
  return <article className={`${styles.productRow} ${tone === "dark" ? styles.productRowDark : ""}`}>
    <p className={styles.productNumber}>{String(number).padStart(2, "0")}</p>
    <div className={styles.productTitle}>
      <p className={styles.productLabel}>{product.label}</p>
      <h3>{product.name}</h3>
      {product.grade && <p className={styles.productGrade}>{product.grade}</p>}
    </div>
    <div className={styles.productDetail}>
      <p>{product.description}</p>
      <span>{product.availability}</span>
    </div>
    <Link className={styles.rowLink} href={product.href}>
      {product.cta}<ArrowUpRight aria-hidden="true" size={16}/>
    </Link>
  </article>;
}

export default function TeasPage() {
  const [nahorchukbari, ekoratoli, ajanta, fusion] = teaCatalogChapters;

  return <>
    <SiteNavbar />
    <main id="main" className={styles.page}>
      <section className={styles.hero} aria-labelledby="tea-page-title">
        <div className={styles.heroRule} aria-hidden="true"><span>01</span><span>04</span></div>
        <div className={styles.heroInner}>
          <div className={styles.heroHeading}>
            <p className={styles.eyebrow}>The AFT Tea Collection</p>
            <h1 id="tea-page-title">One region.<br/><em>Many remarkable cups.</em></h1>
          </div>
          <div className={styles.heroStatement}>
            <p>From carefully handcrafted specialty teas to robust Assam CTC and aromatic chai blends, explore a collection shaped by the character of Upper Assam and the diversity of its tea traditions.</p>
            <div className={styles.heroNote}>
              <span>Upper Assam</span>
              <span>Specialty / CTC / Blended</span>
            </div>
          </div>
        </div>
        <a className={styles.scrollCue} href="#collection-guide">Explore the collection <ArrowDown aria-hidden="true" size={16}/></a>
      </section>

      <div id="collection-guide"><TeaChapterNav chapters={chapterNav}/></div>

      <section id={nahorchukbari.id} className={`${styles.chapter} ${styles.specialty}`} aria-labelledby="nahorchukbari-title">
        <div className={styles.chapterInner}>
          <header className={styles.chapterHeader}>
            <div className={styles.chapterIndex}><span>{nahorchukbari.index}</span><p>{nahorchukbari.positioning}</p></div>
            <div>
              <p className={styles.eyebrow}>{nahorchukbari.name}</p>
              <h2 id="nahorchukbari-title">{nahorchukbari.headline}</h2>
            </div>
            <p className={styles.chapterIntro}>{nahorchukbari.introduction}</p>
          </header>
          <div className={styles.productList}>
            {nahorchukbari.products.map((product, index) => <ProductRow key={product.id} product={product} number={index + 1} tone="dark"/>)}
          </div>
        </div>
      </section>

      <section id={ekoratoli.id} className={`${styles.chapter} ${styles.ekoratoli}`} aria-labelledby="ekoratoli-title">
        <div className={`${styles.chapterInner} ${styles.ctcLayout}`}>
          <header className={styles.ctcIntro}>
            <div className={styles.chapterIndex}><span>{ekoratoli.index}</span><p>{ekoratoli.positioning}</p></div>
            <p className={styles.eyebrow}>{ekoratoli.name}</p>
            <h2 id="ekoratoli-title">{ekoratoli.headline}</h2>
            <p>{ekoratoli.introduction}</p>
            <aside className={styles.ctcNote}>
              <strong>What is CTC?</strong>
              <p>Crush, Tear, Curl is a tea-making method that creates compact, quick-infusing leaf grades known for colour, briskness and body.</p>
            </aside>
            <Link className={styles.ctcCta} href="/wholesale">Discuss Bulk CTC Requirements<ArrowUpRight aria-hidden="true" size={16}/></Link>
          </header>
          <div className={styles.productList}>
            {ekoratoli.products.map((product, index) => <ProductRow key={product.id} product={product} number={index + 1}/>)}
          </div>
        </div>
      </section>

      <section id={ajanta.id} className={`${styles.chapter} ${styles.ajanta}`} aria-labelledby="ajanta-title">
        <div className={styles.ajantaBanner}>
          <div className={styles.chapterInner}>
            <div className={styles.chapterIndex}><span>{ajanta.index}</span><p>{ajanta.positioning}</p></div>
            <p className={styles.eyebrow}>{ajanta.name}</p>
            <h2 id="ajanta-title">{ajanta.headline}</h2>
            <p className={styles.ajantaIntro}>{ajanta.introduction}</p>
          </div>
        </div>
        <div className={`${styles.chapterInner} ${styles.ajantaProducts}`}>
          {ajanta.products.map((product, index) => <ProductRow key={product.id} product={product} number={index + 1}/>)}
        </div>
      </section>

      <section id={fusion.id} className={`${styles.chapter} ${styles.fusion}`} aria-labelledby="fusion-title">
        <div className={styles.chapterInner}>
          <header className={styles.fusionHeader}>
            <div className={styles.chapterIndex}><span>{fusion.index}</span><p>{fusion.positioning}</p></div>
            <div>
              <p className={styles.eyebrow}>{fusion.name}</p>
              <h2 id="fusion-title">{fusion.headline}</h2>
            </div>
            <p>{fusion.introduction}</p>
          </header>
          <div className={styles.fusionGrid}>
            {fusion.products.map((product, index) => <article className={styles.fusionEntry} key={product.id}>
              <div><span>0{index + 1}</span><p>{product.label}</p></div>
              <h3>{product.name}</h3>
              <p>{product.description}</p>
              <small>{product.availability}</small>
              <Link href={product.href}>{product.cta}<ArrowUpRight aria-hidden="true" size={16}/></Link>
            </article>)}
          </div>
        </div>
      </section>

      <section className={styles.finder} aria-labelledby="tea-finder-title">
        <div className={styles.finderIntro}>
          <p className={styles.eyebrow}>A simple place to begin</p>
          <h2 id="tea-finder-title">Find the tea that fits your cup.</h2>
        </div>
        <div className={styles.finderLinks}>
          <Link href="#nahorchukbari"><span>For quiet, considered brewing</span><strong>Explore specialty tea</strong><ArrowRight aria-hidden="true"/></Link>
          <Link href="#ekoratoli"><span>For strong milk tea and chai</span><strong>Explore Assam CTC</strong><ArrowRight aria-hidden="true"/></Link>
          <Link href="#ajanta-tea"><span>For familiar and aromatic moments</span><strong>Explore Ajanta Tea</strong><ArrowRight aria-hidden="true"/></Link>
          <Link href="/wholesale"><span>For bulk, blend or private-label needs</span><strong>Discuss tea supply</strong><ArrowRight aria-hidden="true"/></Link>
        </div>
      </section>

      <section className={styles.finalCta} aria-labelledby="tea-cta-title">
        <div>
          <p className={styles.eyebrow}>Let&apos;s talk tea</p>
          <h2 id="tea-cta-title">The right tea begins with understanding your needs.</h2>
          <p>Whether you&apos;re exploring a distinctive specialty selection, choosing an everyday blend, or sourcing Assam tea for your business, AFT Techno Trade welcomes the conversation.</p>
          <div className={styles.ctaActions}>
            <Link className={styles.primaryCta} href="/wholesale">Discuss Your Tea Requirements<ArrowUpRight aria-hidden="true" size={17}/></Link>
            <Link className={styles.secondaryCta} href="/contact">Contact Our Team<ArrowRight aria-hidden="true" size={17}/></Link>
          </div>
        </div>
      </section>
    </main>
    <SiteFooter />
  </>;
}
