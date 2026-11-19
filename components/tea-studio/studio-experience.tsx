"use client";

import dynamic from "next/dynamic";
import Image, { getImageProps } from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, ArrowUpRight, ChevronLeft, ChevronRight, Cuboid, Info, List, Rotate3D, RotateCcw, SlidersHorizontal, ZoomIn, ZoomOut } from "lucide-react";
import { Component, useCallback, useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { WhatsAppAction } from "../whatsapp-action";
import { studioProducts, studioEnquiryMessage, type StudioCameraView } from "../../lib/tea-studio-products";
import styles from "../../app/tea-studio/tea-studio.module.css";

const ProductCanvas = dynamic(() => import("./product-canvas"), { ssr: false });
type LoadState = { id: string; phase: "loading" | "ready" | "error" };

class ViewerBoundary extends Component<{ children: ReactNode; onError: () => void; resetKey: string }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch() { this.props.onError(); }
  componentDidUpdate(previous: { resetKey: string }) { if (previous.resetKey !== this.props.resetKey && this.state.failed) this.setState({ failed: false }); }
  render() { return this.state.failed ? null : this.props.children; }
}

export function StudioExperience() {
  const [index, setIndex] = useState(0), [presented, setPresented] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0), [toolsOpen, setToolsOpen] = useState(false);
  const [load, setLoad] = useState<LoadState>({ id: studioProducts[0].id, phase: "loading" });
  const [command, setCommand] = useState<{ view: StudioCameraView; serial: number }>({ view: "front", serial: 0 });
  const [menu, setMenu] = useState(false), [info, setInfo] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null), menuButton = useRef<HTMLButtonElement>(null), selection = useRef(studioProducts[0].id);
  const toolsRef=useRef<HTMLDivElement>(null),toolsButton=useRef<HTMLButtonElement>(null);
  const product = studioProducts[index];
  const failed = load.id === product.id && load.phase === "error";
  const busy = load.id !== product.id || load.phase === "loading";
  const display = failed ? product : studioProducts.find(item => item.id === presented) ?? product;
  const hasScene = presented !== null && !failed;
  const mobilePoster = getImageProps({ src: product.studioPoster.mobile, alt: "", width: 585, height: 1266, sizes: "100vw", quality: 90 }).props;
  const changeState = useCallback((id: string, phase: LoadState["phase"]) => {
    if (id !== selection.current) return;
    setLoad({ id, phase }); if (phase === "ready") setPresented(id);
  }, []);
  const error = useCallback(() => changeState(selection.current, "error"), [changeState]);
  useEffect(() => { if (!busy) return; const timer = setTimeout(error, 25_000); return () => clearTimeout(timer); }, [busy, product.id, attempt, error]);
  useEffect(() => {
    if(!toolsOpen)return;
    toolsRef.current?.querySelector<HTMLButtonElement>("button")?.focus();
    const outside=(event:PointerEvent)=>{if(!toolsRef.current?.contains(event.target as Node)&&!toolsButton.current?.contains(event.target as Node))setToolsOpen(false);};
    document.addEventListener("pointerdown",outside);return()=>document.removeEventListener("pointerdown",outside);
  },[toolsOpen]);
  useEffect(() => {
    if (!menu) return;
    menuRef.current?.querySelector<HTMLButtonElement>("[aria-current=true]")?.focus();
    const outside = (event: PointerEvent) => { if (!menuRef.current?.contains(event.target as Node) && !menuButton.current?.contains(event.target as Node)) setMenu(false); };
    document.addEventListener("pointerdown", outside); return () => document.removeEventListener("pointerdown", outside);
  }, [menu]);
  function choose(next: number) {
    const normalized = (next + studioProducts.length) % studioProducts.length;
    selection.current = studioProducts[normalized].id; setIndex(normalized); setMenu(false);setToolsOpen(false);
    setCommand({ view: "front", serial: 0 });
    if (failed) { setPresented(null); setLoad({ id: studioProducts[normalized].id, phase: "loading" }); setAttempt(previous => previous + 1); }
  }
  function camera(view: StudioCameraView) { setCommand(previous => ({ view, serial: previous.serial + 1 }));if(toolsOpen&&view!=="zoom-in"&&view!=="zoom-out"){setToolsOpen(false);toolsButton.current?.focus();} }
  function retry() { setPresented(null); setLoad({ id: product.id, phase: "loading" }); setAttempt(previous => previous + 1); }
  return <main id="main" className={styles.studio} aria-labelledby="studio-title" style={{ "--scene-accent": display.scene.accent, "--scene-background": display.scene.background } as CSSProperties} onKeyDown={event => {
    if (event.key === "Escape") { setMenu(false); setInfo(false);setToolsOpen(false);if(toolsOpen)toolsButton.current?.focus();if (menu) menuButton.current?.focus();return; }
    if (event.target instanceof HTMLElement && (event.target.closest("dialog") || event.target.matches("input,textarea,select"))) return;
    if (event.key === "ArrowRight" || event.key === "ArrowLeft") { event.preventDefault(); choose(index + (event.key === "ArrowRight" ? 1 : -1)); }
  }}>
    <h1 id="studio-title" className={styles.srOnly}>AFT Immersive Tea Studio. Explore Assam tea from every angle.</h1>
    <div className={`${styles.poster} ${hasScene ? styles.posterHidden : ""}`} aria-hidden={hasScene}>
      <picture><source media="(max-width:767px)" srcSet={mobilePoster.srcSet} sizes="100vw" /><Image src={product.studioPoster.desktop} alt={`${product.name}, rendered from the supplied 3D packaging model in the AFT studio`} fill sizes="100vw" quality={90} loading="eager" fetchPriority="high" /></picture>
    </div>
    {!failed && <ViewerBoundary key={attempt} onError={error} resetKey={product.id}><ProductCanvas product={product} command={command} onState={changeState} /></ViewerBoundary>}
    <header className={styles.header}>
      <Link href="/" className={styles.brand} aria-label="AFT Techno Trade home"><Image src="/branding/aft-circular-seal.svg" alt="" width={48} height={48} priority /><span>AFT<span>Immersive Tea Studio</span></span></Link>
      <span className={styles.tagline}>Explore Assam tea from every angle.</span>
      <Link href="/" className={styles.back}><ArrowLeft size={16} aria-hidden="true" /><span>Back to AFT</span></Link>
    </header>
    <div ref={toolsRef} id="studio-viewing-tools" className={styles.tools} data-open={toolsOpen} role="toolbar" aria-label="Product viewing tools">
      <button type="button" onClick={() => camera("zoom-in")} disabled={!hasScene} aria-label="Zoom in" title="Zoom in"><ZoomIn size={19} /></button>
      <button type="button" onClick={() => camera("zoom-out")} disabled={!hasScene} aria-label="Zoom out" title="Zoom out"><ZoomOut size={19} /></button>
      <button type="button" onClick={() => camera("reset")} disabled={!hasScene} aria-label="Reset camera" title="Reset camera"><RotateCcw size={18} /></button>
      <button type="button" onClick={() => camera(command.view === "back" ? "front" : "back")} disabled={!hasScene} aria-label={command.view === "back" ? "Show front" : "Show back"} title={command.view === "back" ? "Show front" : "Show back"}><Rotate3D size={19} /></button>
      <button type="button" onClick={() => camera("three-quarter")} disabled={!hasScene} aria-label="Three-quarter view" title="Three-quarter view"><Cuboid size={19}/></button>
    </div>
    <div className={styles.status} role="status" aria-live="polite">{failed ? <><span>3D unavailable. Product preview shown.</span><button type="button" onClick={retry}>Retry 3D <RotateCcw size={13} /></button></> : busy ? <span>Preparing {product.shortName}<span className={styles.progress} /></span> : null}</div>
    <div className={styles.product} data-product={display.id} aria-live="polite" aria-atomic="true" key={display.id}>
      <p>{display.id === "ajanta-elaichi" ? "Elaichi Tea" : display.category}</p>
      <h2>{display.id === "ajanta-high-societea" ? "High Societea" : display.name}</h2>
    </div>
    <div className={styles.actions}>
      <WhatsAppAction className={styles.enquire} productName={display.name} message={studioEnquiryMessage(display.name)}>Enquire on WhatsApp <ArrowUpRight size={17} aria-hidden="true" /></WhatsAppAction>
      <Link href="/wholesale" className={styles.wholesale}>Explore wholesale <ArrowUpRight size={13} aria-hidden="true" /></Link>
    </div>
    <nav className={styles.dock} aria-label="Tea studio products">
      <button type="button" onClick={() => choose(index - 1)} aria-label="Previous tea" title="Previous tea"><ChevronLeft size={20} /></button>
      <button ref={menuButton} type="button" className={styles.counter} aria-label="Choose tea" aria-haspopup="true" aria-expanded={menu} aria-controls="studio-product-list" onClick={() => setMenu(previous => !previous)}><span>0{index + 1}<span className={styles.total}> / 04</span></span><List size={16} aria-hidden="true" /></button>
      <button type="button" onClick={() => choose(index + 1)} aria-label="Next tea" title="Next tea"><ChevronRight size={20} /></button>
      <button ref={toolsButton} type="button" className={styles.toolToggle} aria-label="Viewing controls" title="Viewing controls" aria-controls="studio-viewing-tools" aria-expanded={toolsOpen} onClick={()=>{setMenu(false);setToolsOpen(value=>!value);}}><SlidersHorizontal size={18}/></button>
      {menu && <div ref={menuRef} id="studio-product-list" className={styles.productList} role="group" aria-label="Choose an Ajanta tea">{studioProducts.map((item, i) => <button key={item.id} type="button" aria-current={index === i ? "true" : undefined} onClick={() => { choose(i); menuButton.current?.focus(); }}><span className={styles.swatch} style={{ background: item.accent }} /><span>{item.name}</span><span className={styles.listNumber}>0{i + 1}</span></button>)}</div>}
    </nav>
    <button className={styles.infoButton} type="button" aria-label="About these 3D models" title="About these 3D models" aria-expanded={info} aria-controls="studio-asset-note" onClick={() => setInfo(previous => !previous)}><Info size={17} /></button>
    {info && <aside id="studio-asset-note" className={styles.assetNote}><p>Packaging studies made from supplied photographs. Dimensions, folds and unseen closures are approximate; photographic lighting remains in the textures.</p><Link href={display.href}>View the tea collection <ArrowRight size={14} /></Link></aside>}
  </main>;
}
