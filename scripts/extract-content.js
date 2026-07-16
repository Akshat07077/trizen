const fs = require("fs");
const path = require("path");

const dir = path.join(process.cwd(), "trizen 2");
const outDir = path.join(process.cwd(), "lib", "toy", "content");
fs.mkdirSync(outDir, { recursive: true });

const files = {
  category: "Trizen_Toy_Category_Clean_Sidebar.html",
  "action-figure": "Trizen_Toy_ActionFigure_Clean_Sidebar.html",
  "set-inserts": "Trizen_Toy_SetInserts_Clean_Sidebar.html",
  "custom-molded": "Trizen_Toy_CustomMolded_Clean_Sidebar.html",
  "packaging-trays": "Trizen_Toy_PackagingTrays_Clean_Sidebar.html",
  protective: "Trizen_Toy_Protective_Clean_Sidebar.html",
  "retail-display": "Trizen_Toy_RetailDisplay_Clean_Sidebar.html",
};

function grab(html, re) {
  return (html.match(re) || [])[1]?.trim() || "";
}

function decode(s) {
  return s
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

function stripTags(s) {
  return decode(s.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim());
}

function extractFaqs(html) {
  const faqs = [];
  const re =
    /<div class="fq[^"]*"><button class="fqq"[^>]*>([\s\S]*?)<span class="arr">[\s\S]*?<\/button><div class="fqa"><p>([\s\S]*?)<\/p><\/div><\/div>/gi;
  let m;
  while ((m = re.exec(html))) {
    faqs.push({
      q: stripTags(m[1]),
      a: stripTags(m[2]),
    });
  }
  return faqs;
}

function extractStrips(sectionHtml) {
  const strips = [];
  const re =
    /<div class="strip">[\s\S]*?<div class="strip-title">([\s\S]*?)<\/div><div class="strip-desc">([\s\S]*?)<\/div>/gi;
  let m;
  while ((m = re.exec(sectionHtml))) {
    strips.push({ title: stripTags(m[1]), desc: stripTags(m[2]) });
  }
  return strips;
}

function extractPcs(html) {
  const pcs = [];
  const re =
    /<div class="pc">[\s\S]*?<div class="pc-name">([\s\S]*?)<\/div><div class="pc-desc">([\s\S]*?)<\/div>(?:<div class="pc-link">([\s\S]*?)<\/div>)?/gi;
  let m;
  while ((m = re.exec(html))) {
    pcs.push({
      name: stripTags(m[1]),
      desc: stripTags(m[2]),
      link: m[3] ? stripTags(m[3]) : undefined,
    });
  }
  return pcs;
}

function extractLeads(sectionHtml) {
  const leads = [];
  const re = /<p class="lead">([\s\S]*?)<\/p>/gi;
  let m;
  while ((m = re.exec(sectionHtml))) {
    leads.push(stripTags(m[1]));
  }
  return leads;
}

function extractSections(mainHtml) {
  const sections = [];
  const parts = mainHtml.split(/<div class="sec">/).slice(1);
  for (const part of parts) {
    const ey = grab(part, /<div class="ey[^"]*">([\s\S]*?)<\/div>/);
    const st = grab(part, /<h2 class="st">([\s\S]*?)<\/h2>/);
    const body = part.split(/<div class="sec">/)[0];
    sections.push({
      ey: stripTags(ey),
      st: stripTags(st),
      leads: extractLeads(body),
      strips: extractStrips(body),
      products: extractPcs(body),
    });
  }
  return sections;
}

function extractMidCtas(html) {
  const ctas = [];
  const re =
    /<div class="mid-cta"><div class="mid-cta-txt"><h4>([\s\S]*?)<\/h4><p>([\s\S]*?)<\/p><\/div><a[^>]*>([\s\S]*?)<\/a><\/div>/gi;
  let m;
  while ((m = re.exec(html))) {
    ctas.push({
      title: stripTags(m[1]),
      text: stripTags(m[2]),
      button: stripTags(m[3]),
    });
  }
  return ctas;
}

function extractBottomCta(html) {
  const block = grab(
    html,
    /<div class="bottom-cta">([\s\S]*?)<\/div>\s*<\/main>/,
  );
  if (!block) return null;
  return {
    title: stripTags(grab(block, /<h3>([\s\S]*?)<\/h3>/)),
    text: stripTags(grab(block, /<p>([\s\S]*?)<\/p>/)),
  };
}

function extractChips(html) {
  const chips = [];
  const re = /<span class="cp">([^<]+)<\/span>/gi;
  let m;
  while ((m = re.exec(html))) chips.push(m[1].trim());
  return chips;
}

for (const [slug, file] of Object.entries(files)) {
  const h = fs.readFileSync(path.join(dir, file), "utf8").replace(/\r\n/g, "\n");
  const main = grab(h, /<main class="content">([\s\S]*?)<\/main>/);
  const data = {
    slug,
    title: grab(h, /<title>([^<]+)/),
    hero: {
      ey: grab(h, /class="hey">([^<]+)/),
      titleMain: grab(h, /class="title-main">([^<]+)/),
      titleTail: grab(h, /class="title-tail">([^<]+)/),
      desc: grab(h, /class="hdesc">([^<]+)/),
      chips: extractChips(h),
    },
    sections: extractSections(main),
    midCtas: extractMidCtas(main),
    bottomCta: extractBottomCta(h),
    faqs: extractFaqs(main),
  };
  fs.writeFileSync(
    path.join(outDir, `${slug}.json`),
    JSON.stringify(data, null, 2),
  );
  console.log(slug, "sections", data.sections.length, "faqs", data.faqs.length);
}
