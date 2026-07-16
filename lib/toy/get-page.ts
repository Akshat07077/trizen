import type { ToyPageContent } from "@/lib/toy/types";
import category from "@/lib/toy/content/category.json";
import actionFigure from "@/lib/toy/content/action-figure.json";
import setInserts from "@/lib/toy/content/set-inserts.json";
import customMolded from "@/lib/toy/content/custom-molded.json";
import packagingTrays from "@/lib/toy/content/packaging-trays.json";
import protective from "@/lib/toy/content/protective.json";
import retailDisplay from "@/lib/toy/content/retail-display.json";

const pages: Record<string, ToyPageContent> = {
  category: category as ToyPageContent,
  "action-figure": actionFigure as ToyPageContent,
  "set-inserts": setInserts as ToyPageContent,
  "custom-molded": customMolded as ToyPageContent,
  "packaging-trays": packagingTrays as ToyPageContent,
  protective: protective as ToyPageContent,
  "retail-display": retailDisplay as ToyPageContent,
};

export function getToyPage(slug: string): ToyPageContent {
  const page = pages[slug];
  if (!page) throw new Error(`Unknown toy page: ${slug}`);
  return page;
}
