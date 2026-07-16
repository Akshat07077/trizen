import { cache } from "react";
import { promises as fs } from "node:fs";
import path from "node:path";

export type LegacyPageData = {
  title: string;
  description: string;
  styles: string[];
  bodyHtml: string;
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
    if (mappedRoute) {
      return `href="${mappedRoute}"`;
    }

    if (hrefValue.endsWith(".html")) {
      return 'href="#"';
    }

    return fullMatch;
  });
}

function extractMetaValue(head: string, pattern: RegExp): string {
  const match = head.match(pattern);
  return match?.[1]?.trim() ?? "";
}

export const getLegacyPageData = cache(
  async (filename: string): Promise<LegacyPageData> => {
    // HTML sources ship with the Next app (next-migration/trizen 2) for Vercel deploys
    const htmlPath = path.join(process.cwd(), "trizen 2", filename);
    const html = await fs.readFile(htmlPath, "utf8");

    const head = html.match(/<head[^>]*>([\s\S]*?)<\/head>/i)?.[1] ?? "";
    const body = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i)?.[1] ?? "";

    const title = extractMetaValue(head, /<title>([\s\S]*?)<\/title>/i);
    const description = extractMetaValue(
      head,
      /<meta\s+name="description"\s+content="([^"]*)"/i,
    );

    const styles = [...head.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/gi)].map(
      (match) =>
        match[1]
          .trim()
          // overflow-x:hidden on body/html breaks position:sticky in browsers
          .replace(/body\{([^}]*)overflow-x:\s*hidden;?/g, "body{$1overflow-x:clip;")
          .replace(/html\{([^}]*)overflow-x:\s*hidden;?/g, "html{$1overflow-x:clip;"),
    );

    // Strip scripts — interactions run via LegacyEffects (React) instead
    const bodyWithoutScripts = body
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
      .replace(
        /<div class="page-loader"><div><div class="loader-mark"><\/div><div class="loader-copy">[\s\S]*?<\/div><\/div><\/div>/i,
        "",
      )
      // Remove inline onclick handlers (handled by event delegation)
      .replace(/\s+onclick="fq\(this\)"/gi, "");

    return {
      title,
      description,
      styles,
      bodyHtml: rewriteLegacyLinks(bodyWithoutScripts),
    };
  },
);
