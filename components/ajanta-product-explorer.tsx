"use client";

import { useCallback, useEffect, useRef, useState, type PointerEvent } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Pause, Play } from "lucide-react";
import { CloudinaryImage } from "./cloudinary-image";
import type { AftMediaAsset } from "../lib/media/aft-assets";
import type { TeaCatalogProduct } from "../lib/products";
import styles from "./tea-interactive-showcases.module.css";

type Product = Pick<TeaCatalogProduct, "id" | "label" | "name" | "description" | "availability" | "href" | "cta"> & {
  image: AftMediaAsset;
  note?: string;
};

const imageSizes = "(max-width: 760px) 72vw, (max-width: 1100px) 45vw, 34vw";

export function AjantaProductExplorer({ products }: { products: Product[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [pendingIndex, setPendingIndex] = useState<number | null>(null);
  const [direction, setDirection] = useState(1);
  const [readyRevision, setReadyRevision] = useState(0);
  const [isInView, setIsInView] = useState(false);
  const [pageVisible, setPageVisible] = useState(true);
  const [userPaused, setUserPaused] = useState(false);
  const [manualHold, setManualHold] = useState(false);
  const activeIndexRef = useRef(0);
  const pendingIndexRef = useRef<number | null>(null);
  const readyIdsRef = useRef(new Set<string>());
  const stageRef = useRef<HTMLDivElement>(null);
  const pointerStartRef = useRef<number | null>(null);
  const manualHoldTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const reduceMotion = useReducedMotion() ?? false;
  const active = products[activeIndex];
  const nextIndex = products.length > 1 ? (activeIndex + 1) % products.length : activeIndex;
  const preloadIndex = pendingIndex ?? nextIndex;
  const preloadProduct = products[preloadIndex];

  useEffect(() => {
    activeIndexRef.current = activeIndex;
  }, [activeIndex]);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const observer = new IntersectionObserver(([entry]) => setIsInView(entry.isIntersecting), { threshold: 0.12 });
    observer.observe(stage);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const updateVisibility = () => setPageVisible(document.visibilityState === "visible");
    updateVisibility();
    document.addEventListener("visibilitychange", updateVisibility);
    return () => document.removeEventListener("visibilitychange", updateVisibility);
  }, []);

  useEffect(() => () => {
    if (manualHoldTimerRef.current) clearTimeout(manualHoldTimerRef.current);
  }, []);

  const holdAutoplayAfterInput = useCallback(() => {
    setManualHold(true);
    if (manualHoldTimerRef.current) clearTimeout(manualHoldTimerRef.current);
    manualHoldTimerRef.current = setTimeout(() => {
      setManualHold(false);
      manualHoldTimerRef.current = null;
    }, 7000);
  }, []);

  const requestProduct = useCallback((index: number, manual: boolean, nextDirection: number) => {
    const product = products[index];
    if (!product) return;
    if (manual) holdAutoplayAfterInput();
    setDirection(nextDirection);

    if (readyIdsRef.current.has(product.id)) {
      pendingIndexRef.current = null;
      setPendingIndex(null);
      setActiveIndex(index);
      return;
    }

    pendingIndexRef.current = index;
    setPendingIndex(index);
  }, [holdAutoplayAfterInput, products]);

  const markImageReady = useCallback((id: string) => {
    if (!readyIdsRef.current.has(id)) {
      readyIdsRef.current.add(id);
      setReadyRevision((revision) => revision + 1);
    }

    const pending = pendingIndexRef.current;
    if (pending !== null && products[pending]?.id === id) {
      pendingIndexRef.current = null;
      setPendingIndex(null);
      setActiveIndex(pending);
    }
  }, [products]);

  const nextProduct = useCallback(() => {
    const index = (activeIndexRef.current + 1) % products.length;
    requestProduct(index, false, 1);
  }, [products.length, requestProduct]);

  useEffect(() => {
    if (
      products.length < 2 || !isInView || !pageVisible || userPaused || manualHold || reduceMotion ||
      pendingIndex !== null || !readyIdsRef.current.has(products[nextIndex]?.id)
    ) return;

    const timer = setTimeout(nextProduct, 4000);
    return () => clearTimeout(timer);
  }, [activeIndex, isInView, manualHold, nextIndex, nextProduct, pageVisible, pendingIndex, products, readyRevision, reduceMotion, userPaused]);

  const selectProduct = (index: number) => {
    const current = activeIndexRef.current;
    if (index === current && pendingIndexRef.current === null) return;
    const forwardDistance = (index - current + products.length) % products.length;
    const backwardDistance = (current - index + products.length) % products.length;
    requestProduct(index, true, forwardDistance <= backwardDistance ? 1 : -1);
  };

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    pointerStartRef.current = event.clientX;
  };

  const handlePointerUp = (event: PointerEvent<HTMLDivElement>) => {
    const start = pointerStartRef.current;
    pointerStartRef.current = null;
    if (start === null || Math.abs(event.clientX - start) < 44 || products.length < 2) return;
    const step = event.clientX < start ? 1 : -1;
    const index = (activeIndexRef.current + step + products.length) % products.length;
    requestProduct(index, true, step);
  };

  if (!active || products.length === 0) return null;

  return (
    <div className={styles.ajantaExplorer}>
      <div
        className={styles.ajantaStage}
        data-product={active.id}
        ref={stageRef}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerCancel={() => { pointerStartRef.current = null; }}
      >
        <div className={styles.stageNumber}>AJANTA TEA <span>·</span> 0{activeIndex + 1} / 0{products.length}</div>
        <button
          type="button"
          className={styles.autoplayToggle}
          aria-label={userPaused ? "Resume automatic product rotation" : "Pause automatic product rotation"}
          aria-pressed={userPaused}
          onClick={() => setUserPaused((paused) => !paused)}
        >
          {userPaused ? <Play aria-hidden="true" size={15} /> : <Pause aria-hidden="true" size={15} />}
          <span>{userPaused ? "Play" : "Pause"}</span>
        </button>

        <AnimatePresence initial={false}>
          <motion.figure
            key={active.id}
            className={styles.packFigure}
            initial={reduceMotion ? { x: 0, opacity: 1 } : { x: direction * 46, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={reduceMotion ? { x: 0, opacity: 1 } : { x: direction * -46, opacity: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.82, ease: [0.22, 1, 0.36, 1] }}
          >
            <CloudinaryImage
              src={active.image.src}
              alt={active.image.alt}
              fill
              sizes={imageSizes}
              quality={90}
              className={styles.packImage}
              loading="eager"
              onLoad={() => markImageReady(active.id)}
              onError={() => {
                if (pendingIndexRef.current !== null && products[pendingIndexRef.current]?.id === active.id) {
                  pendingIndexRef.current = null;
                  setPendingIndex(null);
                }
              }}
              draggable={false}
            />
          </motion.figure>
        </AnimatePresence>

        {preloadProduct && preloadProduct.id !== active.id && (
          <figure className={styles.preloadFigure} aria-hidden="true">
            <CloudinaryImage
              src={preloadProduct.image.src}
              alt=""
              fill
              sizes={imageSizes}
              quality={90}
              className={styles.packImage}
              loading="eager"
              onLoad={() => markImageReady(preloadProduct.id)}
              onError={() => {
                if (pendingIndexRef.current !== null && products[pendingIndexRef.current]?.id === preloadProduct.id) {
                  pendingIndexRef.current = null;
                  setPendingIndex(null);
                }
              }}
              draggable={false}
            />
          </figure>
        )}

        <p className={styles.stageFootnote}>Authentic supplied pouch artwork <span aria-hidden="true">·</span> Swipe to explore</p>
      </div>

      <div className={styles.productDetailsStage}>
        <AnimatePresence initial={false}>
          <motion.div
            key={active.id}
            className={styles.productDetails}
            aria-live="polite"
            aria-atomic="true"
            initial={reduceMotion ? { x: 0, opacity: 1 } : { x: direction * 22, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={reduceMotion ? { x: 0, opacity: 1 } : { x: direction * -22, opacity: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.58, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className={styles.eyebrow}>{active.label}</p>
            <h3>{active.name}</h3>
            <p>{active.description}</p>
            {active.note && <p className={styles.productNote}>{active.note}</p>}
            <small>{active.availability}</small>
            <Link href={active.href}>{active.cta}<ArrowUpRight aria-hidden="true" size={17} /></Link>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className={styles.productRail} role="group" aria-label="Choose an Ajanta Tea product">
        {products.map((product, index) => (
          <button
            type="button"
            key={product.id}
            aria-pressed={active.id === product.id}
            aria-label={`${product.name}${active.id === product.id ? ", currently selected" : ""}`}
            className={active.id === product.id ? styles.productSelected : undefined}
            onClick={() => selectProduct(index)}
          >
            <span>0{index + 1}</span>
            <strong>{product.name}</strong>
            <small>{product.label}</small>
          </button>
        ))}
      </div>
    </div>
  );
}
