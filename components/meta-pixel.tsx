"use client";

import Script from "next/script";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { META_PIXEL_CONSENT_KEY, META_PIXEL_ID, META_PIXEL_SCRIPT_SRC, campaignMetaEvent, challengersMetaCampaign, isAdvertisingConsent, metaPixelEnabled, type AdvertisingConsent } from "../lib/meta-pixel";
import styles from "./meta-pixel.module.css";

type Fbq = ((...arguments_: unknown[]) => void) & { callMethod?: (...arguments_: unknown[]) => void; queue?: unknown[][]; loaded?: boolean; version?: string };

declare global {
  interface Window {
    fbq?: Fbq;
    _fbq?: Fbq;
    __aftMetaPixelInitialized?: boolean;
  }
}

function installPixelQueue() {
  if (window.__aftMetaPixelInitialized) return;
  if (!window.fbq) {
    const queue = ((...arguments_: unknown[]) => {
      if (queue.callMethod) queue.callMethod(...arguments_);
      else queue.queue?.push(arguments_);
    }) as Fbq;
    queue.queue = [];
    queue.loaded = true;
    queue.version = "2.0";
    window.fbq = queue;
    window._fbq ??= queue;
  }
  window.fbq?.("init", META_PIXEL_ID);
  window.__aftMetaPixelInitialized = true;
}

function send(command: "track" | "trackCustom", name: string, parameters?: Record<string, string | string[]>) {
  window.fbq?.(command, name, parameters);
}

function readConsent(): AdvertisingConsent {
  if (typeof window === "undefined") return "unknown";
  try {
    const value = window.localStorage.getItem(META_PIXEL_CONSENT_KEY);
    return isAdvertisingConsent(value) ? value : "unknown";
  } catch {
    return "unknown";
  }
}

function subscribeConsent(callback: () => void) {
  const notify = () => callback();
  window.addEventListener("storage", notify);
  window.addEventListener("aft:advertising-consent", notify);
  return () => { window.removeEventListener("storage", notify); window.removeEventListener("aft:advertising-consent", notify); };
}

export function MetaPixel() {
  const pathname = usePathname();
  const consent = useSyncExternalStore(subscribeConsent, readConsent, () => "unknown");
  const [preferencesOpen, setPreferencesOpen] = useState(false);
  const lastPath = useRef<string | null>(null);
  const wasGranted = useRef(false);
  const enabled = metaPixelEnabled();
  const canTrack = enabled && consent === "granted";

  useEffect(() => {
    document.documentElement.dataset.advertisingConsent = consent;
    return () => { delete document.documentElement.dataset.advertisingConsent; };
  }, [consent]);

  useEffect(() => {
    if (!canTrack) {
      lastPath.current = null;
      if (wasGranted.current) window.fbq?.("consent", "revoke");
      wasGranted.current = false;
      return;
    }
    installPixelQueue();
    window.fbq?.("consent", "grant");
    wasGranted.current = true;
    if (!pathname || lastPath.current === pathname) return;
    lastPath.current = pathname;
    send("track", "PageView");
    if (pathname === challengersMetaCampaign.path) {
      send("track", "ViewContent", { campaign_id: challengersMetaCampaign.id, content_name: challengersMetaCampaign.contentName, content_type: "campaign", content_ids: [challengersMetaCampaign.id] });
    }
  }, [canTrack, pathname]);

  useEffect(() => {
    if (!canTrack) return;
    function onCampaignEvent(event: Event) {
      const detail = event instanceof CustomEvent ? event.detail : null;
      if (!detail || typeof detail !== "object" || (detail as { campaign?: unknown }).campaign !== "challengers_trophy_2026") return;
      const mapped = campaignMetaEvent((detail as { event?: unknown }).event as string);
      if (mapped) send(mapped.command, mapped.name, mapped.parameters);
    }
    window.addEventListener("aft:campaign", onCampaignEvent);
    return () => window.removeEventListener("aft:campaign", onCampaignEvent);
  }, [canTrack]);

  function save(next: Exclude<AdvertisingConsent, "unknown">) {
    try { window.localStorage.setItem(META_PIXEL_CONSENT_KEY, next); } catch { /* Browsing still works if storage is unavailable. */ }
    window.dispatchEvent(new Event("aft:advertising-consent"));
    setPreferencesOpen(false);
  }

  return <>
    {canTrack && <Script id="aft-meta-pixel" src={META_PIXEL_SCRIPT_SRC} strategy="afterInteractive" />}
    {consent === "unknown" || preferencesOpen ? <aside className={styles.consent} aria-labelledby="advertising-consent-title" role="dialog" aria-modal="false">
      <strong id="advertising-consent-title">Advertising measurement</strong>
      <p>With your permission, AFT uses Meta Pixel to measure advertising visits and campaign interactions. It does not send enquiry form details to Meta. Read our <Link href="/privacy">Privacy Notice</Link>.</p>
      <div className={styles.actions}><button className={styles.accept} type="button" onClick={() => save("granted")}>Allow advertising measurement</button><button className={styles.decline} type="button" onClick={() => save("denied")}>Decline</button></div>
    </aside> : <button id="privacy-choices" className={styles.manage} type="button" onClick={() => setPreferencesOpen(true)}>Privacy choices</button>}
  </>;
}
