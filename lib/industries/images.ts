import { TOY_IMAGES } from "@/lib/toy/images";

export type IndustryImageSet = {
  hero: string;
  content: [string, string];
};

const EMPTY: IndustryImageSet = {
  hero: "",
  content: ["", ""],
};

export function getIndustryImages(
  industryId: string,
  slug: string,
): IndustryImageSet {
  if (industryId === "toy") {
    const set = TOY_IMAGES[slug] ?? TOY_IMAGES.category;
    return { hero: set.hero, content: set.content };
  }

  return EMPTY;
}
