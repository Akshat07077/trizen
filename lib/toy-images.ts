/**
 * Toy category image map — files live in /public/images/toy/
 * Each page gets: hero + visual-band (3) + content placeholders (2)
 */
export type ToyImageSet = {
  hero: string;
  bandMain: string;
  bandDetail: string;
  bandProcess: string;
  content: [string, string];
};

const trays = {
  a: "/images/toy/packaging-trays/toy-blister-packaging.jpg",
  b: "/images/toy/packaging-trays/toy-blister-packaging-2.jpg",
  c: "/images/toy/packaging-trays/toy-blister-packaging-3.jpg",
};

const action = {
  a: "/images/toy/action-figure/action-figure-protective-clamshell-case.jpg",
  b: "/images/toy/action-figure/monster-protective-clamshell-packaging.jpg",
  c: "/images/toy/action-figure/star-echo-figure-protective-clamshell-packaging.jpg",
};

const setInserts = {
  a: "/images/toy/set-inserts/toy-set-thermoforming-packaging.jpg",
  b: "/images/toy/set-inserts/custom-toy-set-thermoforming-packaging.jpg",
  c: "/images/toy/set-inserts/toy-thermoforming-packaging.jpg",
};

const custom = {
  a: "/images/toy/custom-molded/custom-molded-hot-wheels-blister-packaging.jpg",
  b: "/images/toy/custom-molded/custom-molded-cossmic-blister-packaging.jpg",
  c: "/images/toy/custom-molded/forest-guardian-toy-blister-packaging.jpg",
};

const protective = {
  a: "/images/toy/protective/protective-toy-thermoforming-boxes.jpg",
  b: "/images/toy/protective/protective-toy-thermoforming-packaging-boxes.jpg",
  c: "/images/toy/protective/toy-thermoforming-packaging-boxes.jpg",
};

const retail = {
  a: "/images/toy/retail-display/retail-display-toy-packaging-box.avif",
  b: "/images/toy/retail-display/retail-display-custom-toy-packaging-box.avif",
  c: "/images/toy/retail-display/toy-displaty-packaging-box.avif",
};

function set(
  hero: string,
  main: string,
  detail: string,
  process: string,
  c1: string,
  c2: string,
): ToyImageSet {
  return {
    hero,
    bandMain: main,
    bandDetail: detail,
    bandProcess: process,
    content: [c1, c2],
  };
}

export const TOY_IMAGES_BY_FILE: Record<string, ToyImageSet> = {
  "Trizen_Toy_Category_Clean_Sidebar.html": set(
    trays.a,
    trays.a,
    trays.b,
    trays.c,
    trays.b,
    trays.c,
  ),
  "Trizen_Toy_ActionFigure_Clean_Sidebar.html": set(
    action.a,
    action.a,
    action.b,
    action.c,
    action.b,
    action.c,
  ),
  "Trizen_Toy_SetInserts_Clean_Sidebar.html": set(
    setInserts.a,
    setInserts.a,
    setInserts.b,
    setInserts.c,
    setInserts.b,
    setInserts.c,
  ),
  "Trizen_Toy_CustomMolded_Clean_Sidebar.html": set(
    custom.a,
    custom.a,
    custom.b,
    custom.c,
    custom.b,
    custom.c,
  ),
  "Trizen_Toy_PackagingTrays_Clean_Sidebar.html": set(
    trays.a,
    trays.a,
    trays.b,
    trays.c,
    trays.b,
    trays.c,
  ),
  "Trizen_Toy_Protective_Clean_Sidebar.html": set(
    protective.a,
    protective.a,
    protective.b,
    protective.c,
    protective.b,
    protective.c,
  ),
  "Trizen_Toy_RetailDisplay_Clean_Sidebar.html": set(
    retail.a,
    retail.a,
    retail.b,
    retail.c,
    retail.b,
    retail.c,
  ),
};

