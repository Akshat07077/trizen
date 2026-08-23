/**
 * Add Design Requirements sections (4 strips) to manufacturing pages
 * so the editorial 01–04 tab panel renders on product pages.
 */
const fs = require("fs");
const path = require("path");

const MFG_DIR = path.resolve(__dirname, "../lib/industries/content/manufacturing");

const PAGE_DESIGN = {
  "thermoforming-packaging": {
    st: "Thermoforming Packaging Design — Key Requirements",
    source: { sectionEy: "Our Solutions", from: "table", max: 4 },
  },
  "vacuum-forming": {
    st: "Vacuum Forming Design — Key Requirements",
    source: { sectionEy: "The Process", from: "table", max: 4 },
  },
  "pressure-forming": {
    st: "Pressure Forming Design — Key Requirements",
    source: { sectionEy: "The Process", from: "table", max: 4 },
  },
  "blister-packaging": {
    st: "Blister Packaging Design — Key Requirements",
    source: { sectionEy: "Manufacturing Process", from: "table", max: 4 },
  },
  "clamshell-packaging": {
    st: "Clamshell Packaging Design — Key Requirements",
    source: { sectionEy: "Sealing Methods", from: "table", max: 4 },
  },
  materials: {
    st: "Material Selection Design — Key Requirements",
    source: { sectionEy: "Material Selection", from: "table", max: 4 },
  },
  "plastic-packaging": {
    st: "Plastic Packaging Design — Key Requirements",
    source: { sectionEy: "Complete Range", from: "products", max: 4 },
  },
};

function tableToStrips(table, max = 4) {
  if (!table?.rows?.length) return [];
  return table.rows.slice(0, max).map((row) => ({
    title: row[0] || "Requirement",
    desc: [row[1], row[2]].filter(Boolean).join(" — "),
  }));
}

function productsToStrips(products, max = 4) {
  if (!products?.length) return [];
  return products.slice(0, max).map((p) => ({
    title: p.name,
    desc: p.desc || "",
  }));
}

function findSection(page, ey) {
  return page.sections.find((s) => s.ey === ey);
}

function insertDesignSection(page, config) {
  if (page.sections.some((s) => /design requirements/i.test(s.ey))) {
    console.log("skip", page.slug, "(already has Design Requirements)");
    return false;
  }

  const sourceSection = findSection(page, config.source.sectionEy);
  if (!sourceSection) {
    console.warn("warn", page.slug, "missing source section", config.source.sectionEy);
    return false;
  }

  let strips = [];
  if (config.source.from === "table") {
    strips = tableToStrips(sourceSection.table, config.source.max);
  } else if (config.source.from === "products") {
    strips = productsToStrips(sourceSection.products, config.source.max);
  } else if (config.source.from === "strips") {
    strips = (sourceSection.strips || []).slice(0, config.source.max);
  }

  if (strips.length < 4 && sourceSection.strips?.length) {
    strips = sourceSection.strips.slice(0, 4);
  }
  if (strips.length < 4 && sourceSection.table?.rows?.length) {
    strips = tableToStrips(sourceSection.table, 4);
  }
  if (strips.length < 4) {
    console.warn("warn", page.slug, "only", strips.length, "strips available");
  }
  strips = strips.slice(0, 4);
  if (!strips.length) return false;

  const section = {
    ey: "Design Requirements",
    st: config.st,
    leads: [],
    products: [],
    strips,
  };

  const whyIdx = page.sections.findIndex((s) => /why trizen/i.test(s.ey));
  if (whyIdx >= 0) page.sections.splice(whyIdx, 0, section);
  else page.sections.push(section);

  return true;
}

let updated = 0;
for (const [slug, config] of Object.entries(PAGE_DESIGN)) {
  const filePath = path.join(MFG_DIR, `${slug}.json`);
  if (!fs.existsSync(filePath)) {
    console.warn("missing", filePath);
    continue;
  }
  const page = JSON.parse(fs.readFileSync(filePath, "utf8"));
  if (insertDesignSection(page, config)) {
    fs.writeFileSync(filePath, JSON.stringify(page, null, 2) + "\n");
    console.log("updated", slug);
    updated++;
  }
}

console.log(`\nDone: ${updated} manufacturing pages updated`);
