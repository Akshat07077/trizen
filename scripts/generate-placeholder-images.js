/**
 * Generates branded SVG placeholders (hero, content-1, content-2) for every
 * page folder under public/images/. Skips slots that already have a real image.
 *
 * Run: node scripts/generate-placeholder-images.js
 */
const fs = require("fs");
const path = require("path");

const registry = require("../lib/industries/registry.json");
const PUBLIC_IMAGES = path.resolve(__dirname, "../public/images");
const EXTENSIONS = [".jpg", ".jpeg", ".webp", ".png", ".avif", ".svg"];

const INDUSTRY_PALETTE = {
  toy: ["#36356C", "#6866A0"],
  electronics: ["#0B3D91", "#2563EB"],
  fmcg: ["#0F766E", "#14B8A6"],
  industrial: ["#374151", "#6B7280"],
  medical: ["#1D4ED8", "#3B82F6"],
  pharmaceutical: ["#7C3AED", "#A78BFA"],
  stationery: ["#B45309", "#F59E0B"],
  manufacturing: ["#1B1F73", "#0050CC"],
  expertise: ["#4338CA", "#6366F1"],
};

function escapeXml(text) {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function slotExists(dir, basename) {
  for (const ext of EXTENSIONS) {
    if (fs.existsSync(path.join(dir, basename + ext))) return true;
  }
  return false;
}

function folderHasRaster(dir) {
  if (!fs.existsSync(dir)) return false;
  return fs.readdirSync(dir).some((f) =>
    /\.(jpg|jpeg|webp|png|avif)$/i.test(f),
  );
}

function wrapLines(text, maxLen = 42) {
  const words = text.split(/\s+/);
  const lines = [];
  let line = "";
  for (const word of words) {
    const next = line ? `${line} ${word}` : word;
    if (next.length > maxLen && line) {
      lines.push(line);
      line = word;
    } else {
      line = next;
    }
  }
  if (line) lines.push(line);
  return lines.slice(0, 3);
}

function benzenePattern(opacity = 0.12) {
  return `<g opacity="${opacity}" stroke="#ffffff" stroke-width="1" fill="none">
    <path d="M120 40l34.64 20v40L120 120 85.36 100V60z"/>
    <path d="M280 120l34.64 20v40L280 200 245.36 180V140z"/>
    <path d="M440 40l34.64 20v40L440 120 405.36 100V60z"/>
    <path d="M600 120l34.64 20v40L600 200 565.36 180V140z"/>
    <path d="M760 40l34.64 20v40L760 120 725.36 100V60z"/>
    <path d="M920 120l34.64 20v40L920 200 885.36 180V140z"/>
    <path d="M1080 40l34.64 20v40L1080 120 1055.36 100V60z"/>
    <path d="M1280 120l34.64 20v40L1280 200 1245.36 180V140z"/>
    <path d="M1460 40l34.64 20v40L1460 120 1425.36 100V60z"/>
  </g>`;
}

function makeSvg({ width, height, colors, title, subtitle, badge, variant = 0 }) {
  const [c1, c2] = colors;
  const angle = variant === 0 ? "0%" : variant === 1 ? "100%" : "50%";
  const lines = wrapLines(title);
  const lineY = height * 0.42;
  const textLines = lines
    .map((line, i) => {
      const y = lineY + i * (height * 0.055);
      return `<text x="72" y="${y}" fill="#ffffff" font-family="Arial, Helvetica, sans-serif" font-size="${height * 0.052}" font-weight="700">${escapeXml(line)}</text>`;
    })
    .join("");

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <defs>
    <linearGradient id="bg" x1="${angle}" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${c1}"/>
      <stop offset="100%" stop-color="${c2}"/>
    </linearGradient>
    <linearGradient id="shine" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0"/>
      <stop offset="50%" stop-color="#ffffff" stop-opacity="0.08"/>
      <stop offset="100%" stop-color="#ffffff" stop-opacity="0"/>
    </linearGradient>
  </defs>
  <rect width="${width}" height="${height}" fill="url(#bg)"/>
  ${benzenePattern(0.14)}
  <rect x="0" y="0" width="${width}" height="${height}" fill="url(#shine)"/>
  <rect x="72" y="${height * 0.28}" width="64" height="4" fill="rgba(255,255,255,0.55)"/>
  <text x="72" y="${height * 0.34}" fill="rgba(255,255,255,0.72)" font-family="Consolas, monospace" font-size="${height * 0.028}" font-weight="700" letter-spacing="3">${escapeXml(badge)}</text>
  ${textLines}
  <text x="72" y="${height * 0.72}" fill="rgba(255,255,255,0.68)" font-family="Arial, Helvetica, sans-serif" font-size="${height * 0.03}">${escapeXml(subtitle)}</text>
  <text x="72" y="${height * 0.78}" fill="rgba(255,255,255,0.45)" font-family="Consolas, monospace" font-size="${height * 0.022}" letter-spacing="2">TRIZEN PACKAGING · VAPI, GUJARAT · ISO 9001:2015</text>
  <polygon points="${width - 80},${height - 80} ${width},${height - 80} ${width},${height}" fill="rgba(255,255,255,0.12)"/>
</svg>`;
}

function pageLabel(industryId, slug, meta) {
  if (slug === "category" || slug === "hub") return `${meta.label} Overview`;
  const navItem = meta.nav?.find((n) => n.href.endsWith(`/${slug}`) || n.href === meta.route);
  if (navItem) return navItem.label;
  return slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function writeSlot(dir, basename, svg) {
  if (slotExists(dir, basename)) return false;
  fs.writeFileSync(path.join(dir, basename + ".svg"), svg, "utf8");
  return true;
}

let created = 0;
let skipped = 0;

for (const [industryId, meta] of Object.entries(registry.industries)) {
  const colors = INDUSTRY_PALETTE[industryId] ?? ["#1B1F73", "#0050CC"];

  for (const slug of meta.pages) {
    const dir = path.join(PUBLIC_IMAGES, industryId, slug);
    fs.mkdirSync(dir, { recursive: true });

    if (folderHasRaster(dir)) {
      skipped += 3;
      continue;
    }

    const label = pageLabel(industryId, slug, meta);
    const badge = meta.label.toUpperCase();

    const slots = [
      {
        name: "hero",
        svg: makeSvg({
          width: 1600,
          height: 900,
          colors,
          title: label,
          subtitle: "Custom thermoforming packaging · Replace with hero.jpg",
          badge,
          variant: 0,
        }),
      },
      {
        name: "content-1",
        svg: makeSvg({
          width: 1400,
          height: 780,
          colors,
          title: "Product Packaging",
          subtitle: label,
          badge: "CONTENT IMAGE 1",
          variant: 1,
        }),
      },
      {
        name: "content-2",
        svg: makeSvg({
          width: 1400,
          height: 780,
          colors,
          title: "Production Facility Vapi",
          subtitle: label,
          badge: "CONTENT IMAGE 2",
          variant: 2,
        }),
      },
    ];

    for (const slot of slots) {
      if (writeSlot(dir, slot.name, slot.svg)) created++;
      else skipped++;
    }
  }
}

console.log(`Placeholder images: ${created} created, ${skipped} slots already filled`);
console.log("Drop real photos as hero.jpg / content-1.jpg / content-2.jpg to replace SVGs.");
