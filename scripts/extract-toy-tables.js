const fs = require("fs");
const path = require("path");

const dir = "c:/n8n/Truizen/next-migration/trizen 2";
const files = fs
  .readdirSync(dir)
  .filter((f) => f.startsWith("Trizen_Toy_") && f.endsWith(".html"));

function parseTable(html) {
  const thead = [...html.matchAll(/<th>([\s\S]*?)<\/th>/gi)].map((m) =>
    m[1].replace(/<[^>]+>/g, "").trim(),
  );
  const rows = [];
  for (const row of html.matchAll(/<tr>([\s\S]*?)<\/tr>/gi)) {
    const cells = [...row[1].matchAll(/<t[dh]>([\s\S]*?)<\/t[dh]>/gi)].map((m) =>
      m[1]
        .replace(/<a[^>]*>/gi, "")
        .replace(/<\/a>/gi, "")
        .replace(/&amp;/g, "&")
        .replace(/<[^>]+>/g, "")
        .trim(),
    );
    if (cells.length && !/<th/i.test(row[1])) rows.push(cells);
  }
  return { headers: thead, rows };
}

function decode(s) {
  return s
    .replace(/&amp;/g, "&")
    .replace(/&mdash;/g, "—")
    .replace(/&nbsp;/g, " ")
    .replace(/<[^>]+>/g, "")
    .trim();
}

for (const f of files) {
  const h = fs.readFileSync(path.join(dir, f), "utf8");
  const out = { file: f };

  const matBlock = h.match(
    /ey gold">Materials[\s\S]*?<table class="gtbl">([\s\S]*?)<\/table>([\s\S]*?)(?=<div class="sec"|<div class="mid-cta"|<div class="bottom-cta")/,
  );
  if (matBlock) {
    out.materials = parseTable(matBlock[1]);
    const call = matBlock[2].match(/<div class="callout">([\s\S]*?)<\/div>/);
    out.callout = call ? decode(call[1]) : null;
  }

  // first product table after What We Manufacture
  const mfg = h.match(
    /What We Manufacture[\s\S]*?<table class="gtbl">([\s\S]*?)<\/table>/,
  );
  if (mfg) out.manufactureTable = parseTable(mfg[1]);

  console.log(JSON.stringify(out, null, 2));
  console.log("\n----\n");
}
