"use client";

import { useEffect, useRef } from "react";

export function CloudinaryHeroVideo({
  desktopSrc,
  mobileSrc,
  poster
}: {
  desktopSrc: string;
  mobileSrc: string;
  poster: string;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const playback = videoRef.current?.play();
    playback?.catch(() => {
      // Safari and Low Power Mode can reject autoplay; the poster remains visible.
    });
  }, []);

  return (
    <video
      ref={videoRef}
      autoPlay
      muted
      loop
      playsInline
      preload="metadata"
      poster={poster}
      aria-hidden="true"
    >
      <source
        src={mobileSrc}
        type="video/mp4"
        media="(max-width: 700px) and (prefers-reduced-motion: no-preference)"
      />
      <source
        src={desktopSrc}
        type="video/mp4"
        media="(min-width: 701px) and (prefers-reduced-motion: no-preference)"
      />
    </video>
  );
}
