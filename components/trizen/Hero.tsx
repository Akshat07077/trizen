import type { CSSProperties } from "react";
import ImagePreview from "@/components/trizen/ImagePreview";

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
  stats?: { value: string; label: string }[];
};

const DEFAULT_STATS = [
  { value: "APET", label: "Crystal Clear" },
  { value: "7–14", label: "Day Prototype" },
  { value: "ISO", label: "9001:2015" },
];

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
  stats = DEFAULT_STATS,
}: HeroProps) {
  return (
    <div
      className={imageSrc ? "hero has-product-photo" : "hero"}
      style={
        imageSrc
          ? undefined
          : ({
              ["--hero-image"]: "none",
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
        {imageSrc ? (
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
        ) : (
          <div className="hcards">
            {stats.map((stat) => (
              <div key={stat.label} className="hc">
                <div className="hn">{stat.value}</div>
                <div className="hl">{stat.label}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
