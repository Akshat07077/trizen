import { getIndustryImages } from "@/lib/industries/images";
import { isRasterUrl } from "@/lib/industries/image-url";
import { TOY_IMAGES } from "@/lib/toy/images";

export type GalleryImage = {
  src: string;
  alt: string;
};

export function getIndustryGalleryImages(
  industryId: string,
  slug: string,
  labels: string[] = [],
  options: { padTo?: number } = {},
): GalleryImage[] {
  const images = getIndustryImages(industryId, slug);
  const toyFallback =
    industryId === "toy" ? (TOY_IMAGES[slug] ?? TOY_IMAGES.category) : null;

  const candidates = [
    images.hero || toyFallback?.hero || "",
    images.content[0] || toyFallback?.content[0] || "",
    images.content[1] || toyFallback?.content[1] || "",
  ].filter(isRasterUrl);

  const unique = candidates.filter(
    (src, index) => src && candidates.indexOf(src) === index,
  );

  const padTo = options.padTo ?? 0;
  const slots =
    padTo > 0
      ? Array.from({ length: padTo }, (_, index) => unique[index] || "")
      : unique.slice(0, 3);

  return slots.map((src, index) => ({
    src,
    alt: labels[index] ?? `${industryId} packaging sample ${index + 1}`,
  }));
}
