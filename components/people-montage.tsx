"use client";

import { Pause, Play } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { cloudinaryVideoUrl, usesCloudinary } from "../lib/cloudinary-media";
import { CloudinaryImage } from "./cloudinary-image";
import styles from "./people-montage.module.css";

const videoSource = "/videos/aft-people-montage.mp4";
const mobileVideoSource = "/videos/aft-people-montage-mobile.mp4";
const posterSource = "/images/company/aft-tea-workers.jpg";

export function PeopleMontage({ variant }: { variant: "homepage" | "about" }) {
  const frameRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const manualPlayback = useRef(false);
  const userPaused = useRef(false);
  const autoplayBlocked = useRef(false);
  const [shouldLoad, setShouldLoad] = useState(false);
  const [inView, setInView] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;

    const preloadObserver = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
        if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches && !connection?.saveData) setShouldLoad(true);
        preloadObserver.disconnect();
      },
      { rootMargin: "420px 0px" },
    );
    preloadObserver.observe(frame);
    return () => preloadObserver.disconnect();
  }, []);

  useEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;

    const playbackObserver = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting && entry.intersectionRatio >= 0.2),
      { threshold: [0, 0.2, 0.65] },
    );
    playbackObserver.observe(frame);
    return () => playbackObserver.disconnect();
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !shouldLoad) return;
    video.load();
  }, [shouldLoad]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !shouldLoad) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!inView || document.hidden || userPaused.current || (reduceMotion && !manualPlayback.current)) {
      video.pause();
      return;
    }

    if (autoplayBlocked.current) return;
    const playback = video.play();
    playback?.catch(() => {
      autoplayBlocked.current = true;
    });
  }, [inView, shouldLoad]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !shouldLoad) return;
    function visibility() {
      if (document.hidden) video?.pause();
      else if (inView && !userPaused.current && !autoplayBlocked.current && (manualPlayback.current || !window.matchMedia("(prefers-reduced-motion: reduce)").matches)) video?.play().catch(() => { autoplayBlocked.current = true; });
    }
    document.addEventListener("visibilitychange", visibility);
    return () => document.removeEventListener("visibilitychange", visibility);
  }, [inView, shouldLoad]);

  function togglePlayback() {
    const video = videoRef.current;
    if (!video) return;
    manualPlayback.current = true;
    autoplayBlocked.current = false;
    if (!shouldLoad) { setShouldLoad(true); return; }
    if (video.paused) {
      userPaused.current = false;
      video.play().catch(() => { autoplayBlocked.current = true; });
    } else {
      userPaused.current = true;
      video.pause();
    }
  }

  const desktopWidth = variant === "about" ? 1600 : 1200;
  const desktopVideo = cloudinaryVideoUrl(videoSource, desktopWidth);
  const mobileVideo = usesCloudinary(videoSource)
    ? cloudinaryVideoUrl(videoSource, 720)
    : mobileVideoSource;

  return (
    <figure ref={frameRef} className={`${styles.figure} ${styles[variant]}`}>
      <div className={styles.media}>
        <CloudinaryImage
          className={styles.poster}
          src={posterSource}
          alt=""
          fill
          quality={75}
          sizes={variant === "about" ? "(max-width: 800px) 100vw, 70vw" : "(max-width: 800px) 100vw, 62vw"}
        />
        <video
          ref={videoRef}
          muted
          loop
          playsInline
          preload="none"
          data-ready={isReady}
          aria-label="The people and places behind AFT Techno Trade"
          onPlay={() => setIsPlaying(true)}
          onPlaying={() => setIsReady(true)}
          onPause={() => setIsPlaying(false)}
          onError={() => { setHasError(true); setIsReady(false); }}
        >
          {shouldLoad ? <>
            <source src={mobileVideo} type="video/mp4" media="(max-width: 700px)" />
            <source src={desktopVideo} type="video/mp4" />
          </> : null}
        </video>
        {!hasError ? (
          <button
            className={styles.control}
            type="button"
            onClick={togglePlayback}
            aria-label={isPlaying ? "Pause people montage" : "Play people montage"}
            title={isPlaying ? "Pause montage" : "Play montage"}
          >
            {isPlaying ? <Pause aria-hidden="true" size={17} /> : <Play aria-hidden="true" size={17} />}
          </button>
        ) : null}
      </div>
      <figcaption>The people and places behind AFT Techno Trade.</figcaption>
    </figure>
  );
}
