import Hero from "@/components/trizen/Hero";
import VisualBand from "@/components/trizen/VisualBand";
import ToySidebar from "@/components/trizen/ToySidebar";
import FAQ from "@/components/trizen/FAQ";
import { MidCTA, BottomCTA } from "@/components/trizen/CTA";
import ImageBlock from "@/components/trizen/ImageBlock";
import { TOY_IMAGES } from "@/lib/toy/images";
import type { ToyPageContent } from "@/lib/toy/types";

type ToyPageProps = {
  content: ToyPageContent;
};

export default function ToyPage({ content }: ToyPageProps) {
  const images = TOY_IMAGES[content.slug] ?? TOY_IMAGES.category;

  return (
    <div className="toy-page">
      <Hero
        ey={content.hero.ey}
        titleMain={content.hero.titleMain}
        titleTail={content.hero.titleTail}
        desc={content.hero.desc}
        chips={content.hero.chips}
        imageSrc={images.hero}
        imageLabel={content.hero.titleMain}
      />

      <VisualBand
        mainSrc={images.bandMain}
        mainTitle={content.band.mainTitle}
        mainText={content.band.mainText}
        detailSrc={images.bandDetail}
        detailTitle={content.band.detailTitle}
        detailText={content.band.detailText}
        processSrc={images.bandProcess}
        processTitle={content.band.processTitle}
        processText={content.band.processText}
      />

      <div className="layout">
        <main className="content">
          {content.sections.map((section, sIdx) => (
            <div key={`${section.ey}-${sIdx}`}>
              <div className="sec">
                {section.ey ? <div className="ey">{section.ey}</div> : null}
                {section.st ? <h2 className="st">{section.st}</h2> : null}

                {section.leads?.map((lead) => (
                  <p key={lead.slice(0, 48)} className="lead">
                    {lead}
                  </p>
                ))}

                {section.products && section.products.length > 0 ? (
                  <div className="pgrid">
                    {section.products.map((product) => (
                      <div key={product.name} className="pc">
                        <div className="pc-name">{product.name}</div>
                        <div className="pc-desc">{product.desc}</div>
                        {product.link ? (
                          <div className="pc-link">{product.link}</div>
                        ) : null}
                      </div>
                    ))}
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
                  <ImageBlock
                    src={images.content[0]}
                    label={content.imageLabels?.[0] ?? "Toy packaging"}
                  />
                </>
              ) : null}

              {sIdx === 2 && content.midCtas[1] ? (
                <>
                  <ImageBlock
                    src={images.content[1]}
                    label={
                      content.imageLabels?.[1] ?? "Toy packaging production"
                    }
                  />
                  <MidCTA {...content.midCtas[1]} />
                </>
              ) : null}

              {sIdx === 2 && !content.midCtas[1] ? (
                <ImageBlock
                  src={images.content[1]}
                  label={
                    content.imageLabels?.[1] ?? "Toy packaging production"
                  }
                />
              ) : null}
            </div>
          ))}

          {content.faqs.length > 0 ? (
            <div className="sec">
              <div className="ey">Frequently Asked Questions</div>
              <h2 className="st">Frequently Asked Questions</h2>
              <FAQ items={content.faqs} />
            </div>
          ) : null}

          {content.bottomCta ? <BottomCTA {...content.bottomCta} /> : null}
        </main>

        <ToySidebar />
      </div>
    </div>
  );
}
