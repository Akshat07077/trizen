import { cache } from "react";
import { promises as fs } from "node:fs";
import path from "node:path";

export type LegacyPageData = {
  title: string;
  description: string;
  styles: string[];
  scripts: { id: string; content: string }[];
  bodyHtml: string;
};

const TOY_ROUTE_MAP: Record<string, string> = {
  "Trizen_Toy_Category_Clean_Sidebar.html": "/toy",
  "Trizen_Toy_ActionFigure_Clean_Sidebar.html": "/toy/action-figure",
  "Trizen_Toy_SetInserts_Clean_Sidebar.html": "/toy/set-inserts",
  "Trizen_Toy_CustomMolded_Clean_Sidebar.html": "/toy/custom-molded",
  "Trizen_Toy_PackagingTrays_Clean_Sidebar.html": "/toy/packaging-trays",
  "Trizen_Toy_Protective_Clean_Sidebar.html": "/toy/protective",
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
    const htmlPath = path.resolve(process.cwd(), "..", "trizen 2", filename);
    const html = await fs.readFile(htmlPath, "utf8");

    const head = html.match(/<head[^>]*>([\s\S]*?)<\/head>/i)?.[1] ?? "";
    const body = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i)?.[1] ?? "";

    const title = extractMetaValue(head, /<title>([\s\S]*?)<\/title>/i);
    const description = extractMetaValue(
      head,
      /<meta\s+name="description"\s+content="([^"]*)"/i,
    );

    const styles = [...head.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/gi)].map(
      (match) => match[1].trim(),
    );

    const scripts = [...body.matchAll(/<script([^>]*)>([\s\S]*?)<\/script>/gi)]
      .map((match, index) => {
        const scriptIdMatch = match[1].match(/\sid="([^"]+)"/i);
        return {
          id: scriptIdMatch?.[1] ?? `legacy-script-${index + 1}`,
          content: match[2].trim(),
        };
      })
      .filter((script) => script.content.length > 0);

    const bodyWithoutScripts = body.replace(
      /<script[^>]*>[\s\S]*?<\/script>/gi,
      "",
    );

    return {
      title,
      description,
      styles,
      scripts,
      bodyHtml: rewriteLegacyLinks(bodyWithoutScripts),
    };
  },
);
