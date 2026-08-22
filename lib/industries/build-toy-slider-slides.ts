import type { IndustryProduct, IndustryTable } from "@/lib/industries/types";

export type ComponentSlide = {
  title: string;
  meta: { label: string; value: string }[];
};

function slidesFromTable(table: IndustryTable): ComponentSlide[] {
  const [, ...metaHeaders] = table.headers;
  return table.rows.map((row) => ({
    title: row[0] ?? "",
    meta: metaHeaders.map((label, index) => ({
      label,
      value: row[index + 1] ?? "",
    })),
  }));
}

function slidesFromProducts(products: IndustryProduct[]): ComponentSlide[] {
  return products.map((product) => ({
    title: product.name,
    meta: [
      { label: "Description", value: product.desc },
      { label: "Packaging page", value: product.link ?? "View sub-page" },
    ],
  }));
}

export function buildToySliderSlides(section: {
  table?: IndustryTable;
  products?: IndustryProduct[];
}): ComponentSlide[] {
  if (section.table?.rows.length) return slidesFromTable(section.table);
  if (section.products?.length) return slidesFromProducts(section.products);
  return [];
}
