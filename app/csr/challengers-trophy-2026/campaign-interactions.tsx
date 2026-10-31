"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight, ArrowUpRight, Phone, X } from "lucide-react";
import { SiWhatsapp } from "react-icons/si";
import { motion, useReducedMotion } from "framer-motion";
import { createContext, useContext, useEffect, useRef, useState, useSyncExternalStore, type FormEvent, type MouseEvent, type ReactNode } from "react";
import { campaignAttribution, campaignEventDetail, challengersTrophy, eventContacts, eventHasEnded, eventWhatsAppUrl, validateEventEnquiry, type CampaignEventName, type CampaignPlacement, type EventEnquiry, type EventEnquiryType, type EventErrors } from "../../../lib/campaigns/challengers-trophy-2026";
import styles from "./event.module.css";

function track(event: CampaignEventName, placement: CampaignPlacement, type: EventEnquiryType = "registration") {
  window.dispatchEvent(new CustomEvent("aft:campaign", { detail: campaignEventDetail(event, campaignAttribution(location.search), placement, type) }));
}
function scrollToSection(target: HTMLElement) {
  const header = document.querySelector(".site-header")?.getBoundingClientRect().bottom ?? 74;
  window.scrollTo({ top: target.getBoundingClientRect().top + scrollY - header - 16, behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
  target.setAttribute("tabindex", "-1"); target.focus({ preventScroll: true }); history.replaceState(null, "", `#${target.id}`);
}
const subscribeHydration = () => () => {};
const clientSnapshot = () => true;
const serverSnapshot = () => false;
const desktopSnapshot = () => matchMedia("(min-width: 1024px)").matches;
const desktopServerSnapshot = () => true;
function subscribeDesktop(callback: () => void) { const query = matchMedia("(min-width: 1024px)"); query.addEventListener("change", callback); return () => query.removeEventListener("change", callback); }
type PickerInput = EventEnquiry | EventEnquiryType;
type Mode = "registration" | "contacts" | null;
type ContactContext = { archived: boolean; desktop: boolean; mode: Mode; draft: EventEnquiry; edit: (key: keyof EventEnquiry, value: string) => void; markFormOpen: (placement: CampaignPlacement) => void; start: (placement: CampaignPlacement, trigger?: HTMLElement) => void; open: (input: PickerInput, placement: CampaignPlacement, trigger?: HTMLElement) => void };
const ContactsContext = createContext<ContactContext | null>(null);
function useContacts() { const context = useContext(ContactsContext); if (!context) throw new Error("Event contacts require the campaign provider."); return context; }
const enquiryKind = (input: PickerInput): EventEnquiryType => typeof input === "string" ? input : "registration";

export function CampaignReveal({ children, className }: { children: ReactNode; className: string }) {
  const reduced = useReducedMotion();
  return <motion.div className={className} initial={false} whileInView={reduced ? undefined : { y: [9, 0] }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.35, ease: "easeOut" }}>{children}</motion.div>;
}

function ContactOptions({ input, placement, close }: { input: PickerInput; placement: CampaignPlacement; close: () => void }) {
  const { archived } = useContacts();
  function handoff(event: MouseEvent<HTMLAnchorElement>) {
    event.preventDefault();
    if (archived || eventHasEnded() || event.currentTarget.closest("dialog")?.dataset.closing === "true") return;
    const url = event.currentTarget.href;
    track("whatsapp_handoff_click", placement, enquiryKind(input));
    window.open(url, "_blank", "noopener,noreferrer"); close();
  }
  return <ul className={styles.contactList}>{eventContacts.map((contact, index) => {
    const url = archived ? null : eventWhatsAppUrl(contact.international, input);
    return <li key={contact.id}><div className={styles.contactNumber}><span>Event contact {String(index + 1).padStart(2, "0")}</span><strong>{contact.display}</strong></div><div className={styles.contactActions}>{url ? <a className={styles.whatsappChoice} href={url} target="_blank" rel="noopener noreferrer" onClick={handoff} aria-label={`WhatsApp event contact ${index + 1}: ${contact.display}`}><SiWhatsapp size={16} aria-hidden="true" /><span>WhatsApp</span></a> : <span>Enquiries closed</span>}<a href={`tel:+${contact.international}`} onClick={close} aria-label={`Call event contact ${index + 1}: ${contact.display}`}><Phone size={15} aria-hidden="true" /><span>Call</span></a></div></li>;
  })}</ul>;
}

export function CampaignProvider({ children, archived: initial }: { children: ReactNode; archived: boolean }) {
  const desktop = useSyncExternalStore(subscribeDesktop, desktopSnapshot, desktopServerSnapshot);
  const [archived, setArchived] = useState(initial);
  const [mode, setMode] = useState<Mode>(null);
  const [draft, setDraft] = useState<EventEnquiry>({ team: "", person: "", phone: "" });
  const [selection, setSelection] = useState<{ input: PickerInput; placement: CampaignPlacement } | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null);
  const formObserved = useRef(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    if (archived) return;
    let timer: ReturnType<typeof setTimeout>;
    function check() { if (eventHasEnded()) { setArchived(true); return; } timer = setTimeout(check, Math.min(86_400_000, Math.max(1, Date.parse(challengersTrophy.archiveAt) - Date.now()))); }
    check(); return () => clearTimeout(timer);
  }, [archived]);
  useEffect(() => {
    function measureViewport() {
      const viewport = window.visualViewport;
      const height = Math.floor(viewport?.height ?? innerHeight);
      dialog.current?.style.setProperty("--event-visual-height", `${height}px`);
      dialog.current?.style.setProperty("--event-visual-bottom", `${Math.max(0, Math.floor(innerHeight - height - (viewport?.offsetTop ?? 0)))}px`);
    }
    measureViewport(); window.addEventListener("resize", measureViewport); window.visualViewport?.addEventListener("resize", measureViewport); window.visualViewport?.addEventListener("scroll", measureViewport);
    return () => { window.removeEventListener("resize", measureViewport); window.visualViewport?.removeEventListener("resize", measureViewport); window.visualViewport?.removeEventListener("scroll", measureViewport); if (closeTimer.current) clearTimeout(closeTimer.current); };
  }, []);
  useEffect(() => {
    if (archived || (desktop && mode === "registration")) { dialog.current?.close(); return; }
    if (!mode) return;
    const previous = document.body.style.overflow; document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = previous; };
  }, [mode, archived, desktop]);
  function show(nextMode: Exclude<Mode, null>, trigger?: HTMLElement) {
    if (closeTimer.current) { clearTimeout(closeTimer.current); closeTimer.current = null; }
    if (!dialog.current?.open) returnFocus.current = trigger ?? (document.activeElement instanceof HTMLElement ? document.activeElement : null);
    if (document.activeElement instanceof HTMLElement) document.activeElement.blur();
    delete dialog.current?.dataset.closing;
    setMode(nextMode); dialog.current?.showModal();
    requestAnimationFrame(() => { const heading = dialog.current?.querySelector<HTMLElement>("[data-dialog-heading]"); heading?.focus({ preventScroll: true }); if (dialog.current) dialog.current.scrollTop = 0; });
  }
  function markFormOpen(placement: CampaignPlacement) {
    if (formObserved.current) return;
    formObserved.current = true; track("registration_form_open", placement);
  }
  function start(placement: CampaignPlacement, trigger?: HTMLElement) {
    if (archived || eventHasEnded()) return;
    track("registration_cta_click", placement); markFormOpen(placement);
    if (desktop) {
      const section = document.getElementById("registration");
      if (section) { scrollToSection(section); section.querySelector<HTMLInputElement>("input")?.focus({ preventScroll: true }); }
    } else show("registration", trigger);
  }
  function open(input: PickerInput, placement: CampaignPlacement, trigger?: HTMLElement) {
    if (archived || eventHasEnded()) return;
    setSelection({ input, placement });
    if (placement !== "form") track(enquiryKind(input) === "sponsorship" ? "sponsorship_enquiry_click" : "registration_cta_click", placement, enquiryKind(input));
    show("contacts", trigger);
  }
  function close() {
    if (!dialog.current?.open || closeTimer.current) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) { dialog.current.close(); return; }
    dialog.current.dataset.closing = "true";
    closeTimer.current = setTimeout(() => dialog.current?.close(), 140);
  }
  function finish() {
    if (closeTimer.current) { clearTimeout(closeTimer.current); closeTimer.current = null; }
    delete dialog.current?.dataset.closing; setMode(null); setSelection(null);
    const trigger = returnFocus.current;
    if (trigger?.isConnected) trigger.focus({ preventScroll: true });
    else document.querySelector<HTMLButtonElement>('#registration button[type="submit"]')?.focus({ preventScroll: true });
  }
  function back() {
    if (desktop) close();
    else { setSelection(null); setMode("registration"); requestAnimationFrame(() => dialog.current?.querySelector<HTMLElement>("[data-dialog-heading]")?.focus({ preventScroll: true })); }
  }
  const selectedType = selection ? enquiryKind(selection.input) : "registration";
  return <ContactsContext.Provider value={{ archived, desktop, mode, draft, edit: (key, value) => setDraft((previous) => ({ ...previous, [key]: value })), markFormOpen, start, open }}>{children}
    <dialog ref={dialog} className={`${styles.contactDialog} ${mode === "registration" ? styles.registrationDialog : ""}`} aria-labelledby={mode === "registration" ? "registration-title" : "event-contacts-title"} onClose={finish} onCancel={(event) => { event.preventDefault(); close(); }} onClick={(event) => { const box = event.currentTarget.getBoundingClientRect(); if (event.target === event.currentTarget && (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom)) close(); }}>
      <button className={styles.dialogClose} type="button" onClick={close} aria-label="Close registration"><X size={21} aria-hidden="true" /></button>
      {mode === "registration" ? <RegistrationPanel /> : mode === "contacts" ? <><p className={styles.dialogKicker}>Challengers Trophy 3.0 / {selectedType === "registration" ? "02 · Choose a contact" : "Event enquiries"}</p><h2 id="event-contacts-title" data-dialog-heading tabIndex={-1}>{selectedType === "sponsorship" ? "Sponsorship Enquiries" : "Choose an Event Contact"}</h2><p className={styles.dialogIntro}>{selectedType === "sponsorship" ? "Choose one published contact to discuss sponsorship." : "Your message is ready. Choose one contact and review it in WhatsApp before sending."}</p><ContactOptions input={selection?.input ?? "registration"} placement={selection?.placement ?? "form"} close={close} /><p className={styles.contactDisclaimer}>WhatsApp availability is not independently verified. Use Call if unavailable. Registration requires organiser confirmation.</p>{selectedType === "registration" && <button className={styles.backButton} type="button" onClick={back}><ArrowLeft size={16} aria-hidden="true" />Edit team details</button>}</> : null}
    </dialog>
  </ContactsContext.Provider>;
}

