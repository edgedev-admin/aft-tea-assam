"use client";

import Link from "next/link";
import { ArrowRight, ArrowUpRight, Phone, X } from "lucide-react";
import { SiWhatsapp } from "react-icons/si";
import { motion, useReducedMotion } from "framer-motion";
import { createContext, useContext, useEffect, useRef, useState, useSyncExternalStore, type FormEvent, type MouseEvent, type ReactNode } from "react";
import { campaignAttribution, campaignEventDetail, challengersTrophy, eventContacts, eventEnquiryMessage, eventHasEnded, eventWhatsAppUrl, validateEventEnquiry, type CampaignEventName, type CampaignPlacement, type EventEnquiry, type EventEnquiryType, type EventErrors } from "../../../lib/campaigns/challengers-trophy-2026";
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
type PickerInput = EventEnquiry | EventEnquiryType;
const enquiryKind = (input: PickerInput): EventEnquiryType => typeof input === "string" ? input : "registration";
type ContactContext = {
  archived: boolean; picking: boolean; draft: EventEnquiry;
  edit: (key: keyof EventEnquiry, value: string) => void;
  markFormOpen: (placement: CampaignPlacement) => void;
  start: (placement: CampaignPlacement) => void;
  open: (input: PickerInput, placement: CampaignPlacement, trigger?: HTMLElement) => void;
};
const ContactsContext = createContext<ContactContext | null>(null);
function useContacts() { const context = useContext(ContactsContext); if (!context) throw new Error("Event contacts require the campaign provider."); return context; }

export function CampaignReveal({ children, className }: { children: ReactNode; className: string }) {
  const reduced = useReducedMotion();
  return <motion.div className={className} initial={false} whileInView={reduced ? undefined : { y: [9, 0] }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.35, ease: "easeOut" }}>{children}</motion.div>;
}

function ContactOptions({ input, placement, close }: { input: PickerInput; placement: CampaignPlacement; close: () => void }) {
  const { archived } = useContacts();
  function handoff(event: MouseEvent<HTMLAnchorElement>) {
    event.preventDefault();
    if (archived || eventHasEnded() || event.currentTarget.closest("dialog")?.dataset.closing === "true") return;
    track("whatsapp_handoff_click", placement, enquiryKind(input));
    window.open(event.currentTarget.href, "_blank", "noopener,noreferrer"); close();
  }
  return <ul className={styles.contactList}>{eventContacts.map((contact, index) => {
    const url = archived ? null : eventWhatsAppUrl(contact.international, input);
    return <li key={contact.id}><div className={styles.contactNumber}><span>Event contact {String(index + 1).padStart(2, "0")}</span><strong>{contact.display}</strong></div><div className={styles.contactActions}>{url ? <a className={styles.whatsappChoice} href={url} target="_blank" rel="noopener noreferrer" onClick={handoff} aria-label={`WhatsApp event contact ${index + 1}: ${contact.display}`}><SiWhatsapp size={17} aria-hidden="true" /><span>WhatsApp</span></a> : <span>Enquiries closed</span>}<a href={`tel:+${contact.international}`} onClick={close} aria-label={`Call event contact ${index + 1}: ${contact.display}`}><Phone size={16} aria-hidden="true" /><span>Call</span></a></div></li>;
  })}</ul>;
}

