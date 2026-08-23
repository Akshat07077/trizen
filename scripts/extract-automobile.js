/**
 * Extract automobile Preview HTML into JSON + merge into registry/content-map.
 * Does not regenerate other industries (preserves manufacturing nav, etc.).
 */
const fs = require("fs");
const path = require("path");

const HTML_DIR = path.resolve(__dirname, "../html-pages");
const OUT_CONTENT = path.resolve(__dirname, "../lib/industries/content/automobile");
const REGISTRY_PATH = path.resolve(__dirname, "../lib/industries/registry.json");
const CONTENT_MAP_PATH = path.resolve(__dirname, "../lib/industries/content-map.ts");

const META = {
  prefix: "Trizen_Auto_",
  route: "/automobile",
  label: "Automobile",
  sidebarTitle: "Automobile pages",
  ctaTitle: "Automotive Packaging Quote",
  ctaText:
    "Assembly line trays · Exterior · Interior · Mechanical · Sensor packaging — ISO 9001:2015 · Vapi.",
  footerLabel: "Automotive Packaging",
  faqSub: "Automotive thermoforming packaging",
};

const AUTO_NAV = [
  { href: "/automobile", label: "Automobile Overview" },
  { href: "/automobile/assembly-line-trays", label: "Assembly Line & Movement Trays" },
  {
    href: "/automobile/exterior-component-packaging",
    label: "Exterior Component Packaging",
  },
  {
    href: "/automobile/interior-fittings-packaging",
    label: "Interior Fittings Packaging",
  },
  {
    href: "/automobile/mechanical-parts-packaging",
    label: "Mechanical Parts Packaging",
  },
  {
    href: "/automobile/sensor-electrical-packaging",
    label: "Sensor & Electrical Packaging",
  },
];

const AUTO_FILE_SLUG = {
  Category: "category",
  AssemblyLine: "assembly-line-trays",
  Exterior: "exterior-component-packaging",
  Interior: "interior-fittings-packaging",
  Mechanical: "mechanical-parts-packaging",
  Sensor: "sensor-electrical-packaging",
};

const AUTO_PRODUCT_KEYWORDS = [
  { keys: ["assembly line", "movement tray"], slug: "assembly-line-trays" },
  { keys: ["exterior", "bumper", "body panel"], slug: "exterior-component-packaging" },
  {
    keys: ["interior", "dashboard", "door panel", "centre console", "steering"],
    slug: "interior-fittings-packaging",
  },
  { keys: ["mechanical", "engine", "transmission"], slug: "mechanical-parts-packaging" },
  { keys: ["sensor", "electrical", "ecu", "wiring"], slug: "sensor-electrical-packaging" },
];

function decode(s) {
  return (s || "")
    .replace(/&amp;/g, "&")
    .replace(/&mdash;/g, "—")
    .replace(/&nbsp;/g, " ")
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .replace(/<[^>]+>/g, "")
    .trim();
}

function fileToSlug(filename) {
  const middle = filename
    .replace(META.prefix, "")
    .replace(/_Preview\.html$/i, "")
    .replace(/\s*\(\d+\)$/, "");
  if (AUTO_FILE_SLUG[middle]) return AUTO_FILE_SLUG[middle];
  return middle
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/([A-Z])([A-Z][a-z])/g, "$1-$2")
    .toLowerCase();
}

function parseTable(html) {
  const headers = [...html.matchAll(/<th[^>]*>([\s\S]*?)<\/th>/gi)].map((m) =>
    decode(m[1]),
  );
  const rows = [];
  for (const row of html.matchAll(/<tr>([\s\S]*?)<\/tr>/gi)) {
    if (/<th/i.test(row[1])) continue;
    const cells = [...row[1].matchAll(/<td[^>]*>([\s\S]*?)<\/td>/gi)].map((m) =>
      decode(m[1]),
    );
    if (cells.length) rows.push(cells);
  }
  return headers.length ? { headers, rows } : null;
}

function extractEy(secHtml) {
  const eyMatch = secHtml.match(/<div class="ey[^"]*">([\s\S]*?)<\/div>/i);
  const ey = eyMatch ? decode(eyMatch[1]) : "";
  let eyClass;
  if (/class="ey[^"]*\bgold\b/i.test(secHtml)) eyClass = "gold";
  else if (/class="ey[^"]*\bgreen\b/i.test(secHtml)) eyClass = "green";
  return { ey, eyClass };
}