export function EventContactButton({ children, className, placement, type = "registration" }: { children: ReactNode; className: string; placement: CampaignPlacement; type?: EventEnquiryType }) {
  const contacts = useContacts();
  return <button className={className} type="button" onClick={(event) => type === "registration" ? contacts.start(placement, event.currentTarget) : contacts.open(type, placement, event.currentTarget)} disabled={contacts.archived} aria-haspopup={type !== "registration" || !contacts.desktop ? "dialog" : undefined}>{children}</button>;
}

export function EventContacts() {
  return <div className={styles.contactsDirectory} id="published-event-contacts"><p>Published event contacts <span>Call directly, or register interest via WhatsApp.</span></p><ul>{eventContacts.map((contact, index) => <li key={contact.id}><a href={`tel:+${contact.international}`} aria-label={`Call event contact ${index + 1}: ${contact.display}`}><Phone size={14} aria-hidden="true" />{contact.display}</a></li>)}</ul></div>;
}

export function CampaignInteractions() {
  const contacts = useContacts(); const [hidden, setHidden] = useState(true); const visited = useRef(false);
  useEffect(() => {
    if (!visited.current) { track("landing_view", "hero"); visited.current = true; }
    const root = document.querySelector("[data-campaign-page]");
    function click(event: globalThis.MouseEvent) {
      const anchor = (event.target as Element).closest<HTMLAnchorElement>('a[href^="#"]'); if (!anchor || !root?.contains(anchor)) return;
      const target = document.getElementById(anchor.hash.slice(1));
      if (target && !event.metaKey && !event.ctrlKey && !event.shiftKey && event.button === 0) { event.preventDefault(); scrollToSection(target); }
    }
    document.addEventListener("click", click);
    const targets = [document.getElementById("campaign-hero"), document.querySelector("footer.site-footer")].filter((element): element is HTMLElement => element instanceof HTMLElement);
    const visible = new Set<Element>(targets.slice(0, 1));
    function update() { const editing = document.activeElement?.matches("input,select,textarea"); const keyboard = window.visualViewport ? innerHeight - window.visualViewport.height > 150 : false; setHidden(visible.size > 0 || Boolean(editing) || keyboard); }
    const observer = new IntersectionObserver((entries) => { entries.forEach((entry) => entry.isIntersecting ? visible.add(entry.target) : visible.delete(entry.target)); update(); }, { threshold: 0 }); targets.forEach((element) => observer.observe(element));
    const focus = () => requestAnimationFrame(update); document.addEventListener("focusin", focus); document.addEventListener("focusout", focus); window.visualViewport?.addEventListener("resize", update);
    return () => { observer.disconnect(); document.removeEventListener("click", click); document.removeEventListener("focusin", focus); document.removeEventListener("focusout", focus); window.visualViewport?.removeEventListener("resize", update); };
  }, []);
  if (hidden || contacts.archived || contacts.mode) return null;
  return <aside className={styles.sticky} aria-label="Tournament registration"><button type="button" onClick={(event) => contacts.start("sticky", event.currentTarget)}><span>Register Your Team<small>Challengers Trophy 3.0</small></span><ArrowUpRight size={21} aria-hidden="true" /></button></aside>;
}

