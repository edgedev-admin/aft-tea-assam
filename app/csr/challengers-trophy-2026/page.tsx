import type { Metadata } from "next";
import Image from "next/image";
import { ArrowDown, ArrowRight, CalendarDays, MapPin, Plus } from "lucide-react";
import { SiteNavbar } from "../../../components/site-navbar";
import { SiteFooter } from "../../../components/site-footer";
import { StructuredData } from "../../../components/structured-data";
import { pageMetadata, SITE_URL } from "../../../lib/seo";
import { challengersTrophy as event, eventHasEnded } from "../../../lib/campaigns/challengers-trophy-2026";
import { CampaignInteractions, CampaignProvider, CampaignReveal, EventContactButton, EventContacts, EventRegistration } from "./campaign-interactions";
import styles from "./event.module.css";

export const dynamic = "force-dynamic";
export const metadata: Metadata = pageMetadata({
  title: "Challengers Trophy 3.0 2026 | Dikom Cricket Tournament | AFT Techno Trade",
  description: `Explore Challengers Trophy 3.0, taking place ${event.dates} at Dikom Nahortoli Playground, Assam. View prizes, tournament details and enquire about team registration through WhatsApp.`,
  path: event.path,
  image: event.socialImage,
});

const faqs = [
  ["When is Challengers Trophy 3.0?", `The tournament runs ${event.dates}. The Mega Final is on ${event.finalDate}. Match schedules should be confirmed with the organiser.`],
  ["Where is the tournament being held?", `${event.venue}, Dikom, Assam.`],
  ["What is the team registration fee?", "The advertised fee is ₹3,000 per team. Ask the organiser for the official registration and payment instructions before paying."],
  ["How many teams can participate?", "32 team places are advertised. Current team availability is subject to organiser confirmation."],
  ["How do I enquire about registration?", "Enter your team name, contact person name and Indian mobile number. Review the prepared message, choose one event contact and send it in WhatsApp. You can also call a published contact."],
  ["How is my registration confirmed?", "Only the organiser can confirm eligibility, availability, payment and registration. Opening or sending a WhatsApp message does not confirm a team place."],
  ["Who is organising the tournament?", `${event.organiser}. AFT Techno Trade features this event through its community initiative and is not the tournament organiser.`],
];

