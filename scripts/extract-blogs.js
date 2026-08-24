const fs = require("fs");
const path = require("path");

const dir = path.resolve(
  __dirname,
  "../../trizen pages whole website/trizen pages whole website/blog",
);
const outDir = path.resolve(__dirname, "../lib/blog/content");
fs.mkdirSync(outDir, { recursive: true });

const POSTS = [
  {
    file: "Trizen_Blog1_rPET_v3_Preview.html",
    slug: "rpet-revolution-thermoforming-packaging",
    category: "Sustainability",
    date: "2025-03-15",
    readMins: 8,
  },
  {
    file: "Trizen_Blog2_VacuumPressure_Preview.html",
    slug: "vacuum-vs-pressure-forming",
    category: "Manufacturing",
    date: "2025-02-20",
    readMins: 7,
  },
  {
    file: "Trizen_Blog3_MedicalPharma_Preview.html",
    slug: "medical-pharma-thermoforming-packaging",
    category: "Regulated Industries",
    date: "2025-01-28",
    readMins: 9,
  },
  {
    file: "Trizen_Blog4_Industry40_Preview.html",
    slug: "industry-4-0-thermoforming",
    category: "Innovation",
    date: "2024-12-12",
    readMins: 6,
  },
];

function strip(s) {
  return String(s || "")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#\d+;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function extractBetween(html, startRe, endRe) {
  const sm = html.match(startRe);
  if (!sm) return "";
  const start = sm.index + sm[0].length;
  const rest = html.slice(start);
  const em = rest.search(endRe);
  return em === -1 ? rest : rest.slice(0, em);
}

function parseBlocks(artHtml) {
  const blocks = [];
  // Walk top-level-ish tags in article
  const re =
    /<(h2|h3|p|div|table|ul|ol)(\s[^>]*)?>([\s\S]*?)<\/\1>/gi;
  let m;
  const used = new Set();

  // Simpler sequential parse from .art content
  const tokens = [];
  const tagRe =
    /<(h2|h3|p)(\s[^>]*)?>([\s\S]*?)<\/\1>|<div class="(bl|callout|stat-row|checklist|img-ph|mid-cta|toc-box|faq-wrap)[^"]*"[\s\S]*?<\/div>(?=\s*(?:<h2|<h3|<p|<div class="(?:bl|callout|stat|check|img|mid|toc|faq|aside)|<\/div>\s*<\/article|<\/section|$))/gi;

  // Manual structured extraction
  // h2 sections
  const parts = artHtml.split(/(?=<h2\b)/i);
  for (const part of parts) {
    if (!part.trim()) continue;
    const h2m = part.match(/^<h2[^>]*>([\s\S]*?)<\/h2>/i);
    if (h2m) {
      const title = strip(h2m[1]);
      if (/frequently asked|faq/i.test(title)) {
        // FAQs handled separately
        continue;
      }
      blocks.push({ type: "h2", text: title });
      parseInner(part.slice(h2m[0].length), blocks);
    } else {
      parseInner(part, blocks);
    }
  }
  return blocks;
}