function extractProducts(secHtml) {
  const products = [];
  if (/class="pgrid"/i.test(secHtml)) {
    const names = [...secHtml.matchAll(/class="pc-name"[^>]*>([\s\S]*?)<\/div>/gi)];
    const descs = [...secHtml.matchAll(/class="pc-desc"[^>]*>([\s\S]*?)<\/div>/gi)];
    const links = [...secHtml.matchAll(/class="pc-link"[^>]*>([\s\S]*?)<\/div>/gi)];
    for (let i = 0; i < names.length; i++) {
      const name = decode(names[i][1]);
      if (!name) continue;
      products.push({
        name,
        desc: decode(descs[i]?.[1]),
        link: decode(links[i]?.[1]) || "View sub-page →",
      });
    }
  }
  return products;
}

function extractStrips(secHtml) {
  const strips = [];
  const stripTitles = [
    ...secHtml.matchAll(/class="strip-title"[^>]*>([\s\S]*?)<\/div>/gi),
  ].map((m) => decode(m[1]));
  const stripDescs = [
    ...secHtml.matchAll(/class="strip-desc"[^>]*>([\s\S]*?)<\/div>/gi),
  ].map((m) => decode(m[1]));
  for (let i = 0; i < stripTitles.length; i++) {
    if (stripTitles[i]) strips.push({ title: stripTitles[i], desc: stripDescs[i] || "" });
  }

  const chalTitles = [...secHtml.matchAll(/class="chal-title"[^>]*>([\s\S]*?)<\/div>/gi)];
  const chalTexts = [...secHtml.matchAll(/class="chal-text"[^>]*>([\s\S]*?)<\/div>/gi)];
  const chalCosts = [...secHtml.matchAll(/class="chal-cost"[^>]*>([\s\S]*?)<\/div>/gi)];
  for (let i = 0; i < chalTitles.length; i++) {
    const title = decode(chalTitles[i][1]);
    if (!title) continue;
    let desc = decode(chalTexts[i]?.[1]);
    const cost = decode(chalCosts[i]?.[1]);
    if (cost) desc = `${desc} ${cost}`.trim();
    strips.push({ title, desc });
  }
  return strips;
}

function parseSection(secHtml) {
  const { ey, eyClass } = extractEy(secHtml);
  const stMatch = secHtml.match(/<h2 class="st">([\s\S]*?)<\/h2>/i);
  const st = stMatch ? decode(stMatch[1]) : "";
  const leads = [...secHtml.matchAll(/<p class="lead">([\s\S]*?)<\/p>/gi)].map((m) =>
    decode(m[1]),
  );
  const products = extractProducts(secHtml);
  const strips = extractStrips(secHtml);
  const tableMatch = secHtml.match(/<table[^>]*>([\s\S]*?)<\/table>/i);
  const table = tableMatch ? parseTable(tableMatch[0]) : undefined;
  const calloutMatch = secHtml.match(/<div class="callout">([\s\S]*?)<\/div>/i);
  const callout = calloutMatch ? decode(calloutMatch[1]) : undefined;
  return { ey, st, eyClass, leads, products, strips, table, callout };
}

function splitSections(contentHtml) {
  const sections = [];
  const re = /<(?:div|section) class="sec[^"]*"[^>]*>/gi;
  const starts = [];
  let m;
  while ((m = re.exec(contentHtml)) !== null) starts.push(m.index);
  for (let i = 0; i < starts.length; i++) {
    const chunk = contentHtml.slice(starts[i], starts[i + 1] ?? contentHtml.length);
    const parsed = parseSection(chunk);
    const hasBody =
      parsed.leads.length ||
      parsed.products.length ||
      parsed.strips.length ||
      parsed.table ||
      parsed.callout;
    if (hasBody) sections.push(parsed);
  }
  return sections;
}

