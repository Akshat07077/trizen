import { getIndustryImages } from "@/lib/industries/images";
import { TOY_IMAGES } from "@/lib/toy/images";

export type GalleryImage = {
  src: string;
  alt: string;
};

export function getIndustryGalleryImages(
  industryId: string,
  slug: string,
  labels: string[] = [],
): GalleryImage[] {
  const images = getIndustryImages(industryId, slug);
  const toyFallback =
    industryId === "toy" ? (TOY_IMAGES[slug] ?? TOY_IMAGES.category) : null;

  const candidates = [
    images.hero || toyFallback?.hero || "",
    images.content[0] || toyFallback?.content[0] || "",
    images.content[1] || toyFallback?.content[1] || "",
  ];

  const unique = candidates.filter(
    (src, index) => src && candidates.indexOf(src) === index,
  );

  const slots =
    unique.length >= 3 ? unique.slice(0, 3) : candidates.slice(0, 3);

  return slots.map((src, index) => ({
    src,
    alt: labels[index] ?? `${industryId} packaging sample ${index + 1}`,
  }));
}
