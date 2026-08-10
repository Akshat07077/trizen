/**
 * Extract all Trizen Clean_Sidebar / New_Design HTML into JSON content
 * + industry registry for Next.js routes.
 */
const fs = require("fs");
const path = require("path");

const HTML_DIR = path.resolve(__dirname, "../../");
const OUT_CONTENT = path.resolve(__dirname, "../lib/industries/content");
const OUT_REGISTRY = path.resolve(
  __dirname,
  "../lib/industries/registry.json",
);
const OUT_CONTENT_MAP = path.resolve(
  __dirname,
  "../lib/industries/content-map.ts",
);

const INDUSTRY_META = {
  toy: {
    prefix: "Trizen_Toy_",
    route: "/toy",
    label: "Toys",
    sidebarTitle: "Toy pages",
    ctaTitle: "Toy Packaging Quote",
    ctaText:
      "Retail trays · Action figure packs · Protective packaging · Display trays · Custom molded — ISO 9001:2015 · Vapi.",
    footerLabel: "Toy Packaging",
    faqSub: "Toy thermoforming packaging",
  },
  electronics: {
    prefix: "Trizen_Elec_",
    route: "/electronics",
    label: "Electronics",
    sidebarTitle: "Electronics pages",
    ctaTitle: "Electronics Packaging Quote",
    ctaText:
      "ESD-safe trays · PCB packaging · Connector trays · Consumer electronics — ISO 9001:2015 · Vapi.",
    footerLabel: "Electronics Packaging",
    faqSub: "Electronics thermoforming packaging",
  },
  fmcg: {
    prefix: "Trizen_FMCG_",
    route: "/fmcg",
    label: "FMCG",
    sidebarTitle: "FMCG pages",
    ctaTitle: "FMCG Packaging Quote",
    ctaText:
      "Food & beverage · Bakery · Retail · Custom FMCG trays — ISO 9001:2015 · Vapi.",
    footerLabel: "FMCG Packaging",
    faqSub: "FMCG thermoforming packaging",
  },
  industrial: {
    prefix: "Trizen_Ind_",
    route: "/industrial",
    label: "Industrial",
    sidebarTitle: "Industrial pages",
    ctaTitle: "Industrial Packaging Quote",
    ctaText:
      "Power tools · Enclosures · Machinery covers — ISO 9001:2015 · Vapi.",
    footerLabel: "Industrial Packaging",
    faqSub: "Industrial thermoforming packaging",
  },
  medical: {
    prefix: "Trizen_Med_",
    route: "/medical",
    label: "Medical",
    sidebarTitle: "Medical pages",
    ctaTitle: "Medical Packaging Quote",
    ctaText:
      "Cardiology · Vascular · Drug delivery · Wound care — ISO 9001:2015 · Vapi.",
    footerLabel: "Medical Device Packaging",
    faqSub: "Medical device packaging",
  },
  pharmaceutical: {
    prefix: "Trizen_Pharma_",
    route: "/pharmaceutical",
    label: "Pharmaceutical",
    sidebarTitle: "Pharmaceutical pages",
    ctaTitle: "Pharma Packaging Quote",
    ctaText:
      "Sterile · Syringe · Ampoule · Strip · Tamper-proof — ISO 9001:2015 · Vapi.",
    footerLabel: "Pharmaceutical Packaging",
    faqSub: "Pharmaceutical packaging",
  },
  stationery: {
    prefix: "Trizen_Stat_",
    route: "/stationery",
    label: "Stationery",
    sidebarTitle: "Stationery pages",
    ctaTitle: "Stationery Packaging Quote",
    ctaText:
      "Pen & marker · Eraser · School kit · Display · Gift set — ISO 9001:2015 · Vapi.",
    footerLabel: "Stationery Packaging",
    faqSub: "Stationery thermoforming packaging",
  },
  manufacturing: {
    prefix: "Trizen_Mfg_",
    route: "/manufacturing",
    label: "Manufacturing",
    sidebarTitle: "Manufacturing pages",
    ctaTitle: "Manufacturing Capabilities",
    ctaText:
      "Vacuum forming · Pressure forming · Blister · Clamshell · Materials — Vapi.",
    footerLabel: "Manufacturing Capabilities",
    faqSub: "Trizen manufacturing capabilities",
  },
  expertise: {
    prefix: "Trizen_Expertise_",
    route: "/expertise",
    label: "Expertise",
    sidebarTitle: "Expertise pages",
    ctaTitle: "Trizen Expertise",
    ctaText:
      "Cleanroom · Contract manufacturing · R&D · Unique offer — Vapi.",
    footerLabel: "Trizen Expertise",
    faqSub: "Trizen expertise and services",
  },
};

