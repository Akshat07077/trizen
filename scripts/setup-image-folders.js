/**
 * Creates public/images/{industry}/{slug}/ folders for every page in the registry.
 * Run after adding HTML or when you want fresh empty image slots.
 */
const fs = require("fs");
const path = require("path");

const registry = require("../lib/industries/registry.json");
const PUBLIC_IMAGES = path.resolve(__dirname, "../public/images");

const README = `# Trizen category images

Drop files into each page folder using these names (jpg, jpeg, webp, png, or avif):

- hero — Hero background
- content-1 — First mid-page image
- content-2 — Second mid-page image

Example:
  public/images/stationery/school-kit/hero.webp
  public/images/stationery/school-kit/content-1.jpg
  public/images/stationery/school-kit/content-2.jpg

Re-run: node scripts/setup-image-folders.js
`;

fs.mkdirSync(PUBLIC_IMAGES, { recursive: true });
fs.writeFileSync(path.join(PUBLIC_IMAGES, "README.md"), README);

let count = 0;
for (const [industryId, meta] of Object.entries(registry.industries)) {
  for (const slug of meta.pages) {
    const dir = path.join(PUBLIC_IMAGES, industryId, slug);
    fs.mkdirSync(dir, { recursive: true });
    const keep = path.join(dir, ".gitkeep");
    if (!fs.existsSync(keep)) fs.writeFileSync(keep, "");
    count++;
  }
}

console.log(`Ready: ${count} page folders under public/images/`);
console.log("Add hero + content-1 + content-2 images per folder, then rebuild.");
