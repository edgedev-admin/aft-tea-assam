import type { Metadata } from "next";
import { pageMetadata } from "../../lib/seo";
import Link from "next/link";
import { getImageProps } from "next/image";
import { ArrowDown, ArrowRight, Mail, MapPin, Phone } from "lucide-react";
import { EnquiryForm } from "../../components/enquiry-form";
import { SiteFooter } from "../../components/site-footer";
import { SiteNavbar } from "../../components/site-navbar";
import { CloudinaryImage } from "../../components/cloudinary-image";
import { WholesaleEnquiryLink, WholesaleSupplyShowcase } from "../../components/wholesale-supply-showcase";
import { businessContacts, COMPANY_CONTACT, phoneHref } from "../../lib/company";
import { WhatsAppAction, WhatsAppContactLink } from "../../components/whatsapp-action";
import { aftAssets } from "../../lib/media/aft-assets";
import styles from "./wholesale.module.css";

export const metadata: Metadata = pageMetadata({
  title: "Wholesale Assam Tea & Bulk Supply | AFT Techno Trade",
  description: "Discuss Assam CTC grades, specialty tea, custom blending and private-label supply with AFT Techno Trade, based in Upper Assam.",
  path: "/wholesale",
});

const sourcingJourney = [
  ["01", "Tell us what you need", "Share your tea category, intended application, estimated quantity and delivery destination."],
  ["02", "Review suitable options", "Discuss available grades, characteristics and relevant tea or blending options with our team."],
  ["03", "Confirm the commercial details", "Review applicable specifications, pricing, sampling possibilities, quantities and packaging requirements."],
  ["04", "Agree on the next steps", "Once the relevant terms are confirmed, proceed with agreed documentation, preparation and dispatch arrangements."],
] as const;

const buyerGroups = [
  ["01", "Wholesalers & distributors", "Commercial Assam tea for regional and wider distribution enquiries.", "General Wholesale Enquiry"],
  ["02", "Packers & private-label businesses", "Tea selections and blending discussions for businesses developing their own range.", "Private Label / Bulk Packaging"],
  ["03", "Retailers & tea merchants", "Packaged and specialty tea enquiries for stores and independent merchants.", "Specialty / Orthodox Tea"],
  ["04", "Hospitality & institutional buyers", "Tea discussions for hospitality, food-service and institutional requirements.", "General Wholesale Enquiry"],
  ["05", "Tea vendors & beverage businesses", "CTC grades and tea profiles for everyday chai applications.", "Commercial CTC"],
] as const;

const sensoryDimensions = ["Dry-leaf appearance", "Infused-leaf character", "Liquor", "Body", "Aroma & finish"];

const buyerFaqs = [
  ["Which Assam tea grades can I enquire about?", "You can ask about documented commercial CTC selections such as BP, PF and PD, along with other suitable CTC, specialty or orthodox options. Current availability is confirmed individually."],
  ["Can I discuss a custom tea blend?", "Yes. Share the cup profile, application and market you have in mind. Feasibility, formulation options and commercial terms are reviewed for each enquiry."],
  ["Can I enquire about private-label or bulk supply?", "Yes. Include your packaging preference and approximate quantity. Packaging formats, documentation, quantities and supply terms require project-specific confirmation."],
  ["What information should I include for a quote?", "Tea category or grade, intended application, approximate quantity and destination are useful starting details. You may include packaging needs or a target cup profile too."],
  ["Can I request samples?", "Sampling possibilities depend on the tea and current availability. Please include your requirements so the team can confirm what may be arranged."],
  ["What are your minimum quantities and delivery times?", "Minimum quantities, lead times and dispatch arrangements are confirmed individually after the tea, destination and commercial requirements are understood."],
] as const;

