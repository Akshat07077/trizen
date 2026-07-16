const fs = require("fs");
const path = require("path");

const dir = path.join(process.cwd(), "trizen 2");
const files = [
  ["category", "Trizen_Toy_Category_Clean_Sidebar.html"],
  ["action-figure", "Trizen_Toy_ActionFigure_Clean_Sidebar.html"],
  ["set-inserts", "Trizen_Toy_SetInserts_Clean_Sidebar.html"],
  ["custom-molded", "Trizen_Toy_CustomMolded_Clean_Sidebar.html"],
  ["packaging-trays", "Trizen_Toy_PackagingTrays_Clean_Sidebar.html"],
  ["protective", "Trizen_Toy_Protective_Clean_Sidebar.html"],
  ["retail-display", "Trizen_Toy_RetailDisplay_Clean_Sidebar.html"],
];

function grab(html, re) {
  return (html.match(re) || [])[1]?.trim() || "";
}

for (const [slug, file] of files) {
  const h = fs.readFileSync(path.join(dir, file), "utf8").replace(/\r\n/g, "\n");
  console.log(
    JSON.stringify({
      slug,
      title: grab(h, /<title>([^<]+)/),
      hey: grab(h, /class="hey">([^<]+)/),
      titleMain: grab(h, /class="title-main">([^<]+)/),
      titleTail: grab(h, /class="title-tail">([^<]+)/),
      hdesc: grab(h, /class="hdesc">([^<]+)/).slice(0, 180),
    }),
  );
}
