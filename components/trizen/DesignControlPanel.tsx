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

/**
 * Design panel titles: match HTML process labels (name only).
 * Tabs already show 01–04, so strip leading "1." / "1Heat" / "Step 1 —".
 */
function designPanelTitle(raw: string): string {
  return raw
    .replace(/^Step\s*\d+\s*[—–-]\s*/i, "")
    .replace(/^\d+\.\s*/, "")
    .replace(/^(\d+)([A-Za-z])/, "$2")
    .replace(/^\d+\s+/, "")
    .trim();
}

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

  const displayTitle = designPanelTitle(item.title);

  const selectTab = (index: number) => {
    if (index === active) return;
    setAnimating(true);
    setActive(index);
    window.setTimeout(() => setAnimating(false), 400);
  };

  return (
    <div className="design-control-panel">
      <figure className="design-media">
        {imageSrc ? (
          <ImagePreview src={imageSrc} alt={imageAlt}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={imageSrc} alt={imageAlt} />
          </ImagePreview>
        ) : (
          <div className="design-media-placeholder" aria-hidden="true" />
        )}
        {imageCaption ? (
          <span className="design-media-caption">{imageCaption}</span>
        ) : null}
      </figure>

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
        <h3 className="design-title">{displayTitle}</h3>
        <p className="design-description">{item.desc}</p>
      </div>
    </div>
  );
}
