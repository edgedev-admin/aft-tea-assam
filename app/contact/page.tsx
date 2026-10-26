import type { Metadata } from "next";
import { pageMetadata } from "../../lib/seo";
import { ArrowDown, ArrowUpRight, Mail, MapPin, Phone } from "lucide-react";
import { FaFacebookF, FaInstagram, FaXTwitter } from "react-icons/fa6";
import { ContactFaq } from "../../components/contact-faq";
import { EnquiryForm } from "../../components/enquiry-form";
import { SiteFooter } from "../../components/site-footer";
import { SiteNavbar } from "../../components/site-navbar";
import { businessContacts, COMPANY_CONTACT, phoneHref } from "../../lib/company";
import { WhatsAppAction, WhatsAppContactLink } from "../../components/whatsapp-action";
import { getProduct } from "../../lib/products";
import styles from "./contact.module.css";
import "./contact-contrast.css";

export const metadata: Metadata = pageMetadata({
  title: "Contact AFT Techno Trade | Tea Enquiries & Wholesale Supply",
  description: "Contact AFT Techno Trade in Upper Assam for tea collection enquiries, commercial Assam CTC supply, specialty tea, custom blending and wholesale discussions.",
  path: "/contact",
});

export default async function ContactPage({ searchParams }: { searchParams: Promise<{ product?: string }> }) {
  const requestedProduct = (await searchParams).product;
  const product = typeof requestedProduct === "string" ? getProduct(requestedProduct) : undefined;
  return <>
    <SiteNavbar />
    <main id="main" className={`${styles.page} aft-contact-2-page`}>
      <section className={styles.hero} aria-labelledby="contact-title">
        <div className={styles.heroCopy}>
          <p className={styles.eyebrow}>Contact AFT Techno Trade</p>
          <h1 id="contact-title">Good tea begins with a conversation.</h1>
          <p className={styles.intro}>Whether you&apos;re exploring our tea collections, sourcing Assam tea for your business or looking for a specific blend, we&apos;re here to hear what you have in mind.</p>
          <p className={styles.location}><MapPin size={17} aria-hidden="true" />Based in Dikom and Lahowal, near Dibrugarh, Upper Assam.</p>
          <a className={styles.formJump} href="#enquiry-form">Start your enquiry <ArrowDown size={16} aria-hidden="true" /></a>
        </div>

        <div className={styles.formPanel} id="enquiry-form">
          <div className={styles.formHeading}>
            <div><span>Enquiry form</span><span>Fields marked required</span></div>
            <h2>Tell us what you&apos;re looking for.</h2>
            <p>Share a few details about your enquiry, and the AFT Techno Trade team can follow up with you.</p>
          </div>
          <EnquiryForm variant="contact" defaultType={product ? "Tea Collection / Product Enquiry" : ""} productContext={product?.name} />
        </div>
      </section>

      <section className={styles.contactBand} aria-labelledby="direct-contact-title">
        <div className={styles.sectionShell}>
          <div className={styles.contactIntro}>
            <h2 id="direct-contact-title">A straightforward way to get in touch.</h2>
            <p>Share your enquiry, tell us about the tea you&apos;re interested in, and include any relevant business requirements. This helps our team understand the conversation before following up.</p>
            <WhatsAppAction className={styles.whatsappAction} productName={product?.name} />
          </div>
          <address className={styles.contactDetails}>
            {businessContacts.map((contact) => <div className={styles.phoneRow} key={contact.id}><a className={styles.phoneNumber} href={phoneHref(contact)}><Phone size={18} aria-hidden="true" /><span><small>{contact.label}</small>{contact.display}</span></a><WhatsAppContactLink contact={contact} productName={product?.name} /></div>)}
            <a className={styles.contactEmail} href={COMPANY_CONTACT.emailHref}><Mail size={18} aria-hidden="true" /><span><small>Email</small>{COMPANY_CONTACT.email}</span><ArrowUpRight size={16} aria-hidden="true" /></a>
            <div><MapPin size={18} aria-hidden="true" /><span><small>Location</small>Dikom &amp; Lahowal, near Dibrugarh Airport<br />Dibrugarh, Assam, India, 786010</span></div>
          </address>
          <div className={styles.socials} aria-label="AFT Tea India social channels">
            <span>Follow AFT Tea India</span>
            <a href="https://www.instagram.com/aftteaindia/" target="_blank" rel="noopener noreferrer" aria-label="AFT Tea India on Instagram"><FaInstagram aria-hidden="true" /></a>
            <a href="https://www.facebook.com/AFTTeaIndia" target="_blank" rel="noopener noreferrer" aria-label="AFT Tea India on Facebook"><FaFacebookF aria-hidden="true" /></a>
            <a href="https://x.com/AFTTeaIndia" target="_blank" rel="noopener noreferrer" aria-label="AFT Tea India on X"><FaXTwitter aria-hidden="true" /></a>
          </div>
        </div>
      </section>

      <section className={styles.faq} aria-labelledby="contact-faq-title">
        <div className={styles.sectionShell}>
          <header>
            <h2 id="contact-faq-title">Useful details before you write.</h2>
            <p>Short answers about enquiries, supply conversations and contacting the AFT team.</p>
          </header>
          <ContactFaq />
        </div>
      </section>
    </main>
    <SiteFooter productName={product?.name} />
  </>;
}
