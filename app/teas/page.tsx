import type { Metadata } from "next";
import { pageMetadata } from "../../lib/seo";
import Link from "next/link";
import { ArrowDown, ArrowRight, ArrowUpRight } from "lucide-react";
import { CloudinaryImage } from "../../components/cloudinary-image";
import { SiteFooter } from "../../components/site-footer";
import { SiteNavbar } from "../../components/site-navbar";
import { TeaChapterNav } from "../../components/tea-chapter-nav";
import { AjantaProductExplorer, EkoratoliExplorer } from "../../components/tea-interactive-showcases";
import { aftAssets, teaProcessSequence } from "../../lib/media/aft-assets";
import { teaCatalogChapters } from "../../lib/products";
import styles from "./teas.module.css";

export const metadata: Metadata = pageMetadata({
  title: "Our Teas | Assam Tea Collections | AFT Techno Trade",
  description: "Discover AFT Techno Trade's Assam teas: handcrafted Nahorchukbari specialties, Ekoratoli CTC grades, Ajanta Tea and contemporary blends.",
  path: "/teas",
});

const [nahorchukbari, ekoratoli, ajanta, fusion] = teaCatalogChapters;
const chapters = teaCatalogChapters.map(({ id, index, name }) => ({ id, index, name }));
const ajantaProducts = ajanta.products.map((product, index) => ({
  ...product,
  image: [
    aftAssets.consumerProducts.ajantaGold,
    aftAssets.consumerProducts.ajantaElaichi,
    aftAssets.consumerProducts.highSocietea,
    aftAssets.consumerProducts.kolkataStreetMasalaChai
  ][index],
  ...(product.id === "high-societea" ? {
    note: "The photographed pouch says ‘High Societea’; the catalogue also lists Ajanta Societea. Their relationship is awaiting confirmation."
  } : {})
}));

