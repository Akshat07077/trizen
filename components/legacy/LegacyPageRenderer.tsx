import Script from "next/script";
import { getLegacyPageData } from "@/lib/legacy-html";

type LegacyPageRendererProps = {
  filename: string;
};

export default async function LegacyPageRenderer({
  filename,
}: LegacyPageRendererProps) {
  const pageData = await getLegacyPageData(filename);

  return (
    <>
      {pageData.styles.map((styleContent, index) => (
        <style
          key={`${filename}-style-${index + 1}`}
          dangerouslySetInnerHTML={{ __html: styleContent }}
        />
      ))}

      <div dangerouslySetInnerHTML={{ __html: pageData.bodyHtml }} />

      {pageData.scripts.map((script) => (
        <Script
          key={`${filename}-${script.id}`}
          id={`${filename}-${script.id}`}
          strategy="afterInteractive"
        >
          {script.content}
        </Script>
      ))}
    </>
  );
}
