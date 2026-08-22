import { getIndustryImages } from "@/lib/industries/images";
import { TOY_IMAGES } from "@/lib/toy/images";

export type GalleryImage = {
  src: string;
  alt: string;
};

export function getToyGalleryImages(
  slug: string,
  labels: string[] = [],
): GalleryImage[] {
  const images = getIndustryImages("toy", slug);
  const fallback = TOY_IMAGES[slug] ?? TOY_IMAGES.category;

  const candidates = [
    images.hero || fallback?.hero || "",
    images.content[0] || fallback?.content[0] || "",
    images.content[1] || fallback?.content[1] || "",
  ];

  const unique = candidates.filter(
    (src, index) => src && candidates.indexOf(src) === index,
  );

  const slots = unique.length >= 3 ? unique.slice(0, 3) : candidates.slice(0, 3);

  return slots.map((src, index) => ({
    src,
    alt: labels[index] ?? `Toy packaging sample ${index + 1}`,
  }));
}
