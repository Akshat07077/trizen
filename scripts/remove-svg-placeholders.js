/**
 * Removes generated SVG slot placeholders from public/images.
 * Production builds should use real photos (jpg/webp/png) only.
 *
 * Run: node scripts/remove-svg-placeholders.js
 */
const fs = require("fs");
const path = require("path");

const PUBLIC_IMAGES = path.resolve(__dirname, "../public/images");
const SLOT_PREFIXES = ["hero", "content-1", "content-2"];

let removed = 0;

function walk(dir) {
  if (!fs.existsSync(dir)) return;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(full);
      continue;
    }
    if (!entry.name.endsWith(".svg")) continue;
    if (!SLOT_PREFIXES.some((prefix) => entry.name.startsWith(prefix))) continue;
    fs.unlinkSync(full);
    removed++;
  }
}

walk(PUBLIC_IMAGES);
console.log(`Removed ${removed} SVG slot placeholder(s).`);
console.log("Add real photos: public/images/{industry}/{slug}/hero.jpg (+ content-1, content-2)");
