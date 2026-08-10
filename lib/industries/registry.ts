import registryData from "@/lib/industries/registry.json";
import type { IndustryMeta, IndustryRegistry } from "@/lib/industries/types";

export const registry = registryData as IndustryRegistry;

export function getIndustryMeta(industryId: string): IndustryMeta {
  const meta = registry.industries[industryId];
  if (!meta) throw new Error(`Unknown industry: ${industryId}`);
  return meta;
}

export function listIndustryIds(): string[] {
  return Object.keys(registry.industries);
}

export const MFG_NAV =
  registry.industries.manufacturing?.nav ??
  ([] as IndustryMeta["nav"]);

export const EXPERTISE_NAV =
  registry.industries.expertise?.nav ?? ([] as IndustryMeta["nav"]);

/** Industries shown in sidebar before the live migrated list. */
export const PLACEHOLDER_INDUSTRIES = [
  { href: "#", label: "Automobile" },
  { href: "#", label: "Baby Care" },
  { href: "#", label: "Cosmetics" },
] as const;
