import fs from "fs";
import path from "path";
import { TOY_IMAGES } from "@/lib/toy/images";
import { isRasterFilename, isRasterUrl } from "@/lib/industries/image-url";

export type IndustryImageSet = {
  hero: string;
  content: [string, string];
};

const EMPTY: IndustryImageSet = {
  hero: "",
  content: ["", ""],
};

const RASTER_EXTENSIONS = [".jpg", ".jpeg", ".webp", ".png", ".avif"];
const ALL_EXTENSIONS = [...RASTER_EXTENSIONS, ".svg"];

function publicUrl(industryId: string, slug: string, filename: string): string {
  return `/images/${industryId}/${slug}/${filename}`;
}

function sanitizeImageSet(set: IndustryImageSet): IndustryImageSet {
  return {
    hero: isRasterUrl(set.hero) ? set.hero : "",
    content: [
      isRasterUrl(set.content[0]) ? set.content[0] : "",
      isRasterUrl(set.content[1]) ? set.content[1] : "",
    ],
  };
}

function resolveNamedSlot(
  industryId: string,
  slug: string,
  basename: string,
): string {
  const dir = path.join(process.cwd(), "public/images", industryId, slug);
  for (const ext of ALL_EXTENSIONS) {
    const file = path.join(dir, basename + ext);
    if (fs.existsSync(file)) {
      return publicUrl(industryId, slug, basename + ext);
    }
  }
  return "";
}

function listFolderFiles(industryId: string, slug: string): string[] {
  const dir = path.join(process.cwd(), "public/images", industryId, slug);
  if (!fs.existsSync(dir)) return [];

  const files = fs
    .readdirSync(dir)
    .filter((f) => isRasterFilename(f))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

  return files;
}

function pickNext(
  urls: string[],
  used: string[],
  preferRaster = true,
): string {
  for (const url of urls) {
    if (used.includes(url)) continue;
    const name = url.split("/").pop() ?? "";
    if (preferRaster && !isRasterFilename(name)) continue;
    return url;
  }
  for (const url of urls) {
    if (!used.includes(url)) return url;
  }
  return "";
}

function resolveFromFolder(industryId: string, slug: string): IndustryImageSet {
  const files = listFolderFiles(industryId, slug);
  const urls = files.map((f) => publicUrl(industryId, slug, f));

  const namedHero =
    resolveNamedSlot(industryId, slug, "hero") ||
    resolveNamedSlot(industryId, slug, "hero-image");
  const namedC1 =
    resolveNamedSlot(industryId, slug, "content-1") ||
    resolveNamedSlot(industryId, slug, "content1");
  const namedC2 =
    resolveNamedSlot(industryId, slug, "content-2") ||
    resolveNamedSlot(industryId, slug, "content2");

  const hero =
    namedHero && isRasterUrl(namedHero) ? namedHero : urls.find(isRasterUrl) ?? "";

  const used: string[] = hero ? [hero] : [];

  let content1 = namedC1 && isRasterUrl(namedC1) ? namedC1 : "";
  if (!content1) content1 = pickNext(urls, used, true);
  if (content1) used.push(content1);

  let content2 = namedC2 && isRasterUrl(namedC2) ? namedC2 : "";
  if (!content2) content2 = pickNext(urls, used, true);
  if (!content2 && namedC1 && isRasterUrl(namedC1) && !used.includes(namedC1)) {
    content2 = namedC1;
  }
  if (!content1 && namedC1 && isRasterUrl(namedC1) && !used.includes(namedC1)) {
    content1 = namedC1;
  }

  return { hero, content: [content1, content2] };
}

/**
 * Load images for a page. Checks public/images/{industryId}/{slug}/ first.
 * Toys use lib/toy/images.ts when folder slots are empty.
 */
export function getIndustryImages(
  industryId: string,
  slug: string,
): IndustryImageSet {
  const fromFolder = resolveFromFolder(industryId, slug);

  if (industryId === "toy") {
    const toy = TOY_IMAGES[slug] ?? TOY_IMAGES.category;
    return sanitizeImageSet({
      hero: fromFolder.hero || toy?.hero || "",
      content: [
        fromFolder.content[0] || toy?.content[0] || "",
        fromFolder.content[1] || toy?.content[1] || "",
      ],
    });
  }

  if (fromFolder.hero || fromFolder.content[0] || fromFolder.content[1]) {
    return sanitizeImageSet(fromFolder);
  }

  if (slug !== "category" && slug !== "hub") {
    const categorySlug = industryId === "expertise" ? "hub" : "category";
    const fallback = resolveFromFolder(industryId, categorySlug);
    if (fallback.hero || fallback.content[0] || fallback.content[1]) {
      return sanitizeImageSet(fallback);
    }
  }

  return EMPTY;
}

/** Hero photo for a category card, resolved from its sub-page href. */
export function getCardImageFromHref(
  industryId: string,
  href?: string,
): string {
  if (!href || href === "#") return "";
  const parts = href.split("/").filter(Boolean);
  if (parts[0] !== industryId) return "";
  const slug = parts[1];
  if (!slug || slug === "category" || slug === "hub") return "";
  const images = getIndustryImages(industryId, slug);
  return images.hero || images.content[0] || "";
}

/** Prefer content-2 for the design tab panel (matches reference HTML source-image order). */
export function getDesignPanelImage(images: IndustryImageSet): string {
  const candidates = [images.content[1], images.content[0], images.hero];
  return candidates.find(isRasterUrl) ?? "";
}

export function designKickerLabel(
  meta: { label: string; route: string; nav?: { href: string; label: string }[] },
  slug: string,
): string {
  const navItem = meta.nav?.find(
    (item) =>
      item.href.endsWith(`/${slug}`) ||
      (slug === "category" && item.href === meta.route) ||
      (slug === "hub" && item.href === meta.route),
  );
  if (navItem) {
    const short = navItem.label
      .replace(/\s*&\s*.*/i, "")
      .replace(/\s*packaging\s*$/i, "")
      .trim();
    return `${short} control`;
  }
  return `${meta.label} packaging control`;
}
