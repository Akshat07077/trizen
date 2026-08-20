/**
 * Extract all Trizen Clean_Sidebar / New_Design HTML into JSON content
 * + industry registry for Next.js routes.
 */
const fs = require("fs");
const path = require("path");

const HTML_DIR = path.resolve(__dirname, "../html-pages");
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
  const eyMatch = secHtml.match(
    /<div class="ey[^"]*">([\s\S]*?)<\/div>/i,
  );
  const ey = eyMatch ? decode(eyMatch[1]) : "";
  let eyClass;
  if (/class="ey[^"]*\bgold\b/i.test(secHtml)) eyClass = "gold";
  else if (/class="ey[^"]*\bgreen\b/i.test(secHtml)) eyClass = "green";
  else if (/class="ey[^"]*\beyb\b/i.test(secHtml)) eyClass = "gold";
  else if (/class="ey[^"]*\beygo\b/i.test(secHtml)) eyClass = "gold";
  else if (/class="ey[^"]*\beyg\b/i.test(secHtml)) eyClass = "green";
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
    return products;
  }

  if (/class="fgrid"/i.test(secHtml)) {
    const names = [...secHtml.matchAll(/class="fn"[^>]*>([\s\S]*?)<\/div>/gi)];
    const descs = [...secHtml.matchAll(/class="fd"[^>]*>([\s\S]*?)<\/div>/gi)];
    const flinks = [...secHtml.matchAll(/class="flink"[^>]*>([\s\S]*?)<\/(?:a|div)>/gi)];
    for (let i = 0; i < names.length; i++) {
      const name = decode(names[i][1]);
      if (!name) continue;
      products.push({
        name,
        desc: decode(descs[i]?.[1]),
        link: decode(flinks[i]?.[1]) || undefined,
      });
    }
  }

  if (/class="blgrid"/i.test(secHtml)) {
    const tags = [...secHtml.matchAll(/class="bltag"[^>]*>([\s\S]*?)<\/div>/gi)];
    const titles = [
      ...secHtml.matchAll(/class="blb"[^>]*>[\s\S]*?<h3[^>]*>([\s\S]*?)<\/h3>/gi),
    ];
    const descs = [
      ...secHtml.matchAll(
        /class="blb"[^>]*>[\s\S]*?<h3[^>]*>[\s\S]*?<\/h3>\s*<p[^>]*>([\s\S]*?)<\/p>/gi,
      ),
    ];
    const links = [...secHtml.matchAll(/class="bla"[^>]*>([\s\S]*?)<\/a>/gi)];
    for (let i = 0; i < titles.length; i++) {
      const title = decode(titles[i][1]);
      if (!title) continue;
      const tag = decode(tags[i]?.[1]);
      products.push({
        name: tag ? `${tag}: ${title}` : title,
        desc: decode(descs[i]?.[1]),
        link: decode(links[i]?.[1]) || "Read Article →",
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

  const wiBlocks = [...secHtml.matchAll(/<div class="wi[^"]*">([\s\S]*?)<\/div>\s*(?=<div class="wi|<\/div>)/gi)];
  for (const wi of wiBlocks) {
    const block = wi[1];
    const num = decode(block.match(/class="wnum"[^>]*>([\s\S]*?)<\/div>/i)?.[1]);
    const title = decode(
      block.match(/class="wc"[^>]*>\s*<h4[^>]*>([\s\S]*?)<\/h4>/i)?.[1] ||
        block.match(/<h4[^>]*>([\s\S]*?)<\/h4>/i)?.[1],
    );
    const desc = decode(block.match(/class="wc"[^>]*>[\s\S]*?<p[^>]*>([\s\S]*?)<\/p>/i)?.[1]);
    if (title) strips.push({ title: num ? `${num}. ${title}` : title, desc });
  }

  if (/class="mgrid"/i.test(secHtml)) {
    const names = [...secHtml.matchAll(/class="mn"[^>]*>([\s\S]*?)<\/div>/gi)];
    const metas = [...secHtml.matchAll(/class="mf"[^>]*>([\s\S]*?)<\/div>/gi)];
    const descs = [...secHtml.matchAll(/class="mp"[^>]*>([\s\S]*?)<\/div>/gi)];
    for (let i = 0; i < names.length; i++) {
      const title = decode(names[i][1]);
      if (!title) continue;
      const meta = decode(metas[i]?.[1]);
      const desc = decode(descs[i]?.[1]);
      strips.push({
        title,
        desc: [meta, desc].filter(Boolean).join(" — "),
      });
    }
  }

  const kdiBlocks = [...secHtml.matchAll(/<div class="kdi[^"]*">([\s\S]*?)<\/div>\s*(?=<div class="kdi|<\/div>)/gi)];
  for (const kdi of kdiBlocks) {
    const block = kdi[1];
    const title = decode(block.match(/class="kdd"[^>]*>\s*<h4[^>]*>([\s\S]*?)<\/h4>/i)?.[1]);
    const desc = decode(block.match(/class="kdd"[^>]*>[\s\S]*?<p[^>]*>([\s\S]*?)<\/p>/i)?.[1]);
    if (title) strips.push({ title, desc });
  }

  return strips;
}

