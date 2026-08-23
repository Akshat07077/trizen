import Hero from "@/components/trizen/Hero";
import IndustrySidebar from "@/components/trizen/IndustrySidebar";
import FAQ from "@/components/trizen/FAQ";
import { MidCTA, BottomCTA } from "@/components/trizen/CTA";
import FullImageBlock from "@/components/trizen/FullImageBlock";
import DesignControlPanel from "@/components/trizen/DesignControlPanel";
import ComponentSlider from "@/components/trizen/ComponentSlider";
import IndustryHeroGallery from "@/components/trizen/IndustryHeroGallery";
import { buildToySliderSlides } from "@/lib/industries/build-toy-slider-slides";
import {
  findDesignSectionIndex,
  isDesignRequirementsSection,
  isPainPointsSection,
  isOverviewSlug,
} from "@/lib/industries/section-layout";
import {
  designKickerLabel,
  getDesignPanelImage,
  getIndustryImages,
} from "@/lib/industries/images";
import { getIndustryGalleryImages } from "@/lib/industries/gallery";
import type { IndustryMeta, IndustryPageContent } from "@/lib/industries/types";

type IndustryPageProps = {
  industryId: string;
  meta: IndustryMeta;
  content: IndustryPageContent;
};

function SectionTitle({
  ey,
  st,
  eyClass,
}: {
  ey: string;
  st: string;
  eyClass?: "gold" | "green";
}) {
  const parts = st.split(/\s+[—–-]\s+/);
  const main = parts[0] ?? st;
  const sub = parts.slice(1).join(" — ");

  return (
    <>
      {ey ? (
        <div className={`ey${eyClass ? ` ${eyClass}` : ""}`}>{ey}</div>
      ) : null}
      {st ? (
        <h2 className="st">
          <span className="section-title-main">{main}</span>
          {sub ? <span className="section-title-sub">{sub}</span> : null}
        </h2>
      ) : null}
    </>
  );
}

