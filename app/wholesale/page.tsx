import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowRight, Mail, MapPin, Phone } from "lucide-react";
import { EnquiryForm } from "../../components/enquiry-form";
import { SiteFooter } from "../../components/site-footer";
import { SiteNavbar } from "../../components/site-navbar";
import { WholesaleEnquiryLink, WholesaleSupplyShowcase } from "../../components/wholesale-supply-showcase";
import { COMPANY_CONTACT } from "../../lib/company";
import styles from "./wholesale.module.css";

export const metadata: Metadata = {
  title: { absolute: "Wholesale Assam Tea & Bulk Supply | AFT Techno Trade" },
  description: "Explore wholesale Assam tea sourcing with AFT Techno Trade, including CTC grades, specialty tea, custom blending and private-label supply discussions from Upper Assam.",
  alternates: { canonical: "/wholesale" },
};

const workingPrinciples = [
  ["01", "Origin & Manufacturing", "From its operations in Upper Assam, AFT works across commercial tea processing and selected specialty production."],
  ["02", "Grading & Cupping", "Tea assessment considers appearance, infused leaf, liquor, body, aroma and finish to understand the character of a processed lot."],
  ["03", "Flexible Commercial Discussions", "Buyers can enquire about suitable grades, custom blending, packaging formats and trade arrangements based on their requirements."],
] as const;

const sourcingJourney = [
  ["01", "Tell us what you're looking for", "Share the tea type, grade, intended use, approximate quantity and destination."],
  ["02", "Review suitable options", "Discuss available grades, tea characteristics and relevant product or blending options with the AFT team."],
  ["03", "Align the commercial details", "Confirm applicable specifications, sampling arrangements where offered, packaging, pricing and supply terms."],
  ["04", "Finalise your requirements", "Once the necessary details are agreed, the team can discuss order confirmation and dispatch arrangements."],
] as const;

const buyerGroups = [
  ["01", "Wholesalers & Distributors", "Commercial Assam tea supply for regional and wider distribution networks.", "General Wholesale Enquiry"],
  ["02", "Packers & Private-Label Businesses", "Tea selections and blending discussions for businesses building or expanding their own range.", "Private Label / Bulk Packaging"],
  ["03", "Retailers & Tea Merchants", "Packaged and specialty tea enquiries for stores, independent merchants and dedicated tea businesses.", "Specialty / Orthodox Tea"],
  ["04", "Hospitality & Institutional Buyers", "Tea discussions for hospitality, food-service and institutional requirements.", "General Wholesale Enquiry"],
  ["05", "Tea Vendors & Beverage Businesses", "CTC grades and tea profiles suited to different preparation preferences and everyday chai applications.", "Commercial CTC"],
] as const;

const sensoryDimensions = ["Dry-leaf appearance", "Infused-leaf character", "Liquor", "Body", "Aroma & finish"];

const buyerFaqs = [
  ["Which Assam tea grades can I enquire about?", "Buyers can discuss commercial CTC grades such as BP, PF and PD, along with selected specialty and orthodox teas."],
  ["Can I discuss a custom tea blend?", "Yes. Specific formulations, feasibility and commercial terms are discussed directly with the AFT Techno Trade team."],
  ["Can I enquire about private-label tea?", "Yes. Available packaging, documentation, quantities and order terms require confirmation for each project."],
  ["What information should I include?", "Tea type, preferred grade, approximate quantity, intended use and delivery destination are useful starting details."],
] as const;

