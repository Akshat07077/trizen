"use client";

import ImagePreview from "@/components/trizen/ImagePreview";
import type { GalleryImage } from "@/lib/toy/gallery";

type ToyHeroGalleryProps = {
  images: GalleryImage[];
};

export default function ToyHeroGallery({ images }: ToyHeroGalleryProps) {
  const items =
    images.length >= 3
      ? images.slice(0, 3)
      : [
          ...images,
          ...Array.from({ length: 3 - images.length }, (_, index) => ({
            src: "",
            alt: `Packaging sample ${images.length + index + 1}`,
          })),
        ];

  return (
    <section className="toy-hero-gallery" aria-label="Product packaging samples">
      <div className="toy-hero-gallery-grid">
        {items.map((item, index) => (
          <div key={`${item.src}-${index}`} className="toy-hero-gallery-card">
            {item.src ? (
              <ImagePreview src={item.src} alt={item.alt}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={item.src} alt={item.alt} />
              </ImagePreview>
            ) : (
              <div className="toy-hero-gallery-placeholder">
                <span>Photo {index + 1}</span>
                <small>Product packaging sample</small>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