function parseInner(html, blocks) {
  // Remove FAQ wrap and TOC and sidebar-ish
  let h = html
    .replace(/<div class="faq-wrap"[\s\S]*$/i, "")
    .replace(/<div class="toc-box"[\s\S]*?<\/div>\s*(?=<h2|<h3|<p|<div class="(?:bl|call|stat|check|img|mid))/i, "");

  const chunkRe =
    /<h3[^>]*>([\s\S]*?)<\/h3>|<p[^>]*>([\s\S]*?)<\/p>|<div class="bl"[^>]*>([\s\S]*?)<\/div>\s*(?=<div class="bl"|<h2|<h3|<p|<div class="(?!bl)|$)|<div class="callout"[^>]*>([\s\S]*?)<\/div>|<div class="stat-row"[^>]*>([\s\S]*?)<\/div>\s*(?=<h2|<h3|<p|<div class="(?!stat)|$)|<div class="checklist"[^>]*>([\s\S]*?)<\/div>\s*(?=<h2|<h3|<p|<div class="(?!check)|$)|<table[^>]*>([\s\S]*?)<\/table>|<div class="img-ph"[^>]*>([\s\S]*?)<\/div>\s*(?=<h2|<h3|<p|<div class="(?!img)|$)|<div class="mid-cta"[^>]*>([\s\S]*?)<\/div>\s*(?=<h2|<h3|<p|<div class="(?!mid)|$)/gi;

  let m;
  while ((m = chunkRe.exec(h))) {
    if (m[1] != null) {
      blocks.push({ type: "h3", text: strip(m[1]) });
    } else if (m[2] != null) {
      const t = strip(m[2]);
      if (t) blocks.push({ type: "p", text: t, html: enrichInline(m[2]) });
    } else if (m[3] != null) {
      const blt = (m[3].match(/class="blt"[^>]*>([\s\S]*?)<\/div>/i) ||
        [])[1];
      blocks.push({ type: "bullet", text: strip(blt || m[3]), html: enrichInline(blt || m[3]) });
    } else if (m[4] != null) {
      blocks.push({ type: "callout", text: strip(m[4]), html: enrichInline(m[4]) });
    } else if (m[5] != null) {
      const stats = [...m[5].matchAll(/class="stat-val"[^>]*>([\s\S]*?)<\/div>[\s\S]*?class="stat-lbl"[^>]*>([\s\S]*?)<\/div>/gi)].map(
        (x) => ({ value: strip(x[1]), label: strip(x[2]) }),
      );
      if (stats.length) blocks.push({ type: "stats", items: stats });
    } else if (m[6] != null) {
      const items = [...m[6].matchAll(/class="cl-item"[^>]*>([\s\S]*?)<\/div>\s*(?=<div class="cl-item"|$)/gi)].map(
        (x) => {
          const body = x[1].replace(/<div class="cl-ico"[\s\S]*?<\/div>/i, "");
          return strip(body);
        },
      );
      // fallback
      const items2 =
        items.length > 0
          ? items
          : [...m[6].matchAll(/class="cl-item"[^>]*>([\s\S]*?)<\/div>/gi)].map(
              (x) => strip(x[1].replace(/class="cl-ico"[\s\S]*?<\/div>/i, "")),
            );
      if (items2.length) blocks.push({ type: "checklist", items: items2 });
    } else if (m[7] != null) {
      const headers = [...m[7].matchAll(/<th[^>]*>([\s\S]*?)<\/th>/gi)].map(
        (x) => strip(x[1]),
      );
      const rows = [...m[7].matchAll(/<tr[^>]*>([\s\S]*?)<\/tr>/gi)]
        .map((tr) =>
          [...tr[1].matchAll(/<td[^>]*>([\s\S]*?)<\/td>/gi)].map((td) =>
            strip(td[1]),
          ),
        )
        .filter((r) => r.length);
      if (headers.length || rows.length)
        blocks.push({ type: "table", headers, rows });
    } else if (m[8] != null) {
      const label = strip(
        (m[8].match(/class="img-ph-label"[^>]*>([\s\S]*?)<\/div>/i) || [])[1] ||
          "Article image",
      );
      blocks.push({ type: "image", label });
    } else if (m[9] != null) {
      const title = strip(
        (m[9].match(/<h4[^>]*>([\s\S]*?)<\/h4>/i) || [])[1] || "",
      );
      const text = strip((m[9].match(/<p[^>]*>([\s\S]*?)<\/p>/i) || [])[1] || "");
      const button = strip(
        (m[9].match(/class="mid-cta-btn"[^>]*>([\s\S]*?)<\/a>/i) || [])[1] ||
          "Get a Quote →",
      );
      blocks.push({ type: "midCta", title, text, button });
    }
  }
}

function enrichInline(html) {
  // Keep simple <strong> only
  return strip(html).length
    ? String(html)
        .replace(/<(?!\/?(strong|em)\b)[^>]+>/gi, "")
        .replace(/\s+/g, " ")
        .trim()
    : "";
}

function extractFaqs(html) {
  const faqs = [];
  const re =
    /<button class="fqq"[^>]*>([\s\S]*?)<\/button>\s*<div class="fqa"[^>]*>([\s\S]*?)<\/div>/gi;
  let m;
  while ((m = re.exec(html))) {
    faqs.push({
      q: strip(m[1]).replace(/▼/g, "").trim(),
      a: strip(m[2]),
    });
  }
  return faqs;
}

function extractToc(html) {
  const items = [];
  const re = /class="ti"[^>]*>[\s\S]*?class="ti-n"[^>]*>([\s\S]*?)<\/span>[\s\S]*?<a[^>]*>([\s\S]*?)<\/a>/gi;
  let m;
  while ((m = re.exec(html))) {
    items.push({ n: strip(m[1]), label: strip(m[2]) });
  }
  // alternate structure
  if (!items.length) {
    const re2 = /class="ti-n"[^>]*>([\s\S]*?)<\/[^>]+>[\s\S]*?<a[^>]*href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/gi;
    while ((m = re2.exec(html))) {
      items.push({ n: strip(m[1]), label: strip(m[3]), href: m[2] });
    }
  }
  return items;
}

const index = [];

for (const meta of POSTS) {
  const html = fs.readFileSync(path.join(dir, meta.file), "utf8");
  const title = strip((html.match(/<title>([^<]+)/i) || [])[1]);
  const description = strip(
    (html.match(/name="description"\s+content="([^"]+)"/i) || [])[1],
  );
  const h1 = strip((html.match(/class="hb-h1"[^>]*>([\s\S]*?)<\/h1>/i) ||
    html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i) ||
    [])[1]);
  const intro = strip(
    (html.match(/class="hb-intro"[^>]*>([\s\S]*?)<\/p>/i) || [])[1],
  );
  const cat =
    strip((html.match(/class="hb-cat"[^>]*>([\s\S]*?)<\/div>/i) || [])[1]) ||
    meta.category;
  const metaBlock = (html.match(
    /class="hb-meta"[^>]*>([\s\S]*?)<\/div>/i,
 ) || [])[1];
  let dateLabel = meta.date;
  let readLabel = `${meta.readMins} min read`;
  if (metaBlock) {
    const spans = [
      ...metaBlock.matchAll(/<span[^>]*>([\s\S]*?)<\/span>/gi),
    ].map((x) => strip(x[1]));
    if (spans[0]) dateLabel = spans[0].replace(/^[^\w]*\s*/, "");
    if (spans[1]) readLabel = spans[1].replace(/^[^\w]*\s*/, "");
  }

  const art =
    extractBetween(html, /<div class="art"[^>]*>/i, /<\/div>\s*<aside/i) ||
    extractBetween(html, /<article[^>]*>/i, /<\/article>/i) ||
    extractBetween(html, /<div class="blog-wrap"[^>]*>/i, /<\/div>\s*<footer/i);

  const blocks = parseBlocks(art);
  const faqs = extractFaqs(html);
  const toc = extractToc(html);

  const post = {
    slug: meta.slug,
    title,
    description,
    category: cat.replace(/^[^\w]+/, "").trim() || meta.category,
    date: meta.date,
    dateLabel,
    readMins: meta.readMins,
    readLabel,
    heroTitle: h1 || title,
    intro,
    toc,
    blocks,
    faqs,
  };

  fs.writeFileSync(
    path.join(outDir, `${meta.slug}.json`),
    JSON.stringify(post, null, 2),
  );
  index.push({
    slug: meta.slug,
    title: h1 || title,
    description,
    category: post.category,
    date: meta.date,
    dateLabel,
    readMins: meta.readMins,
    readLabel,
    excerpt: intro.slice(0, 180) + (intro.length > 180 ? "…" : ""),
  });
  console.log(
    "OK",
    meta.slug,
    "blocks",
    blocks.length,
    "faqs",
    faqs.length,
    "toc",
    toc.length,
  );
}

fs.writeFileSync(
  path.join(outDir, "index.json"),
  JSON.stringify(
    {
      title: "Trizen Packaging Blog | Thermoforming Insights from Vapi",
      description:
        "Expert articles on thermoforming packaging — rPET sustainability, vacuum vs pressure forming, medical & pharma packaging, and Industry 4.0 manufacturing from Trizen Packaging, Vapi.",
      heroEy: "Insights & Resources",
      heroTitle: "Packaging Insights from the Floor",
      heroDesc:
        "Practical articles from Trizen Packaging — materials, processes, regulated industries, and manufacturing innovation from our Vapi facility.",
      posts: index,
    },
    null,
    2,
  ),
);
console.log("Wrote index +", index.length, "posts to", outDir);