/** Inject real <img> tags into legacy placeholders while keeping layout classes. */
export function injectToyImages(bodyHtml: string, images: ToyImageSet): string {
  let html = bodyHtml;
  let contentIdx = 0;

  // Hero showcase → real product image (nested tray-stack markup)
  html = html.replace(
    /<div class="showcase-frame">[\s\S]*?<div class="showcase-badge">[\s\S]*?<\/div><\/div>/i,
    `<div class="showcase-frame has-photo"><img class="toy-photo toy-photo-hero" src="${images.hero}" alt="Toy packaging product" /><div class="showcase-badge"><span class="material-symbols-outlined">image</span><strong>Product Photo</strong><small>Trizen Packaging</small></div></div>`,
  );

  // Visual band placeholders: <div class="visual-placeholder ..."><div>...</div></div>
  let bandStep = 0;
  const bandSrcs = [images.bandMain, images.bandDetail, images.bandProcess];
  html = html.replace(
    /<div class="visual-placeholder([^"]*)"><div>([\s\S]*?)<\/div><\/div>/gi,
    (_full, cls: string, inner: string) => {
      const src = bandSrcs[Math.min(bandStep, bandSrcs.length - 1)];
      bandStep += 1;
      const title =
        inner.match(/<h2[^>]*>([\s\S]*?)<\/h2>/i)?.[1] ||
        inner.match(/<h3[^>]*>([\s\S]*?)<\/h3>/i)?.[1] ||
        "Toy packaging";
      const cleanTitle = title.replace(/<[^>]+>/g, "").trim();
      return `<div class="visual-placeholder${cls} has-photo"><img class="toy-photo" src="${src}" alt="${cleanTitle}" /><div class="visual-photo-caption"><span>PRODUCT IMAGE</span><strong>${cleanTitle}</strong></div></div>`;
    },
  );

  // Content image placeholders
  html = html.replace(
    /<div class="img-ph"><div class="img-ph-inner">[\s\S]*?<\/div><\/div>/gi,
    () => {
      const src =
        images.content[Math.min(contentIdx, images.content.length - 1)];
      contentIdx += 1;
      return `<div class="img-ph has-photo"><img class="toy-photo toy-photo-content" src="${src}" alt="Toy packaging production" /></div>`;
    },
  );

  return html;
}

export const TOY_IMAGE_CSS = `
.showcase-frame.has-photo{padding:0;background:#0f1630}
.showcase-frame.has-photo:before{display:none}
.showcase-frame.has-photo .tray-stack{display:none}
.toy-photo{display:block;width:100%;height:100%;object-fit:cover;object-position:center}
.toy-photo-hero{position:absolute;inset:0;min-height:100%}
.showcase-frame.has-photo .showcase-badge{z-index:4}
.visual-placeholder.has-photo{padding:0;display:block;background:#0f1630}
.visual-placeholder.has-photo:before,.visual-placeholder.has-photo:after{display:none}
.visual-placeholder.has-photo > .toy-photo{position:absolute;inset:0;width:100%;height:100%}
.visual-placeholder.has-photo{position:relative;overflow:hidden}
.visual-photo-caption{position:absolute;left:18px;right:18px;bottom:18px;z-index:2;padding:14px 16px;background:rgba(255,255,255,.86);border:1px solid rgba(27,31,115,.14);backdrop-filter:blur(12px);clip-path:polygon(0 0,100% 0,100% calc(100% - 10px),calc(100% - 10px) 100%,0 100%)}
.visual-photo-caption span{font-family:'JetBrains Mono',monospace;font-size:10px;letter-spacing:.2em;color:var(--secondary);font-weight:700}
.visual-photo-caption strong{display:block;margin-top:4px;font-family:'Hanken Grotesk',sans-serif;color:var(--primary);font-size:18px}
.img-ph.has-photo{padding:0;min-height:280px;position:relative;overflow:hidden;background:#0f1630}
.img-ph.has-photo .img-ph-inner{display:none}
.toy-photo-content{width:100%;height:100%;min-height:280px;object-fit:cover}
`;