function parseSection(secHtml) {
  const { ey, eyClass } = extractEy(secHtml);

  const stMatch = secHtml.match(/<h2 class="st">([\s\S]*?)<\/h2>/i);
  const st = stMatch ? decode(stMatch[1]) : "";

  const leads = [...secHtml.matchAll(/<p class="lead">([\s\S]*?)<\/p>/gi)].map(
    (m) => decode(m[1]),
  );

  const solBox = secHtml.match(/<div class="sol-box">([\s\S]*?)<\/div>/i);
  if (solBox) {
    for (const p of solBox[1].matchAll(/<p[^>]*>([\s\S]*?)<\/p>/gi)) {
      leads.push(decode(p[1]));
    }
  }

  const products = extractProducts(secHtml);
  const strips = extractStrips(secHtml);

  const tableMatch = secHtml.match(/<table[^>]*>([\s\S]*?)<\/table>/i);
  const table = tableMatch ? parseTable(tableMatch[0]) : undefined;

  const calloutMatch =
    secHtml.match(/<div class="callout">([\s\S]*?)<\/div>/i) ||
    secHtml.match(/<div class="esd-note">([\s\S]*?)<\/div>/i) ||
    secHtml.match(/<div class="safety-note">([\s\S]*?)<\/div>/i);
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
  for (const m of contentHtml.matchAll(/<div class="mid-cta">([\s\S]*?)<\/div>\s*(?=<div |<section |<\/main)/gi)) {
    const block = m[1];
    const title = decode(
      block.match(/<h4[^>]*>([\s\S]*?)<\/h4>/i)?.[1],
    );
    const text = decode(block.match(/<p[^>]*>([\s\S]*?)<\/p>/i)?.[1]);
    const button = decode(
      block.match(/class="mid-cta-btn"[^>]*>([\s\S]*?)<\//i)?.[1],
    );
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

  const ctai = contentHtml.match(/<div class="ctai"[^>]*>([\s\S]*?)<\/div>\s*<\/section>/i);
  if (ctai) {
    const block = ctai[1];
    const title = decode(block.match(/class="ctah"[^>]*>([\s\S]*?)<\/h/i)?.[1]);
    const text = decode(block.match(/class="ctap"[^>]*>([\s\S]*?)<\/p>/i)?.[1]);
    if (title) return { title, text };
  }
  return null;
}

function extractFaqs(contentHtml) {
  const faqs = [];
  for (const fq of contentHtml.matchAll(/<div class="fq[^"]*">([\s\S]*?)<\/div>\s*(?=<div class="fq|<\/div>\s*<\/div>)/gi)) {
    const block = fq[1];
    const q = decode(
      block.match(/class="fqq"[^>]*>([\s\S]*?)<\/(?:button|div)/i)?.[1],
    ).replace(/\s*▼\s*$/, "");
    const aBlock = block.match(/class="fqa"[^>]*>([\s\S]*?)<\/div>/i)?.[1];
    const a = aBlock
      ? decode(aBlock.match(/<p[^>]*>([\s\S]*?)<\/p>/i)?.[1] || aBlock)
      : "";
    if (q && a) faqs.push({ q, a });
  }
  if (!faqs.length) {
    for (const fq of contentHtml.matchAll(/<div class="fq[^"]*">([\s\S]*?)<\/div>/gi)) {
      const block = fq[1];
      const q = decode(
        block.match(/class="fqq"[^>]*>([\s\S]*?)<\/(?:button|div)/i)?.[1],
      ).replace(/\s*▼\s*$/, "");
      const aBlock = block.match(/class="fqa"[^>]*>([\s\S]*)/i)?.[1];
      const a = aBlock ? decode(aBlock.split("</div>")[0]) : "";
      if (q && a) faqs.push({ q, a });
    }
  }
  return faqs;
}

