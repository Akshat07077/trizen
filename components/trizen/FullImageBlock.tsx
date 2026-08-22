"use client";

import ImagePreview from "@/components/trizen/ImagePreview";

type FullImageBlockProps = {
  src: string;
  label: string;
};

export default function FullImageBlock({ src, label }: FullImageBlockProps) {
  return (
    <ImagePreview src={src} alt={label}>
      <figure className="source-image source-image-full">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={label} />
        <figcaption>{label}</figcaption>
      </figure>
    </ImagePreview>
  );
}
