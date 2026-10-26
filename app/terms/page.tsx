import type { Metadata } from "next";
import { pageMetadata } from "../../lib/seo";
import { FileCheck2 } from "lucide-react";
import { SiteFooter } from "../../components/site-footer";
import { SiteNavbar } from "../../components/site-navbar";
import { COMPANY_CONTACT } from "../../lib/company";
import "../legal.css";

export const metadata: Metadata = pageMetadata({
  title: "Terms of Use",
  description: "Draft terms governing use of the AFT Techno Trade informational and enquiry website.",
  path: "/terms",
  index: false,
});

export default function TermsPage() {
  return <div className="legal-page">
    <SiteNavbar />
    <main id="main" className="legal-main">
      <p className="legal-kicker">Website information</p>
      <h1>Terms of Use</h1>
      <p className="legal-intro">These terms are intended to govern use of the AFT Techno Trade informational and business enquiry website.</p>
      <div className="legal-status"><FileCheck2 size={20} aria-hidden="true"/><span><strong>Draft for company and legal approval.</strong> These terms are not presented as approved legal advice and must be reviewed before production publication.</span></div>

      <div className="legal-content">
        <section><h2>About the website</h2><div className="legal-copy"><p>This website provides information about AFT Techno Trade, its tea-related activities, product families and potential business supply services. It also provides ways to contact the company and submit enquiries.</p><p>The site does not currently provide an online checkout, accept payment or automatically create a sale contract.</p></div></section>

        <section><h2>Enquiries and orders</h2><div className="legal-copy"><p>Submitting a form, requesting a quotation or viewing a product does not guarantee availability and does not create a confirmed order, binding quotation or commercial offer. Product specifications, samples, quantities, packaging, pricing, taxes, delivery, documentation and other terms must be confirmed directly in writing by authorised representatives.</p></div></section>

        <section><h2>Product information</h2><div className="legal-copy"><p>Tea appearance, harvest characteristics, availability and packaging may vary by lot, season and approved supply format. Photographs are presented for identification or editorial context and may not show every current pack, grade or serving result. Historical Golden Pearl auction information is not a current retail price or a promise about future lots.</p><p>AFT Techno Trade should correct material errors brought to its attention, but website content should not be used as a substitute for the specifications and documents agreed for a particular transaction.</p></div></section>

        <section><h2>Permitted use</h2><div className="legal-copy"><p>You may browse the website and use its enquiry features for lawful personal or business purposes. You must not interfere with the service, attempt unauthorised access, submit malicious or misleading content, automate abusive submissions, impersonate another person, or use website material in a way that infringes rights or law.</p></div></section>

        <section><h2>Intellectual property</h2><div className="legal-copy"><p>Unless otherwise indicated, website text, presentation, brand elements and original media are intended to remain the property of AFT Techno Trade or their respective rights holders. No licence to reproduce packaging, logos, photographs, video, marketing material or substantial website content is granted merely by making the site available.</p><p>Third-party names, platforms and materials remain subject to their owners&apos; rights. AFT Techno Trade must retain records confirming permission for all commercial website media and bundled fonts.</p></div></section>

        <section><h2>External services and links</h2><div className="legal-copy"><p>The website links to social networks, reporting and service providers that AFT Techno Trade does not control. Their availability, security, content and privacy practices are governed by their own terms. A link does not necessarily amount to endorsement of every statement or service on an external site.</p></div></section>

        <section><h2>Availability and liability</h2><div className="legal-copy"><p>AFT Techno Trade may update, suspend or withdraw website content and features. The company does not promise uninterrupted or error-free access. To the extent permitted by applicable law, AFT Techno Trade is not responsible for indirect loss arising solely from reliance on general website information or from third-party services. Nothing in these terms excludes responsibility that cannot lawfully be excluded.</p></div></section>

        <section><h2>Contact and changes</h2><div className="legal-copy"><p>Questions about these terms may be sent to <a href={COMPANY_CONTACT.emailHref}>{COMPANY_CONTACT.email}</a> or raised by calling <a href={COMPANY_CONTACT.phoneHref}>{COMPANY_CONTACT.phone}</a>.</p><p>Material changes should be published on this page with a revised date. The company and its legal adviser should confirm governing-law, dispute and formal-notice provisions before production approval.</p></div></section>
      </div>
      <p className="legal-updated">Draft last reviewed: 20 October 2026.</p>
    </main>
    <SiteFooter />
  </div>;
}
