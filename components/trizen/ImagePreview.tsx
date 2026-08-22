"use client";

import { useEffect, useId, useState } from "react";
import { createPortal } from "react-dom";

type ImagePreviewProps = {
  src: string;
  alt: string;
  children: React.ReactNode;
};

export default function ImagePreview({ src, alt, children }: ImagePreviewProps) {
  const [lightbox, setLightbox] = useState(false);
  const [mounted, setMounted] = useState(false);
  const titleId = useId();

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!lightbox) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setLightbox(false);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [lightbox]);

  const lightboxLayer =
    mounted && lightbox
      ? createPortal(
          <div
            className="image-preview-layer is-lightbox"
            role="dialog"
            aria-modal
            aria-labelledby={titleId}
            onClick={() => setLightbox(false)}
          >
            <div
              className="image-preview-card"
              onClick={(event) => event.stopPropagation()}
            >
              <p id={titleId} className="image-preview-kicker">
                Full image · no crop
              </p>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt={alt} />
              <button
                type="button"
                className="image-preview-close"
                onClick={() => setLightbox(false)}
              >
                Close
              </button>
            </div>
          </div>,
          document.body,
        )
      : null;

  return (
    <>
      <div
        className="image-preview-trigger"
        role="button"
        tabIndex={0}
        onClick={() => setLightbox(true)}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            setLightbox(true);
          }
        }}
        aria-label={`View full image: ${alt}`}
      >
        {children}
        <span className="image-preview-badge">Click for full photo</span>
      </div>
      {lightboxLayer}
    </>
  );
}
