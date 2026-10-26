import type { Metadata } from "next";
import { pageMetadata } from "../../lib/seo";
import { ShieldCheck } from "lucide-react";
import { SiteFooter } from "../../components/site-footer";
import { SiteNavbar } from "../../components/site-navbar";
import { COMPANY_CONTACT } from "../../lib/company";
import "../legal.css";

export const metadata: Metadata = pageMetadata({
  title: "Privacy Notice",
  description: "Draft privacy notice describing how AFT Techno Trade handles website enquiries.",
  path: "/privacy",
  index: false,
});

export default function PrivacyPage() {
  return <div className="legal-page">
    <SiteNavbar />
    <main id="main" className="legal-main">
      <p className="legal-kicker">Website information</p>
      <h1>Privacy Notice</h1>
      <p className="legal-intro">This notice explains how AFT Techno Trade handles personal information submitted through this website and its business enquiry forms.</p>
      <div className="legal-status"><ShieldCheck size={20} aria-hidden="true"/><span><strong>Draft for company and legal approval.</strong> This document reflects the website&apos;s current implementation but is not presented as legal certification or professional legal advice.</span></div>

      <div className="legal-content">
        <section><h2>Who operates this site</h2><div className="legal-copy"><p>AFT Techno Trade operates this website from Dikom and Lahowal in the Dibrugarh area of Assam, India. Privacy questions may be sent to <a href={COMPANY_CONTACT.emailHref}>{COMPANY_CONTACT.email}</a> or raised by calling <a href={COMPANY_CONTACT.phoneHref}>{COMPANY_CONTACT.phone}</a>.</p></div></section>

        <section><h2>Information collected</h2><div className="legal-copy"><p>When you send an enquiry, the form collects your name, email address, enquiry category and message. Depending on the enquiry, you may also provide a phone number, business or organisation name, approximate quantity, delivery destination and product context.</p><p>The service also processes limited technical data needed to operate and protect the form, such as submission timing, an idempotency identifier, request origin and network information made available by the hosting platform.</p></div></section>

        <section><h2>How it is used</h2><div className="legal-copy"><ul><li>To review, route and respond to your enquiry.</li><li>To discuss requested products, samples, wholesale requirements or other business matters.</li><li>To prevent spam, repeated delivery and misuse of the enquiry service.</li><li>To maintain correspondence and records needed for business, security or legal purposes.</li></ul><p>Sending an enquiry does not subscribe you to a newsletter or marketing list. AFT Techno Trade should obtain separate permission before using enquiry details for unrelated promotional messaging.</p></div></section>

        <section><h2>Service providers</h2><div className="legal-copy"><p>The website is intended to be hosted on Vercel. Enquiry emails are sent through Resend to AFT Techno Trade&apos;s business inbox, currently provided through Google&apos;s Gmail service. These providers process information on AFT Techno Trade&apos;s behalf under their own service and data-processing terms.</p><p>Depending on provider infrastructure and contractual arrangements, information may be processed or stored outside India. AFT Techno Trade must confirm the applicable provider terms and cross-border arrangements before production approval.</p></div></section>

        <section><h2>Storage and retention</h2><div className="legal-copy"><p>The website does not intentionally store enquiry messages in its own application database. Information may remain in Resend delivery records, hosting and security logs, and the recipient email inbox.</p><p>No fixed company retention period has been approved for this website. Information should be kept only for as long as reasonably needed to handle the enquiry, maintain necessary business or legal records, resolve disputes and protect the service. AFT Techno Trade must approve and implement a documented retention and deletion schedule.</p></div></section>

        <section><h2>Cookies and analytics</h2><div className="legal-copy"><p>The audited website code does not install optional analytics, advertising pixels or marketing cookies. The hosting platform may still create security, delivery and access logs needed to operate the service. If analytics, advertising or other non-essential tracking is introduced, this notice and any required consent controls must be updated before that technology is enabled.</p></div></section>

        <section><h2>Security</h2><div className="legal-copy"><p>The form uses server-side validation, size limits, same-origin checks, spam controls, provider timeouts and non-cacheable API responses. Vercel and Resend credentials are intended to remain server-side. No internet transmission or storage method can be guaranteed completely secure, and operational access, credential rotation and provider settings remain company responsibilities.</p></div></section>

        <section><h2>Your requests</h2><div className="legal-copy"><p>You may contact AFT Techno Trade to ask about personal information associated with an enquiry, request correction or deletion where applicable, withdraw consent for future processing where the processing depends on consent, or raise a grievance.</p><p>India&apos;s Digital Personal Data Protection Act, 2023 and Digital Personal Data Protection Rules, 2025 have phased commencement dates. Applicable rights and duties should be reviewed against the provisions in force when a request is received. Identity may need to be verified before acting on a request.</p></div></section>

        <section><h2>Children and updates</h2><div className="legal-copy"><p>This business enquiry website is not directed to children. Do not submit another person&apos;s information unless you are authorised to do so.</p><p>Material changes to this notice should be posted on this page with an updated date. Where law or the nature of a change requires a more direct notice or renewed consent, AFT Techno Trade should provide it before the changed processing begins.</p></div></section>
      </div>
      <p className="legal-updated">Draft last reviewed: 20 October 2026.</p>
    </main>
    <SiteFooter />
  </div>;
}
