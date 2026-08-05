import SiteNav from "@/components/trizen/SiteNav";
import Hero from "@/components/trizen/Hero";
import ToySidebar from "@/components/trizen/ToySidebar";
import FAQ from "@/components/trizen/FAQ";
import { MidCTA, BottomCTA } from "@/components/trizen/CTA";
import ImageBlock from "@/components/trizen/ImageBlock";
import { TOY_IMAGES } from "@/lib/toy/images";
import type { ToyPageContent } from "@/lib/toy/types";

type ToyPageProps = {
  content: ToyPageContent;
};

function SectionTitle({ ey, st }: { ey: string; st: string }) {
  const parts = st.split(/\s+[—–-]\s+/);
  const main = parts[0] ?? st;
  const sub = parts.slice(1).join(" — ");

  return (
    <>
      {ey ? <div className="ey">{ey}</div> : null}
      {st ? (
        <h2 className="st">
          <span className="section-title-main">{main}</span>
          {sub ? <span className="section-title-sub">{sub}</span> : null}
        </h2>
      ) : null}
    </>
  );
}

export default function ToyPage({ content }: ToyPageProps) {
  const images = TOY_IMAGES[content.slug] ?? TOY_IMAGES.category;
  const trailLabel =
    content.slug === "category" ? "Toys" : content.hero.titleMain;

  return (
    <div className="toy-page">
      <SiteNav
        trail={[
          { href: "/", label: "Home" },
          { href: "#", label: "Industries" },
          { href: "/toy", label: "Toys" },
          ...(content.slug !== "category"
            ? [{ label: trailLabel }]
            : []),
        ]}
      />

      <Hero
        ey={content.hero.ey}
        titleMain={content.hero.titleMain}
        titleTail={content.hero.titleTail}
        desc={content.hero.desc}
        chips={content.hero.chips}
        imageSrc={images.hero}
        imageLabel={content.hero.titleMain}
      />

      <div className="page-wrap">
        <main>
          {content.sections.map((section, sIdx) => (
            <div key={`${section.ey}-${sIdx}`}>
              <div className="sec">
                <SectionTitle ey={section.ey} st={section.st} />

                {section.leads?.map((lead) => (
                  <p key={lead.slice(0, 48)} className="lead">
                    {lead}
                  </p>
                ))}

                {section.products && section.products.length > 0 ? (
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
              <h2 className="st">
                <span className="section-title-main">
                  Frequently Asked Questions
                </span>
                <span className="section-title-sub">
                  Toy thermoforming packaging
                </span>
              </h2>
              <FAQ items={content.faqs} />
            </div>
          ) : null}

          {content.bottomCta ? <BottomCTA {...content.bottomCta} /> : null}
        </main>

        <ToySidebar />
      </div>

      <footer>
        <div className="fi">
          <p>
            © 2025 Trizen Packaging · Toy Packaging · Vapi, Gujarat, India ·
            ISO 9001:2015
          </p>
          <div className="fl">
            <a href="/toy">Toys</a>
            <a href="#">Capabilities</a>
            <a href="mailto:contact@trizenpackaging.com">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