export default function TeasPage() {
  const goldenPearl = nahorchukbari.products[0];

  return <>
    <SiteNavbar />
    <main id="main" className={styles.page}>
      <section className={styles.hero} aria-labelledby="tea-page-title">
        <div className={styles.heroCopy}>
          <p className={styles.eyebrow}>The AFT Tea Collection</p>
          <h1 id="tea-page-title">Every kind of tea has a story.</h1>
          <p className={styles.heroDescription}>From Assam CTC and everyday favourites to carefully crafted specialty teas, discover the collections that define AFT Techno Trade.</p>
          <a className={styles.heroAction} href="#collection-guide">Explore the collections <ArrowDown aria-hidden="true" size={16} /></a>
          <span className={styles.heroIndex}>Upper Assam <i aria-hidden="true">/</i> Four tea identities</span>
        </div>
        <div className={styles.heroProducts} aria-label="Ajanta Tea product collection">
          <div className={styles.heroProductLineup}>
            <div className={styles.heroProductSociety}>
              <CloudinaryImage src={aftAssets.consumerProducts.highSocietea.src} alt={aftAssets.consumerProducts.highSocietea.alt} fill sizes="(max-width: 820px) 23vw, 17vw" quality={90} />
            </div>
            <div className={styles.heroProductElaichi}>
              <CloudinaryImage src={aftAssets.consumerProducts.ajantaElaichi.src} alt={aftAssets.consumerProducts.ajantaElaichi.alt} fill sizes="(max-width: 820px) 28vw, 21vw" quality={90} />
            </div>
            <div className={styles.heroProductGold}>
              <CloudinaryImage src={aftAssets.consumerProducts.ajantaGold.src} alt={aftAssets.consumerProducts.ajantaGold.alt} fill preload sizes="(max-width: 820px) 28vw, 21vw" quality={90} />
            </div>
            <div className={styles.heroProductChai}>
              <CloudinaryImage src={aftAssets.consumerProducts.kolkataStreetMasalaChai.src} alt={aftAssets.consumerProducts.kolkataStreetMasalaChai.alt} fill sizes="(max-width: 820px) 23vw, 17vw" quality={90} />
            </div>
          </div>
          <p className={styles.heroProductCaption}>Four collections.<br />Many ways to enjoy Assam tea.</p>
          <span className={styles.heroProductRule} aria-hidden="true" />
        </div>
      </section>

      <div id="collection-guide" className={styles.collectionGuide}>
        <TeaChapterNav chapters={chapters} />
      </div>

      <section id={nahorchukbari.id} className={`${styles.chapter} ${styles.specialty}`} aria-labelledby="nahorchukbari-title">
        <div className={styles.chapterShell}>
          <header className={styles.specialtyHeading}>
            <p className={styles.eyebrow}>01 / Nahorchukbari · {nahorchukbari.positioning}</p>
            <h2 id="nahorchukbari-title">The finer side<br /><em>of Assam tea.</em></h2>
            <p>{nahorchukbari.introduction}</p>
          </header>

          <div className={styles.pearlFeature}>
            <div className={styles.pearlOrb} aria-hidden="true" />
            <figure className={styles.pearlJar}>
              <CloudinaryImage src={aftAssets.specialtyTeas.goldenPearlJar.src} alt={aftAssets.specialtyTeas.goldenPearlJar.alt} fill sizes="(max-width: 760px) 82vw, 39vw" quality={90} />
              <figcaption>Nahorchukbari · Golden Pearl</figcaption>
            </figure>
            <article className={styles.pearlCopy}>
              <p className={styles.goldEyebrow}>A handcrafted specialty tea</p>
              <h3>One kilogram.<br />One remarkable chapter.</h3>
              <p>{goldenPearl.description}</p>
              <div className={styles.auctionNote}>
                <strong>₹99,999 <small>/ kg</small></strong>
                <span>Historical one-kilogram auction sale<br />Guwahati Tea Auction Centre · 14 February 2022</span>
              </div>
              <p className={styles.priceNote}>A historic auction result, not a current retail price.</p>
              <Link className={styles.goldLink} href="/teas/golden-pearl">Discover Golden Pearl <ArrowUpRight aria-hidden="true" size={17} /></Link>
            </article>
          </div>

          <div className={styles.specialtyRange}>
            <span className={styles.rangeLabel}>Other specialty selections</span>
            {nahorchukbari.products.slice(1).map((product) => (
              <Link href={product.href} key={product.id}>
                <span>{product.label}</span><strong>{product.name}</strong><small>{product.availability}</small><ArrowUpRight aria-hidden="true" size={16} />
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section id={ekoratoli.id} className={`${styles.chapter} ${styles.ekoratoli}`} aria-labelledby="ekoratoli-title">
        <div className={styles.chapterShell}>
          <header className={styles.ekoratoliHeading}>
            <div>
              <p className={styles.eyebrow}>02 / Ekoratoli · CTC for commercial supply</p>
              <h2 id="ekoratoli-title">The strength and character of Assam CTC.</h2>
            </div>
            <p>{ekoratoli.introduction}</p>
          </header>
          <EkoratoliExplorer
            grades={ekoratoli.products}
            macro={aftAssets.teaLeavesAndTextures.macroGranules}
            ctc={aftAssets.teaLeavesAndTextures.ctcGranules}
            scoop={aftAssets.teaLeavesAndTextures.woodenScoop}
          />
          <div className={styles.ekoratoliSignature}>
            <CloudinaryImage src={aftAssets.brandCampaignAssets.ekoratoliTote.src} alt={aftAssets.brandCampaignAssets.ekoratoliTote.alt} width={1122} height={1402} sizes="112px" quality={90} />
            <p><span>Ekoratoli</span><strong>Garden Fresh Tea</strong><small>Brand tote image · commercial tea grades available by enquiry</small></p>
          </div>
        </div>
      </section>

      <section id={ajanta.id} className={`${styles.chapter} ${styles.ajanta}`} aria-labelledby="ajanta-title">
        <div className={styles.chapterShell}>
          <header className={styles.ajantaHeading}>
            <p className={styles.eyebrow}>03 / Ajanta Tea · Everyday tea, distinctive character</p>
            <div>
              <h2 id="ajanta-title">A familiar cup.<br /><em>A character of its own.</em></h2>
              <p>{ajanta.introduction}</p>
            </div>
          </header>
          <AjantaProductExplorer products={ajantaProducts} />
          <p className={styles.availabilityNote}>Current formulations, pack sizes and availability are confirmed directly with AFT Techno Trade.</p>
        </div>
      </section>

      <section id={fusion.id} className={`${styles.chapter} ${styles.fusion}`} aria-labelledby="fusion-title">
        <div className={styles.chapterShell}>
          <div className={styles.fusionTopline}><p className={styles.eyebrow}>04 / Contemporary & Fusion</p><span>New expressions · by enquiry</span></div>
          <div className={styles.fusionLayout}>
            <div className={styles.fusionImage}>
              <CloudinaryImage src={aftAssets.teaLeavesAndTextures.granulesPouring.src} alt={aftAssets.teaLeavesAndTextures.granulesPouring.alt} fill sizes="(max-width: 760px) 100vw, 48vw" quality={90} />
              <p>Ideas begin with Assam tea.</p>
            </div>
            <div className={styles.fusionCopy}>
              <h2 id="fusion-title">Beyond the<br /><em>familiar cup.</em></h2>
              <p>{fusion.introduction}</p>
              <div className={styles.fusionOfferings}>
                {fusion.products.map((product, index) => (
                  <article key={product.id}>
                    <span>0{index + 1}</span><div><h3>{product.name}</h3><p>{product.description}</p><small>{product.availability}</small></div>
                    <Link href={product.href} aria-label={`${product.cta}: ${product.name}`}><ArrowUpRight aria-hidden="true" size={18} /></Link>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.processStory} aria-labelledby="process-title">
        <div className={styles.chapterShell}>
          <div className={styles.processHeading}>
            <p className={styles.eyebrow}>From leaf to tea</p>
            <h2 id="process-title">A closer look at the work.</h2>
            <p>Selected garden, leaf, inspection and packing photographs connect the cup with the people and work around tea.</p>
          </div>
          <div className={styles.processRail}>
            {teaProcessSequence.map((frame, index) => (
              <figure key={frame.src}>
                <div className={styles.processImage}><CloudinaryImage src={frame.src} alt={frame.alt} fill sizes="(max-width: 700px) 76vw, (max-width: 1100px) 43vw, 25vw" quality={90} /></div>
                <figcaption><span>0{index + 1}</span><strong>{frame.title}</strong><small>{frame.caption}</small></figcaption>
              </figure>
            ))}
          </div>
          <p className={styles.enhancedDisclaimer}>Images labeled “enhanced” have been edited; their documentary provenance should be confirmed before they are presented as unaltered operational records.</p>
        </div>
      </section>

      <section className={styles.finalCta} aria-labelledby="tea-cta-title">
        <div className={styles.finalCtaInner}>
          <p className={styles.goldEyebrow}>For tea buyers and partners</p>
          <h2 id="tea-cta-title">Looking for the right Assam tea for your business?</h2>
          <p>Explore product requirements, commercial grades, custom blending and wholesale supply with our team.</p>
          <div className={styles.ctaActions}>
            <Link className={styles.primaryCta} href="/wholesale">Discuss Your Requirements <ArrowUpRight aria-hidden="true" size={17} /></Link>
            <Link className={styles.secondaryCta} href="/contact">Contact Our Team <ArrowRight aria-hidden="true" size={17} /></Link>
          </div>
        </div>
      </section>
    </main>
    <SiteFooter />
  </>;
}
