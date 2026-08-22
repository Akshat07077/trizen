"use client";

import { useState } from "react";
import ImagePreview from "@/components/trizen/ImagePreview";
import type { IndustryStrip } from "@/lib/industries/types";

type DesignControlPanelProps = {
  items: IndustryStrip[];
  imageSrc?: string;
  imageAlt: string;
  imageCaption?: string;
  kickerLabel?: string;
};

export default function DesignControlPanel({
  items,
  imageSrc,
  imageAlt,
  imageCaption,
  kickerLabel = "Packaging control",
}: DesignControlPanelProps) {
  const [active, setActive] = useState(0);
  const [animating, setAnimating] = useState(false);
  const item = items[active] ?? items[0];

  if (!item) return null;

  const selectTab = (index: number) => {
    if (index === active) return;
    setAnimating(true);
    setActive(index);
    window.setTimeout(() => setAnimating(false), 400);
  };

  return (
    <div
      className={`design-control-panel${imageSrc ? "" : " no-media"}`}
    >
      {imageSrc ? (
        <figure className="design-media">
          <ImagePreview src={imageSrc} alt={imageAlt}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={imageSrc} alt={imageAlt} />
          </ImagePreview>
          {imageCaption ? (
            <span className="design-media-caption">{imageCaption}</span>
          ) : null}
        </figure>
      ) : null}

      <div className={`design-detail${animating ? " is-changing" : ""}`}>
        <div className="design-tabs" role="tablist" aria-label={kickerLabel}>
          {items.map((entry, index) => (
            <button
              key={entry.title}
              type="button"
              role="tab"
              className={`design-tab${index === active ? " active" : ""}`}
              aria-selected={index === active}
              aria-label={entry.title}
              onClick={() => selectTab(index)}
            >
              {String(index + 1).padStart(2, "0")}
            </button>
          ))}
        </div>
        <p className="design-kicker">
          {String(active + 1).padStart(2, "0")} / {kickerLabel}
        </p>
        <h3 className="design-title">{item.title}</h3>
        <p className="design-description">{item.desc}</p>
      </div>
    </div>
  );
}
