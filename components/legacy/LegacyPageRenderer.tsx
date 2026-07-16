import { getLegacyPageData } from "@/lib/legacy-html";
import {
  injectToyImages,
  TOY_IMAGE_CSS,
  TOY_IMAGES_BY_FILE,
} from "@/lib/toy-images";
import LegacyBootstrap from "@/components/legacy/LegacyBootstrap";
import LegacyEffects from "@/components/legacy/LegacyEffects";

type LegacyPageRendererProps = {
  filename: string;
};

export default async function LegacyPageRenderer({
  filename,
}: LegacyPageRendererProps) {
  const pageData = await getLegacyPageData(filename);
  const images = TOY_IMAGES_BY_FILE[filename];
  const bodyHtml = images
    ? injectToyImages(pageData.bodyHtml, images)
    : pageData.bodyHtml;

  return (
    <>
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
            .layout{overflow:visible!important;align-items:start!important;isolation:auto!important}
            .layout > .sidebar,
            aside.sidebar{
              position:sticky!important;
              top:24px!important;
              align-self:start!important;
              z-index:20!important;
              max-height:calc(100vh - 32px)!important;
              overflow-y:auto!important;
              overflow-x:visible!important;
              transform:none!important;
              contain:none!important;
              will-change:auto!important;
            }
            .sidebar .side-card,
            .sidebar .side-cta{
              transform:none!important;
              will-change:auto!important;
              animation:none!important;
            }
            .sidebar .side-card:hover,
            .sidebar .side-cta:hover{
              transform:none!important;
            }
            @media(max-width:1100px){
              .layout > .sidebar, aside.sidebar{
                position:relative!important;
                top:auto!important;
                max-height:none!important;
                overflow:visible!important;
              }
            }
            ${TOY_IMAGE_CSS}
          `,
        }}
      />

      <div dangerouslySetInnerHTML={{ __html: bodyHtml }} />

      <LegacyBootstrap />
      <LegacyEffects />
    </>
  );
}
