"use client";

import { Pause, Play } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { CloudinaryImage } from "./cloudinary-image";
import styles from "./cloudinary-hero-video.module.css";

export function CloudinaryHeroVideo({ desktopSrc, mobileSrc, posterSource, mobilePoster }: { desktopSrc: string; mobileSrc: string; posterSource: string; mobilePoster: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const userPaused = useRef(false);
  const autoplayBlocked = useRef(false);
  const inView = useRef(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    const automaticPlayback = () => inView.current && !motion.matches && !connection?.saveData && !userPaused.current && !autoplayBlocked.current;

    function play() {
      if (!video || !automaticPlayback() || document.hidden || !video.paused) return;
      const selectedPoster = video.parentElement?.querySelector("img")?.currentSrc;
      if (selectedPoster) video.poster = selectedPoster;
      if (!video.getAttribute("src")) video.src = window.matchMedia("(max-width: 700px)").matches ? mobileSrc : desktopSrc;
      video.muted = true;
      video.defaultMuted = true;
      video.play().catch(() => { autoplayBlocked.current = true; });
    }

    play();
    const observer = new IntersectionObserver(([entry]) => {
      inView.current = entry.isIntersecting && entry.intersectionRatio >= 0.05;
      if (inView.current) play();
      else video.pause();
    }, { threshold: 0.05 });
    observer.observe(video);
    function visibility() { if (document.hidden) video?.pause(); else play(); }
    function preference() { if (motion.matches) video?.pause(); }
    document.addEventListener("visibilitychange", visibility);
    motion.addEventListener("change", preference);
    return () => { observer.disconnect(); document.removeEventListener("visibilitychange", visibility); motion.removeEventListener("change", preference); video.pause(); };
  }, [desktopSrc, mobileSrc]);

  function togglePlayback() {
    const video = videoRef.current;
    if (!video || hasError) return;
    if (!video.paused) { userPaused.current = true; video.pause(); return; }
    userPaused.current = false;
    autoplayBlocked.current = false;
    const selectedPoster = video.parentElement?.querySelector("img")?.currentSrc;
    if (selectedPoster) video.poster = selectedPoster;
    if (!video.getAttribute("src")) video.src = window.matchMedia("(max-width: 700px)").matches ? mobileSrc : desktopSrc;
    video.muted = true;
    video.defaultMuted = true;
    video.play().catch(() => { autoplayBlocked.current = true; });
  }

  return <>
    <div className={`video-hero-media ${styles.media}`} aria-hidden="true">
      <div className={`video-hero-fallback ${styles.poster}`}><picture><source media="(max-width: 700px)" srcSet={mobilePoster} /><CloudinaryImage src={posterSource} alt="" fill loading="eager" fetchPriority="high" quality={90} sizes="100vw" /></picture></div>
      <video ref={videoRef} className={styles.video} data-ready={isReady} autoPlay muted loop playsInline preload="none" onPlaying={() => { setIsReady(true); setIsPlaying(true); }} onPause={() => setIsPlaying(false)} onError={() => { setHasError(true); setIsReady(false); setIsPlaying(false); }} />
    </div>
    {!hasError && <button className={styles.control} type="button" onClick={togglePlayback} aria-label={isPlaying ? "Pause background video" : "Play background video"} title={isPlaying ? "Pause background video" : "Play background video"}>{isPlaying ? <Pause size={17} aria-hidden="true" /> : <Play size={17} aria-hidden="true" />}</button>}
  </>;
}