function decode(s) {
  return (s || "")
    .replace(/&amp;/g, "&")
    .replace(/&mdash;/g, "—")
    .replace(/&nbsp;/g, " ")
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .replace(/<[^>]+>/g, "")
    .trim();
}

function pascalToKebab(name) {
  return name
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/([A-Z])([A-Z][a-z])/g, "$1-$2")
    .replace(/_/g, "-")
    .toLowerCase();
}

function fileToSlug(filename, prefix) {
  let middle = filename
    .replace(prefix, "")
    .replace(/_Clean_Sidebar\.html$/i, "")
    .replace(/_New_Design\.html$/i, "");
  if (/^category$/i.test(middle)) return "category";
  if (middle === "ExpertiseHub") return "hub";
  if (middle === "RnDInnovation") return "rnd-innovation";
  return pascalToKebab(middle);
}

function parseTable(html) {
  const headers = [...html.matchAll(/<th>([\s\S]*?)<\/th>/gi)].map((m) =>
    decode(m[1]),
  );
  const rows = [];
  for (const row of html.matchAll(/<tr>([\s\S]*?)<\/tr>/gi)) {
    if (/<th/i.test(row[1])) continue;
    const cells = [...row[1].matchAll(/<td>([\s\S]*?)<\/td>/gi)].map((m) =>
      decode(m[1]),
    );
    if (cells.length) rows.push(cells);
  }
  return headers.length ? { headers, rows } : null;
}

function splitSections(contentHtml) {
  const parts = contentHtml.split(/<div class="sec">/i).slice(1);
  return parts.map((chunk) => {
    const block = `<div class="sec">${chunk}`;
    const end = block.search(/<\/div>\s*(?=<div class="(sec|mid-cta|bottom-cta)")/i);
    const secHtml = end > 0 ? block.slice(0, end + 6) : block;

    const eyMatch = secHtml.match(
      /<div class="ey(?:\s+gold|\s+green)?">([\s\S]*?)<\/div>/i,
    );
    const ey = eyMatch ? decode(eyMatch[1]) : "";
    let eyClass;
    if (/class="ey gold"/i.test(secHtml)) eyClass = "gold";
    if (/class="ey green"/i.test(secHtml)) eyClass = "green";

    const stMatch = secHtml.match(/<h2 class="st">([\s\S]*?)<\/h2>/i);
    const st = stMatch ? decode(stMatch[1]) : "";

    const leads = [...secHtml.matchAll(/<p class="lead">([\s\S]*?)<\/p>/gi)].map(
      (m) => decode(m[1]),
    );

    const products = [];
    for (const pc of secHtml.matchAll(
      /<(?:a|div) class="pc[^"]*">([\s\S]*?)<\/(?:a|div)>/gi,
    )) {
      const pcHtml = pc[1];
      const name = decode(
        pcHtml.match(/class="pc-name"[^>]*>([\s\S]*?)<\/div>/i)?.[1],
      );
      const desc = decode(
        pcHtml.match(/class="pc-desc"[^>]*>([\s\S]*?)<\/div>/i)?.[1],
      );
      const link = decode(
        pcHtml.match(/class="pc-link"[^>]*>([\s\S]*?)<\/div>/i)?.[1],
      );
      if (name) products.push({ name, desc, link: link || undefined });
    }

    const strips = [];
    const stripTitles = [
      ...secHtml.matchAll(/class="strip-title"[^>]*>([\s\S]*?)<\/div>/gi),
    ].map((m) => decode(m[1]));
    const stripDescs = [
      ...secHtml.matchAll(/class="strip-desc"[^>]*>([\s\S]*?)<\/div>/gi),
    ].map((m) => decode(m[1]));
    for (let i = 0; i < stripTitles.length; i++) {
      strips.push({ title: stripTitles[i], desc: stripDescs[i] || "" });
    }

    const tableMatch = secHtml.match(/<table class="gtbl">([\s\S]*?)<\/table>/i);
    const table = tableMatch ? parseTable(tableMatch[1]) : undefined;

    const calloutMatch = secHtml.match(/<div class="callout">([\s\S]*?)<\/div>/i);
    const callout = calloutMatch ? decode(calloutMatch[1]) : undefined;

    return { ey, st, eyClass, leads, products, strips, table, callout };
  });
}

