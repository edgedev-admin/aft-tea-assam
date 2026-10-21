import type { Metadata } from "next";
import Link from "next/link";
import { ArrowDown, ArrowRight, Boxes, Leaf, MapPin, PackageCheck, Scale, ScanLine } from "lucide-react";
import { CraftProcessJourney } from "../../components/craft-process-journey";
import { SiteFooter } from "../../components/site-footer";
import { SiteNavbar } from "../../components/site-navbar";
import { CloudinaryImage } from "../../components/cloudinary-image";
import { cuppingCriteria } from "../../lib/craft-process";
import styles from "./craft.module.css";

export const metadata: Metadata = {
  title: { absolute: "Our Tea Craft & Manufacturing Process | AFT Techno Trade" },
  description: "Explore the tea-making process at AFT Techno Trade in Upper Assam, from leaf selection and withering to specialty tea, CTC processing, grading and cupping.",
  alternates: { canonical: "/craft" },
};

const finishingStages = [
  { number: "01", title: "Oxidation & flavour", text: "Oxidation is managed according to the tea style being made, contributing to colour, aroma and flavour development." },
  { number: "02", title: "Drying & stabilisation", text: "Drying arrests further change and helps stabilise the tea before it moves into finishing and evaluation." },
  { number: "03", title: "Sorting & grading", text: "The finished leaf is sorted by form and particle size so that each grade can be prepared for its intended use." },
];

const grades = [
  ["BP", "Broken Pekoe", "A broken-leaf CTC grade."],
  ["PF", "Pekoe Fannings", "A smaller, quick-infusing grade."],
  ["PD", "Pekoe Dust", "A fine CTC grade used for strong extraction."],
  ["ORTH", "Selected orthodox", "Whole-leaf and specialty classifications vary by tea."],
] as const;