export function CampaignProvider({ children, archived: initial }: { children: ReactNode; archived: boolean }) {
  const [archived, setArchived] = useState(initial);
  const [draft, setDraft] = useState<EventEnquiry>({ team: "", person: "", phone: "" });
  const [selection, setSelection] = useState<{ input: PickerInput; placement: CampaignPlacement } | null>(null);
  const dialog = useRef<HTMLDialogElement>(null), returnFocus = useRef<HTMLElement | null>(null);
  const formObserved = useRef(false), closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    if (archived) { dialog.current?.close(); return; }
    let timer: ReturnType<typeof setTimeout>;
    function check() { if (eventHasEnded()) { setArchived(true); return; } timer = setTimeout(check, Math.min(86_400_000, Math.max(1, Date.parse(challengersTrophy.archiveAt) - Date.now()))); }
    check(); return () => clearTimeout(timer);
  }, [archived]);
  useEffect(() => {
    function measureViewport() {
      const viewport = window.visualViewport, height = Math.floor(viewport?.height ?? innerHeight);
      dialog.current?.style.setProperty("--event-visual-height", `${height}px`);
      dialog.current?.style.setProperty("--event-visual-bottom", `${Math.max(0, Math.floor(innerHeight - height - (viewport?.offsetTop ?? 0)))}px`);
    }
    measureViewport(); window.addEventListener("resize", measureViewport); window.visualViewport?.addEventListener("resize", measureViewport);
    return () => { window.removeEventListener("resize", measureViewport); window.visualViewport?.removeEventListener("resize", measureViewport); if (closeTimer.current) clearTimeout(closeTimer.current); };
  }, []);
  useEffect(() => {
    if (!selection || archived) return;
    const previous = document.body.style.overflow; document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = previous; };
  }, [selection, archived]);
  function markFormOpen(placement: CampaignPlacement) {
    if (formObserved.current) return;
    formObserved.current = true; track("registration_form_open", placement);
  }
  function start(placement: CampaignPlacement) {
    if (archived || eventHasEnded()) return;
    track("registration_cta_click", placement); markFormOpen(placement);
    const section = document.getElementById("registration"); if (section) scrollToSection(section);
  }
  function open(input: PickerInput, placement: CampaignPlacement, trigger?: HTMLElement) {
    if (archived || eventHasEnded()) return;
    if (closeTimer.current) { clearTimeout(closeTimer.current); closeTimer.current = null; }
    returnFocus.current = trigger ?? (document.activeElement instanceof HTMLElement ? document.activeElement : null);
    if (document.activeElement instanceof HTMLElement) document.activeElement.blur();
    setSelection({ input, placement }); delete dialog.current?.dataset.closing;
    if (placement !== "form") track(enquiryKind(input) === "sponsorship" ? "sponsorship_enquiry_click" : "registration_cta_click", placement, enquiryKind(input));
    dialog.current?.showModal();
    requestAnimationFrame(() => { dialog.current?.querySelector<HTMLElement>("h2")?.focus({ preventScroll: true }); if (dialog.current) dialog.current.scrollTop = 0; });
  }
  function close() {
    if (!dialog.current?.open || closeTimer.current) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) { dialog.current.close(); return; }
    dialog.current.dataset.closing = "true";
    closeTimer.current = setTimeout(() => dialog.current?.close(), 140);
  }
  function finish() {
    if (closeTimer.current) { clearTimeout(closeTimer.current); closeTimer.current = null; }
    delete dialog.current?.dataset.closing; setSelection(null);
    if (returnFocus.current?.isConnected) returnFocus.current.focus({ preventScroll: true });
  }
  const selectedType = selection ? enquiryKind(selection.input) : "registration";
  return <ContactsContext.Provider value={{ archived, picking: selection !== null, draft, edit: (key, value) => setDraft(previous => ({ ...previous, [key]: value })), markFormOpen, start, open }}>{children}
    <dialog ref={dialog} className={styles.contactDialog} aria-labelledby="event-contacts-title" onClose={finish} onCancel={event => { event.preventDefault(); close(); }} onClick={event => { const box = event.currentTarget.getBoundingClientRect(); if (event.target === event.currentTarget && (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom)) close(); }}>
      <button className={styles.dialogClose} type="button" onClick={close} aria-label="Close event contacts"><X size={21} aria-hidden="true" /></button>
      {selection && <><p className={styles.dialogKicker}>Challengers Trophy 3.0</p><h2 id="event-contacts-title" tabIndex={-1}>{selectedType === "sponsorship" ? "Sponsorship enquiries" : "Choose an event contact"}</h2><p className={styles.dialogIntro}>Choose one contact. You can review your message before sending it in WhatsApp.</p>
        <details className={styles.messagePreview}><summary>Review your message</summary><p>{eventEnquiryMessage(selection.input)}</p></details>
        <ContactOptions input={selection.input} placement={selection.placement} close={close} />
        <p className={styles.contactDisclaimer}>WhatsApp availability is not independently verified. Use Call if unavailable. Registration requires organiser confirmation.</p>
        {selectedType === "registration" && <button className={styles.backButton} type="button" onClick={close}>Edit team details <ArrowRight size={16} aria-hidden="true" /></button>}
      </>}
    </dialog>
  </ContactsContext.Provider>;
}

export function EventContactButton({ children, className, placement, type = "registration" }: { children: ReactNode; className: string; placement: CampaignPlacement; type?: EventEnquiryType }) {
  const contacts = useContacts();
  if (type === "registration") return <a className={className} href={contacts.archived ? "#tournament" : "#registration"} onClick={event => { if (!contacts.archived) { event.preventDefault(); contacts.start(placement); } }}>{children}</a>;
  return <button className={className} type="button" onClick={event => contacts.open(type, placement, event.currentTarget)} disabled={contacts.archived} aria-haspopup="dialog">{children}</button>;
}

export function EventContacts() {
  return <div className={styles.contactsDirectory} id="published-event-contacts"><div><h3>EVENT CONTACTS</h3><p>For registration, sponsorship and tournament enquiries.</p><EventContactButton className={styles.directoryAction} placement="community" type="sponsorship">Sponsorship enquiries <ArrowUpRight size={16} aria-hidden="true" /></EventContactButton></div><ul>{eventContacts.map((contact, index) => <li key={contact.id}><a href={`tel:+${contact.international}`} aria-label={`Call event contact ${index + 1}: ${contact.display}`}><Phone size={16} aria-hidden="true" />{contact.display}</a></li>)}</ul></div>;
}