function RegistrationPanel() {
  const { archived } = useContacts();
  if (archived) return <div className={styles.notice} role="status"><strong>This tournament is now an archive.</strong><p>Registration handoffs are closed. The official announcement remains available for reference.</p></div>;
  return <><div className={styles.panelIntro}><p>01 / Your team details<span>₹3,000 per team</span></p><h2 id="registration-title" data-dialog-heading tabIndex={-1}>Get in<br /><span>the game.</span></h2><p>Three quick details. Then choose an event contact.</p></div><EventRegistration /></>;
}
export function HeroRegistration() {
  const { desktop } = useContacts();
  if (!desktop) return null;
  return <section className={styles.registrationPanel} id="registration" aria-labelledby="registration-title"><RegistrationPanel /></section>;
}

export function EventRegistration() {
  const { archived, draft, edit, markFormOpen, open } = useContacts(); const hydrated = useSyncExternalStore(subscribeHydration, clientSnapshot, serverSnapshot); const formRef = useRef<HTMLFormElement>(null); const [errors, setErrors] = useState<EventErrors>({});
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); if (archived || !hydrated || eventHasEnded()) return;
    const result = validateEventEnquiry(draft); setErrors(result.errors); const first = Object.keys(result.errors)[0];
    if (first) { formRef.current?.querySelector<HTMLInputElement>(`[name="${first}"]`)?.focus(); return; }
    track("form_validation_success", "form"); open(result.values, "form", formRef.current?.querySelector<HTMLButtonElement>('button[type="submit"]') ?? undefined);
  }
  const fields = [{ key: "team", label: "Team Name", autoComplete: "organization", max: 120 }, { key: "person", label: "Contact Person Name", autoComplete: "name", max: 100 }, { key: "phone", label: "Phone Number", autoComplete: "tel", max: 24 }] as const;
  return <form className={styles.form} ref={formRef} onSubmit={submit} method="post" noValidate onFocus={(event) => { if (!event.currentTarget.contains(event.relatedTarget as Node | null)) markFormOpen("form"); }}>
    <fieldset disabled={!hydrated}><legend className={styles.srOnly}>Team registration enquiry · all three fields required</legend><div className={styles.formGrid}>{fields.map((field) => <label className={styles.field} key={field.key}><span>{field.label}<span aria-hidden="true">*</span></span><input id={`event-${field.key}`} name={field.key} value={draft[field.key]} onChange={(event) => edit(field.key, event.currentTarget.value)} type={field.key === "phone" ? "tel" : "text"} inputMode={field.key === "phone" ? "tel" : "text"} autoComplete={field.autoComplete} maxLength={field.max} required aria-invalid={Boolean(errors[field.key])} aria-describedby={errors[field.key] ? `event-${field.key}-error` : undefined} />{errors[field.key] && <span id={`event-${field.key}-error`} className={styles.error}>{errors[field.key]}</span>}</label>)}</div>
    {Object.keys(errors).length > 0 && <p className={styles.errorSummary} role="alert">Please check the highlighted fields.</p>}<button className={styles.primary} type="submit" aria-haspopup="dialog">Continue to WhatsApp <ArrowRight size={18} aria-hidden="true" /></button></fieldset>
    <p className={styles.privacy}>Details only prepare your WhatsApp message. No website submission or storage. Organiser confirmation required. <Link href="/privacy">Privacy notice</Link>.</p>
    <noscript><p>Enable JavaScript to prepare your enquiry, or call a published contact below.</p></noscript>
  </form>;
}