function extractImageLabels(contentHtml) {
  return [...contentHtml.matchAll(/class="img-ph-label"[^>]*>([\s\S]*?)<\/div>/gi)]
    .map((m) => decode(m[1]))
    .filter(Boolean);
}

const PRODUCT_HREF_KEYWORDS = [
  { keys: ["esd", "antistatic"], slug: "esd" },
  { keys: ["pcb", "circuit board", "gold finger"], slug: "pcb" },
  { keys: ["connector", "terminal", "micro-component"], slug: "connector" },
  { keys: ["switch", "sensor", "module"], slug: "switches" },
  { keys: ["consumer", "accessory", "earphone"], slug: "consumer" },
  { keys: ["action figure", "hero pose"], slug: "action-figure" },
  { keys: ["set insert", "toy set", "multi-component"], slug: "set-inserts" },
  { keys: ["retail display", "display packaging"], slug: "retail-display" },
  { keys: ["protective", "packaging box"], slug: "protective" },
  { keys: ["custom molded", "custom moulded", "bespoke"], slug: "custom-molded" },
  { keys: ["packaging tray", "toy tray"], slug: "packaging-trays" },
  { keys: ["vacuum forming"], slug: "vacuum-forming" },
  { keys: ["pressure forming"], slug: "pressure-forming" },
  { keys: ["blister"], slug: "blister-packaging" },
  { keys: ["clamshell"], slug: "clamshell-packaging" },
  { keys: ["plastic packaging"], slug: "plastic-packaging" },
  { keys: ["material"], slug: "materials" },
  { keys: ["thermoforming"], slug: "thermoforming-packaging" },
];

function guessProductHref(name, desc, route, nav) {
  const text = `${name} ${desc}`.toLowerCase();
  for (const navItem of nav) {
    if (navItem.href === route) continue;
    const label = navItem.label.toLowerCase();
    const slug = navItem.href.split("/").pop() || "";
    if (text.includes(slug.replace(/-/g, " ")) || text.includes(label.slice(0, 12))) {
      return navItem.href;
    }
  }
  for (const rule of PRODUCT_HREF_KEYWORDS) {
    if (rule.keys.some((k) => text.includes(k))) {
      return `${route}/${rule.slug}`;
    }
  }
  return undefined;
}

