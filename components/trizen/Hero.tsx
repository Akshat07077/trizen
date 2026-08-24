import type { CSSProperties } from "react";
import { heroStatsFromChips, type HeroStat } from "@/lib/industries/hero-stats";

type HeroProps = {
  ey: string;
  titleMain: string;
  titleTail: string;
  desc: string;
  chips: string[];
  imageSrc?: string;
  imageLabel?: string;
  backHref?: string;
  backLabel?: string;
  stats?: HeroStat[];
  /** @deprecated Always uses editorial rhombus + stats on every page */
  variant?: "default" | "editorial";
};

export default function Hero({
  ey,
  titleMain,
  titleTail,
  desc,
  chips,
  imageSrc = "",
  backHref = "/toy",
  backLabel = "← Toy Overview",
  stats,
}: HeroProps) {
  const heroStats = stats ?? heroStatsFromChips(chips);
  const hasPhoto = Boolean(imageSrc);

  return (
    <div
      className={[
        "hero",
        "hero-editorial",
        hasPhoto ? "" : "hero-editorial--no-photo",
      ]
        .filter(Boolean)
        .join(" ")}
      style={
        {
          ["--hero-image" as string]: hasPhoto
            ? `url("${imageSrc}")`
            : "none",
        } as CSSProperties
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

        <div className="hcards" aria-label="Key capabilities">
          {heroStats.map((stat) => (
            <div key={`${stat.value}-${stat.label}`} className="hc">
              <div className="hn">{stat.value}</div>
              <div className="hl">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
