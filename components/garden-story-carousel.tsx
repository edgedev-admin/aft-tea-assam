"use client";

import useEmblaCarousel from "embla-carousel-react";
import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import { gardenJourneySlides } from "../lib/photographic-stories";
import { usePrefersReducedMotion } from "../lib/use-prefers-reduced-motion";
import { CloudinaryImage } from "./cloudinary-image";
import styles from "./garden-story-carousel.module.css";

const AUTOPLAY_DELAY = 5000;
const lastSlideIndex = gardenJourneySlides.length - 1;

export function GardenStoryCarousel() {
  const sectionRef = useRef<HTMLElement>(null);
  const [viewportRef, emblaApi] = useEmblaCarousel({
    align: "start",
    duration: 36,
    loop: true,
    skipSnaps: false,
  });
  const prefersReducedMotion = usePrefersReducedMotion();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isInView, setIsInView] = useState(false);
  const [isInteracting, setIsInteracting] = useState(false);
  const [hasKeyboardFocus, setHasKeyboardFocus] = useState(false);
  const [isPageHidden, setIsPageHidden] = useState(false);
  const [loadedIndexes, setLoadedIndexes] = useState(
    () => new Set([lastSlideIndex, 0, 1]),
  );
  const [failedImages, setFailedImages] = useState(() => new Set<string>());

  const prepareNearbySlides = useCallback((index: number) => {
    const previousIndex = (index - 1 + gardenJourneySlides.length) % gardenJourneySlides.length;
    const nextIndex = (index + 1) % gardenJourneySlides.length;

    setLoadedIndexes((current) => {
      if (current.has(index) && current.has(previousIndex) && current.has(nextIndex)) return current;
      const next = new Set(current);
      next.add(index);
      next.add(previousIndex);
      next.add(nextIndex);
      return next;
    });
  }, []);

  const updateSelection = useCallback(() => {
    if (!emblaApi) return;
    const index = emblaApi.selectedScrollSnap();
    setSelectedIndex(index);
    prepareNearbySlides(index);
  }, [emblaApi, prepareNearbySlides]);

  const handlePointerDown = useCallback(() => setIsInteracting(true), []);
  const handlePointerUp = useCallback(() => setIsInteracting(false), []);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on("select", updateSelection);
    emblaApi.on("reInit", updateSelection);
    emblaApi.on("pointerDown", handlePointerDown);
    emblaApi.on("pointerUp", handlePointerUp);
    return () => {
      emblaApi.off("select", updateSelection);
      emblaApi.off("reInit", updateSelection);
      emblaApi.off("pointerDown", handlePointerDown);
      emblaApi.off("pointerUp", handlePointerUp);
    };
  }, [emblaApi, handlePointerDown, handlePointerUp, updateSelection]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const observer = new IntersectionObserver(
      ([entry]) => setIsInView(entry.isIntersecting),
      { threshold: 0.45 },
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    function handleVisibilityChange() {
      setIsPageHidden(document.hidden);
    }

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

  const autoplayPaused =
    prefersReducedMotion ||
    !isInView ||
    isInteracting ||
    hasKeyboardFocus ||
    isPageHidden;

  useEffect(() => {
    if (!emblaApi || autoplayPaused) return;
    const timer = window.setTimeout(() => emblaApi.scrollNext(), AUTOPLAY_DELAY);
    return () => window.clearTimeout(timer);
  }, [autoplayPaused, emblaApi, selectedIndex]);

  function handleKeyDown(event: React.KeyboardEvent<HTMLElement>) {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      emblaApi?.scrollPrev();
    }
    if (event.key === "ArrowRight") {
      event.preventDefault();
      emblaApi?.scrollNext();
    }
  }

  function markImageFailed(id: string) {
    setFailedImages((current) => new Set(current).add(id));
  }

  return (
    <section ref={sectionRef} className={styles.section} aria-label="AFT visual journal">
      <div
        className={styles.carousel}
        role="region"
        aria-roledescription="carousel"
        aria-label="The journey from Assam's tea gardens to the finished cup"
        tabIndex={0}
        onKeyDown={handleKeyDown}
        onFocusCapture={(event) => {
          setHasKeyboardFocus((event.target as HTMLElement).matches(":focus-visible"));
        }}
        onBlurCapture={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
            setHasKeyboardFocus(false);
          }
        }}
      >
        <div className={styles.viewport} ref={viewportRef}>
          <div className={styles.track}>
            {gardenJourneySlides.map((slide, index) => {
              const imageFailed = failedImages.has(slide.photo.id);
              const mediaStyle = {
                "--desktop-position": slide.desktopPosition,
                "--mobile-position": slide.mobilePosition,
              } as CSSProperties;

              return (
                <figure
                  className={`${styles.slide} ${index === selectedIndex ? styles.activeSlide : ""}`}
                  key={slide.photo.id}
                  aria-label={`${index + 1} of ${gardenJourneySlides.length}: ${slide.title}`}
                  aria-hidden={index !== selectedIndex}
                >
                  <div className={styles.imageFrame} style={mediaStyle}>
                    <div className={styles.media}>
                      {loadedIndexes.has(index) && !imageFailed ? (
                        <CloudinaryImage
                          src={slide.photo.src}
                          alt={slide.photo.alt}
                          fill
                          loading="lazy"
                          quality={90}
                          sizes="100vw"
                          onError={() => markImageFailed(slide.photo.id)}
                        />
                      ) : null}
                      <div className={styles.fallback} aria-hidden="true" />
                    </div>
                    <figcaption className={styles.caption}>
                      <p>{slide.label}</p>
                      <h2>{slide.title}</h2>
                    </figcaption>
                  </div>
                </figure>
              );
            })}
          </div>
        </div>

        <div className={styles.dots} role="group" aria-label="Choose photograph">
          {gardenJourneySlides.map((slide, index) => (
            <button
              type="button"
              className={index === selectedIndex ? styles.activeDot : ""}
              key={slide.photo.id}
              onClick={() => emblaApi?.scrollTo(index)}
              aria-label={`Show photograph ${index + 1}: ${slide.label}`}
              aria-current={index === selectedIndex ? "true" : undefined}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
