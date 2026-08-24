import { getToyPage } from "@/lib/toy/get-page";
import { getIndustryMeta, registry } from "@/lib/industries/registry";
import { industryContentMap } from "@/lib/industries/content-map";
import type { IndustryPageContent } from "@/lib/industries/types";

export function resolvePageSlug(
  industryId: string,
  slugParts?: string[],
): string {
  const meta = getIndustryMeta(industryId);

  if (slugParts && slugParts.length > 0) {
    return slugParts.join("/");
  }

  if (industryId === "expertise") return "hub";
  if (industryId === "manufacturing") return "category";
  if (meta.pages.includes("category")) return "category";
  return meta.pages[0] ?? "category";
}

export function getIndustryPage(
  industryId: string,
  slugParts?: string[],
): IndustryPageContent {
  const slug = resolvePageSlug(industryId, slugParts);

  if (industryId === "toy") {
    try {
      return getToyPage(slug) as IndustryPageContent;
    } catch {
      // Fall back to extracted JSON below.
    }
  }

  const page = industryContentMap[industryId]?.[slug];
  if (!page) {
    throw new Error(`Unknown page: ${industryId}/${slug}`);
  }

  return page;
}

export function getAllStaticIndustryParams(): {
  industry: string;
  slug?: string[];
}[] {
  const params: { industry: string; slug?: string[] }[] = [];

  for (const [industryId, meta] of Object.entries(registry.industries)) {
    params.push({ industry: industryId });

    for (const page of meta.pages) {
      if (page === "category") continue;
      params.push({ industry: industryId, slug: [page] });
    }
  }

  return params;
}
