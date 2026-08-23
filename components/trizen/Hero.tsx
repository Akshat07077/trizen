import type { CSSProperties } from "react";
import ImagePreview from "@/components/trizen/ImagePreview";
import { heroStatsFromChips, type HeroStat } from "@/lib/industries/hero-stats";

type HeroProps = {
  ey: string;
  titleMain: string;
  titleTail: string;
  desc: string;
  chips: string[];
  imageSrc: string;
  imageLabel: string;
  backHref?: string;
  backLabel?: string;
  stats?: HeroStat[];
  variant?: "default" | "editorial";
};

export default function Hero({
  ey,
  titleMain,
  titleTail,
  desc,
  chips,
  imageSrc,
  imageLabel,
  backHref = "/toy",
  backLabel = "← Toy Overview",
  stats,
  variant = "default",
}: HeroProps) {
  const editorial = variant === "editorial";
  const heroStats = stats ?? heroStatsFromChips(chips);
  const hasPhoto = Boolean(imageSrc);
  const heroClass = [
    "hero",
    hasPhoto && !editorial ? "has-product-photo" : "",
    editorial ? "hero-editorial" : "",
    editorial && !hasPhoto ? "hero-editorial--no-photo" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      className={heroClass}
      style={
        editorial && hasPhoto
          ? ({
              ["--hero-image" as string]: `url("${imageSrc}")`,
            } as CSSProperties)
          : !editorial && hasPhoto
            ? undefined
            : ({
                ["--hero-image" as string]: "none",
              } as CSSProperties)
      }
    >
      <div className="hi">
        <div>
          <div className="hey" data-label={ey} />
          <h1 className="hh1">
            <span className="headline-main">{titleMain}</span>
            <span className="headline-sub">{titleTail}</span>
          </h1>
          <p className="hdesc">{desc}</p>
          <div className="hbtns">
            <a href="mailto:contact@trizenpackaging.com" className="bp">
              Request a Quote →
            </a>
            <a href={backHref} className="bg2">
              {backLabel}
            </a>
          </div>
          {chips.length > 0 ? (
            <div className="cprow">
              {chips.map((chip) => (
                <span key={chip} className="cp">
                  {chip}
                </span>
              ))}
            </div>
          ) : null}
        </div>

        {editorial || !hasPhoto ? (
          <div className="hcards">
            {heroStats.map((stat) => (
              <div key={stat.label} className="hc">
                <div className="hn">{stat.value}</div>
                <div className="hl">{stat.label}</div>
              </div>
            ))}
          </div>
        ) : (
          <ImagePreview src={imageSrc} alt={imageLabel}>
            <div className="hero-showcase" aria-label={imageLabel}>
              <div className="showcase-frame has-photo">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  className="toy-photo toy-photo-hero"
                  src={imageSrc}
                  alt={imageLabel}
                />
              </div>
            </div>
          </ImagePreview>
        )}
      </div>
      {editorial && hasPhoto ? (
        <ImagePreview src={imageSrc} alt={imageLabel}>
          <span className="hero-image-hit" aria-hidden="true" />
        </ImagePreview>
      ) : null}
    </div>
  );
}
