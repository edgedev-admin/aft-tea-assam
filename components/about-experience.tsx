"use client";

import Link from "next/link";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ArrowDown, ArrowUpRight, MapPin } from "lucide-react";
import { useRef } from "react";
import { CloudinaryImage } from "./cloudinary-image";
import { PeopleMontage } from "./people-montage";
import { aftAssets } from "../lib/media/aft-assets";
import styles from "./about-experience.module.css";

const founders = ["Noor Alam Khan", "Imran Khan", "Aslam Khan"] as const;
const businessLinks = [
  ["Our teas", "CTC, orthodox, green, dust and premium Assam tea for different cups.", "/teas"],
  ["Our craft", "A closer look at processing, grading and cup evaluation.", "/craft"],
  ["Wholesale", "Commercial CTC, specialty selections and supply conversations.", "/wholesale"],
] as const;

const journeyMilestones = [
  {
    date: "2018",
    dateTime: "2018",
    title: "AFT Techno Trade is established",
    description: "The company begins its manufacturing journey at Nahorchukbari in Lahowal, building on its fresh-leaf roots in Upper Assam.",
    image: aftAssets.teaGardens.aerialGarden,
    imageAlt: "Aerial view over tea rows in Upper Assam",
  },
  {
    date: "14 February 2022",
    dateTime: "2022-02-14",
    title: "Golden Pearl reaches the auction floor",
    description: "A one-kilogram Golden Pearl lot sold for ₹99,999 per kilogram at the Guwahati Tea Auction Centre.",
    image: aftAssets.specialtyTeas.goldenPearlJar,
    imageAlt: "Nahorchukbari Golden Pearl presentation jar",
  },
] as const;

const processFrames = [
  { image: aftAssets.teaLeavesAndTextures.dewLeaves, title: "Garden leaves", caption: "Dew on tea leaves in morning light." },
  { image: aftAssets.teaLeavesAndTextures.sortingLeaves, title: "Leaf sorting", caption: "Hands sorting tea leaves on a work surface." },
  { image: aftAssets.teaLeavesAndTextures.freshLeafInspection, title: "Fresh leaf inspection", caption: "Fresh leaf material being examined by hand." },
  { image: aftAssets.manufacturingAndQuality.processingInspection, title: "Processing inspection", caption: "A worker examines tea on processing equipment. Enhanced image; documentary provenance requires confirmation." },
  { image: aftAssets.teaLeavesAndTextures.granulesPouring, title: "Tea granules", caption: "Tea granules flowing into a metal tray." },
  { image: aftAssets.manufacturingAndQuality.packagingLine, title: "Tea packaging", caption: "A worker alongside a tea packaging line." },
] as const;

