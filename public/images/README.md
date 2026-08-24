# Trizen site images (`public/images/`)


---

## Folder path

```
public/images/{industry-id}/{page-slug}/
```

**Examples**

| URL | Folder |
|-----|--------|
| `/manufacturing/plastic-packaging` | `public/images/manufacturing/plastic-packaging/` |
| `/toy/action-figure` | `public/images/toy/action-figure/` |
| `/pharmaceutical/sterile` | `public/images/pharmaceutical/sterile/` |
| `/manufacturing` (overview) | `public/images/manufacturing/category/` |
| `/expertise/hub` | `public/images/expertise/hub/` |

Industry IDs and slugs match `lib/industries/registry.json` and the URL path.

---

## File names (required)

Use exactly these basenames. Extension can be any supported format (see below).

| File name | Used for |
|-----------|----------|
| `hero` | **Photo 1** in the 3-image row below the hero; also fallback for category card thumbnails and design panel |
| `content-1` | **Photo 2** in the 3-image row |
| `content-2` | **Photo 3** in the 3-image row; preferred image in the **Design Requirements** tab panel |

**Example set**

```
public/images/manufacturing/plastic-packaging/hero.webp
public/images/manufacturing/plastic-packaging/content-1.webp
public/images/manufacturing/plastic-packaging/content-2.webp
```

Alternate names also work if the primary is missing: `hero-image`, `content1`, `content2`.

---

## Supported formats

- **Recommended:** `.webp` or `.jpg` (photos)
- Also accepted: `.jpeg`, `.png`, `.avif`
- `.svg` is detected but **not** shown in the hero gallery (raster only)

If multiple extensions exist for the same slot (e.g. `hero.jpg` and `hero.webp`), the resolver picks the first match in this order: jpg, jpeg, webp, png, avif.

---

## Where images appear on the page

| Slot | On-screen location |
|------|---------------------|
| `hero` | Left card in the **3-photo gallery** row under the hero section |
| `content-1` | Middle card in that row |
| `content-2` | Right card in that row + **Design Requirements** side panel image |

**Not wired to these files yet**

- Large **hero rhombus** (right of headline) — still uses the violet gradient placeholder
- **Blog** posts — use dashed placeholders; blog folders under `public/images/blog/` are not connected yet

---

## Placeholders vs real photos

| What you see | Meaning |
|--------------|---------|
| Dashed box “Photo 1 / 2 / 3” + caption text | File missing for that slot |
| Three real photos in a row | All (or some) of `hero`, `content-1`, `content-2` found |
| No gallery row at all | Product page with **zero** images uploaded (editorial pages hide empty gallery) |
| Always 3 dashed boxes | **Overview** pages (`/toy`, `/fmcg`, `/manufacturing`, etc.) — show 3 slots even when empty |

Caption text under placeholders comes from `imageLabels` in each page’s JSON under `lib/industries/content/`.

---

## Optional: alt text / labels

In the page JSON (e.g. `lib/industries/content/manufacturing/plastic-packaging.json`):

```json
"imageLabels": [
  "Product packaging",
  "Production facility Vapi"
]
```

- Index 0 → alt text for `hero`
- Index 1 → alt text for `content-1`
- Index 2 → defaults to a generic label if omitted

---

## Fallback behaviour

- If a **sub-page** has no images, the site may use images from that industry’s **overview** folder (`category` or `hub`).
- **Toy** pages can also fall back to paths in `lib/toy/images.ts` if the folder is empty.

---

## Suggested specs (guidance only)

| Use | Suggested |
|-----|-----------|
| Gallery photos | Landscape, min ~1200×800 px, consistent aspect ratio across the set |
| File size | Compress for web; aim &lt; 300 KB per image where possible |
| Subject | Product trays, blister packs, facility shots — match `imageLabels` / page topic |

---

## Checklist per page

- [ ] Folder exists: `public/images/{industry}/{slug}/`
- [ ] `hero.*` uploaded
- [ ] `content-1.*` uploaded
- [ ] `content-2.*` uploaded
- [ ] `imageLabels` updated in JSON if captions should change
- [ ] Page refreshed locally to confirm gallery + design panel

---

## Related code

| File | Purpose |
|------|---------|
| `lib/industries/images.ts` | Resolves files from disk → URLs |
| `lib/industries/gallery.ts` | Builds the 3-image gallery row |
| `components/trizen/IndustryHeroGallery.tsx` | Renders the gallery |
| `scripts/setup-image-folders.js` | Creates empty folders for every registered page |

Questions: check the page URL → map to `{industry}/{slug}` → add the three files above.