function extractMidCtas(contentHtml) {
  const ctas = [];
  for (const m of contentHtml.matchAll(
    /<div class="mid-cta">([\s\S]*?)<\/div>\s*(?=<div |<section |<\/main)/gi,
  )) {
    const block = m[1];
    const title = decode(block.match(/<h4[^>]*>([\s\S]*?)<\/h4>/i)?.[1]);
    const text = decode(block.match(/<p[^>]*>([\s\S]*?)<\/p>/i)?.[1]);
    const button = decode(block.match(/class="mid-cta-btn"[^>]*>([\s\S]*?)<\//i)?.[1]);
    if (title) ctas.push({ title, text, button: button || "Request a Quote →" });
  }
  return ctas;
}

function extractBottomCta(contentHtml) {
  const bottom = contentHtml.match(/<div class="bottom-cta">([\s\S]*?)<\/div>/i);
  if (bottom) {
    const block = bottom[1];
    const title = decode(block.match(/<h3[^>]*>([\s\S]*?)<\/h3>/i)?.[1]);
    const text = decode(block.match(/<p[^>]*>([\s\S]*?)<\/p>/i)?.[1]);
    if (title) return { title, text };
  }
  return null;
}

function extractFaqs(contentHtml) {
  const faqs = [];
  for (const fq of contentHtml.matchAll(/<div class="fq[^"]*">([\s\S]*?)<\/div>/gi)) {
    const block = fq[1];
    const q = decode(
      block.match(/class="fqq"[^>]*>([\s\S]*?)<\/(?:button|div)/i)?.[1],
    ).replace(/\s*▼\s*$/, "");
    const aBlock = block.match(/class="fqa"[^>]*>([\s\S]*)/i)?.[1];
    const a = aBlock ? decode(aBlock.split("</div>")[0]) : "";
    if (q && a) faqs.push({ q, a });
  }
  return faqs;
}

function extractImageLabels(contentHtml) {
  return [...contentHtml.matchAll(/class="img-ph-label"[^>]*>([\s\S]*?)<\/div>/gi)]
    .map((m) => decode(m[1]))
    .filter(Boolean);
}

function guessAutoHref(name, desc, nav) {
  const text = `${name} ${desc}`.toLowerCase();
  for (const rule of AUTO_PRODUCT_KEYWORDS) {
    if (rule.keys.some((k) => text.includes(k))) {
      return `${META.route}/${rule.slug}`;
    }
  }
  for (const item of nav) {
    if (item.href === META.route) continue;
    const label = item.label.toLowerCase();
    if (text.includes(label.slice(0, 14))) return item.href;
  }
  return undefined;
}

function enrichCategoryProducts(page, nav) {
  if (page.slug !== "category") return;
  const subNav = nav.filter((n) => n.href !== META.route);
  for (const section of page.sections) {
    if (!section.products?.length) continue;
    section.products.forEach((product, i) => {
      if (product.href) return;
      product.href =
        guessAutoHref(product.name, product.desc, subNav) || subNav[i]?.href || "#";
    });
  }
}

function extractPage(html, filename) {
  const slug = fileToSlug(filename);
  const title = decode(html.match(/<title>([\s\S]*?)<\/title>/i)?.[1]);
  const metaDesc = decode(html.match(/<meta name="description" content="([^"]*)"/i)?.[1]);

  const heroBlock =
    html.match(/<div class="hero">([\s\S]*?)<\/div>\s*<\/div>\s*<\/div>/i)?.[0] ||
    html.match(/<div class="hero">([\s\S]*?)<\/div>\s*<\/div>/i)?.[0] ||
    "";

  const ey = decode(heroBlock.match(/class="hey2?"[^>]*>([\s\S]*?)<\/(?:div|h)/i)?.[1]);

  let titleMain = decode(heroBlock.match(/class="title-main"[^>]*>([\s\S]*?)<\//i)?.[1]);
  let titleTail = decode(heroBlock.match(/class="title-tail"[^>]*>([\s\S]*?)<\//i)?.[1]);
  if (!titleMain) {
    const hh1 = decode(heroBlock.match(/class="hh1"[^>]*>([\s\S]*?)<\//i)?.[1]);
    if (hh1) {
      const parts = hh1.split(/\s*[—–]\s*/);
      titleMain = parts[0] || hh1;
      titleTail = titleTail || parts.slice(1).join(" — ") || "";
    }
  }

  const desc = decode(
    heroBlock.match(/class="hdesc"[^>]*>([\s\S]*?)<\/p>/i)?.[1] || metaDesc,
  );
  let chips = [...heroBlock.matchAll(/<span class="cp">([\s\S]*?)<\/span>/gi)].map((m) =>
    decode(m[1]),
  );
  if (!chips.length) {
    chips = [...heroBlock.matchAll(/class="hpill"[^>]*>([\s\S]*?)<\/div>/gi)].map((m) =>
      decode(m[1]),
    );
  }

  const mainMatch =
    html.match(/<main class="content">([\s\S]*?)<\/main>/i) ||
    html.match(/<main>([\s\S]*?)<\/main>/i);
  const contentHtml = mainMatch?.[1] || "";

  let sections = splitSections(contentHtml).filter(
    (s) => s.ey && !/frequently asked questions/i.test(s.ey),
  );
  sections = sections.filter((s) => !/frequently asked questions/i.test(s.st));

  return {
    slug,
    industryId: "automobile",
    title,
    hero: { ey, titleMain, titleTail, desc, chips },
    sections,
    midCtas: extractMidCtas(contentHtml),
    bottomCta: extractBottomCta(contentHtml),
    faqs: extractFaqs(contentHtml),
    imageLabels: extractImageLabels(contentHtml).length
      ? extractImageLabels(contentHtml).slice(0, 2)
      : ["Product packaging", "Production facility Vapi"],
  };
}

// --- main ---
const htmlFiles = fs
  .readdirSync(HTML_DIR)
  .filter((f) => f.startsWith(META.prefix) && f.endsWith("_Preview.html"));

if (!htmlFiles.length) {
  console.error("No Trizen_Auto_*_Preview.html files in html-pages/");
  process.exit(1);
}

const pages = {};
for (const file of htmlFiles) {
  const html = fs.readFileSync(path.join(HTML_DIR, file), "utf8");
  const page = extractPage(html, file);
  pages[page.slug] = page;
  console.log("extracted automobile", page.slug, "<-", file);
}

const nav = AUTO_NAV;
for (const page of Object.values(pages)) {
  enrichCategoryProducts(page, nav);
}

fs.mkdirSync(OUT_CONTENT, { recursive: true });
for (const page of Object.values(pages)) {
  fs.writeFileSync(
    path.join(OUT_CONTENT, `${page.slug}.json`),
    JSON.stringify(page, null, 2) + "\n",
  );
}

const registry = JSON.parse(fs.readFileSync(REGISTRY_PATH, "utf8"));
registry.industries.automobile = {
  ...META,
  pages: Object.keys(pages).sort(),
  nav,
};

if (!registry.allIndustriesNav.some((item) => item.id === "automobile")) {
  const toyIdx = registry.allIndustriesNav.findIndex((item) => item.id === "toy");
  const insertAt = toyIdx >= 0 ? toyIdx + 1 : 0;
  registry.allIndustriesNav.splice(insertAt, 0, {
    id: "automobile",
    href: META.route,
    label: META.label,
  });
}

fs.writeFileSync(REGISTRY_PATH, JSON.stringify(registry, null, 2) + "\n");

let contentMap = fs.readFileSync(CONTENT_MAP_PATH, "utf8");
if (!contentMap.includes("automobile_category")) {
  const imports = Object.keys(pages)
    .sort()
    .map((slug) => {
      const varName = `automobile_${slug.replace(/[^a-z0-9]+/gi, "_")}`;
      return `import ${varName} from "@/lib/industries/content/automobile/${slug}.json";`;
    })
    .join("\n");

  const mapEntries = Object.keys(pages)
    .sort()
    .map((slug) => {
      const varName = `automobile_${slug.replace(/[^a-z0-9]+/gi, "_")}`;
      return `    "${slug}": ${varName} as IndustryPageContent`;
    })
    .join(",\n");

  contentMap = contentMap.replace(
    /export const industryContentMap/,
    `${imports}\n\nexport const industryContentMap`,
  );
  contentMap = contentMap.replace(
    /(\n};)\s*$/,
    `,\n  automobile: {\n${mapEntries}\n  }\n};`,
  );
  fs.writeFileSync(CONTENT_MAP_PATH, contentMap);
}

console.log("\nWrote", Object.keys(pages).length, "automobile pages");
console.log("Updated registry.json and content-map.ts");
