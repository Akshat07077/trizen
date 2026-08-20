# Trizen HTML source pages

All original violet-sidebar HTML files for the Next.js migration live here.

## Contents

- **59** industry pages — `Trizen_*_Clean_Sidebar.html` and `Trizen_*_New_Design.html`
- **1** automobile template — `trizen-auto-interior-violet-sidebar.html`

## Categories

| Prefix | Industry |
|--------|----------|
| `Trizen_Toy_` | Toys |
| `Trizen_Elec_` | Electronics |
| `Trizen_FMCG_` | FMCG |
| `Trizen_Ind_` | Industrial |
| `Trizen_Med_` | Medical |
| `Trizen_Pharma_` | Pharmaceutical |
| `Trizen_Stat_` | Stationery |
| `Trizen_Mfg_` | Manufacturing |
| `Trizen_Expertise_` | Expertise |

## Regenerate JSON from HTML

```bash
cd next-migration
node scripts/extract-all-industries.js
```

## Add new pages

1. Drop the HTML file in this folder (keep the `Trizen_{Industry}_` naming).
2. Re-run the extractor above.
3. Run `node scripts/setup-image-folders.js` for image slots.