export default function IndustryPage({
  industryId,
  meta,
  content,
}: IndustryPageProps) {
  const images = getIndustryImages(industryId, content.slug);
  const overviewHref =
    industryId === "expertise" ? "/expertise/hub" : meta.route;
  const useEditorial = !isOverviewSlug(content.slug);
  const designSectionIdx = findDesignSectionIndex(content.sections);
  const heroGallery = useEditorial
    ? getIndustryGalleryImages(
        industryId,
        content.slug,
        content.imageLabels,
      )
    : [];
  const designImageSrc = getDesignPanelImage(images);
  const designImageCaption =
    content.imageLabels?.[1] ?? content.imageLabels?.[0] ?? "";

  return (
    <div
      className={`industry-page${useEditorial ? " industry-editorial" : ""}`}
    >
      <Hero
        ey={content.hero.ey}
        titleMain={content.hero.titleMain}
        titleTail={content.hero.titleTail}
        desc={content.hero.desc}
        chips={content.hero.chips}
        imageSrc={images.hero}
        imageLabel={content.hero.titleMain}
        backHref={overviewHref}
        backLabel={`← ${meta.label} Overview`}
        variant={useEditorial ? "editorial" : "default"}
      />

      {useEditorial ? <IndustryHeroGallery images={heroGallery} /> : null}

      <div className="page-wrap">
        <main>
          {content.sections.map((section, sIdx) => {
            const sliderSlides =
              useEditorial && sIdx === 0 ? buildToySliderSlides(section) : [];
            const painLayout =
              useEditorial && isPainPointsSection(section.ey);
            const designLayout = isDesignRequirementsSection(section.ey);

            return (
              <div key={`${section.ey}-${sIdx}`}>
                <div
                  className={`sec${painLayout ? " problem-layout" : ""}${designLayout ? " design-layout" : ""}`}
                >
                  <SectionTitle
                    ey={section.ey}
                    st={section.st}
                    eyClass={section.eyClass}
                  />

                  {section.leads?.map((lead) => (
                    <p key={lead.slice(0, 48)} className="lead">
                      {lead}
                    </p>
                  ))}

                  {sliderSlides.length > 0 ? (
                    <ComponentSlider
                      slides={sliderSlides}
                      ariaLabel={`${meta.label} packaging slider`}
                    />
                  ) : null}

                  {(!useEditorial || sIdx !== 0) &&
                  section.products &&
                  section.products.length > 0 ? (
                    <div className="pgrid">
                      {section.products.map((product) => (
                        <a
                          key={product.name}
                          href={product.href ?? "#"}
                          className="pc"
                        >
                          <div className="pc-name">{product.name}</div>
                          <div className="pc-desc">{product.desc}</div>
                          {product.link ? (
                            <div className="pc-link">{product.link}</div>
                          ) : null}
                        </a>
                      ))}
                    </div>
                  ) : null}

                  {section.table && section.table.rows.length > 0 ? (
                    useEditorial && sIdx === 0 ? (
                      <table className="gtbl slider-source">
                        <thead>
                          <tr>
                            {section.table.headers.map((header) => (
                              <th key={header}>{header}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {section.table.rows.map((row) => (
                            <tr key={row.join("|").slice(0, 64)}>
                              {row.map((cell, cellIdx) => (
                                <td key={`${cellIdx}-${cell.slice(0, 24)}`}>
                                  {cell}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) : (
                      <table className="gtbl">
                        <thead>
                          <tr>
                            {section.table.headers.map((header) => (
                              <th key={header}>{header}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {section.table.rows.map((row) => (
                            <tr key={row.join("|").slice(0, 64)}>
                              {row.map((cell, cellIdx) => (
                                <td key={`${cellIdx}-${cell.slice(0, 24)}`}>
                                  {cell}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )
                  ) : null}

                  {section.callout ? (
                    <div className="callout">
                      <strong>{section.callout}</strong>
                    </div>
                  ) : null}

                  {designLayout &&
                  section.strips &&
                  section.strips.length > 0 ? (
                    <DesignControlPanel
                      items={section.strips}
                      imageSrc={designImageSrc || undefined}
                      imageAlt={
                        designImageCaption ||
                        section.strips[0]?.title ||
                        meta.label
                      }
                      imageCaption={designImageCaption || undefined}
                      kickerLabel={designKickerLabel(meta, content.slug)}
                    />
                  ) : section.strips && section.strips.length > 0 ? (
                    <div className="strips">
                      {section.strips.map((strip) => (
                        <div key={strip.title} className="strip">
                          <div className="strip-body">
                            <div className="strip-title">{strip.title}</div>
                            <div className="strip-desc">{strip.desc}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : null}
                </div>

                {sIdx === 0 && content.midCtas[0] ? (
                  <>
                    <MidCTA {...content.midCtas[0]} />
                    {!useEditorial && images.content[0] ? (
                      <FullImageBlock
                        src={images.content[0]}
                        label={content.imageLabels?.[0] ?? meta.label}
                      />
                    ) : null}
                    {!useEditorial &&
                    !images.content[0] &&
                    content.imageLabels?.[0] ? (
                      <figure className="img-ph img-ph-full">
                        <div className="img-ph-inner">
                          <div className="img-ph-label">
                            {content.imageLabels[0]}
                          </div>
                        </div>
                      </figure>
                    ) : null}
                  </>
                ) : null}

                {sIdx === 2 && content.midCtas[1] ? (
                  <>
                    {!useEditorial &&
                    images.content[1] &&
                    sIdx !== designSectionIdx ? (
                      <FullImageBlock
                        src={images.content[1]}
                        label={
                          content.imageLabels?.[1] ??
                          `${meta.label} production`
                        }
                      />
                    ) : null}
                    <MidCTA {...content.midCtas[1]} />
                  </>
                ) : null}

                {!useEditorial &&
                sIdx === 2 &&
                !content.midCtas[1] &&
                images.content[1] &&
                sIdx !== designSectionIdx ? (
                  <FullImageBlock
                    src={images.content[1]}
                    label={
                      content.imageLabels?.[1] ?? `${meta.label} production`
                    }
                  />
                ) : null}

                {!useEditorial &&
                sIdx === 2 &&
                !content.midCtas[1] &&
                !images.content[1] &&
                content.imageLabels?.[1] &&
                sIdx !== designSectionIdx ? (
                  <figure className="img-ph img-ph-full">
                    <div className="img-ph-inner">
                      <div className="img-ph-label">
                        {content.imageLabels[1]}
                      </div>
                    </div>
                  </figure>
                ) : null}
              </div>
            );
          })}

          {content.faqs.length > 0 ? (
            <div className="sec">
              <div className="ey">Frequently Asked Questions</div>
              <h2 className="st">
                <span className="section-title-main">
                  Frequently Asked Questions
                </span>
                <span className="section-title-sub">{meta.faqSub}</span>
              </h2>
              <FAQ items={content.faqs} />
            </div>
          ) : null}

          {content.bottomCta ? <BottomCTA {...content.bottomCta} /> : null}
        </main>

        <IndustrySidebar industryId={industryId} meta={meta} />
      </div>
    </div>
  );
}