export default function CraftPage() {
  return (
    <>
      <SiteNavbar />
      <main id="main" className={styles.page}>
        <section className={styles.hero} aria-labelledby="craft-hero-title">
          <CloudinaryImage className={styles.heroImage} src="/images/tea/assam-dawn.png" alt="Tea-growing landscape at dawn in Assam" fill sizes="100vw" preload />
          <div className={styles.heroShade} />
          <div className={styles.heroGrid} aria-hidden="true" />
          <div className={styles.heroInner}>
            <p className={styles.heroEyebrow}>Our Craft · AFT Techno Trade</p>
            <h1 id="craft-hero-title">Every leaf.<br />Every detail.</h1>
            <p className={styles.heroCopy}>From careful leaf selection to processing, grading and tasting, our work brings together the craft of specialty tea and the discipline of Assam CTC manufacturing.</p>
            <Link className={styles.heroAction} href="#process">Explore Our Process <ArrowDown size={16} /></Link>
          </div>
          <p className={styles.heroLocation}><MapPin size={15} /> Dikom &amp; Lahowal · Upper Assam</p>
        </section>

        <section className={styles.origin} aria-labelledby="origin-title">
          <div className={styles.shell}>
            <div className={styles.originGrid}>
              <header className={styles.originHeading}>
                <p className={styles.eyebrow}>01 / Close to the source</p>
                <h2 id="origin-title">Where good tea begins.</h2>
              </header>
              <div className={styles.originCopy}>
                <p>In Dikom and Lahowal, near Dibrugarh, AFT Techno Trade works within one of Assam&apos;s established tea-growing regions. This connection to the source informs how fresh leaf is received, inspected and prepared for processing.</p>
                <p>The journey to a finished cup begins long before the tea reaches a packet. Leaf condition, handling and timely processing help shape what comes next.</p>
              </div>
            </div>
            <div className={styles.placePanel}>
              <div className={styles.placeMark} aria-hidden="true"><MapPin strokeWidth={1.2} /></div>
              <p>Tea country</p>
              <strong>Upper Assam</strong>
              <div className={styles.placeDetails}><span>Dikom</span><span>Lahowal</span><span>Dibrugarh district</span></div>
            </div>
          </div>
        </section>

        <CraftProcessJourney />

        <section className={styles.paths} aria-labelledby="paths-title">
          <header className={styles.pathsHeader}>
            <p className={styles.eyebrow}>Two processing paths</p>
            <h2 id="paths-title">Different methods. Distinctive cups.</h2>
            <p>The character of a tea is shaped partly by how its leaves are processed. AFT Techno Trade&apos;s portfolio brings together carefully handled specialty selections and the strength of commercial Assam CTC.</p>
          </header>
          <div className={styles.pathsGrid}>
            <article className={styles.specialtyPath}>
              <div className={styles.pathTopline}><span>Nahorchukbari</span><Leaf size={20} /></div>
              <p className={styles.pathIndex}>Path 01 / Specialty tea</p>
              <h3>Craft that preserves the leaf.</h3>
              <p>For selected specialty offerings, gentle leaf handling, careful rolling and controlled processing help preserve delicate leaf structure and develop distinctive aromatic character.</p>
              <ul><li>Selective leaf handling</li><li>Careful rolling</li><li>Whole-leaf and golden-tip selections</li><li>Small-batch specialty craftsmanship</li></ul>
              <Link href="/teas#nahorchukbari">Explore Specialty Teas <ArrowRight size={16} /></Link>
            </article>
            <article className={styles.ctcPath}>
              <div className={styles.pathTopline}><span>Ekoratoli</span><Boxes size={20} /></div>
              <p className={styles.pathIndex}>Path 02 / CTC tea</p>
              <h3>Precision for a stronger cup.</h3>
              <p>CTC, or Crush, Tear, Curl, processing transforms prepared leaves into compact granules. The method supports brisk extraction and the full-bodied liquor associated with traditional Assam chai.</p>
              <ul><li>CTC processing</li><li>Commercial grading</li><li>Brisk liquor</li><li>Traditional milk-tea applications</li></ul>
              <Link href="/teas#ekoratoli">Explore CTC Teas <ArrowRight size={16} /></Link>
            </article>
          </div>
        </section>

        <section className={styles.finishing} aria-labelledby="finishing-title">
          <div className={styles.shell}>
            <header className={styles.sectionLead}>
              <p className={styles.eyebrow}>Finishing the leaf</p>
              <h2 id="finishing-title">The details that shape the finished tea.</h2>
              <p>Colour, aroma, leaf form and liquor character are influenced by the decisions made throughout processing. Once the required tea style has been achieved, sorting and grading prepare the finished tea for its intended use.</p>
            </header>
            <div className={styles.finishingSequence}>
              {finishingStages.map((stage) => <article key={stage.number}><span>{stage.number}</span><h3>{stage.title}</h3><p>{stage.text}</p></article>)}
            </div>
            <div className={styles.gradeGuide} aria-labelledby="grade-guide-title">
              <div className={styles.gradeIntro}><Scale size={22} /><p className={styles.eyebrow}>A compact grade guide</p><h3 id="grade-guide-title">Form follows purpose.</h3></div>
              <div className={styles.gradeRows}>
                {grades.map(([short, name, text]) => <article key={short}><strong>{short}</strong><h4>{name}</h4><p>{text}</p></article>)}
              </div>
            </div>
          </div>
        </section>

        <section className={styles.cupping} aria-labelledby="cupping-title">
          <div className={styles.shell}>
            <div className={styles.cuppingLayout}>
              <header className={styles.cuppingLead}>
                <p className={styles.eyebrowLight}>The cup is the final test</p>
                <h2 id="cupping-title">The cup tells us what the leaf has become.</h2>
                <p>Before tea is prepared for supply, representative samples are evaluated for appearance, liquor and sensory character. Cupping helps connect the decisions made during processing with the experience of brewing and drinking the tea.</p>
              </header>
              <div className={styles.cuppingCriteria}>
                {cuppingCriteria.map(([number, title, text]) => <article key={number}><span>{number}</span><div><h3>{title}</h3><p>{text}</p></div><ScanLine size={20} aria-hidden="true" /></article>)}
              </div>
            </div>
          </div>
        </section>

        <section className={styles.supply} aria-labelledby="supply-title">
          <div className={styles.shell}>
            <header className={styles.supplyLead}><p className={styles.eyebrow}>Beyond the factory floor</p><h2 id="supply-title">Made with care. Prepared for the journey.</h2></header>
            <div className={styles.supplyBody}>
              <p>Processing is only part of the journey. Finished teas are graded, prepared and packed according to their intended retail or commercial requirements, helping preserve their character as they move toward the people and businesses they serve.</p>
              <p>AFT Techno Trade works with wholesale buyers, retailers and other tea businesses on documented supply and blending requirements.</p>
              <Link href="/wholesale">Explore wholesale supply <ArrowRight size={16} /></Link>
            </div>
            <div className={styles.supplyLine}><span><PackageCheck size={18} /> Evaluated</span><span><Scale size={18} /> Graded</span><span><Boxes size={18} /> Prepared for supply</span></div>
          </div>
        </section>

        <section className={styles.finalCta} aria-labelledby="craft-cta-title">
          <div>
            <p className={styles.eyebrowGold}>Start a conversation</p>
            <h2 id="craft-cta-title">Let&apos;s find the tea that fits your brief.</h2>
            <p>Looking for a particular Assam CTC grade, a specialty selection or a custom tea requirement? Tell us what you&apos;re sourcing, and start a conversation with the AFT Techno Trade team.</p>
            <div className={styles.ctaActions}><Link className={styles.primaryCta} href="/wholesale">Discuss Your Requirements <ArrowRight size={16} /></Link><Link className={styles.secondaryCta} href="/teas">Explore Our Teas <ArrowRight size={16} /></Link></div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
