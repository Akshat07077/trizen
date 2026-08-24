/**
 * Cross-check all industry JSON pages against
 * trizen pages whole website/... Preview HTML sources.
 */
const fs = require("fs");
const path = require("path");

const HTML_ROOT = path.resolve(
  __dirname,
  "../../trizen pages whole website/trizen pages whole website",
);
const JSON_ROOT = path.resolve(__dirname, "../lib/industries/content");
const OUT = path.resolve(__dirname, "../content-audit-report.json");

/** Explicit HTML filename (basename) → industry/slug */
const MAP = {
  // manufacturing
  "Trizen_Mfg_Thermoforming_Hybrid_Preview.html": [
    "manufacturing",
    "thermoforming-packaging",
  ],
  "Trizen_Mfg_VacuumForming_Preview.html": ["manufacturing", "vacuum-forming"],
  "Trizen_Mfg_PressureForming_Preview.html": [
    "manufacturing",
    "pressure-forming",
  ],
  "Trizen_Mfg_BlisterPackaging_Final_Preview (1).html": [
    "manufacturing",
    "blister-packaging",
  ],
  "Trizen_Mfg_ClamshellPackaging_Preview.html": [
    "manufacturing",
    "clamshell-packaging",
  ],
  "Trizen_Mfg_Materials_Final_Preview.html": ["manufacturing", "materials"],
  "Trizen_Mfg_PlasticPackaging_Final_Preview.html": [
    "manufacturing",
    "plastic-packaging",
  ],

  // expertise
  "Trizen_Expertise_Hub_Preview.html": ["expertise", "hub"],
  "Trizen_Expertise_UniqueOffer_Preview.html": ["expertise", "unique-offer"],
  "Trizen_Expertise_Contract_Preview.html": [
    "expertise",
    "contract-manufacturing",
  ],
  "Trizen_Expertise_RnD_Preview.html": ["expertise", "rnd-innovation"],
  "Trizen_Expertise_Cleanroom_v2_Preview.html": ["expertise", "cleanroom"],

  // toy
  "Trizen_Toy_Category_Preview.html": ["toy", "category"],
  "Trizen_Toy_ActionFigure_Preview.html": ["toy", "action-figure"],
  "Trizen_Toy_SetInserts_Preview.html": ["toy", "set-inserts"],
  "Trizen_Toy_CustomMolded_Preview.html": ["toy", "custom-molded"],
  "Trizen_Toy_PackagingTrays_Preview.html": ["toy", "packaging-trays"],
  "Trizen_Toy_Protective_Preview.html": ["toy", "protective"],
  "Trizen_Toy_RetailDisplay_Preview.html": ["toy", "retail-display"],

  // electronics
  "Trizen_Elec_Category_Preview.html": ["electronics", "category"],
  "Trizen_Elec_ESD_Preview.html": ["electronics", "esd"],
  "Trizen_Elec_PCB_Preview.html": ["electronics", "pcb"],
  "Trizen_Elec_Connector_Preview.html": ["electronics", "connector"],
  "Trizen_Elec_Switches_Preview.html": ["electronics", "switches"],
  "Trizen_Elec_Consumer_Preview.html": ["electronics", "consumer"],

  // fmcg
  "Trizen_FMCG_Category_Preview.html": ["fmcg", "category"],
  "Trizen_FMCG_Bakery_Preview.html": ["fmcg", "bakery"],
  "Trizen_FMCG_Retail_Preview.html": ["fmcg", "retail"],
  "Trizen_FMCG_Custom_Preview.html": ["fmcg", "custom"],
  "Trizen_FMCG_FoodBev_Preview.html": ["fmcg", "food-bev"],

  // industrial
  "Trizen_Ind_Category_Preview.html": ["industrial", "category"],
  "Trizen_Ind_PowerTools_Preview.html": ["industrial", "power-tools"],
  "Trizen_Ind_Enclosures_Preview.html": ["industrial", "enclosures"],
  "Trizen_Ind_Machinery_Preview.html": ["industrial", "machinery"],

  // medical
  "Trizen_Med_Category_Preview.html": ["medical", "category"],
  "Trizen_Med_Cardiology_Preview.html": ["medical", "cardiology"],
  "Trizen_Med_Vascular_Preview.html": ["medical", "vascular"],
  "Trizen_Med_DrugDelivery_Preview.html": ["medical", "drug-delivery"],
  "Trizen_Med_Respiratory_Preview.html": ["medical", "respiratory"],
  "Trizen_Med_Ophthalmic_Preview.html": ["medical", "ophthalmic"],
  "Trizen_Med_Ortho_Preview.html": ["medical", "ortho"],
  "Trizen_Med_WoundCare_Preview.html": ["medical", "wound-care"],
  "Trizen_Med_Oncology_Preview.html": ["medical", "oncology"],

  // pharma
  "Trizen_Pharma_Category_Preview.html": ["pharmaceutical", "category"],
  "Trizen_Pharma_Sterile_Preview.html": ["pharmaceutical", "sterile"],
  "Trizen_Pharma_Syringe_Preview.html": ["pharmaceutical", "syringe"],
  "Trizen_Pharma_Ampoule_Preview.html": ["pharmaceutical", "ampoule"],
  "Trizen_Pharma_Strip_Preview.html": ["pharmaceutical", "strip"],
  "Trizen_Pharma_Diagnostic_Preview.html": ["pharmaceutical", "diagnostic"],
  "Trizen_Pharma_SampleKit_Preview.html": ["pharmaceutical", "sample-kit"],
  "Trizen_Pharma_TamperProof_Preview.html": ["pharmaceutical", "tamper-proof"],
  "Trizen_Pharma_ChildResistant_Preview.html": [
    "pharmaceutical",
    "child-resistant",
  ],

  // stationery
  "Trizen_Stat_Category_Preview.html": ["stationery", "category"],
  "Trizen_Stat_PenMarker_Preview.html": ["stationery", "pen-marker"],
  "Trizen_Stat_Eraser_Preview.html": ["stationery", "eraser"],
  "Trizen_Stat_SchoolKit_Preview.html": ["stationery", "school-kit"],
  "Trizen_Stat_Display_Preview.html": ["stationery", "display"],
  "Trizen_Stat_GiftSet_Preview.html": ["stationery", "gift-set"],
  "Trizen_Stat_Office_Preview.html": ["stationery", "office"],

  // automobile
  "Trizen_Auto_Category_Preview (1).html": ["automobile", "category"],
  "Trizen_Auto_AssemblyLine_Preview.html": [
    "automobile",
    "assembly-line-trays",
  ],
  "Trizen_Auto_Exterior_Preview.html": [
    "automobile",
    "exterior-component-packaging",
  ],
  "Trizen_Auto_Interior_Preview.html": [
    "automobile",
    "interior-fittings-packaging",
  ],
  "Trizen_Auto_Mechanical_Preview.html": [
    "automobile",
    "mechanical-parts-packaging",
  ],
  "Trizen_Auto_Sensor_Preview.html": [
    "automobile",
    "sensor-electrical-packaging",
  ],

  // cosmetics
  "Trizen_Cosm_Category_Preview.html": ["cosmetics", "category"],
  "Trizen_Cosm_Beauty_Preview.html": ["cosmetics", "cosmetic-beauty-packaging"],
  "Trizen_Cosm_Perfume_Preview.html": [
    "cosmetics",
    "perfume-bottle-insert-trays",
  ],
  "Trizen_Cosm_Makeup_Preview.html": [
    "cosmetics",
    "makeup-kit-thermoformed-trays",
  ],
  "Trizen_Cosm_Lipstick_Preview.html": [
    "cosmetics",
    "lipstick-compact-case-inserts",
  ],
  "Trizen_Cosm_GiftSet_Preview.html": ["cosmetics", "gift-set-display-trays"],
  "Trizen_Cosm_Transparent_Preview.html": [
    "cosmetics",
    "transparent-thermoformed-cosmetic-packaging",
  ],

  // baby-care
  "Trizen_Baby_Category_Preview.html": ["baby-care", "category"],
  "Trizen_Baby_Toy_Preview.html": ["baby-care", "baby-toy-packaging"],
  "Trizen_Baby_Accessories_Preview.html": [
    "baby-care",
    "baby-accessories-trays",
  ],
  "Trizen_Baby_Hygiene_Preview.html": ["baby-care", "hygiene-product-trays"],
  "Trizen_Baby_Product_Preview.html": ["baby-care", "baby-product-packaging"],
  "Trizen_Baby_Feeding_Preview.html": ["baby-care", "feeding-bottle-packaging"],
  "Trizen_Baby_Lotion_Preview.html": ["baby-care", "lotion-cream-tray-inserts"],
};

