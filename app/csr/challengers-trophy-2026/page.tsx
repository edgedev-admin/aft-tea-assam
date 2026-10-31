import type { Metadata } from "next";
import { ArrowDown, ArrowRight, ArrowUpRight, Plus } from "lucide-react";
import { SiteNavbar } from "../../../components/site-navbar";
import { SiteFooter } from "../../../components/site-footer";
import { StructuredData } from "../../../components/structured-data";
import { pageMetadata, SITE_URL } from "../../../lib/seo";
import { challengersTrophy as event, eventHasEnded } from "../../../lib/campaigns/challengers-trophy-2026";
import { CampaignInteractions, CampaignProvider, CampaignReveal, EventContactButton, EventContacts, HeroRegistration } from "./campaign-interactions";
import styles from "./event.module.css";

export const dynamic = "force-dynamic";
export const metadata: Metadata = pageMetadata({
  title: "Challengers Trophy 3.0 2026 | AFT Techno Trade Community",
  description: "Discover Challengers Trophy 3.0, held 8–11 December 2026 at Dikom Nahortoli Playground. Explore prizes, tournament details and WhatsApp registration enquiries.",
  path: event.path, image: event.socialImage,
});

const faqs = [
  ["When and where is the tournament?", "8–11 December 2026 at Dikom Nahortoli Playground, Assam. The Mega Final is advertised for 11 December."],
  ["What is the registration fee?", "The advertised fee is ₹3,000 per team. Confirm the procedure and official payment details directly with the organiser before paying."],
  ["How many teams can participate?", "The advertised limit is 32 teams. Current availability must be confirmed with the organiser."],
  ["How do I enquire about registration?", "Enter your team name, contact person name and phone number. Choose one published event contact, then review and send your message in WhatsApp. Call links are also available."],
  ["Does a WhatsApp enquiry confirm my place?", "No. Only the organiser can confirm eligibility, availability, payment and registration. Opening or sending a message does not confirm a place."],
  ["Who is organising Challengers Trophy 3.0?", "Jyoti Jana Kalyan Sangha. AFT Techno Trade features the event through its Community Spotlight initiative and is not the tournament organiser."],
];

function FieldGraphic({ className }: { className: string }) {
  return <svg className={className} viewBox="0 0 700 620" fill="none" aria-hidden="true"><ellipse cx="350" cy="310" rx="315" ry="265" /><ellipse cx="350" cy="310" rx="210" ry="175" /><path d="M325 202h50v216h-50zM297 224h106M297 396h106M325 238h50M325 382h50" /><path d="M340 214v18m10-18v18m10-18v18m-20 156v18m10-18v18m10-18v18" /></svg>;
}

