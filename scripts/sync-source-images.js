/**
 * Copies product photos from Truizen workspace folders into
 * public/images/{industry}/{slug}/ with normalized names + standard slots.
 *
 * Source folders (workspace root):
 *   Action Figure, TOY BLISTER, Toy set, custom, Protective toy, Retail Display
 *
 * Run: node scripts/sync-source-images.js
 */
const fs = require("fs");
const path = require("path");

const WORKSPACE = path.resolve(__dirname, "../../");
const PUBLIC_IMAGES = path.resolve(__dirname, "../public/images");

const IMAGE_EXT = /\.(jpg|jpeg|webp|png|avif)$/i;

/** Source folder name -> one or more target slugs under toy */
const TOY_SOURCES = [
  { folder: "Action Figure", slugs: ["action-figure"] },
  { folder: "TOY BLISTER", slugs: ["packaging-trays", "category"] },
  { folder: "Toy set", slugs: ["set-inserts"] },
  { folder: "custom", slugs: ["custom-molded"] },
  { folder: "Protective toy", slugs: ["protective"] },
  { folder: "Retail Display", slugs: ["retail-display"] },
];

const SLOT_NAMES = ["hero", "content-1", "content-2"];

function normalizeBase(name) {
  const ext = path.extname(name);
  const base = path.basename(name, ext)
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
  return `${base}${ext.toLowerCase()}`;
}

function copyFile(src, dest) {
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.copyFileSync(src, dest);
}

function removePlaceholders(dir) {
  if (!fs.existsSync(dir)) return;
  for (const file of fs.readdirSync(dir)) {
    if (file.endsWith(".svg") && SLOT_NAMES.some((s) => file.startsWith(s))) {
      fs.unlinkSync(path.join(dir, file));
    }
  }
}

function syncFolder(sourceDir, industryId, slug) {
  const targetDir = path.join(PUBLIC_IMAGES, industryId, slug);
  fs.mkdirSync(targetDir, { recursive: true });

  const files = fs
    .readdirSync(sourceDir)
    .filter((f) => IMAGE_EXT.test(f))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

  if (!files.length) {
    console.warn(`  skip ${slug}: no images in ${sourceDir}`);
    return 0;
  }

  let count = 0;
  for (let i = 0; i < files.length; i++) {
    const srcFile = path.join(sourceDir, files[i]);
    const normalized = normalizeBase(files[i]);
    copyFile(srcFile, path.join(targetDir, normalized));
    count++;

    if (i < SLOT_NAMES.length) {
      const ext = path.extname(files[i]);
      copyFile(srcFile, path.join(targetDir, SLOT_NAMES[i] + ext));
    }
  }

  removePlaceholders(targetDir);
  console.log(`  ${industryId}/${slug}: ${files.length} photo(s)`);
  return count;
}

let total = 0;

console.log("Syncing toy product photos...");
for (const { folder, slugs } of TOY_SOURCES) {
  const sourceDir = path.join(WORKSPACE, folder);
  if (!fs.existsSync(sourceDir)) {
    console.warn(`Missing source folder: ${folder}`);
    continue;
  }
  for (const slug of slugs) {
    total += syncFolder(sourceDir, "toy", slug);
  }
}

console.log(`Done: ${total} file copies into public/images/toy/`);
console.log("Other industries: drop photos into public/images/{industry}/{slug}/ or run npm run images:generate");
