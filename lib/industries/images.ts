import fs from "fs";
import path from "path";
import { TOY_IMAGES } from "@/lib/toy/images";

export type IndustryImageSet = {
  hero: string;
  content: [string, string];
};

const EMPTY: IndustryImageSet = {
  hero: "",
  content: ["", ""],
};

const EXTENSIONS = [".jpg", ".jpeg", ".webp", ".png", ".avif"];

function publicUrl(industryId: string, slug: string, basename: string): string {
  return `/images/${industryId}/${slug}/${basename}`;
}

function resolveSlot(
  industryId: string,
  slug: string,
  basename: string,
): string {
  const dir = path.join(
    process.cwd(),
    "public/images",
    industryId,
    slug,
  );
  for (const ext of EXTENSIONS) {
    const file = path.join(dir, basename + ext);
    if (fs.existsSync(file)) {
      return publicUrl(industryId, slug, basename + ext);
    }
  }
  return "";
}

function resolveFromFolder(industryId: string, slug: string): IndustryImageSet {
  const hero =
    resolveSlot(industryId, slug, "hero") ||
    resolveSlot(industryId, slug, "hero-image");

  const content1 =
    resolveSlot(industryId, slug, "content-1") ||
    resolveSlot(industryId, slug, "content1");

  const content2 =
    resolveSlot(industryId, slug, "content-2") ||
    resolveSlot(industryId, slug, "content2");

  if (hero || content1 || content2) {
    return { hero, content: [content1, content2] };
  }

  const dir = path.join(process.cwd(), "public/images", industryId, slug);
  if (!fs.existsSync(dir)) return EMPTY;

  const files = fs
    .readdirSync(dir)
    .filter((f) => EXTENSIONS.some((ext) => f.toLowerCase().endsWith(ext)))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

  if (!files.length) return EMPTY;

  const urls = files.map((f) => publicUrl(industryId, slug, f));
  return {
    hero: urls[0] ?? "",
    content: [urls[1] ?? "", urls[2] ?? ""],
  };
}

/**
 * Load images for a page. Checks public/images/{industryId}/{slug}/ first.
 * Toys still use lib/toy/images.ts when those paths are defined.
 */
export function getIndustryImages(
  industryId: string,
  slug: string,
): IndustryImageSet {
  const fromFolder = resolveFromFolder(industryId, slug);

  if (industryId === "toy") {
    const toy = TOY_IMAGES[slug] ?? TOY_IMAGES.category;
    return {
      hero: fromFolder.hero || toy.hero,
      content: [
        fromFolder.content[0] || toy.content[0],
        fromFolder.content[1] || toy.content[1],
      ],
    };
  }

  if (fromFolder.hero || fromFolder.content[0] || fromFolder.content[1]) {
    return fromFolder;
  }

  // Category-level fallback images
  if (slug !== "category" && slug !== "hub") {
    const categorySlug =
      industryId === "expertise" ? "hub" : "category";
    const fallback = resolveFromFolder(industryId, categorySlug);
    if (fallback.hero || fallback.content[0] || fallback.content[1]) {
      return fallback;
    }
  }

  return EMPTY;
}