function strip(s) {
  return String(s)
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#\d+;/g, " ")
    .replace(/&[a-z]+;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function norm(s) {
  return strip(s)
    .toLowerCase()
    .replace(/[–—−]/g, "-")
    .replace(/['']/g, "'")
    .replace(/[""]/g, '"')
    .replace(/[^\w\s.,;:!?%/+()-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function has(hayNorm, needle) {
  const n = norm(needle);
  if (!n || n.length < 10) return true; // skip tiny / noisy
  // editorial chrome we don't require in HTML
  if (/^design requirements$/i.test(needle.trim())) return true;
  if (/pain points we solve/i.test(needle)) return true;
  const sliceLen = Math.min(55, n.length);
  return hayNorm.includes(n.slice(0, sliceLen));
}

function collectFields(j) {
  const fields = [];
  const push = (label, text, kind = "body") => {
    if (!text || String(text).trim().length < 10) return;
    fields.push({ label, text: String(text), kind });
  };

  push("title", j.title, "meta");
  if (j.hero) {
    push("hero.ey", j.hero.ey);
    push("hero.titleMain", j.hero.titleMain);
    push("hero.titleTail", j.hero.titleTail);
    push("hero.desc", j.hero.desc);
    for (const c of j.hero.chips || []) push("chip", c);
  }

  for (const s of j.sections || []) {
    const isEditorial =
      /design\s+requirements/i.test(s.ey || "") ||
      /pain points/i.test(s.ey || "");
    const kind = isEditorial ? "editorial" : "body";
    push("ey:" + s.ey, s.ey, kind);
    push("st:" + (s.st || "").slice(0, 40), s.st, kind);
    for (const lead of s.leads || []) push("lead", lead, kind);
    for (const p of s.products || []) {
      push("product:" + p.name, p.name, kind);
      push("product-desc:" + p.name, p.desc, kind);
    }
    for (const t of s.strips || []) {
      // strip leading 01. / Step N
      const title = String(t.title || "").replace(
        /^(?:\d+\.\s*|\d+(?=[A-Za-z])|Step\s*\d+\s*[—\-:]?\s*)/i,
        "",
      );
      push("strip:" + title.slice(0, 40), title || t.title, kind);
      push("strip-desc:" + title.slice(0, 30), t.desc, kind);
    }
    if (s.table) {
      for (const h of s.table.headers || []) push("th", h, kind);
      for (const row of s.table.rows || []) {
        for (const c of row) push("td", c, kind);
      }
    }
    if (s.callout) push("callout", s.callout, kind);
  }

  for (const f of j.faqs || []) {
    push("faq.q", f.q);
    push("faq.a", f.a);
  }
  for (const c of j.midCtas || []) {
    push("midCta.title", c.title);
    push("midCta.text", c.text);
  }
  if (j.bottomCta) {
    push("bottomCta.title", j.bottomCta.title);
    push("bottomCta.text", j.bottomCta.text);
  }

  return fields;
}

function findHtmlFile(basename) {
  // search recursively
  const stack = [HTML_ROOT];
  while (stack.length) {
    const dir = stack.pop();
    let entries;
    try {
      entries = fs.readdirSync(dir, { withFileTypes: true });
    } catch {
      continue;
    }
    for (const e of entries) {
      const p = path.join(dir, e.name);
      if (e.isDirectory()) stack.push(p);
      else if (e.name === basename) return p;
    }
  }
  return null;
}

function listJsonPages() {
  const pages = [];
  for (const ind of fs.readdirSync(JSON_ROOT, { withFileTypes: true })) {
    if (!ind.isDirectory()) continue;
    const dir = path.join(JSON_ROOT, ind.name);
    for (const f of fs.readdirSync(dir)) {
      if (!f.endsWith(".json")) continue;
      pages.push({
        industry: ind.name,
        slug: f.replace(/\.json$/, ""),
        jsonPath: path.join(dir, f),
      });
    }
  }
  return pages;
}

const results = [];
const mapped = new Map(); // industry/slug → html basename

for (const [basename, [industry, slug]] of Object.entries(MAP)) {
  mapped.set(`${industry}/${slug}`, basename);
}

const allJson = listJsonPages();
const unmatchedJson = [];
const unmatchedHtml = [];

for (const page of allJson) {
  const key = `${page.industry}/${page.slug}`;
  const basename = mapped.get(key);
  if (!basename) {
    unmatchedJson.push(key);
    continue;
  }

  const htmlPath = findHtmlFile(basename);
  if (!htmlPath) {
    results.push({
      key,
      status: "html-missing",
      basename,
      score: 0,
      missing: [],
    });
    continue;
  }

  const j = JSON.parse(fs.readFileSync(page.jsonPath, "utf8"));
  const html = fs.readFileSync(htmlPath, "utf8");
  const hay = norm(html);
  const fields = collectFields(j);

  const body = fields.filter((f) => f.kind === "body" || f.kind === "meta");
  const editorial = fields.filter((f) => f.kind === "editorial");

  const missing = [];
  let hit = 0;
  for (const f of body) {
    if (has(hay, f.text)) hit++;
    else missing.push({ label: f.label, text: f.text.slice(0, 140) });
  }

  const score = body.length ? Math.round((100 * hit) / body.length) : 100;

  // editorial: how many are actually in HTML (bonus info)
  let editorialInHtml = 0;
  for (const f of editorial) {
    if (has(hay, f.text)) editorialInHtml++;
  }

  results.push({
    key,
    basename,
    status: score >= 90 ? "ok" : score >= 75 ? "warn" : "fail",
    score,
    checked: body.length,
    hit,
    missingCount: missing.length,
    missing: missing.slice(0, 25),
    editorialFields: editorial.length,
    editorialInHtml,
    htmlTitle: strip((html.match(/<title>([^<]+)/i) || [])[1] || "").slice(
      0,
      100,
    ),
    jsonTitle: (j.title || "").slice(0, 100),
  });
}

// HTML files that exist but aren't mapped (excluding blog/core/custom)
function walkHtml(dir, acc = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walkHtml(p, acc);
    else if (e.name.endsWith(".html")) acc.push(e.name);
  }
  return acc;
}

const allHtml = walkHtml(HTML_ROOT);
const mappedBasenames = new Set(Object.keys(MAP));
for (const name of allHtml) {
  if (mappedBasenames.has(name)) continue;
  if (/Blog|Homepage|About|Custom_Solutions/i.test(name)) continue;
  unmatchedHtml.push(name);
}

results.sort((a, b) => a.score - b.score || a.key.localeCompare(b.key));

const summary = {
  checked: results.length,
  ok: results.filter((r) => r.status === "ok").length,
  warn: results.filter((r) => r.status === "warn").length,
  fail: results.filter((r) => r.status === "fail").length,
  unmatchedJson,
  unmatchedHtml,
  pages: results,
};

fs.writeFileSync(OUT, JSON.stringify(summary, null, 2));

console.log("=== CONTENT CROSS-CHECK vs whole-website folder ===");
console.log(
  `Checked: ${summary.checked}  OK(>=90%): ${summary.ok}  WARN(75-89%): ${summary.warn}  FAIL(<75%): ${summary.fail}`,
);
console.log("");
console.log("--- FAIL / WARN pages ---");
for (const r of results.filter((r) => r.status !== "ok")) {
  console.log(
    `${r.status.toUpperCase()} ${r.score}%  ${r.key}  (missing ${r.missingCount}/${r.checked})`,
  );
  for (const m of r.missing.slice(0, 8)) {
    console.log(`   - [${m.label}] ${m.text}`);
  }
}
console.log("");
console.log("--- JSON with no HTML source ---");
unmatchedJson.forEach((k) => console.log(" ", k));
console.log("");
console.log("--- HTML not mapped (excl blog/about/home) ---");
unmatchedHtml.forEach((k) => console.log(" ", k));
console.log("");
console.log("Full report:", OUT);
