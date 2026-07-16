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
            .layout{
              display:grid!important;
              grid-template-columns:minmax(0,1fr) clamp(280px,22vw,360px)!important;
              gap:clamp(28px,3vw,56px)!important;
              align-items:start!important;
              overflow:visible!important;
              isolation:auto!important;
            }
            .layout > .content{
              grid-column:1!important;
              grid-row:1!important;
              min-width:0!important;
            }
            .layout > .sidebar,
            aside.sidebar{
              grid-column:2!important;
              grid-row:1!important;
              display:block!important;
              visibility:visible!important;
              opacity:1!important;
              position:sticky!important;
              top:24px!important;
              align-self:start!important;
              z-index:20!important;
              width:100%!important;
              max-height:calc(100vh - 32px)!important;
              overflow-y:auto!important;
              overflow-x:visible!important;
              transform:none!important;
              contain:none!important;
              will-change:auto!important;
              left:auto!important;
            }
            .sidebar .side-card,
            .sidebar .side-cta{
              display:block!important;
              visibility:visible!important;
              opacity:1!important;
              transform:none!important;
              will-change:auto!important;
              animation:none!important;
            }
            .sidebar .side-card:hover,
            .sidebar .side-cta:hover{
              transform:none!important;
            }
            @media(max-width:1100px){
              .layout{grid-template-columns:1fr!important}
              .layout > .content,
              .layout > .sidebar,
              aside.sidebar{
                grid-column:1!important;
                grid-row:auto!important;
              }
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