export default function WholesalePage() {
  return (
    <>
      <SiteNavbar />
      <main id="main" className={styles.page}>
        <section className={styles.hero} aria-labelledby="wholesale-hero-title">
          <div className={styles.heroRule} aria-hidden="true"><span>Origin</span><span>Portfolio</span><span>Quality</span><span>Partnership</span></div>
          <div className={styles.heroInner}>
            <div className={styles.heroCopy}>
              <p className={styles.heroEyebrow}>AFT Techno Trade · Wholesale &amp; Trade</p>
              <h1 id="wholesale-hero-title">Your next tea supply begins at the source.</h1>
              <p>Based in Dikom and Lahowal near Dibrugarh, AFT Techno Trade brings together Assam CTC manufacturing, specialty tea selections and commercial supply for businesses with distinct tea requirements.</p>
              <div className={styles.heroActions}>
                <a className={styles.primaryAction} href="#wholesale-enquiry">Discuss Your Requirements <ArrowDown size={16} /></a>
                <a className={styles.secondaryAction} href="#supply-options">Explore Supply Options <ArrowDown size={16} /></a>
              </div>
            </div>
            <div className={styles.heroLedger} aria-label="Available supply conversations include CTC grades, specialty tea, blending and private-label supply">
              <p>Assam tea · Commercial supply</p>
              <strong>BP <i>/</i> PF <i>/</i> PD</strong>
              <div><span>Commercial CTC</span><span>Specialty &amp; orthodox</span><span>Custom blending</span><span>Private label</span></div>
            </div>
          </div>
          <p className={styles.heroFoot}>From robust commercial grades to carefully crafted specialty teas.</p>
        </section>

        <section className={styles.origin} aria-labelledby="origin-title">
          <div className={styles.shell}>
            <header className={styles.originHeading}>
              <p className={styles.eyebrow}>01 / Our sourcing foundation</p>
              <h2 id="origin-title">Good supply starts with knowing the source.</h2>
            </header>
            <div className={styles.originComposition}>
              <figure className={styles.originImage}>
                <Image src="/images/tea/assam-dawn.png" alt="Tea-growing landscape in Upper Assam" fill sizes="(max-width: 800px) 100vw, 70vw" />
                <figcaption><MapPin size={15} /> Upper Assam tea-growing region</figcaption>
              </figure>
              <div className={styles.originCopy}>
                <p>AFT Techno Trade operates in Dikom and Lahowal, within Upper Assam&apos;s established tea-growing region. Our proximity to the source connects tea manufacturing and processing with the practical needs of commercial buyers.</p>
                <p>From leaf intake to grading and cupping, understanding how a tea is made helps create clearer discussions around flavour, grade and intended use.</p>
              </div>
            </div>
            <div className={styles.originFacts}><span><b>2018</b>Established</span><span><b>Dikom · Lahowal</b>Upper Assam</span><span><b>CTC · Specialty</b>Tea selections</span></div>
          </div>
        </section>

        <WholesaleSupplyShowcase />

        <section className={styles.howWeWork} aria-labelledby="how-title">
          <div className={styles.shell}>
            <header className={styles.sectionLead}>
              <p className={styles.eyebrow}>03 / How we work</p>
              <h2 id="how-title">A sourcing conversation grounded in the details.</h2>
              <p>The right tea is not defined by its name alone. Grade, liquor, aroma, appearance, intended use and commercial requirements all influence the buying decision.</p>
            </header>
            <p className={styles.principleIntro}>AFT Techno Trade&apos;s manufacturing and cupping processes provide a practical foundation for discussing those details with trade buyers.</p>
            <div className={styles.principles}>
              {workingPrinciples.map(([number, title, text]) => <article key={number}><span>{number}</span><h3>{title}</h3><p>{text}</p></article>)}
            </div>
            <Link className={styles.textLink} href="/craft">Learn About Our Craft <ArrowRight size={16} /></Link>
          </div>
        </section>

        <section className={styles.journey} aria-labelledby="journey-title">
          <div className={styles.shell}>
            <header className={styles.journeyLead}>
              <p className={styles.eyebrowLight}>04 / Your sourcing journey</p>
              <h2 id="journey-title">A clear path from enquiry to supply.</h2>
              <p>Whether you&apos;re comparing CTC grades, sourcing a specialty lot or discussing a new blend, the first step is understanding what your business needs.</p>
            </header>
            <ol className={styles.journeySteps}>
              {sourcingJourney.map(([number, title, text]) => <li key={number}><span>{number}</span><div><h3>{title}</h3><p>{text}</p></div></li>)}
            </ol>
            <p className={styles.journeyNote}>Specifications, sampling arrangements, pricing, packaging and supply terms are confirmed through discussion; they are not automatically guaranteed by submitting an enquiry.</p>
          </div>
        </section>

        <section className={styles.buyers} aria-labelledby="buyers-title">
          <div className={styles.shell}>
            <header className={styles.buyersHeader}>
              <p className={styles.eyebrow}>05 / Who we serve</p>
              <h2 id="buyers-title">Different businesses. Different tea requirements.</h2>
              <p>AFT Techno Trade welcomes enquiries from established buyers and businesses developing their tea offering.</p>
            </header>
            <div className={styles.buyerDirectory}>
              {buyerGroups.map(([number, title, text, type]) => (
                <article key={number}><span>{number}</span><h3>{title}</h3><p>{text}</p><WholesaleEnquiryLink type={type} className={styles.directoryLink} aria-label={`Start an enquiry for ${title}`}><ArrowRight size={18} /></WholesaleEnquiryLink></article>
              ))}
            </div>
          </div>
        </section>

        <section className={styles.quality} aria-labelledby="quality-title">
          <div className={styles.shell}>
            <div className={styles.qualityLead}>
              <p className={styles.eyebrowGold}>06 / Tea character &amp; quality</p>
              <h2 id="quality-title">The details are in the leaf. And in the cup.</h2>
              <p>Tea buyers evaluate more than grade names. Leaf appearance, infused colour, liquor brightness, body, aroma and finish all contribute to understanding whether a tea suits its intended purpose.</p>
              <Link href="/craft">Explore Our Craft <ArrowRight size={16} /></Link>
            </div>
            <div className={styles.qualityAssessment}>
              <p>Assessment dimensions</p>
              {sensoryDimensions.map((dimension, index) => <div key={dimension}><span>0{index + 1}</span><strong>{dimension}</strong></div>)}
              <small>Grading and sensory cupping form part of AFT Techno Trade&apos;s described manufacturing approach.</small>
            </div>
          </div>
        </section>

        <section className={styles.enquiry} id="wholesale-enquiry" aria-labelledby="enquiry-title">
          <div className={styles.shell}>
            <div className={styles.enquiryIntro}>
              <p className={styles.eyebrow}>07 / Start a conversation</p>
              <h2 id="enquiry-title">Let&apos;s talk about your tea requirements.</h2>
              <p>Share the type of tea, the quantity you&apos;re considering and where it needs to go. The details you provide will help the AFT Techno Trade team understand your enquiry.</p>
              <div className={styles.directContact}>
                <a href={COMPANY_CONTACT.phoneHref}><Phone size={17} /><span><small>Call</small>{COMPANY_CONTACT.phone}</span></a>
                <a href={COMPANY_CONTACT.emailHref}><Mail size={17} /><span><small>Email</small>{COMPANY_CONTACT.email}</span></a>
              </div>
              <div className={styles.formNote}><strong>How this form works</strong><p>Your details are securely submitted to the AFT Techno Trade team for review. If delivery is unavailable, the form will say so clearly and you can use the direct phone or email links above.</p></div>
            </div>
            <div className={styles.enquiryFormPanel}>
              <div className={styles.formTopline}><span>Wholesale sourcing brief</span><span>Fields marked required</span></div>
              <EnquiryForm wholesale />
            </div>
          </div>
        </section>

        <section className={styles.faq} aria-labelledby="faq-title">
          <div className={styles.shell}>
            <header><p className={styles.eyebrow}>Buyer questions</p><h2 id="faq-title">Useful details before you enquire.</h2></header>
            <div className={styles.faqList}>{buyerFaqs.map(([question, answer]) => <details key={question}><summary>{question}<span>+</span></summary><p>{answer}</p></details>)}</div>
          </div>
        </section>

        <section className={styles.contactStrip} aria-label="Direct wholesale contact">
          <div className={styles.shell}><div><p>Prefer a direct conversation?</p><span>Speak with the AFT Techno Trade team about your sourcing requirements.</span></div><div className={styles.contactActions}><a href={COMPANY_CONTACT.phoneHref}><Phone size={16} />{COMPANY_CONTACT.phone}</a><a href={COMPANY_CONTACT.emailHref}><Mail size={16} />Email the team</a></div></div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