export default function ChallengersTrophyPage() {
  const archived = eventHasEnded();
  const eventData = {
    "@context": "https://schema.org", "@type": "SportsEvent", "@id": `${SITE_URL}${event.path}#event`,
    name: event.name, url: `${SITE_URL}${event.path}`, sport: "Cricket", startDate: event.startDate, endDate: event.endDate,
    description: `${event.format}, organised by ${event.organiser} at ${event.venue}, Dikom, Assam.`,
    image: new URL(event.socialImage, SITE_URL).href,
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    location: { "@type": "Place", name: event.venue, address: { "@type": "PostalAddress", addressLocality: "Dikom", addressRegion: "Assam", addressCountry: "IN" } },
    organizer: { "@type": "Organization", name: event.organiser },
  };
  return <CampaignProvider archived={archived}>
    <SiteNavbar />
    <main id="main" className={styles.page} data-campaign-page>
      <StructuredData data={eventData} />
      <section className={styles.hero} id="campaign-hero" aria-labelledby="campaign-title">
        <div className={styles.heroMedia} aria-hidden="true"><Image src="/images/csr/challengers-hero-stadium.webp" alt="" fill preload sizes="(max-width: 599px) 250vw, 100vw" quality={90} /></div>
        <div className={styles.heroOverlay} aria-hidden="true" />
        <div className={styles.shell}>
          <p className={styles.heroEyebrow}>AFT Community Spotlight <span>/ Dikom, Assam</span></p>
          {archived && <p className={styles.archiveLabel}>December 2026 · Event archive</p>}
          <h1 id="campaign-title"><span>CHALLENGERS</span><span>TROPHY <em>3.0</em></span></h1>
          <p className={styles.heroPromise}>Four days. Thirty-two teams. One trophy.</p>
          <div className={styles.heroMeta}>
            <p><CalendarDays size={19} aria-hidden="true" /><span>09—12 DECEMBER 2026</span></p>
            <p><MapPin size={19} aria-hidden="true" /><span>DIKOM NAHORTOLI PLAYGROUND</span></p>
          </div>
          <div className={styles.heroActions}>
            {archived ? <a className={styles.primary} href="#tournament">Explore the event archive <ArrowRight size={18} /></a> : <EventContactButton className={styles.primary} placement="hero">Register Your Team <ArrowRight size={18} aria-hidden="true" /></EventContactButton>}
            <a className={styles.textLink} href="#prizes">Explore the prizes <ArrowDown size={17} aria-hidden="true" /></a>
          </div>
          <div className={styles.heroFoot}><p>Play Hard. Dream Big.</p><span>Light Cosco · Day &amp; Night · Knock-Out Cricket</span></div>
        </div>
      </section>

      <section className={styles.prizes} id="prizes" aria-labelledby="prizes-title"><div className={styles.shell}>
        <div className={styles.sectionHeading}><h2 id="prizes-title">THE STAKES<span>.</span></h2><p>Play with passion. Compete for glory.</p></div>
        <CampaignReveal className={styles.scoreboard}>
          <article className={`${styles.prizeCard} ${styles.champions}`}>
            <div className={styles.prizeCopy}><p>Champions <span aria-hidden="true">01</span></p><strong>₹1,00,000</strong></div>
            <Image className={styles.prizeGraphic} src="/images/csr/prize-champions-trophy.webp" alt="" aria-hidden="true" width={875} height={1000} sizes="(max-width: 599px) 36vw, (max-width: 1023px) 24vw, 18vw" quality={90} />
          </article>
          <article className={`${styles.prizeCard} ${styles.runners}`}>
            <div className={styles.prizeCopy}><p>Runners-up <span aria-hidden="true">02</span></p><strong>₹50,000</strong></div>
            <Image className={styles.prizeGraphic} src="/images/csr/prize-runners-trophy.webp" alt="" aria-hidden="true" width={818} height={1000} sizes="(max-width: 599px) 36vw, (max-width: 1023px) 24vw, 18vw" quality={90} />
          </article>
          <div className={styles.otherAwards}>
            <article className={`${styles.prizeCard} ${styles.seriesAward}`}><div className={styles.prizeCopy}><span>Man of the Series</span><strong>BICYCLE</strong></div><Image className={styles.prizeGraphic} src="/images/csr/prize-man-of-series-bicycle.webp" alt="" aria-hidden="true" width={1000} height={667} sizes="(max-width: 599px) 60vw, (max-width: 1023px) 36vw, 27vw" quality={90} /></article>
            <article className={`${styles.prizeCard} ${styles.bowlerAward}`}><div className={styles.prizeCopy}><span>Best Bowler</span><strong>₹3,000</strong></div><Image className={styles.prizeGraphic} src="/images/csr/prize-best-bowler-ball.webp" alt="" aria-hidden="true" width={1000} height={667} sizes="(max-width: 599px) 42vw, (max-width: 1023px) 28vw, 21vw" quality={90} /></article>
          </div>
        </CampaignReveal>
      </div></section>

      <section className={styles.actionFeature} aria-label="Cricket action"><CampaignReveal className={styles.actionFrame}>
        <Image src="/images/csr/challengers-cricket-action.webp" alt="Cricket batter in a navy and ivory kit playing a shot as the ball travels through the outfield." width={1672} height={941} sizes="100vw" quality={90} />
        <div className={styles.actionOverlay}><p>PLAY HARD.<br />DREAM BIG.</p></div>
      </CampaignReveal></section>

      <section className={styles.registration} id="registration" aria-labelledby="registration-title">
        <div className={`${styles.shell} ${styles.registrationInner}`}>
          <div className={styles.registrationCopy}><p className={styles.kicker}>Team registration enquiries</p><h2 id="registration-title">YOUR TEAM.<br /><span>YOUR SHOT.</span></h2><p>Register your interest for Challengers Trophy 3.0. Only 32 team places are advertised.</p><div className={styles.entryFee}><strong>₹3,000</strong><span>per team<br />Organiser confirmation required.</span></div><a className={styles.textLink} href="#published-event-contacts">Prefer to call? View event contacts <ArrowDown size={16} aria-hidden="true" /></a></div>
          <EventRegistration />
        </div>
      </section>

      <section className={styles.matchSection} id="tournament" aria-labelledby="details-title"><div className={styles.shell}>
        <div className={styles.sectionHeading}><h2 id="details-title">THE MATCH.<br />THE MOMENT<span>.</span></h2></div>
        <CampaignReveal className={styles.matchGrid}><dl className={styles.matchFacts}>
          <div><dt>Tournament</dt><dd>{event.dates}</dd></div><div><dt>Mega Final</dt><dd>{event.finalDate}</dd></div>
          <div><dt>Venue</dt><dd>{event.venue}<small>Dikom, Assam</small></dd></div><div><dt>Team limit</dt><dd>32 teams</dd></div>
          <div><dt>Registration</dt><dd>₹3,000 <small>per team</small></dd></div><div><dt>Format</dt><dd>Light Cosco Day &amp; Night<small>Knock-Out Cricket Tournament</small></dd></div>
        </dl></CampaignReveal>
        <p className={styles.availability}>Team availability and registration confirmation are subject to organiser approval.</p>
      </div></section>

      <section className={styles.culture} aria-labelledby="culture-title">
        <div className={styles.cultureMedia}><Image src="/images/csr/challengers-cultural-night.webp" alt="Illustrative concert scene with a crowd gathered beneath crimson stage lights." fill sizes="100vw" quality={90} /></div>
        <div className={styles.cultureOverlay} aria-hidden="true" />
        <CampaignReveal className={styles.culturePerformer}><Image src="/images/csr/michel-pator-gamusa.webp" alt="Michel Pator holding a microphone while wearing an Assamese gamosa." width={1322} height={1190} sizes="(max-width: 599px) 72vw, (max-width: 1023px) 50vw, 42vw" quality={90} /></CampaignReveal>
        <div className={`${styles.shell} ${styles.cultureInner}`}>
          <CampaignReveal className={styles.cultureHeading}><h2 id="culture-title">BEYOND THE<br />BOUNDARY<span>.</span></h2></CampaignReveal>
          <CampaignReveal className={styles.cultureProgramme}><div><p>Special appearance</p><strong>{event.performer.toUpperCase()}<span>LIVE</span></strong></div><div className={styles.cultureNight}><strong>CULTURAL NIGHT<br /><span>+ DJ NIGHT</span></strong><p>The celebration continues beyond the cricket field.</p><small>Concert scene is illustrative. Michel Pator is the announced special performer.</small><EventContactButton className={`${styles.primary} ${styles.cultureCta}`} placement="community">Register Your Team <ArrowRight size={18} aria-hidden="true" /></EventContactButton></div></CampaignReveal>
        </div>
      </section>

      <section className={styles.community} aria-labelledby="community-title"><div className={`${styles.shell} ${styles.communityInner}`}>
        <div><h2 id="community-title">PLAY CRICKET.<br />BRING UNITY<span>.</span></h2><p>Challengers Trophy 3.0 brings teams and communities together through competition and shared celebration.</p><p className={styles.organiserCredit}>Organised by <strong>{event.organiser}.</strong><br />Featured through AFT Techno Trade&apos;s community initiative.</p></div>
        <div className={styles.memorial}><p>In loving memory of</p><p>Late Uttam Sharma<br />Late Ashraf Khan (Bittu)</p></div>
      </div></section>

      <section className={`${styles.faq} ${styles.shell}`} aria-labelledby="faq-title"><div><h2 id="faq-title">BEFORE<br />YOU PLAY<span>.</span></h2></div><div className={styles.faqList}>{faqs.map(([question, answer]) => <details key={question}><summary>{question}<Plus size={18} aria-hidden="true" /></summary><p>{answer}</p></details>)}</div><EventContacts /></section>

      <section className={styles.final} aria-labelledby="final-title"><div className={styles.shell}>
        <h2 id="final-title">THE FIELD<br />IS WAITING<span>.</span></h2>
        <div className={styles.finalAction}><p>{archived ? "The December 2026 tournament is now an archive. Registration enquiries are closed." : "32 teams. One trophy.\nIs your team ready?"}</p>
          {archived ? <a className={styles.primary} href="#tournament">View tournament details <ArrowRight size={18} /></a> : <EventContactButton className={styles.primary} placement="final">Register Your Team <ArrowRight size={18} aria-hidden="true" /></EventContactButton>}
          <EventContactButton className={styles.textLink} placement="community" type="general">Contact an event organiser <ArrowRight size={16} aria-hidden="true" /></EventContactButton>
        </div>
      </div></section>
      <CampaignInteractions />
    </main>
    <SiteFooter />
  </CampaignProvider>;
}
