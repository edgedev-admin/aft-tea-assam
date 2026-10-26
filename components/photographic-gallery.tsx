"use client";

import { ChevronLeft, ChevronRight, Expand, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { storyPhotos, type PhotoCategory, type StoryPhoto } from "../lib/photographic-stories";
import { CloudinaryImage } from "./cloudinary-image";
import styles from "./photographic-gallery.module.css";

const filters: Array<{ value: "all" | PhotoCategory; label: string }> = [
  { value: "all", label: "All photographs" },
  { value: "gardens", label: "Tea gardens" },
  { value: "people", label: "People and harvest" },
  { value: "factory", label: "Inside the factory" },
  { value: "products", label: "Products and campaigns" },
];

export function PhotographicGallery() {
  const [filter, setFilter] = useState<(typeof filters)[number]["value"]>("all");
  const [activePhoto, setActivePhoto] = useState<StoryPhoto | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const isLightboxOpen = Boolean(activePhoto);
  const approvedPhotos = useMemo(() => storyPhotos.filter((photo) => photo.publicationApproval !== "required"), []);
  const visiblePhotos = useMemo(
    () => filter === "all" ? approvedPhotos : approvedPhotos.filter((photo) => photo.category === filter),
    [approvedPhotos, filter],
  );

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (activePhoto && !dialog.open) dialog.showModal();
    if (!activePhoto && dialog.open) dialog.close();
  }, [activePhoto]);

  useEffect(() => {
    if (!isLightboxOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = previousOverflow; };
  }, [isLightboxOpen]);

  function move(step: number) {
    if (!activePhoto) return;
    const currentIndex = visiblePhotos.findIndex((photo) => photo.id === activePhoto.id);
    const nextIndex = (currentIndex + step + visiblePhotos.length) % visiblePhotos.length;
    setActivePhoto(visiblePhotos[nextIndex]);
  }

  function closeLightbox() {
    setActivePhoto(null);
    window.setTimeout(() => triggerRef.current?.focus(), 0);
  }

  function handleDialogKey(event: React.KeyboardEvent<HTMLDialogElement>) {
    if (event.key === "ArrowLeft") move(-1);
    if (event.key === "ArrowRight") move(1);
  }

  return (
    <section className={styles.archive} aria-labelledby="archive-title">
      <div className={styles.shell}>
        <header className={styles.header}>
          <div>
            <p>Photographic archive</p>
            <h1 id="archive-title">Land, people, process and tea.</h1>
          </div>
          <p>Explore photographs from Assam tea gardens, harvesting, factory operations and the AFT product collection.</p>
        </header>

        <div className={styles.filters} aria-label="Filter photographs">
          {filters.map((item) => (
            <button
              key={item.value}
              type="button"
              onClick={() => setFilter(item.value)}
              aria-pressed={filter === item.value}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className={styles.grid}>
          {visiblePhotos.map((photo, index) => (
            <figure className={styles.item} data-layout={(index % 6) + 1} key={photo.id}>
              <button type="button" onClick={(event) => { triggerRef.current = event.currentTarget; setActivePhoto(photo); }} aria-label={`Open ${photo.caption}`}>
                <CloudinaryImage
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  quality={90}
                  sizes="(max-width: 620px) 100vw, (max-width: 980px) 50vw, 33vw"
                  style={{ objectPosition: photo.objectPosition ?? "center" }}
                />
                <span className={styles.expand}><Expand aria-hidden="true" /></span>
              </button>
              <figcaption>
                <span>{photo.caption}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>

      <dialog
        className={styles.lightbox}
        ref={dialogRef}
        onCancel={(event) => {
          event.preventDefault();
          closeLightbox();
        }}
        onClose={closeLightbox}
        onKeyDown={handleDialogKey}
        aria-label="Photograph preview"
      >
        {activePhoto && (
          <div className={styles.lightboxInner}>
            <button className={styles.close} type="button" onClick={closeLightbox} aria-label="Close photograph preview">
              <X aria-hidden="true" />
            </button>
            <div className={styles.lightboxImage}>
              <CloudinaryImage
                key={activePhoto.id}
                src={activePhoto.src}
                alt={activePhoto.alt}
                fill
                quality={90}
                sizes="95vw"
                style={{ objectPosition: activePhoto.objectPosition ?? "center" }}
              />
            </div>
            <div className={styles.lightboxFooter}>
              <p>{activePhoto.caption}</p>
              <div>
                <button type="button" onClick={() => move(-1)} aria-label="Previous photograph"><ChevronLeft aria-hidden="true" /></button>
                <button type="button" onClick={() => move(1)} aria-label="Next photograph"><ChevronRight aria-hidden="true" /></button>
              </div>
            </div>
          </div>
        )}
      </dialog>
    </section>
  );
}
