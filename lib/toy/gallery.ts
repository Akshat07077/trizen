import {
  getIndustryGalleryImages,
  type GalleryImage,
} from "@/lib/industries/gallery";

export type { GalleryImage };

/** @deprecated Use getIndustryGalleryImages */
export function getToyGalleryImages(
  slug: string,
  labels: string[] = [],
): GalleryImage[] {
  return getIndustryGalleryImages("toy", slug, labels);
}