function enrichCategoryProducts(page, nav, route) {
  if (page.slug !== "category" && page.slug !== "hub") return;
  const subNav = nav.filter((n) => n.href !== route && !n.href.endsWith("/hub"));
  for (const section of page.sections) {
    if (!section.products?.length) continue;
    section.products.forEach((product, i) => {
      if (product.href) return;
      product.href =
        guessProductHref(product.name, product.desc, route, subNav) ||
        subNav[i]?.href ||
        (product.link?.toLowerCase().includes("vacuum")
          ? `${route}/vacuum-forming`
          : product.link?.toLowerCase().includes("pressure")
            ? `${route}/pressure-forming`
            : product.link?.toLowerCase().includes("blister")
              ? `${route}/blister-packaging`
              : product.link?.toLowerCase().includes("clamshell")
                ? `${route}/clamshell-packaging`
                : product.link?.toLowerCase().includes("plastic")
                  ? `${route}/plastic-packaging`
                  : product.link?.toLowerCase().includes("material")
                    ? `${route}/materials`
                    : product.link?.toLowerCase().includes("thermoform")
                      ? `${route}/thermoforming-packaging`
                      : undefined) ||
        "#";
    });
  }
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
  const metaDesc = decode(
    html.match(/<meta name="description" content="([^"]*)"/i)?.[1],
  );

  const heroBlock =
    html.match(/<div class="hero">([\s\S]*?)<\/div>\s*<\/div>\s*<\/div>/i)?.[0] ||
    html.match(/<div class="hero">([\s\S]*?)<\/div>\s*<\/div>/i)?.[0] ||
    "";
  const ey = decode(
    heroBlock.match(/class="hey2?"[^>]*>([\s\S]*?)<\/(?:div|h)/i)?.[1],
  );
  const titleMain = decode(
    heroBlock.match(/class="title-main"[^>]*>([\s\S]*?)<\//i)?.[1],
  );
  const titleTail = decode(
    heroBlock.match(/class="title-tail"[^>]*>([\s\S]*?)<\//i)?.[1],
  );
  const desc = decode(
    heroBlock.match(/class="hdesc"[^>]*>([\s\S]*?)<\/p>/i)?.[1] || metaDesc,
  );
  let chips = [...heroBlock.matchAll(/<span class="cp">([\s\S]*?)<\/span>/gi)].map(
    (m) => decode(m[1]),
  );
  if (!chips.length) {
    chips = [...heroBlock.matchAll(/class="hpill"[^>]*>([\s\S]*?)<\/div>/gi)].map(
      (m) => decode(m[1]),
    );
  }

  const mainMatch = html.match(/<main class="content">([\s\S]*?)<\/main>/i);
  const contentHtml = mainMatch?.[1] || "";

  let sections = splitSections(contentHtml).filter(
    (s) => s.ey && !/frequently asked questions/i.test(s.ey),
  );
  sections = sections.filter((s) => !/frequently asked questions/i.test(s.st));

  const midCtas = extractMidCtas(contentHtml);
  const bottomCta = extractBottomCta(contentHtml);
  const faqs = extractFaqs(contentHtml);
  const imageLabels = extractImageLabels(contentHtml);

  return {
    slug,
    industryId,
    title,
    hero: { ey, titleMain, titleTail, desc, chips },
    sections,
    midCtas,
    bottomCta,
    faqs,
    imageLabels: imageLabels.length
      ? imageLabels.slice(0, 2)
      : ["Product packaging", "Production facility Vapi"],
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
    console.log("extracted", industryId, page.slug, "<-", file);
  }

  // Build nav from category page sidebar if available
  const categoryFile =
    industryFiles.find((f) => /ThermoformingPackaging/i.test(f)) ||
    industryFiles.find((f) => /Category|ExpertiseHub|Hub/i.test(f));
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

  for (const page of Object.values(pages)) {
    enrichCategoryProducts(page, nav, meta.route);
  }

  const outDir = path.join(OUT_CONTENT, industryId);
  fs.mkdirSync(outDir, { recursive: true });
  for (const page of Object.values(pages)) {
    fs.writeFileSync(
      path.join(outDir, `${page.slug}.json`),
      JSON.stringify(page, null, 2) + "\n",
    );
  }

  registry.industries[industryId] = {
    ...meta,
    pages: Object.keys(pages).sort(),
    nav,
  };
}

// Preserve fully-patched toy JSON (product hrefs, tables)
const TOY_SRC = path.resolve(__dirname, "../lib/toy/content");
if (fs.existsSync(TOY_SRC)) {
  const toyOut = path.join(OUT_CONTENT, "toy");
  fs.mkdirSync(toyOut, { recursive: true });
  for (const file of fs.readdirSync(TOY_SRC)) {
    if (file.endsWith(".json")) {
      fs.copyFileSync(path.join(TOY_SRC, file), path.join(toyOut, file));
    }
  }
  console.log("Synced toy content from lib/toy/content");
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
