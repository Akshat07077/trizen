import { getLegacyPageData } from "@/lib/legacy-html";
import {
  injectToyImages,
  TOY_IMAGE_CSS,
  TOY_IMAGES_BY_FILE,
} from "@/lib/toy-images";
import LegacyBootstrap from "@/components/legacy/LegacyBootstrap";
import LegacyEffects from "@/components/legacy/LegacyEffects";
import LegacyShell from "@/components/legacy/LegacyShell";
import "@/styles/toy-layout.css";

type LegacyPageRendererProps = {
  filename: string;
};

function applyImages(
  html: string,
  filename: string,
  section: "before" | "content",
): string {
  const images = TOY_IMAGES_BY_FILE[filename];
  if (!images) return html;
  // injectToyImages is safe on partial HTML (hero/band in before, img-ph in content)
  if (section === "before") {
    return injectToyImages(html, {
      ...images,
      // avoid consuming content slots in the before section
      content: ["", ""] as [string, string],
    });
  }
  return injectToyImages(
    // wrap so img-ph regex can still match
    html,
    images,
  );
}

export default async function LegacyPageRenderer({
  filename,
}: LegacyPageRendererProps) {
  const pageData = await getLegacyPageData(filename);

  const beforeHtml = applyImages(pageData.beforeHtml, filename, "before");
  const contentHtml = applyImages(pageData.contentHtml, filename, "content");

  return (
    <div className="toy-page">
      {pageData.styles.map((styleContent, index) => (
        <style
          key={`${filename}-style-${index + 1}`}
          dangerouslySetInnerHTML={{ __html: styleContent }}
        />
      ))}

      <style
        dangerouslySetInnerHTML={{
          __html: `
            .page-loader{display:none!important;opacity:0!important;visibility:hidden!important;pointer-events:none!important}
            html,body{overflow-x:clip!important}
            ${TOY_IMAGE_CSS}
          `,
        }}
      />

      <LegacyShell
        beforeHtml={beforeHtml}
        contentHtml={contentHtml}
        sidebarHtml={pageData.sidebarHtml}
        afterHtml={pageData.afterHtml}
      />

      <LegacyBootstrap />
      <LegacyEffects />
    </div>
  );
}
