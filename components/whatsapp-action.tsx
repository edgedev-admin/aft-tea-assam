"use client";

import { X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { SiWhatsapp } from "react-icons/si";
import { businessContacts, type BusinessContact } from "../lib/company";
import { whatsappContextForPath, whatsappUrl } from "../lib/whatsapp";
import styles from "./whatsapp-action.module.css";

export function WhatsAppContactLink({ contact, productName }: { contact: BusinessContact; productName?: string }) {
  const pathname = usePathname();
  return <a className={styles.direct} href={whatsappUrl(contact, whatsappContextForPath(pathname, productName))} target="_blank" rel="noopener noreferrer" aria-label={`WhatsApp ${contact.label}: ${contact.display}`} title={`WhatsApp ${contact.label}`}><SiWhatsapp aria-hidden="true" size={17} /></a>;
}

export function WhatsAppAction({ className = "", children = "WhatsApp our team", productName }: { className?: string; children?: ReactNode; productName?: string }) {
  const pathname = usePathname();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const id = useId();
  const context = whatsappContextForPath(pathname, productName);

  useEffect(() => {
    if (!isOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = previous; };
  }, [isOpen]);

  function open() {
    dialogRef.current?.showModal();
    setIsOpen(true);
  }

  function close() {
    dialogRef.current?.close();
    setIsOpen(false);
    triggerRef.current?.focus();
  }

  return <>
    <button ref={triggerRef} className={`${styles.trigger} ${className}`} type="button" aria-haspopup="dialog" aria-controls={id} aria-expanded={isOpen} onClick={open}><SiWhatsapp aria-hidden="true" size={17} />{children}</button>
    <dialog ref={dialogRef} id={id} className={styles.dialog} aria-labelledby={`${id}-title`} onClose={() => setIsOpen(false)} onClick={(event) => { if (event.target === event.currentTarget) close(); }}>
      <button className={styles.close} type="button" onClick={close} aria-label="Close WhatsApp contacts"><X size={20} aria-hidden="true" /></button>
      <p className={styles.eyebrow}>AFT Techno Trade</p>
      <h2 id={`${id}-title`}>Talk to our team.</h2>
      <p>Choose a business contact to continue in WhatsApp. Your message will be ready to review before you send it.</p>
      <div className={styles.choices}>{businessContacts.map((contact) => <a key={contact.id} href={whatsappUrl(contact, context)} target="_blank" rel="noopener noreferrer" onClick={close}><SiWhatsapp aria-hidden="true" size={22} /><span><strong>WhatsApp {contact.label}</strong><small>{contact.display}</small></span></a>)}</div>
    </dialog>
  </>;
}