export function CampaignInteractions() {
  const contacts = useContacts(), [hidden, setHidden] = useState(true), visited = useRef(false);
  useEffect(() => {
    if (!visited.current) { track("landing_view", "hero"); visited.current = true; }
    const root = document.querySelector("[data-campaign-page]");
    function click(event: globalThis.MouseEvent) {
      const anchor = (event.target as Element).closest<HTMLAnchorElement>('a[href^="#"]'); if (event.defaultPrevented || !anchor || !root?.contains(anchor)) return;
      const target = document.getElementById(anchor.hash.slice(1));
      if (target && !event.metaKey && !event.ctrlKey && !event.shiftKey && event.button === 0) { event.preventDefault(); scrollToSection(target); }
    }
    document.addEventListener("click", click);
    const targets = [document.getElementById("campaign-hero"), document.getElementById("registration"), document.querySelector('[aria-labelledby="culture-title"]'), document.querySelector("footer.site-footer")].filter((element): element is HTMLElement => element instanceof HTMLElement);
    const visible = new Set<Element>(targets.slice(0, 1));
    function update() { const editing = document.activeElement?.matches("input,select,textarea"), keyboard = window.visualViewport ? innerHeight - window.visualViewport.height > 150 : false; setHidden(visible.size > 0 || Boolean(editing) || keyboard); }
    const observer = new IntersectionObserver(entries => { entries.forEach(entry => entry.isIntersecting ? visible.add(entry.target) : visible.delete(entry.target)); update(); }); targets.forEach(element => observer.observe(element));
    const focus = () => requestAnimationFrame(update); document.addEventListener("focusin", focus); document.addEventListener("focusout", focus); window.visualViewport?.addEventListener("resize", update);
    return () => { observer.disconnect(); document.removeEventListener("click", click); document.removeEventListener("focusin", focus); document.removeEventListener("focusout", focus); window.visualViewport?.removeEventListener("resize", update); };
  }, []);
  if (hidden || contacts.archived || contacts.picking) return null;
  return <aside className={styles.sticky} aria-label="Tournament registration"><button type="button" onClick={() => contacts.start("sticky")}><span>Register Your Team<small>Challengers Trophy 3.0</small></span><ArrowUpRight size={21} aria-hidden="true" /></button></aside>;
}

export function EventRegistration() {
  const { archived, draft, edit, markFormOpen, open } = useContacts();
  const hydrated = useSyncExternalStore(subscribeHydration, clientSnapshot, serverSnapshot), formRef = useRef<HTMLFormElement>(null);
  const [errors, setErrors] = useState<EventErrors>({});
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); if (archived || !hydrated || eventHasEnded()) return;
    const result = validateEventEnquiry(draft); setErrors(result.errors); const first = Object.keys(result.errors)[0];
    if (first) { formRef.current?.querySelector<HTMLInputElement>(`[name="${first}"]`)?.focus(); return; }
    track("form_validation_success", "form"); open(result.values, "form", formRef.current?.querySelector<HTMLButtonElement>('button[type="submit"]') ?? undefined);
  }
  const fields = [{ key: "team", label: "Team Name", autoComplete: "organization", max: 120 }, { key: "person", label: "Contact Person Name", autoComplete: "name", max: 100 }, { key: "phone", label: "Phone Number", autoComplete: "tel", max: 24 }] as const;
  if (archived) return <div className={styles.notice} role="status"><strong>This tournament is now an archive.</strong><p>Registration enquiries are closed. Tournament details remain available for reference.</p></div>;
  return <form className={styles.form} ref={formRef} onSubmit={submit} method="post" noValidate onFocus={event => { if (!event.currentTarget.contains(event.relatedTarget as Node | null)) markFormOpen("form"); }}>
    <fieldset disabled={!hydrated}><legend className={styles.srOnly}>Team registration enquiry · all three fields required</legend><div className={styles.formGrid}>{fields.map(field => <label className={styles.field} key={field.key}><span>{field.label}<span aria-hidden="true">*</span></span><input id={`event-${field.key}`} name={field.key} value={draft[field.key]} onChange={event => edit(field.key, event.currentTarget.value)} type={field.key === "phone" ? "tel" : "text"} inputMode={field.key === "phone" ? "tel" : "text"} autoComplete={field.autoComplete} maxLength={field.max} required aria-invalid={Boolean(errors[field.key])} aria-describedby={errors[field.key] ? `event-${field.key}-error` : undefined} />{errors[field.key] && <span id={`event-${field.key}-error`} className={styles.error}>{errors[field.key]}</span>}</label>)}</div>
      {Object.keys(errors).length > 0 && <p className={styles.errorSummary} role="alert">Please check the highlighted fields.</p>}<button className={styles.primary} type="submit" aria-haspopup="dialog">Continue to WhatsApp <ArrowRight size={18} aria-hidden="true" /></button>
    </fieldset>
    <p className={styles.privacy}>Details only prepare your WhatsApp message. No website submission or storage. Organiser confirmation required. <Link href="/privacy">Privacy notice</Link>.</p>
    <noscript><p>Enable JavaScript to prepare your enquiry, or call a published event contact below.</p></noscript>
  </form>;
}