export default function ChallengersTrophyPage() {
  const archived = eventHasEnded();
  const eventData = {
    "@context": "https://schema.org", "@type": "SportsEvent", "@id": `${SITE_URL}${event.path}#event`,
    name: event.name, url: `${SITE_URL}${event.path}`, sport: "Cricket", startDate: event.startDate, endDate: event.endDate,
    description: "Light Cosco day-and-night knockout cricket tournament, organised by Jyoti Jana Kalyan Sangha at Dikom Nahortoli Playground, Assam.",
    image: new URL(event.poster, SITE_URL).href, eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    location: { "@type": "Place", name: event.venue, address: { "@type": "PostalAddress", addressLocality: "Dikom", addressRegion: "Assam", addressCountry: "IN" } },
    organizer: { "@type": "Organization", name: event.organiser },
  };
  return <CampaignProvider archived={archived}><SiteNavbar /><main id="main" className={styles.page} data-campaign-page>
    <StructuredData data={eventData} />
    <section className={styles.hero} id="campaign-hero" aria-labelledby="campaign-title">
      <div className={styles.heroTop}><div className={styles.shell}><span>AFT Community Spotlight</span><span>Dikom, Assam <span aria-hidden="true">/</span> December 2026</span></div></div>
      <div className={`${styles.shell} ${styles.heroInner}`}>
        <div className={styles.heroCampaign}>
          <FieldGraphic className={styles.fieldGraphic} />
          <div className={styles.tournamentIdentity}><p>Challengers<br />Trophy <span>3.0</span></p><span className={styles.edition}>Day &amp; night<br />Knock-out cricket</span></div>
          {archived && <p className={styles.archiveLabel}>December 2026 · Event archive</p>}
          <h1 id="campaign-title"><span>The field</span><span>is calling<span className={styles.titleDot}>.</span></span></h1>
          <p className={styles.heroPromise}>32 teams<span aria-hidden="true"> / </span>Four days<span aria-hidden="true"> / </span>One trophy.</p>
          <div className={styles.heroMeta}><p><strong>08—11 DEC</strong><span>2026</span></p><p><strong>Dikom Nahortoli</strong><span>Playground, Assam</span></p></div>
          <div className={styles.heroActions}>{archived ? <a className={styles.primary} href="#tournament">Explore the event archive <ArrowRight size={18} aria-hidden="true" /></a> : <EventContactButton className={styles.primary} placement="hero">Register Your Team <ArrowRight size={18} aria-hidden="true" /></EventContactButton>}<a className={styles.textLink} href="#prizes">Explore the stakes <ArrowDown size={16} aria-hidden="true" /></a></div>
          <p className={styles.heroMotto}>Rooted in Assam. United by the Game.</p>
        </div>
        <HeroRegistration />
      </div>
      <div className={styles.heroFoot}><div className={styles.shell}><span>Light Cosco Day &amp; Night Knock-Out Cricket Tournament</span><a href={event.poster} target="_blank" rel="noopener noreferrer">View Official Poster <ArrowUpRight size={15} aria-hidden="true" /></a></div></div>
    </section>

    <section className={styles.prizes} id="prizes" aria-labelledby="prizes-title"><div className={styles.shell}>
      <div className={styles.sectionTop}><p className={styles.kicker}>01 / The prize board</p><span>Challengers Trophy 3.0</span></div>
      <h2 id="prizes-title">The stakes<br /><span>are high.</span></h2>
      <CampaignReveal className={styles.scoreboard}><div className={styles.champions}><p><span className={styles.awardNumber}>01</span>Champions</p><strong>₹1,00,000</strong><span className={styles.scoreNote}>The championship award</span></div><div className={styles.runners}><p><span className={styles.awardNumber}>02</span>Runners-up</p><strong>₹50,000</strong></div><div className={styles.otherAwards}><div><span>Man of the Series</span><strong>Bicycle</strong><p>In memory of Late Minoti Dowarah.</p></div><div><span>Best Bowler</span><strong>₹3,000</strong></div></div></CampaignReveal>
      {!archived && <div className={styles.prizeInvitation}><p>Bring your game.</p><EventContactButton className={styles.outlineButton} placement="prizes">Enter the Tournament <ArrowRight size={18} aria-hidden="true" /></EventContactButton></div>}
    </div></section>

    <section className={styles.matchSection} id="tournament" aria-labelledby="details-title"><div className={styles.shell}>
      <div className={styles.sectionTop}><p className={styles.kicker}>02 / Match information</p><a href={event.poster} target="_blank" rel="noopener noreferrer">View Official Poster <ArrowUpRight size={16} aria-hidden="true" /></a></div>
      <div className={styles.matchPanel}><div className={styles.matchTitle}><p>Challengers Trophy 3.0</p><h2 id="details-title">Your tournament.<br />At a glance.</h2><span>Light Cosco Day &amp; Night<br />Knock-Out Cricket Tournament</span></div><dl className={styles.matchFacts}><div><dt>Tournament</dt><dd>08—11 DEC</dd></div><div><dt>Mega Final</dt><dd>11 DEC</dd></div><div><dt>Entry per team</dt><dd>₹3,000</dd></div><div><dt>Advertised limit</dt><dd>32 <span>teams</span></dd></div></dl><div className={styles.venueLine}><span>Venue</span><strong>Dikom Nahortoli Playground, Assam</strong></div><div className={styles.organiserLine}><span>Organised by <strong>Jyoti Jana Kalyan Sangha</strong></span><small>Team availability requires organiser confirmation.</small></div></div>
    </div></section>

    <section className={styles.community} aria-labelledby="community-title"><div className={styles.shell}>
      <div className={styles.sectionTop}><p className={styles.kicker}>03 / The shared spirit</p><span>AFT Community Spotlight</span></div>
      <h2 id="community-title">More than<br />a match<span>.</span></h2>
      <div className={styles.communityBody}><p>Cricket brings teams, neighbours and communities together. Challengers Trophy 3.0 celebrates that shared spirit through local competition and a cultural evening in Dikom.</p><div className={styles.culture}><span>Off the field / Cultural night</span><strong>Arjun Lakra</strong><p>+ DJ Night <span>As announced on the official poster.</span></p></div></div>
      <div className={styles.communityFoot}><p>In loving memory of<br /><strong>Late Uttam Sharma and Late Ashraf Khan (Bittu).</strong></p><div><p>Organised by Jyoti Jana Kalyan Sangha.<br />Featured through AFT Techno Trade’s community initiative.</p>{!archived && <EventContactButton className={styles.sponsorshipLink} placement="community" type="sponsorship">Sponsorship enquiries <ArrowUpRight size={15} aria-hidden="true" /></EventContactButton>}</div></div>
    </div></section>

    <section className={styles.final} aria-labelledby="final-title"><div className={styles.shell}><div><p className={styles.kicker}>Challengers Trophy 3.0 / Dikom</p><h2 id="final-title">Your team.<br /><span>Your shot.</span></h2></div><div className={styles.finalAction}><p>{archived ? "December 2026 event archive. Registration enquiries are closed." : "The field is waiting. Start your Challengers Trophy 3.0 registration enquiry."}</p>{archived ? <a className={styles.darkButton} href="#tournament">View tournament details <ArrowRight size={18} aria-hidden="true" /></a> : <EventContactButton className={styles.darkButton} placement="final">Register Your Team <ArrowRight size={18} aria-hidden="true" /></EventContactButton>}<small>Confirmation and payment instructions come from the organiser.</small></div></div></section>

    <section className={`${styles.faq} ${styles.shell}`} aria-labelledby="faq-title"><div><p className={styles.kicker}>Before you step out</p><h2 id="faq-title">Good to know.</h2></div><div className={styles.faqList}>{faqs.map(([question, answer]) => <details key={question}><summary>{question}<Plus size={18} aria-hidden="true" /></summary><p>{answer}</p></details>)}</div><EventContacts /></section>
    <CampaignInteractions />
  </main><SiteFooter /></CampaignProvider>;
}
