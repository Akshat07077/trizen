import { cache } from "react";
import { promises as fs } from "node:fs";
import path from "node:path";

export type LegacyPageData = {
  title: string;
  description: string;
  styles: string[];
  /** Markup before .layout (hero, visual band, effects chrome) */
  beforeHtml: string;
  /** Inner HTML of main.content */
  contentHtml: string;
  /** Inner HTML of aside.sidebar */
  sidebarHtml: string;
  /** Markup after .layout */
  afterHtml: string;
};

const TOY_ROUTE_MAP: Record<string, string> = {
  "Trizen_Toy_Category_Clean_Sidebar.html": "/toy",
  "Trizen_Toy_ActionFigure_Clean_Sidebar.html": "/toy/action-figure",
  "Trizen_Toy_SetInserts_Clean_Sidebar.html": "/toy/set-inserts",
  "Trizen_Toy_CustomMolded_Clean_Sidebar.html": "/toy/custom-molded",
  "Trizen_Toy_PackagingTrays_Clean_Sidebar.html": "/toy/packaging-trays",
  "Trizen_Toy_Protective_Clean_Sidebar.html": "/toy/protective",
  "Trizen_Toy_RetailDisplay_Clean_Sidebar.html": "/toy/retail-display",
};

function rewriteLegacyLinks(html: string): string {
  return html.replace(/href="([^"]+)"/g, (fullMatch, hrefValue: string) => {
    const mappedRoute = TOY_ROUTE_MAP[hrefValue];
    if (mappedRoute) return `href="${mappedRoute}"`;
    if (hrefValue.endsWith(".html")) return 'href="#"';
    return fullMatch;
  });
}

function extractMetaValue(head: string, pattern: RegExp): string {
  const match = head.match(pattern);
  return match?.[1]?.trim() ?? "";
}

function normalizeHtml(input: string): string {
  return input.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
}

/** Strip legacy layout/sidebar positioning so our CSS fully owns placement. */
function sanitizeLegacyCss(css: string): string {
  return css
    .replace(/body\{([^}]*)overflow-x:\s*hidden;?/g, "body{$1overflow-x:clip;")
    .replace(/html\{([^}]*)overflow-x:\s*hidden;?/g, "html{$1overflow-x:clip;")
    // Neutralize layout grid/flex rules that fight the right sidebar
    .replace(/\.layout\s*\{[^}]*\}/gi, ".layout{/* neutralized */}")
    .replace(/\.layout>\.content\s*\{[^}]*\}/gi, ".layout>.content{/* neutralized */}")
    .replace(/\.layout>\.sidebar\s*\{[^}]*\}/gi, ".layout>.sidebar{/* neutralized */}")
    .replace(
      /\.sidebar\{[^}]*position:\s*sticky[^}]*\}/gi,
      ".sidebar{/* sticky neutralized */}",
    )
    .replace(/@media\(max-width:1100px\)/g, "@media(max-width:760px)")
    .replace(/@media\(max-width:980px\)/g, "@media(max-width:760px)");
}

/**
 * Split body into React-safe parts so <aside> cannot be ejected from .layout
 * by the browser's HTML repair during hydration.
 */
export function splitLegacyBody(bodyHtml: string): {
  beforeHtml: string;
  contentHtml: string;
  sidebarHtml: string;
  afterHtml: string;
} {
  const layoutOpen = bodyHtml.indexOf('<div class="layout">');
  const mainOpen = bodyHtml.indexOf('<main class="content">');
  const mainClose = bodyHtml.lastIndexOf("</main>");
  const asideOpen = bodyHtml.indexOf('<aside class="sidebar"');
  const asideClose = bodyHtml.indexOf("</aside>");

  if (
    layoutOpen < 0 ||
    mainOpen < 0 ||
    mainClose < 0 ||
    asideOpen < 0 ||
    asideClose < 0
  ) {
    return {
      beforeHtml: bodyHtml,
      contentHtml: "",
      sidebarHtml: "",
      afterHtml: "",
    };
  }

  const mainOpenEnd = bodyHtml.indexOf(">", mainOpen) + 1;
  const asideOpenEnd = bodyHtml.indexOf(">", asideOpen) + 1;
  const afterAside = asideClose + "</aside>".length;

  // Skip the closing </div> of .layout if present
  let afterHtml = bodyHtml.slice(afterAside);
  afterHtml = afterHtml.replace(/^\s*<\/div>/, "");

  return {
    beforeHtml: bodyHtml.slice(0, layoutOpen),
    contentHtml: bodyHtml.slice(mainOpenEnd, mainClose),
    sidebarHtml: bodyHtml.slice(asideOpenEnd, asideClose),
    afterHtml,
  };
}

export const getLegacyPageData = cache(
  async (filename: string): Promise<LegacyPageData> => {
    const htmlPath = path.join(process.cwd(), "trizen 2", filename);
    const html = normalizeHtml(await fs.readFile(htmlPath, "utf8"));

    const head = html.match(/<head[^>]*>([\s\S]*?)<\/head>/i)?.[1] ?? "";
    const body = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i)?.[1] ?? "";

    const title = extractMetaValue(head, /<title>([\s\S]*?)<\/title>/i);
    const description = extractMetaValue(
      head,
      /<meta\s+name="description"\s+content="([^"]*)"/i,
    );

    const styles = [...head.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/gi)].map(
      (match) => sanitizeLegacyCss(normalizeHtml(match[1]).trim()),
    );

    const bodyClean = body
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
      .replace(
        /<div class="page-loader"><div><div class="loader-mark"><\/div><div class="loader-copy">[\s\S]*?<\/div><\/div><\/div>/i,
        "",
      )
      .replace(/\s+onclick="fq\(this\)"/gi, "")
      .trim();

    const rewritten = rewriteLegacyLinks(bodyClean);
    const parts = splitLegacyBody(rewritten);

    return {
      title,
      description,
      styles,
      ...parts,
    };
  },
);
