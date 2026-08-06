const fs = require("fs");
const path = require("path");

const dir = "c:/n8n/Truizen/next-migration/trizen 2";
const contentDir = "c:/n8n/Truizen/next-migration/lib/toy/content";

const map = {
  "Trizen_Toy_ActionFigure_Clean_Sidebar.html": "action-figure.json",
  "Trizen_Toy_Category_Clean_Sidebar.html": "category.json",
  "Trizen_Toy_CustomMolded_Clean_Sidebar.html": "custom-molded.json",
  "Trizen_Toy_PackagingTrays_Clean_Sidebar.html": "packaging-trays.json",
  "Trizen_Toy_Protective_Clean_Sidebar.html": "protective.json",
  "Trizen_Toy_RetailDisplay_Clean_Sidebar.html": "retail-display.json",
  "Trizen_Toy_SetInserts_Clean_Sidebar.html": "set-inserts.json",
};

function parseTable(html) {
  const headers = [...html.matchAll(/<th>([\s\S]*?)<\/th>/gi)].map((m) =>
    m[1].replace(/<[^>]+>/g, "").trim(),
  );
  const rows = [];
  for (const row of html.matchAll(/<tr>([\s\S]*?)<\/tr>/gi)) {
    if (/<th/i.test(row[1])) continue;
    const cells = [...row[1].matchAll(/<td>([\s\S]*?)<\/td>/gi)].map((m) =>
      m[1]
        .replace(/<a[^>]*>/gi, "")
        .replace(/<\/a>/gi, "")
        .replace(/&amp;/g, "&")
        .replace(/<[^>]+>/g, "")
        .trim(),
    );
    if (cells.length) rows.push(cells);
  }
  return { headers, rows };
}

function decode(s) {
  return s
    .replace(/&amp;/g, "&")
    .replace(/&mdash;/g, "—")
    .replace(/&nbsp;/g, " ")
    .replace(/<[^>]+>/g, "")
    .trim();
}

for (const [htmlFile, jsonFile] of Object.entries(map)) {
  const h = fs.readFileSync(path.join(dir, htmlFile), "utf8");
  const jsonPath = path.join(contentDir, jsonFile);
  const data = JSON.parse(fs.readFileSync(jsonPath, "utf8"));

  // Materials table + callout
  const matBlock = h.match(
    /ey gold">Materials[\s\S]*?<table class="gtbl">([\s\S]*?)<\/table>([\s\S]*?)(?=<div class="sec"|<div class="mid-cta"|<div class="bottom-cta")/,
  );
  if (matBlock) {
    const table = parseTable(matBlock[1]);
    const call = matBlock[2].match(/<div class="callout">([\s\S]*?)<\/div>/);
    const matSec = data.sections.find((s) => /materials/i.test(s.ey));
    if (matSec) {
      matSec.table = table;
      matSec.callout = call ? decode(call[1]) : undefined;
      matSec.eyClass = "gold";
    }
  }

  // Manufacture product table (skip category — uses product cards)
  if (jsonFile !== "category.json") {
    const mfg = h.match(
      /What We Manufacture[\s\S]*?<table class="gtbl">([\s\S]*?)<\/table>/,
    );
    if (mfg) {
      const first = data.sections[0];
      if (first) first.table = parseTable(mfg[1]);
    }
  }

  const why = data.sections.find((s) => /why choose/i.test(s.ey));
  if (why) why.eyClass = "green";

  fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2) + "\n");
  console.log("updated", jsonFile);
}