function extractMidCtas(contentHtml) {
  const ctas = [];
  for (const m of contentHtml.matchAll(
    /<div class="mid-cta">([\s\S]*?)<\/div>\s*(?=<div class="|<figure|<\/main)/gi,
  )) {
    const block = m[1];
    const title = decode(block.match(/<h4>([\s\S]*?)<\/h4>/i)?.[1]);
    const text = decode(block.match(/<p>([\s\S]*?)<\/p>/i)?.[1]);
    const button = decode(
      block.match(/class="mid-cta-btn"[^>]*>([\s\S]*?)<\//i)?.[1],
    );
    if (title) ctas.push({ title, text, button: button || "Request a Quote →" });
  }
  return ctas;
}

function extractBottomCta(contentHtml) {
  const m = contentHtml.match(/<div class="bottom-cta">([\s\S]*?)<\/div>/i);
  if (!m) return null;
  const block = m[1];
  const title = decode(block.match(/<h3>([\s\S]*?)<\/h3>/i)?.[1]);
  const text = decode(block.match(/<p>([\s\S]*?)<\/p>/i)?.[1]);
  return title ? { title, text } : null;
}

function extractFaqs(contentHtml) {
  const faqs = [];
  for (const fq of contentHtml.matchAll(/<div class="fq[^"]*">([\s\S]*?)<\/div>\s*<\/div>/gi)) {
    const block = fq[1];
    const q = decode(block.match(/class="fqq"[^>]*>([\s\S]*?)<\//i)?.[1]).replace(
      /\s*▼\s*$/,
      "",
    );
    const a = decode(block.match(/class="fqa"[^>]*>[\s\S]*?<p>([\s\S]*?)<\/p>/i)?.[1]);
    if (q && a) faqs.push({ q, a });
  }
  return faqs;
}

function extractSidebarNav(html, industryId, meta) {
  const aside = html.match(/<aside class="sidebar"[\s\S]*?<\/aside>/i)?.[0] || "";
  const nav = [];
  for (const link of aside.matchAll(
    /<a href="([^"]+)" class="sublink[^"]*"[^>]*>[\s\S]*?<span>([\s\S]*?)<\/span>/gi,
  )) {
    const hrefFile = link[1];
    const label = decode(link[2]);
    if (!label || hrefFile.startsWith("http")) continue;
    const slug = fileToSlug(path.basename(hrefFile), meta.prefix);
    nav.push({
      href: slug === "category" ? meta.route : `${meta.route}/${slug}`,
      label,
    });
  }
  return nav;
}

function extractPage(html, filename, industryId, meta) {
  const slug = fileToSlug(filename, meta.prefix);
  const title = decode(html.match(/<title>([\s\S]*?)<\/title>/i)?.[1]);

  const heroBlock = html.match(/<div class="hero">([\s\S]*?)<\/div>\s*<\/div>\s*<\/div>/i)?.[0] || "";
  const ey = decode(heroBlock.match(/class="hey"[^>]*>([\s\S]*?)<\//i)?.[1]);
  const titleMain = decode(
    heroBlock.match(/class="title-main"[^>]*>([\s\S]*?)<\//i)?.[1],
  );
  const titleTail = decode(
    heroBlock.match(/class="title-tail"[^>]*>([\s\S]*?)<\//i)?.[1],
  );
  const desc = decode(heroBlock.match(/class="hdesc"[^>]*>([\s\S]*?)<\//i)?.[1]);
  const chips = [...heroBlock.matchAll(/<span class="cp">([\s\S]*?)<\/span>/gi)].map(
    (m) => decode(m[1]),
  );

  const mainMatch = html.match(/<main class="content">([\s\S]*?)<\/main>/i);
  const contentHtml = mainMatch?.[1] || "";

  let sections = splitSections(contentHtml).filter(
    (s) => s.ey && !/frequently asked questions/i.test(s.ey),
  );

  // Drop duplicate FAQ section if captured
  sections = sections.filter((s) => !/frequently asked questions/i.test(s.st));

  const midCtas = extractMidCtas(contentHtml);
  const bottomCta = extractBottomCta(contentHtml);
  const faqs = extractFaqs(contentHtml);

  return {
    slug,
    industryId,
    title,
    hero: { ey, titleMain, titleTail, desc, chips },
    sections,
    midCtas,
    bottomCta,
    faqs,
    imageLabels: ["Product packaging", "Production facility Vapi"],
  };
}

// --- main ---
const htmlFiles = fs
  .readdirSync(HTML_DIR)
  .filter(
    (f) =>
      (f.startsWith("Trizen_") &&
        (f.endsWith("_Clean_Sidebar.html") || f.endsWith("_New_Design.html"))) ||
      f === "trizen-auto-interior-violet-sidebar.html",
  );

const registry = {
  industries: {},
  allIndustriesNav: [],
};

for (const [id, meta] of Object.entries(INDUSTRY_META)) {
  registry.allIndustriesNav.push({
    id,
    href: meta.route,
    label: meta.label,
  });
}

for (const [industryId, meta] of Object.entries(INDUSTRY_META)) {
  const industryFiles = htmlFiles.filter((f) => f.startsWith(meta.prefix));
  if (!industryFiles.length) continue;

  const pages = {};
  const nav = [];

  for (const file of industryFiles) {
    const html = fs.readFileSync(path.join(HTML_DIR, file), "utf8");
    const page = extractPage(html, file, industryId, meta);
    pages[page.slug] = page;

    const outDir = path.join(OUT_CONTENT, industryId);
    fs.mkdirSync(outDir, { recursive: true });
    fs.writeFileSync(
      path.join(outDir, `${page.slug}.json`),
      JSON.stringify(page, null, 2) + "\n",
    );
    console.log("extracted", industryId, page.slug, "<-", file);
  }

  // Build nav from category page sidebar if available
  const categoryFile = industryFiles.find((f) => /Category|ExpertiseHub|Hub/i.test(f));
  if (categoryFile) {
    const catHtml = fs.readFileSync(path.join(HTML_DIR, categoryFile), "utf8");
    nav.push(...extractSidebarNav(catHtml, industryId, meta));
  }
  if (!nav.length) {
    for (const slug of Object.keys(pages).sort()) {
      nav.push({
        href: slug === "category" ? meta.route : `${meta.route}/${slug}`,
        label: pages[slug].hero.titleMain || slug,
      });
    }
  }

  registry.industries[industryId] = {
    ...meta,
    pages: Object.keys(pages).sort(),
    nav,
  };
}

fs.mkdirSync(path.dirname(OUT_REGISTRY), { recursive: true });
fs.writeFileSync(OUT_REGISTRY, JSON.stringify(registry, null, 2) + "\n");

const importLines = [];
const mapEntries = [];

for (const [industryId, meta] of Object.entries(registry.industries)) {
  const slugEntries = [];
  for (const slug of meta.pages) {
    const varName = `${industryId}_${slug.replace(/[^a-z0-9]+/gi, "_")}`;
    importLines.push(
      `import ${varName} from "@/lib/industries/content/${industryId}/${slug}.json";`,
    );
    slugEntries.push(`    "${slug}": ${varName} as IndustryPageContent`);
  }
  mapEntries.push(`  ${industryId}: {\n${slugEntries.join(",\n")}\n  }`);
}

const contentMapSource = `/* Auto-generated by scripts/extract-all-industries.js — do not edit */
import type { IndustryPageContent } from "@/lib/industries/types";

${importLines.join("\n")}

export const industryContentMap: Record<
  string,
  Record<string, IndustryPageContent>
> = {
${mapEntries.join(",\n")}
};
`;

fs.writeFileSync(OUT_CONTENT_MAP, contentMapSource);
console.log("\nWrote registry with", Object.keys(registry.industries).length, "industries");
console.log("Wrote content map with", importLines.length, "pages");
