# Trizen category images

Each page has a folder: `public/images/{industry}/{page-slug}/`

## File names

Drop photos using these names (jpg, jpeg, webp, png, or avif):

- `hero` — Hero product photo
- `content-1` — First mid-page image
- `content-2` — Second mid-page image

Real photos always beat SVG placeholders.

## Toy photos (from workspace folders)

Product shots are synced from the Truizen workspace:

| Workspace folder   | App route slug      |
|--------------------|---------------------|
| Action Figure      | `/toy/action-figure` |
| TOY BLISTER        | `/toy/packaging-trays`, `/toy` |
| Toy set            | `/toy/set-inserts` |
| custom             | `/toy/custom-molded` |
| Protective toy     | `/toy/protective` |
| Retail Display     | `/toy/retail-display` |

```bash
npm run images:sync
```

## Other industries

Create a folder per page (same pattern as toys) and add `hero` + `content-1` + `content-2`:

```bash
npm run images:setup      # create empty folders
npm run images:generate   # SVG placeholders where no photos yet
```

Example:

```
public/images/stationery/school-kit/hero.jpg
public/images/stationery/school-kit/content-1.jpg
public/images/stationery/school-kit/content-2.jpg
```
