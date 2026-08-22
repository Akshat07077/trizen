import Hero from "@/components/trizen/Hero";
import IndustrySidebar from "@/components/trizen/IndustrySidebar";
import FAQ from "@/components/trizen/FAQ";
import { MidCTA, BottomCTA } from "@/components/trizen/CTA";
import ImageBlock from "@/components/trizen/ImageBlock";
import ComponentSlider from "@/components/trizen/ComponentSlider";
import { buildToySliderSlides } from "@/lib/industries/build-toy-slider-slides";
import { getIndustryImages } from "@/lib/industries/images";
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
  const useToyEditorial = industryId === "toy";

  return (
    <div
      className={`industry-page${useToyEditorial ? " industry-toy" : ""}`}
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
        variant={useToyEditorial ? "editorial" : "default"}
      />

      <div className="page-wrap">
        <main>
          {content.sections.map((section, sIdx) => {
            const toySliderSlides =
              useToyEditorial && sIdx === 0
                ? buildToySliderSlides(section)
                : [];

            return (
            <div key={`${section.ey}-${sIdx}`}>
              <div className="sec">
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

                {toySliderSlides.length > 0 ? (
                  <ComponentSlider
                    slides={toySliderSlides}
                    ariaLabel={`${meta.label} packaging slider`}
                  />
                ) : null}

                {(!useToyEditorial || sIdx !== 0) &&
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
                  useToyEditorial && sIdx === 0 ? (
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

                {section.strips && section.strips.length > 0 ? (
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
                  {images.content[0] ? (
                    <ImageBlock
                      src={images.content[0]}
                      label={content.imageLabels?.[0] ?? meta.label}
                    />
                  ) : content.imageLabels?.[0] ? (
                    <figure className="img-ph">
                      <div className="img-ph-inner">
                        <div className="img-ph-label">{content.imageLabels[0]}</div>
                      </div>
                    </figure>
                  ) : null}
                </>
              ) : null}

              {sIdx === 2 && content.midCtas[1] ? (
                <>
                  {images.content[1] ? (
                    <ImageBlock
                      src={images.content[1]}
                      label={
                        content.imageLabels?.[1] ?? `${meta.label} production`
                      }
                    />
                  ) : content.imageLabels?.[1] ? (
                    <figure className="img-ph">
                      <div className="img-ph-inner">
                        <div className="img-ph-label">{content.imageLabels[1]}</div>
                      </div>
                    </figure>
                  ) : null}
                  <MidCTA {...content.midCtas[1]} />
                </>
              ) : null}

              {sIdx === 2 && !content.midCtas[1] && images.content[1] ? (
                <ImageBlock
                  src={images.content[1]}
                  label={content.imageLabels?.[1] ?? `${meta.label} production`}
                />
              ) : null}

              {sIdx === 2 && !content.midCtas[1] && !images.content[1] && content.imageLabels?.[1] ? (
                <figure className="img-ph">
                  <div className="img-ph-inner">
                    <div className="img-ph-label">{content.imageLabels[1]}</div>
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
