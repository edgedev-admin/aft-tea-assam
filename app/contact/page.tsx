import type { Metadata } from "next";
import { BriefcaseBusiness, Leaf, MapPin, MessageCircle, Sprout } from "lucide-react";
import { SiteNavbar } from "../../components/site-navbar";
import { SiteFooter } from "../../components/site-footer";
import { FAQSection } from "../../components/faq-section";
import { EnquiryForm } from "../../components/enquiry-form";
import { Reveal, RevealImage } from "../../components/reveal";
import "./contact.css";

export const metadata: Metadata = { title: "Contact | AFT Tea Factory", description: "Contact AFT Tea Factory for business and product enquiries." };
const features = [[Leaf, "Assam Tea Heritage", "Rooted in the tea-growing communities of Assam."], [Sprout, "Speciality Tea", "Enquire about our distinctive speciality offerings."], [BriefcaseBusiness, "Business Enquiries", "Discuss your product and supply requirements."], [MessageCircle, "Personal Response", "Share your needs so our team can understand your enquiry."]] as const;

export default function ContactPage() { return <><SiteNavbar/><main className="aft-contact-page"><section className="aft-contact-wrap"><div className="aft-contact-copy"><Reveal><p className="aft-contact-eyebrow"><Leaf size={12}/> Let&apos;s talk tea</p></Reveal><Reveal><h1>Ready to Discuss<br/>Your <i>Tea Requirements?</i></h1></Reveal><div className="aft-contact-divider"><span/><Leaf size={16}/><span/></div><Reveal delay={.12}><p className="aft-contact-intro">Whether you&apos;re exploring our Assam teas, speciality tea offerings or a business supply enquiry, we&apos;d be glad to hear from you.</p></Reveal><div className="aft-contact-features">{features.map(([Icon, title, text], index) => <Reveal className="aft-contact-feature" delay={.16 + index * .06} key={title}><span><Icon size={18}/></span><h2>{title}</h2><p>{text}</p></Reveal>)}</div><Reveal delay={.38}><div className="aft-contact-strip"><MapPin size={17}/><span><small>Based in Assam</small>Dikom/Lahowal area of Dibrugarh</span><i/><span><small>AFT Techno Trade</small>AFT Tea Factory</span></div></Reveal></div><RevealImage className="aft-contact-visual"><div className="aft-contact-photo"/><div className="aft-contact-shade"/><div className="aft-contact-form-card"><h2>Let&apos;s Start a Conversation</h2><p>Tell us a little about your requirements.</p><EnquiryForm variant="contact"/></div></RevealImage></section><FAQSection/></main><SiteFooter/></> }
