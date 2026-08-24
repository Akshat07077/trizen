/**
 * Extract Preview HTML for Cosmetics + Baby Care and merge into registry.
 */
const fs = require("fs");
const path = require("path");

const HTML_DIR = path.resolve(__dirname, "../html-pages");
const CONTENT_ROOT = path.resolve(__dirname, "../lib/industries/content");
const REGISTRY_PATH = path.resolve(__dirname, "../lib/industries/registry.json");
const CONTENT_MAP_PATH = path.resolve(__dirname, "../lib/industries/content-map.ts");

const INDUSTRIES = [
  {
    id: "cosmetics",
    prefix: "Trizen_Cosm_",
    route: "/cosmetics",
    label: "Cosmetics",
    sidebarTitle: "Cosmetics pages",
    ctaTitle: "Cosmetics Packaging Quote",
    ctaText:
      "Beauty · Perfume · Makeup kits · Lipstick inserts · Gift sets · Transparent APET/PETG — ISO 9001:2015 · Vapi.",
    footerLabel: "Cosmetics Packaging",
    faqSub: "Cosmetics thermoforming packaging",
    navInsertAfter: "automobile",
    nav: [
      { href: "/cosmetics", label: "Cosmetics Overview" },
      {
        href: "/cosmetics/cosmetic-beauty-packaging",
        label: "Cosmetic Packaging for Beauty Products",
      },
      {
        href: "/cosmetics/perfume-bottle-insert-trays",
        label: "Perfume Bottle Insert Trays",
      },
      {
        href: "/cosmetics/makeup-kit-thermoformed-trays",
        label: "Makeup Kit Thermoformed Trays",
      },
      {
        href: "/cosmetics/lipstick-compact-case-inserts",
        label: "Lipstick & Compact Case Inserts",
      },
      { href: "/cosmetics/gift-set-display-trays", label: "Gift Set Display Trays" },
      {
        href: "/cosmetics/transparent-thermoformed-cosmetic-packaging",
        label: "Transparent Cosmetic Packaging",
      },
    ],
    fileSlug: {
      Category: "category",
      Beauty: "cosmetic-beauty-packaging",
      Perfume: "perfume-bottle-insert-trays",
      Makeup: "makeup-kit-thermoformed-trays",
      Lipstick: "lipstick-compact-case-inserts",
      GiftSet: "gift-set-display-trays",
      Transparent: "transparent-thermoformed-cosmetic-packaging",
    },
    productKeywords: [
      { keys: ["perfume", "fragrance", "bottle insert"], slug: "perfume-bottle-insert-trays" },
      { keys: ["makeup", "make-up", "palette"], slug: "makeup-kit-thermoformed-trays" },
      { keys: ["lipstick", "compact"], slug: "lipstick-compact-case-inserts" },
      { keys: ["gift set", "gift tray"], slug: "gift-set-display-trays" },
      { keys: ["transparent", "crystal-clear", "clear"], slug: "transparent-thermoformed-cosmetic-packaging" },
      { keys: ["beauty", "cosmetic packaging"], slug: "cosmetic-beauty-packaging" },
    ],
  },
  {
    id: "baby-care",
    prefix: "Trizen_Baby_",
    route: "/baby-care",
    label: "Baby Care",
    sidebarTitle: "Baby Care pages",
    ctaTitle: "Baby Care Packaging Quote",
    ctaText:
      "BPA-free · Food-grade · Baby toys · Accessories · Hygiene · Feeding bottles · Lotion trays — ISO 9001:2015 · Vapi.",
    footerLabel: "Baby Care Packaging",
    faqSub: "Baby care thermoforming packaging",
    navInsertAfter: "cosmetics",
    nav: [
      { href: "/baby-care", label: "Baby Care Overview" },
      { href: "/baby-care/baby-toy-packaging", label: "Baby Toy Packaging" },
      {
        href: "/baby-care/baby-accessories-trays",
        label: "Protective Trays for Baby Accessories",
      },
      {
        href: "/baby-care/hygiene-product-trays",
        label: "Hygiene Product Thermoformed Trays",
      },
      { href: "/baby-care/baby-product-packaging", label: "Baby Product Packaging" },
      { href: "/baby-care/feeding-bottle-packaging", label: "Feeding Bottle Packaging" },
      {
        href: "/baby-care/lotion-cream-tray-inserts",
        label: "Lotion & Cream Tray Inserts",
      },
    ],
    fileSlug: {
      Category: "category",
      Toy: "baby-toy-packaging",
      Accessories: "baby-accessories-trays",
      Hygiene: "hygiene-product-trays",
      Product: "baby-product-packaging",
      Feeding: "feeding-bottle-packaging",
      Lotion: "lotion-cream-tray-inserts",
    },
    productKeywords: [
      { keys: ["baby toy", "toy packaging", "blister"], slug: "baby-toy-packaging" },
      { keys: ["accessor", "teether", "pacifier"], slug: "baby-accessories-trays" },
      { keys: ["hygiene", "wipe", "cotton"], slug: "hygiene-product-trays" },
      { keys: ["feeding", "bottle", "sippy"], slug: "feeding-bottle-packaging" },
      { keys: ["lotion", "cream", "skincare"], slug: "lotion-cream-tray-inserts" },
      { keys: ["baby product", "general"], slug: "baby-product-packaging" },
    ],
  },
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

function fileToSlug(filename, cfg) {
  const middle = filename
    .replace(cfg.prefix, "")
    .replace(/_Preview\.html$/i, "")
    .replace(/\s*\(\d+\)$/, "");
  if (cfg.fileSlug[middle]) return cfg.fileSlug[middle];
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
  const names = [...secHtml.matchAll(/class="pc-name"[^>]*>([\s\S]*?)<\/div>/gi)];
  const descs = [...secHtml.matchAll(/class="pc-desc"[^>]*>([\s\S]*?)<\/div>/gi)];
  const links = [...secHtml.matchAll(/class="pc-link"[^>]*>([\s\S]*?)<\/div>/gi)];
  for (let i = 0; i < names.length; i++) {
    const name = decode(names[i][1]);
    if (!name) continue;
    const desc = decode(descs[i]?.[1]);
    products.push({
      name,
      desc,
      link: decode(links[i]?.[1]) || "View sub-page →",
    });
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
    if (stripTitles[i]) {
      strips.push({ title: stripTitles[i], desc: stripDescs[i] || "" });
    }
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

function guessHref(name, desc, cfg) {
  const text = `${name} ${desc}`.toLowerCase();
  for (const rule of cfg.productKeywords) {
    if (rule.keys.some((k) => text.includes(k))) {
      return `${cfg.route}/${rule.slug}`;
    }
  }
  for (const item of cfg.nav) {
    if (item.href === cfg.route) continue;
    if (text.includes(item.label.toLowerCase().slice(0, 14))) return item.href;
  }
  return undefined;
}

function enrichCategoryProducts(page, cfg) {
  if (page.slug !== "category") return;
  const subNav = cfg.nav.filter((n) => n.href !== cfg.route);
  for (const section of page.sections) {
    if (!section.products?.length) continue;
    section.products.forEach((product, i) => {
      if (product.href) return;
      product.href =
        guessHref(product.name, product.desc, cfg) ||
        subNav[i]?.href ||
        "#";
    });
  }
}

function extractPage(html, filename, cfg) {
  const slug = fileToSlug(filename, cfg);
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

  const labels = extractImageLabels(contentHtml);

  return {
    slug,
    industryId: cfg.id,
    title,
    hero: { ey, titleMain, titleTail, desc, chips },
    sections,
    midCtas: extractMidCtas(contentHtml),
    bottomCta: extractBottomCta(contentHtml),
    faqs: extractFaqs(contentHtml),
    imageLabels: labels.length ? labels.slice(0, 2) : ["Product packaging", "Production facility Vapi"],
  };
}

function varName(industryId, slug) {
  return `${industryId.replace(/[^a-z0-9]+/gi, "_")}_${slug.replace(/[^a-z0-9]+/gi, "_")}`;
}

function mergeContentMap(industryId, slugs) {
  let contentMap = fs.readFileSync(CONTENT_MAP_PATH, "utf8");
  const marker = `${varName(industryId, "category")}`;
  if (contentMap.includes(marker) || contentMap.includes(`${industryId}: {`)) {
    return;
  }

  const imports = slugs
    .map(
      (slug) =>
        `import ${varName(industryId, slug)} from "@/lib/industries/content/${industryId}/${slug}.json";`,
    )
    .join("\n");

  const mapEntries = slugs
    .map((slug) => `    "${slug}": ${varName(industryId, slug)} as IndustryPageContent`)
    .join(",\n");

  contentMap = contentMap.replace(
    /export const industryContentMap/,
    `${imports}\n\nexport const industryContentMap`,
  );
  contentMap = contentMap.replace(
    /(\n};)\s*$/,
    `,\n  "${industryId}": {\n${mapEntries}\n  }\n};`,
  );
  fs.writeFileSync(CONTENT_MAP_PATH, contentMap);
}

function extractIndustry(cfg) {
  const htmlFiles = fs
    .readdirSync(HTML_DIR)
    .filter((f) => f.startsWith(cfg.prefix) && f.endsWith("_Preview.html"));

  if (!htmlFiles.length) {
    console.error(`No ${cfg.prefix}*_Preview.html files in html-pages/`);
    return 0;
  }

  const pages = {};
  for (const file of htmlFiles) {
    const html = fs.readFileSync(path.join(HTML_DIR, file), "utf8");
    const page = extractPage(html, file, cfg);
    pages[page.slug] = page;
    console.log("extracted", cfg.id, page.slug, "<-", file);
  }

  for (const page of Object.values(pages)) {
    enrichCategoryProducts(page, cfg);
  }

  const outDir = path.join(CONTENT_ROOT, cfg.id);
  fs.mkdirSync(outDir, { recursive: true });
  for (const page of Object.values(pages)) {
    fs.writeFileSync(
      path.join(outDir, `${page.slug}.json`),
      JSON.stringify(page, null, 2) + "\n",
    );
  }

  const registry = JSON.parse(fs.readFileSync(REGISTRY_PATH, "utf8"));
  const { fileSlug, productKeywords, navInsertAfter, ...meta } = cfg;
  registry.industries[cfg.id] = {
    ...meta,
    pages: Object.keys(pages).sort(),
    nav: cfg.nav,
  };

  if (!registry.allIndustriesNav.some((item) => item.id === cfg.id)) {
    const afterIdx = registry.allIndustriesNav.findIndex(
      (item) => item.id === navInsertAfter,
    );
    const insertAt = afterIdx >= 0 ? afterIdx + 1 : registry.allIndustriesNav.length;
    registry.allIndustriesNav.splice(insertAt, 0, {
      id: cfg.id,
      href: cfg.route,
      label: cfg.label,
    });
  }

  fs.writeFileSync(REGISTRY_PATH, JSON.stringify(registry, null, 2) + "\n");
  mergeContentMap(cfg.id, Object.keys(pages).sort());
  return Object.keys(pages).length;
}

let total = 0;
for (const cfg of INDUSTRIES) {
  total += extractIndustry(cfg);
}
console.log(`\nWrote ${total} pages across Cosmetics and Baby Care`);