export function AboutExperience() {
  const reducedMotion = useReducedMotion();
  const peopleRef = useRef<HTMLElement>(null);
  const landRef = useRef<HTMLElement>(null);
  const pearlRef = useRef<HTMLElement>(null);
  const journeyRef = useRef<HTMLElement>(null);
  const { scrollYProgress: peopleProgress } = useScroll({ target: peopleRef, offset: ["start 88%", "end 30%"] });
  const { scrollYProgress: landProgress } = useScroll({ target: landRef, offset: ["start end", "end start"] });
  const { scrollYProgress: pearlProgress } = useScroll({ target: pearlRef, offset: ["start 84%", "center 42%"] });
  const { scrollYProgress: journeyProgress } = useScroll({ target: journeyRef, offset: ["start 72%", "end 48%"] });
  const peopleIntroY = useTransform(peopleProgress, [0, 0.34], [22, 0]);
  const peopleMediaY = useTransform(peopleProgress, [0.08, 0.56], [34, 0]);
  const peopleMediaClip = useTransform(peopleProgress, [0.08, 0.56], ["inset(5% 0 5% 0)", "inset(0% 0 0% 0)"]);
  const peopleCopyY = useTransform(peopleProgress, [0.28, 0.74], [26, 0]);
  const landY = useTransform(landProgress, [0, 1], [-26, 26]);
  const landScale = useTransform(landProgress, [0, 1], [1.035, 1.075]);
  const priceY = useTransform(pearlProgress, [0, 1], [34, 0]);
  const journeyLine = useTransform(journeyProgress, [0, 1], [0, 1]);

  return <div className={styles.page}>
    <section className={styles.hero} aria-labelledby="about-hero-title">
      <CloudinaryImage className={styles.heroImage} src="/images/story/garden-path.jpg" alt="A path through rows of tea bushes beneath shade trees in Upper Assam" fill preload quality={90} sizes="100vw" />
      <div className={styles.heroShade} />
      <div className={styles.heroInner}>
        <p className={styles.heroEyebrow}>Our story <span aria-hidden="true">&bull;</span> Upper Assam</p>
        <h1 id="about-hero-title">Rooted in Assam. Built by people.</h1>
        <p className={styles.heroCopy}>From the tea-growing communities around Dikom and Lahowal, AFT Techno Trade began manufacturing in 2018.</p>
        <Link className={styles.lightButton} href="#our-story">Discover Our Journey <ArrowDown aria-hidden="true" size={16} /></Link>
      </div>
      <p className={styles.heroLocation}><MapPin aria-hidden="true" size={15} /> Dikom <span aria-hidden="true">&bull;</span> Lahowal <span aria-hidden="true">&bull;</span> Dibrugarh</p>
    </section>

    <section ref={peopleRef} id="our-story" className={styles.people} aria-labelledby="people-title">
      <div className={styles.shell}>
        <motion.header className={styles.originsIntro} style={{ y: peopleIntroY }}>
          <p className={styles.eyebrow}>Where our story began</p>
          <h2 id="people-title">A beginning among the tea gardens.</h2>
          <p>AFT Techno Trade grew from fresh-leaf relationships in the small tea-growing communities around Dikom and Lahowal.</p>
        </motion.header>

        <motion.div className={styles.originsFilm} style={{ clipPath: peopleMediaClip, y: peopleMediaY }}>
          <PeopleMontage variant="about" />
        </motion.div>

        <motion.div className={styles.originsNarrative} style={{ y: peopleCopyY }}>
          <div className={styles.originsBody}>
            <p>In 2018, that local experience moved into finished tea manufacturing at Nahorchukbari.</p>
            <p>The journey continues through tea making, specialty selections and commercial relationships rooted in Upper Assam.</p>
          </div>
          <aside className={styles.historicalNote} aria-label="Historical founding partners">
            <p className={styles.eyebrow}>Historical record</p>
            <p>Public reporting identifies {founders[0]}, {founders[1]} and {founders[2]} as partners associated with establishing the Nahorchukbari factory in Lahowal.</p>
            <small>Individual responsibilities and family relationships are not assigned without company confirmation.</small>
          </aside>
        </motion.div>

        <blockquote className={styles.originsClosing}>A story shaped by the people, knowledge and work behind every harvest.</blockquote>
      </div>
    </section>

    <section ref={landRef} className={styles.land} aria-labelledby="land-title">
      <motion.div className={styles.landMedia} style={{ y: landY, scale: landScale }}><CloudinaryImage src="/images/story/garden-shade.jpg" alt="Rows of tea bushes growing beneath tall shade trees in Upper Assam" fill quality={90} sizes="100vw" /></motion.div>
      <div className={styles.landShade} />
      <div className={styles.landInner}>
        <p className={styles.eyebrowLight}>Our home <span aria-hidden="true">&bull;</span> Upper Assam</p>
        <h2 id="land-title">The story starts with the leaf.</h2>
        <p>In and around Dikom, Lahowal and Dibrugarh, tea is part of the working landscape. AFT Techno Trade grew from that proximity: first through fresh-leaf relationships, then through the knowledge and infrastructure required to turn leaf into finished tea.</p>
        <div className={styles.placeLine}><span>Nahorchuk</span><span>Ekora Gaon</span><span>Dikom</span><span>Lahowal</span></div>
      </div>
    </section>

    <section ref={journeyRef} className={styles.journey} aria-labelledby="journey-title"><div className={styles.shell}>
      <div className={styles.splitHeading}><div><p className={styles.eyebrow}>Our journey</p><h2 id="journey-title">From fresh leaf to finished tea.</h2></div><p>Two documented milestones trace the company&apos;s start in manufacturing and a landmark moment for its specialty tea.</p></div>
      <div className={styles.timelineTrack}>
        <motion.span className={styles.timelineProgress} aria-hidden="true" style={{ scaleX: journeyLine }} />
        <ol className={styles.timeline}>
          {journeyMilestones.map((milestone, index) => <motion.li key={milestone.dateTime} initial={reducedMotion ? false : { opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.18 }} transition={{ duration: 0.48, delay: reducedMotion ? 0 : index * 0.08 }}>
            <time dateTime={milestone.dateTime}>{milestone.date}</time>
            <figure className={`${styles.timelinePhoto} ${milestone.image.hasTransparency ? styles.timelinePhotoProduct : ""}`}><CloudinaryImage src={milestone.image.src} alt={milestone.imageAlt} fill sizes="(max-width: 820px) 40vw, 22vw" quality={82} /></figure>
            <div className={styles.timelineCopy}><h3>{milestone.title}</h3><p>{milestone.description}</p></div>
          </motion.li>)}
        </ol>
      </div>
    </div></section>

    <section className={styles.processStory} aria-labelledby="craft-title"><div className={styles.shell}>
      <header className={styles.processHeading}><div><p className={styles.eyebrow}>The craft</p><h2 id="craft-title">From garden leaf to finished tea.</h2></div><p>Garden, leaf handling, tea granules and packaging: views of the work and material that shape AFT&apos;s tea making.</p></header>
      <div className={styles.processSequence}>
        {processFrames.map((frame, index) => <motion.figure key={frame.title} initial={reducedMotion ? false : { opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.18 }} transition={{ duration: 0.42, delay: reducedMotion ? 0 : (index % 3) * 0.07 }}>
          <div className={styles.processFrame}><CloudinaryImage src={frame.image.src} alt={frame.image.alt} fill sizes="(max-width: 560px) 44vw, (max-width: 900px) 46vw, 30vw" quality={82} style={{ objectPosition: frame.image.objectPosition ?? "center" }} /></div>
          <figcaption><span>{String(index + 1).padStart(2, "0")}</span><div><strong>{frame.title}</strong><p>{frame.caption}</p></div></figcaption>
        </motion.figure>)}
      </div>
      <div className={styles.processLinks}><p>Images show separate views of tea work; they do not document one continuous batch. The processing-inspection image is enhanced and its documentary provenance is unconfirmed.</p><Link href="/craft">Explore our craft <ArrowUpRight aria-hidden="true" size={15} /></Link></div>
    </div></section>

    <section ref={pearlRef} className={styles.pearl} aria-labelledby="pearl-title"><div className={styles.pearlInner}>
      <div className={styles.pearlCopy}><p className={styles.eyebrowGold}>Golden Pearl <span aria-hidden="true">&bull;</span> Historical auction</p><h2 id="pearl-title">One kilogram. One memorable milestone.</h2><p>On 14 February 2022, a one-kilogram Golden Pearl lot produced at Nahorchukbari in Lahowal sold to Assam Tea Traders at the Guwahati Tea Auction Centre. The result marked a distinctive moment in AFT&apos;s specialty-tea journey.</p><Link href="/teas/golden-pearl">Discover Golden Pearl <ArrowUpRight aria-hidden="true" size={16} /></Link></div>
      <motion.div className={styles.pearlFigure} style={{ y: priceY }}>
        <div className={styles.pearlJar}><CloudinaryImage src="/images/story/golden-pearl-jar.png" alt="Nahorchukbari Golden Pearl tea presentation jar" fill sizes="(max-width: 820px) 58vw, 300px" /></div>
        <div><small>One-kilogram auction sale</small><strong>&#8377;99,999</strong><span>per kilogram</span><p>14 February 2022<br />Guwahati Tea Auction Centre</p><em>Historical sale of one specialty lot, not a current retail price.</em></div>
      </motion.div>
    </div></section>

    <section className={styles.identities} aria-labelledby="identities-title"><div className={styles.shell}>
      <div className={styles.splitHeading}><div><p className={styles.eyebrow}>Tea for different preferences</p><h2 id="identities-title">Many styles. One Upper Assam foundation.</h2></div><p>The portfolio includes CTC, orthodox, premium Assam tea, green tea and dust tea, alongside consumer-facing blends and packs designed for different ways of enjoying tea.</p></div>
      <div className={styles.identityGrid}>
        <article className={styles.nahorchukbari}>
          <figure className={styles.identityPearlImage}><CloudinaryImage src={aftAssets.specialtyTeas.goldenPearlJar.src} alt={aftAssets.specialtyTeas.goldenPearlJar.alt} fill sizes="(max-width: 820px) 54vw, 20vw" quality={85} /></figure>
          <div className={styles.identityCopy}><span>Specialty tea identity</span><h3>Nahorchukbari</h3><p>Distinctive specialty selections and the Golden Pearl auction story.</p><Link href="/teas/golden-pearl">Explore Golden Pearl <ArrowUpRight aria-hidden="true" size={14} /></Link></div>
        </article>
        <article className={styles.ekoratoli}>
          <div className={styles.ekoratoliMedia}>
            <CloudinaryImage className={styles.ekoratoliTexture} src={aftAssets.teaLeavesAndTextures.ctcGranules.src} alt={aftAssets.teaLeavesAndTextures.ctcGranules.alt} fill sizes="(max-width: 820px) 100vw, 28vw" quality={82} />
            <div className={styles.ekoratoliTote}><CloudinaryImage src={aftAssets.brandCampaignAssets.ekoratoliTote.src} alt={aftAssets.brandCampaignAssets.ekoratoliTote.alt} fill sizes="(max-width: 820px) 35vw, 10vw" quality={85} /></div>
          </div>
          <div className={styles.identityCopy}><span>Commercial CTC identity</span><h3>Ekoratoli</h3><p>Assam CTC grades for everyday milk tea and commercial requirements.</p><Link href="/wholesale">Wholesale enquiries <ArrowUpRight aria-hidden="true" size={14} /></Link></div>
        </article>
        <article className={styles.ajanta}><CloudinaryImage src="/media/product-campaigns/AFT TEA COLLECTION.png" alt="Ajanta Tea Gold, Elaichi, High Societea and Kolkata Street Masala Chai packs" fill quality={90} sizes="(max-width: 900px) 100vw, 50vw" /><div><span>Consumer tea collection</span><h3>Ajanta Tea</h3><p>Packaged teas and aromatic blends for varied everyday preferences.</p><Link href="/teas">View the collection <ArrowUpRight aria-hidden="true" size={14} /></Link></div></article>
      </div>
    </div></section>

    <section className={styles.nextChapter} aria-labelledby="next-chapter-title"><div className={styles.shell}>
      <div className={styles.nextChapterLead}>
        <p className={styles.eyebrow}>The next chapter</p>
        <h2 id="next-chapter-title">Taking a local manufacturing story to a wider audience.</h2>
      </div>
      <div className={styles.nextChapterCopy}>
        <p>AFT Techno Trade&apos;s emerging consumer identity brings its manufacturing background into packaging, digital storytelling, retail presentation and more direct relationships with tea drinkers.</p>
        <p>The ambition is measured and practical: make the portfolio easier to understand, serve wholesale relationships professionally and let the company&apos;s Upper Assam roots remain visible as the market grows.</p>
        <Link href="/contact">Start a conversation <ArrowUpRight aria-hidden="true" size={15} /></Link>
      </div>
      <p className={styles.chapterStatement}>Built from experience. Carried forward with purpose.</p>
    </div></section>

    <section className={styles.cupStory} aria-labelledby="cup-story-title"><div className={styles.cupStoryInner}>
      <p className={styles.eyebrowGold}>The thought that connects it all</p>
      <h2 id="cup-story-title">Har Cup Mein Ek Kahani.</h2>
      <div className={styles.cupStoryCopy}><p>Every cup has a story.</p><p>A morning at home. A break between hours of work. A roadside conversation. A family gathering. Behind each of those moments is another journey: the land, the growers, the people who move the leaf, the hands that make the tea and the cup in which it is finally shared.</p></div>
    </div></section>

    <section className={styles.today} aria-labelledby="today-title"><div className={styles.shell}>
      <div className={styles.todayLead}><p className={styles.eyebrowGold}>AFT Techno Trade today</p><h2 id="today-title">Manufacturing knowledge, specialty ambition and commercial relationships.</h2><p>AFT works across tea manufacturing, commercial CTC grades, specialty selections, consumer collections and wholesale conversations, with its base in Upper Assam remaining central to the story.</p></div>
      <div className={styles.businessLinks}>{businessLinks.map(([title, text, href]) => <Link href={href} key={title}><span>{title}</span><p>{text}</p><ArrowUpRight aria-hidden="true" size={19} /></Link>)}</div>
    </div></section>

    <section className={styles.finalCta} aria-labelledby="about-cta-title"><div><p className={styles.eyebrowLight}>Continue the story</p><h2 id="about-cta-title">Find the tea for your next cup.</h2><p>Explore AFT&apos;s tea portfolio or begin a conversation about commercial requirements.</p><div className={styles.finalActions}><Link className={styles.lightButton} href="/teas">Explore Our Teas <ArrowUpRight aria-hidden="true" size={16} /></Link><Link className={styles.textLinkLight} href="/wholesale">Wholesale Enquiries <ArrowUpRight aria-hidden="true" size={16} /></Link></div></div></section>
  </div>;
}
