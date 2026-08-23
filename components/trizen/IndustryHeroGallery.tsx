"use client";

import ImagePreview from "@/components/trizen/ImagePreview";
import type { GalleryImage } from "@/lib/industries/gallery";

type IndustryHeroGalleryProps = {
  images: GalleryImage[];
};

export default function IndustryHeroGallery({
  images,
}: IndustryHeroGalleryProps) {
  if (!images.length) return null;

  const items = images.slice(0, 3);

  return (
    <section className="hero-gallery" aria-label="Product packaging samples">
      <div className={`hero-gallery-grid hero-gallery-grid--${items.length}`}>
        {items.map((item, index) => (
          <div key={`${item.src}-${index}`} className="hero-gallery-card">
            <ImagePreview src={item.src} alt={item.alt}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={item.src} alt={item.alt} />
            </ImagePreview>
          </div>
        ))}
      </div>
    </section>
  );
}
