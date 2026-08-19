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

const RASTER_EXTENSIONS = [".jpg", ".jpeg", ".webp", ".png", ".avif"];
const ALL_EXTENSIONS = [...RASTER_EXTENSIONS, ".svg"];

function publicUrl(industryId: string, slug: string, filename: string): string {
  return `/images/${industryId}/${slug}/${filename}`;
}

function isRaster(filename: string): boolean {
  const lower = filename.toLowerCase();
  return RASTER_EXTENSIONS.some((ext) => lower.endsWith(ext));
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
    .filter((f) => ALL_EXTENSIONS.some((ext) => f.toLowerCase().endsWith(ext)));

  const raster = files
    .filter(isRaster)
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
  const placeholders = files
    .filter((f) => !isRaster(f))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

  return raster.length ? raster : placeholders;
}

function pickNext(
  urls: string[],
  used: string[],
  preferRaster = true,
): string {
  for (const url of urls) {
    if (used.includes(url)) continue;
    const name = url.split("/").pop() ?? "";
    if (preferRaster && !isRaster(name)) continue;
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
    (namedHero && isRaster(namedHero.split("/").pop() ?? "")) ? namedHero
    : urls[0] ?? namedHero ?? "";

  const used: string[] = hero ? [hero] : [];

  let content1 =
    namedC1 && isRaster(namedC1.split("/").pop() ?? "") ? namedC1 : "";
  if (!content1) content1 = pickNext(urls, used, true);
  if (content1) used.push(content1);

  let content2 =
    namedC2 && isRaster(namedC2.split("/").pop() ?? "") ? namedC2 : "";
  if (!content2) content2 = pickNext(urls, used, true);
  if (!content2 && namedC1 && !used.includes(namedC1)) content2 = namedC1;
  if (!content1 && namedC1 && !used.includes(namedC1)) {
    content1 = namedC1;
    used.push(content1);
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
    return {
      hero: fromFolder.hero || toy?.hero || "",
      content: [
        fromFolder.content[0] || toy?.content[0] || "",
        fromFolder.content[1] || toy?.content[1] || "",
      ],
    };
  }

  if (fromFolder.hero || fromFolder.content[0] || fromFolder.content[1]) {
    return fromFolder;
  }

  if (slug !== "category" && slug !== "hub") {
    const categorySlug = industryId === "expertise" ? "hub" : "category";
    const fallback = resolveFromFolder(industryId, categorySlug);
    if (fallback.hero || fallback.content[0] || fallback.content[1]) {
      return fallback;
    }
  }

  return EMPTY;
}
