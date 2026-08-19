"use client";

import { useEffect, useId, useState } from "react";
import { createPortal } from "react-dom";

type ImagePreviewProps = {
  src: string;
  alt: string;
  children: React.ReactNode;
};

export default function ImagePreview({ src, alt, children }: ImagePreviewProps) {
  const [hover, setHover] = useState(false);
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

  const popup =
    mounted && (hover || lightbox)
      ? createPortal(
          <div
            className={`image-preview-layer${lightbox ? " is-lightbox" : " is-hover"}`}
            role={lightbox ? "dialog" : "tooltip"}
            aria-modal={lightbox || undefined}
            aria-labelledby={titleId}
            onMouseEnter={() => {
              if (!lightbox) setHover(true);
            }}
            onMouseLeave={() => {
              if (!lightbox) setHover(false);
            }}
            onClick={() => {
              if (lightbox) setLightbox(false);
            }}
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
              {lightbox ? (
                <button
                  type="button"
                  className="image-preview-close"
                  onClick={() => setLightbox(false)}
                >
                  Close
                </button>
              ) : (
                <p className="image-preview-hint">Click the page image for a larger view</p>
              )}
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
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        onFocus={() => setHover(true)}
        onBlur={() => setHover(false)}
        onClick={() => {
          setHover(false);
          setLightbox(true);
        }}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            setHover(false);
            setLightbox(true);
          }
        }}
        aria-label={`View full image: ${alt}`}
      >
        {children}
        <span className="image-preview-badge">Hover for full photo</span>
      </div>
      {popup}
    </>
  );
}