export default function WholesalePage() {
  const mobileHero = aftAssets.manufacturingAndQuality.packagingLineMobile;
  const desktopHero = aftAssets.manufacturingAndQuality.packagingLine;
  const mobileHeroProps = getImageProps({ src: mobileHero.src, alt: mobileHero.alt, width: mobileHero.width, height: mobileHero.height, quality: 90, sizes: "100vw" }).props;
  const desktopHeroProps = getImageProps({ src: desktopHero.src, alt: desktopHero.alt, width: desktopHero.width, height: desktopHero.height, quality: 90, sizes: "100vw" }).props;
  return (
    <>
      <SiteNavbar />
      <main id="main" className={styles.page}>
        <section className={styles.hero} aria-labelledby="wholesale-hero-title">
          <link rel="preload" as="image" media="(max-width: 520px)" imageSrcSet={mobileHeroProps.srcSet} imageSizes="100vw" fetchPriority="high" />
          <link rel="preload" as="image" media="(min-width: 521px)" imageSrcSet={desktopHeroProps.srcSet} imageSizes="100vw" fetchPriority="high" />
          <div className={`${styles.shell} ${styles.heroInner}`}>
            <div className={styles.heroCopy}>
              <p className={styles.heroEyebrow}>Wholesale &amp; business supply <span>Upper Assam</span></p>
              <h1 id="wholesale-hero-title">Assam tea.<br /><em>Built around</em><br />your business.</h1>
              <p className={styles.heroDescription}>From commercial CTC grades to specialty tea selections, AFT Techno Trade works with professional buyers to explore tea requirements, blending options and supply opportunities from Upper Assam.</p>
              <div className={styles.heroActions}>
                <a className={styles.primaryAction} href="#wholesale-enquiry">Discuss Your Requirements <ArrowDown size={16} /></a>
                <a className={styles.secondaryAction} href="#supply-options">Explore Supply Options <ArrowDown size={16} /></a>
              </div>
              <p className={styles.heroFoot}><span>01</span> A sourcing conversation that starts with your brief.</p>
            </div>
          </div>
          <figure className={styles.heroMedia}>
            <picture><source media="(max-width: 520px)" srcSet={mobileHeroProps.srcSet} sizes="100vw" /><CloudinaryImage src={desktopHero.src} alt={desktopHero.alt} fill loading="eager" fetchPriority="high" quality={90} sizes="100vw" style={{ objectPosition: desktopHero.objectPosition }} /></picture>
            <figcaption><span>Tea, prepared for its next journey</span><span>Dikom · Lahowal</span></figcaption>
            <span className={styles.heroMediaIndex} aria-hidden="true">AFT / 01</span>
          </figure>
        </section>

        <section className={styles.origin} aria-labelledby="origin-title">
          <div className={styles.shell}>
            <header className={styles.originHeading}>
              <p className={styles.eyebrow}>01 / Our sourcing foundation</p>
              <div><h2 id="origin-title">Closer to the leaf.<br /><em>Clearer about supply.</em></h2><p>Based in the Dikom and Lahowal area of Dibrugarh, AFT Techno Trade draws on Assam&apos;s tea-growing and manufacturing environment to discuss practical sourcing requirements with business buyers.</p></div>
            </header>
            <div className={styles.originComposition}>
              <figure className={styles.originImage}>
                <CloudinaryImage src={aftAssets.teaGardens.aerialGarden.src} alt={aftAssets.teaGardens.aerialGarden.alt} fill quality={90} sizes="(max-width: 820px) 100vw, 72vw" style={{ objectPosition: aftAssets.teaGardens.aerialGarden.objectPosition }} />
                <figcaption><MapPin size={15} /> Dikom · Lahowal · Upper Assam</figcaption>
              </figure>
              <aside className={styles.originNote}><span>Rooted in place</span><p>AFT Techno Trade was established in 2018. Its work brings commercial tea and specialty selections into one practical conversation with buyers.</p><Link href="/about">The AFT story <ArrowRight size={15} /></Link></aside>
            </div>
            <div className={styles.originFacts} aria-label="AFT Techno Trade at a glance"><span><b>2018</b>Established</span><span><b>Dikom · Lahowal</b>Upper Assam</span><span><b>CTC · Specialty</b>Tea conversations</span></div>
          </div>
        </section>

        <WholesaleSupplyShowcase />

        <section className={styles.journey} aria-labelledby="journey-title">
          <div className={styles.shell}>
            <header className={styles.journeyLead}>
              <p className={styles.eyebrowLight}>03 / Your sourcing journey</p>
              <h2 id="journey-title">A clear process.<br /><em>Built around your requirements.</em></h2>
              <p>Start with the tea and market you have in mind. The details are worked through with you, one decision at a time.</p>
            </header>
            <ol className={styles.journeySteps}>
              {sourcingJourney.map(([number, title, text]) => <li key={number}><span>{number}</span><div><h3>{title}</h3><p>{text}</p></div></li>)}
            </ol>
            <p className={styles.journeyNote}>Availability, prices, samples, lead times, minimum quantities and dispatch arrangements are confirmed individually; they are not guaranteed by this website.</p>
          </div>
        </section>

        <section className={styles.buyers} aria-labelledby="buyers-title">
          <div className={styles.shell}>
            <header className={styles.buyersHeader}>
              <p className={styles.eyebrow}>04 / Who we work with</p>
              <h2 id="buyers-title">Different businesses.<br /><em>Different tea requirements.</em></h2>
              <p>Enquiries are welcome from professional buyers at different stages of building their tea supply.</p>
            </header>
            <div className={styles.buyerDirectory}>
              {buyerGroups.map(([number, title, text, type]) => <article key={number}><span>{number}</span><h3>{title}</h3><p>{text}</p><WholesaleEnquiryLink type={type} className={styles.directoryLink} aria-label={`Start an enquiry for ${title}`}><ArrowRight size={18} /></WholesaleEnquiryLink></article>)}
            </div>
          </div>
        </section>

        <section className={styles.quality} aria-labelledby="quality-title">
          <div className={`${styles.shell} ${styles.qualityLayout}`}>
            <figure className={styles.qualityImage}>
              <CloudinaryImage src={aftAssets.teaLeavesAndTextures.macroGranules.src} alt={aftAssets.teaLeavesAndTextures.macroGranules.alt} fill quality={90} sizes="(max-width: 820px) 100vw, 45vw" />
              <figcaption>Tea texture · a close view of dry granules</figcaption>
            </figure>
            <div className={styles.qualityContent}>
              <p className={styles.eyebrowGold}>05 / Tea character &amp; quality</p>
              <h2 id="quality-title">Quality is understood in the leaf and the cup.</h2>
              <p>Beyond the grade name, tea is considered through its dry-leaf appearance, infused-leaf character, liquor, body, aroma and finish. These qualities help buyers discuss the profile that suits their intended market.</p>
              <div className={styles.qualityAssessment} aria-label="Tea assessment dimensions">{sensoryDimensions.map((dimension, index) => <div key={dimension}><span>0{index + 1}</span><strong>{dimension}</strong></div>)}</div>
              <Link href="/craft">Explore Our Craft <ArrowRight size={16} /></Link>
            </div>
          </div>
        </section>

        <section className={styles.enquiry} id="wholesale-enquiry" aria-labelledby="enquiry-title">
          <div className={`${styles.shell} ${styles.enquiryLayout}`}>
            <div className={styles.enquiryIntro}>
              <p className={styles.eyebrow}>06 / Start a conversation</p>
              <h2 id="enquiry-title">Tell us what your business needs.</h2>
              <p>Share your preferred tea type, approximate quantity and destination. Our team can review the details and respond about suitable next steps.</p>
              <div className={styles.directContact}>
                {businessContacts.map((contact) => <div className={styles.phoneRow} key={contact.id}><a href={phoneHref(contact)}><Phone size={17} /><span><small>{contact.label}</small>{contact.display}</span></a><WhatsAppContactLink contact={contact} /></div>)}
                <a className={styles.contactEmail} href={COMPANY_CONTACT.emailHref}><Mail size={17} /><span><small>Email</small>{COMPANY_CONTACT.email}</span></a>
              </div>
              <WhatsAppAction className={styles.whatsappAction} />
              <div className={styles.formNote}><strong>How this form works</strong><p>Your details are securely submitted to the AFT Techno Trade team for review. If online sending is unavailable, use the phone or email links above.</p></div>
            </div>
            <div className={styles.enquiryFormPanel} id="enquiry-form-panel">
              <div className={styles.formTopline}><span>Wholesale sourcing brief</span><span>Fields marked required</span></div>
              <EnquiryForm wholesale />
            </div>
          </div>
        </section>

        <section className={styles.faq} aria-labelledby="faq-title">
          <div className={`${styles.shell} ${styles.faqLayout}`}>
            <header><p className={styles.eyebrow}>Buyer questions</p><h2 id="faq-title">Useful details before you enquire.</h2><p>Each supply conversation is specific to the tea and your business requirements.</p></header>
            <div className={styles.faqList}>{buyerFaqs.map(([question, answer]) => <details key={question}><summary>{question}<span aria-hidden="true">+</span></summary><p>{answer}</p></details>)}</div>
          </div>
        </section>

        <section className={styles.contactStrip} aria-label="Direct wholesale contact">
          <div className={`${styles.shell} ${styles.contactInner}`}><div><p>Prefer a direct conversation?</p><span>Speak with the AFT Techno Trade team about your sourcing requirements.</span></div><div className={styles.contactActions}>{businessContacts.map((contact) => <a key={contact.id} href={phoneHref(contact)}><Phone size={16} />{contact.display}</a>)}<a href={COMPANY_CONTACT.emailHref}><Mail size={16} />Email the team</a></div></div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
