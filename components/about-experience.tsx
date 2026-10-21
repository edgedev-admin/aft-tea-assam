"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ArrowDown, ArrowUpRight, Leaf, MapPin, Sprout } from "lucide-react";
import { useRef } from "react";
import styles from "./about-experience.module.css";

const founders = ["Noor Alam Khan", "Imran Khan", "Aslam Khan"] as const;
const values = [
  ["01", "Authenticity", "Keep the relationship between origin, tea and customer communication clear."],
  ["02", "Craftsmanship", "Give the leaf careful attention, from selective handling to finished processing."],
  ["03", "Integrity", "Build straightforward relationships with customers, growers and business partners."],
  ["04", "Progress", "Keep improving processes, blends and the ways Assam tea reaches the people who value it."]
] as const;
const businessLinks = [
  ["Our teas", "Specialty teas, CTC grades and the Ajanta Tea collection.", "/teas"],
  ["Our craft", "A closer look at leaf handling, processing and cup evaluation.", "/craft"],
  ["Wholesale", "Bulk supply, custom blending and private-label conversations.", "/wholesale"]
] as const;

export function AboutExperience() {
  const reduceMotion = useReducedMotion();
  const peopleRef = useRef<HTMLElement>(null);
  const landRef = useRef<HTMLElement>(null);
  const pearlRef = useRef<HTMLElement>(null);
  const { scrollYProgress: peopleProgress } = useScroll({ target: peopleRef, offset: ["start 88%", "end 30%"] });
  const { scrollYProgress: landProgress } = useScroll({ target: landRef, offset: ["start end", "end start"] });
  const { scrollYProgress: pearlProgress } = useScroll({ target: pearlRef, offset: ["start 84%", "center 42%"] });
  const familyClip = useTransform(peopleProgress, [0, .58], ["inset(12% 0 10% 0)", "inset(0% 0 0% 0)"]);
  const familyY = useTransform(peopleProgress, [0, .58], [38, 0]);
  const officeY = useTransform(peopleProgress, [.18, .76], [54, 0]);
  const officeClip = useTransform(peopleProgress, [.18, .76], ["inset(0 0 24% 0)", "inset(0 0 0% 0)"]);
  const landY = useTransform(landProgress, [0, 1], [-26, 26]);
  const landScale = useTransform(landProgress, [0, 1], [1.035, 1.075]);
  const priceY = useTransform(pearlProgress, [0, 1], [34, 0]);

  return <div className={styles.page}>
    <section className={styles.hero} aria-labelledby="about-hero-title">
      <Image className={styles.heroImage} src="/images/tea/assam-dawn.png" alt="Tea-growing landscape at sunrise in Assam" fill priority quality={90} sizes="100vw" />
      <div className={styles.heroShade} />
      <div className={styles.heroInner}>
        <p className={styles.heroEyebrow}>Our story <span aria-hidden="true">·</span> AFT Techno Trade</p>
        <h1 id="about-hero-title">Our roots run deep in Assam.</h1>
        <p className={styles.heroCopy}>Established in 2018 in Upper Assam, AFT Techno Trade brings together specialty tea craftsmanship, tea manufacturing and meaningful connections between the region and tea drinkers.</p>
        <Link className={styles.lightButton} href="#our-story">Discover Our Journey <ArrowDown aria-hidden="true" size={16} /></Link>
      </div>
      <p className={styles.heroLocation}><MapPin aria-hidden="true" size={15} /> Dikom <span aria-hidden="true">·</span> Lahowal <span aria-hidden="true">·</span> Dibrugarh</p>
    </section>

    <section ref={peopleRef} id="our-story" className={styles.people} aria-labelledby="people-title">
      <div className={styles.shell}>
        <header className={styles.sectionIntro}>
          <p className={styles.eyebrow}>The people</p>
          <h2 id="people-title">A business shaped by people and purpose.</h2>
          <p>AFT Techno Trade began with a belief that Upper Assam could offer more than a familiar strong cup. The founding vision brought careful processing, specialty craftsmanship and a direct relationship with the region into one enterprise.</p>
        </header>
        <div className={styles.peopleComposition}>
          <motion.figure className={styles.familyPortrait} style={reduceMotion ? undefined : { clipPath: familyClip, y: familyY }}>
            <Image src="/images/company/parents-at-home (2).jpeg" alt="Two members of the family behind AFT Techno Trade standing outside their home" fill quality={90} sizes="(max-width: 820px) 100vw, 48vw" />
            <figcaption>Family, at home in Upper Assam.</figcaption>
          </motion.figure>
          <div className={styles.peopleNarrative}>
            <div className={styles.foundingStatement}>
              <p>The company account names three people at the beginning of that vision.</p>
              <ol>{founders.map((founder, index) => <li key={founder}><span>0{index + 1}</span>{founder}</li>)}</ol>
              <small>Named in the company-provided account. Individual legal titles are not assigned here.</small>
            </div>
            <motion.figure className={styles.officePortrait} style={reduceMotion ? undefined : { clipPath: officeClip, y: officeY }}>
              <Image src="/images/company/son-office.png" alt="A member of the family behind AFT Techno Trade seated in the company office" fill quality={90} sizes="(max-width: 820px) 100vw, 45vw" />
              <figcaption>At work in the AFT Techno Trade office.</figcaption>
            </motion.figure>
          </div>
        </div>
      </div>
    </section>

    <section ref={landRef} className={styles.land} aria-labelledby="land-title">
      <motion.div className={styles.landMedia} style={reduceMotion ? undefined : { y: landY, scale: landScale }}><Image src="/images/tea/assam-dawn.png" alt="Tea fields in the Assam landscape" fill quality={90} sizes="100vw" /></motion.div>
      <div className={styles.landShade} />
      <div className={styles.landInner}>
        <p className={styles.eyebrowLight}>Our home <span aria-hidden="true">·</span> Upper Assam</p>
        <h2 id="land-title">Shaped by the land. Connected to its people.</h2>
        <p>From the Brahmaputra valley to the tea-growing areas around Dikom and Lahowal, Upper Assam offers the warmth, rainfall and growing conditions associated with the region&apos;s distinctive teas. It is here that AFT Techno Trade developed its manufacturing and sourcing operations.</p>
        <div className={styles.placeLine}><span>Dikom</span><span>Lahowal</span><span>Dibrugarh</span><span>Assam</span></div>
      </div>
    </section>

    <section className={styles.journey} aria-labelledby="journey-title"><div className={styles.shell}>
      <div className={styles.splitHeading}><div><p className={styles.eyebrow}>Our journey</p><h2 id="journey-title">A journey of ambition and craft.</h2></div><p>Three documented chapters trace how a regional tea enterprise grew into a broader manufacturing, specialty and consumer-tea portfolio.</p></div>
      <ol className={styles.timeline}>
        <li><time>2018</time><div><h3>AFT Techno Trade established</h3><p>The enterprise begins its journey in the Dikom and Lahowal area of Upper Assam.</p></div></li>
        <li><time dateTime="2022-02-14">14.02.22</time><div><h3>Golden Pearl at GTAC</h3><p>One kilogram of the handcrafted Nahorchukbari tea sells for ₹99,999 at the Guwahati Tea Auction Centre.</p></div></li>
        <li><time>Today</time><div><h3>A broader tea portfolio</h3><p>Specialty teas, commercial CTC grades, the Ajanta Tea collection and wholesale services now sit within one company story.</p></div></li>
      </ol>
    </div></section>

    <section className={styles.craft} aria-labelledby="craft-title"><div className={styles.shell}>
      <header className={styles.sectionIntroCompact}><p className={styles.eyebrow}>The craft</p><h2 id="craft-title">Different expressions. One commitment to tea.</h2></header>
      <article className={styles.craftStory}>
        <figure><Image src="/images/tea/about-3.jpg" alt="Loose tea leaves infusing in a glass pot" fill sizes="(max-width: 560px) calc(100vw - 36px), 400px" /></figure>
        <div><span>01 <Sprout aria-hidden="true" size={17} /></span><p className={styles.eyebrow}>Nahorchukbari</p><h3>The patience of specialty craft.</h3><p>Select leaf and bud material, carefully managed withering and skilled hand-rolling shape the company&apos;s whole-leaf and Golden Pearl story. The work favours attention, sensory judgement and limited specialty lots.</p><Link href="/teas/golden-pearl">Explore the specialty story <ArrowUpRight aria-hidden="true" size={15} /></Link></div>
      </article>
      <article className={`${styles.craftStory} ${styles.craftReverse}`}>
        <figure><Image src="/images/tea/about-4.jpg" alt="Prepared chai being poured into cups" fill sizes="(max-width: 560px) calc(100vw - 36px), 400px" /></figure>
        <div><span>02 <Leaf aria-hidden="true" size={17} /></span><p className={styles.eyebrow}>Ekoratoli</p><h3>The discipline behind the everyday cup.</h3><p>CTC processing, grading and cup evaluation support robust Assam tea for milk-tea applications and commercial buyers. Consistency, extraction and a dependable cup guide the everyday side of the business.</p><Link href="/craft">See how we approach tea <ArrowUpRight aria-hidden="true" size={15} /></Link></div>
      </article>
    </div></section>

    <section ref={pearlRef} className={styles.pearl} aria-labelledby="pearl-title"><div className={styles.pearlInner}>
      <div className={styles.pearlCopy}><p className={styles.eyebrowGold}>Golden Pearl <span aria-hidden="true">·</span> Historical auction</p><h2 id="pearl-title">A remarkable moment for Assam tea craft.</h2><p>A handcrafted Golden Pearl lot produced under the Nahorchukbari name became part of Assam&apos;s specialty-tea history at the Guwahati Tea Auction Centre.</p><Link href="/teas/golden-pearl">Discover Golden Pearl <ArrowUpRight aria-hidden="true" size={16} /></Link></div>
      <motion.div className={styles.pearlFigure} style={reduceMotion ? undefined : { y: priceY }}><small>One kilogram sold for</small><strong>₹99,999</strong><span>per kilogram</span><p>14 February 2022<br />Guwahati Tea Auction Centre</p><em>Historical auction result, not a current retail price.</em></motion.div>
    </div></section>

    <section className={styles.identities} aria-labelledby="identities-title"><div className={styles.shell}>
      <div className={styles.splitHeading}><div><p className={styles.eyebrow}>Our tea identities</p><h2 id="identities-title">Three expressions of one Upper Assam foundation.</h2></div><p>Each name has a different place in the portfolio. They are connected by origin, not presented as identical product types.</p></div>
      <div className={styles.identityGrid}>
        <article className={styles.nahorchukbari}><span>Specialty tea identity</span><h3>Nahorchukbari</h3><p>Handcrafted teas, distinctive leaf selections and the Golden Pearl story.</p><Link href="/teas/golden-pearl">Explore <ArrowUpRight aria-hidden="true" size={14} /></Link></article>
        <article className={styles.ekoratoli}><span>Commercial CTC identity</span><h3>Ekoratoli</h3><p>Robust Assam grades developed for everyday milk-tea and commercial applications.</p><Link href="/wholesale">Wholesale enquiries <ArrowUpRight aria-hidden="true" size={14} /></Link></article>
        <article className={styles.ajanta}><Image src="/media/product-campaigns/AFT TEA COLLECTION.png" alt="Ajanta Tea Gold, Elaichi, High Societea and Kolkata Street Masala Chai packs" fill quality={90} sizes="(max-width: 900px) 100vw, 50vw" /><div><span>Consumer tea collection</span><h3>Ajanta Tea</h3><p>Gold, Elaichi, High Societea and Kolkata Street Masala Chai.</p><Link href="/teas">View the collection <ArrowUpRight aria-hidden="true" size={14} /></Link></div></article>
      </div>
    </div></section>

    <section className={styles.purpose} aria-labelledby="purpose-title"><div className={styles.shell}>
      <header className={styles.purposeLead}><p className={styles.eyebrow}>Vision, mission and values</p><h2 id="purpose-title">Our purpose goes beyond the finished cup.</h2></header>
      <div className={styles.intentions}><article><span>Vision</span><p>To demonstrate the potential of Upper Assam tea through distinctive specialty craftsmanship and dependable everyday offerings.</p></article><article><span>Mission</span><p>To combine careful processing, practical manufacturing standards and trustworthy relationships with the people and businesses connected to tea.</p></article></div>
      <div className={styles.valueRows}>{values.map(([number, title, text]) => <article key={title}><span>{number}</span><h3>{title}</h3><p>{text}</p></article>)}</div>
    </div></section>

    <section className={styles.today} aria-labelledby="today-title"><div className={styles.shell}>
      <div className={styles.todayLead}><p className={styles.eyebrowGold}>AFT Techno Trade today</p><h2 id="today-title">From Assam&apos;s tea-growing region to the people we serve.</h2><p>Tea manufacturing and processing, specialty offerings, commercial CTC grades, retail collections, wholesale supply, custom blending and private-label enquiries.</p></div>
      <div className={styles.businessLinks}>{businessLinks.map(([title, text, href]) => <Link href={href} key={title}><span>{title}</span><p>{text}</p><ArrowUpRight aria-hidden="true" size={19} /></Link>)}</div>
    </div></section>

    <section className={styles.finalCta} aria-labelledby="about-cta-title"><div><p className={styles.eyebrowLight}>Continue the story</p><h2 id="about-cta-title">Discover the tea. Get to know AFT.</h2><p>Explore the collections, craftsmanship and business relationships that define AFT Techno Trade.</p><div className={styles.finalActions}><Link className={styles.lightButton} href="/teas">Explore Our Teas <ArrowUpRight aria-hidden="true" size={16} /></Link><Link className={styles.textLinkLight} href="/contact">Contact Our Team <ArrowUpRight aria-hidden="true" size={16} /></Link></div></div></section>
  </div>;
}
