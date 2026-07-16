type HeroProps = {
  ey: string;
  titleMain: string;
  titleTail: string;
  desc: string;
  chips: string[];
  imageSrc: string;
  imageLabel: string;
};

export default function Hero({
  ey,
  titleMain,
  titleTail,
  desc,
  chips,
  imageSrc,
  imageLabel,
}: HeroProps) {
  return (
    <div className="hero">
      <div className="hi">
        <div className="hero-copy">
          <div className="hey">{ey}</div>
          <h1 className="hh1">
            <span className="title-main">{titleMain}</span>
            <span className="title-tail">{titleTail}</span>
          </h1>
          <p className="hdesc">{desc}</p>
          <div className="hbtns">
            <a href="mailto:contact@trizenpackaging.com" className="bp">
              Request a Quote →
            </a>
            <a href="/toy" className="bg2">
              ← Overview
            </a>
          </div>
          <div className="cprow">
            {chips.map((chip) => (
              <span key={chip} className="cp">
                {chip}
              </span>
            ))}
          </div>
        </div>

        <div className="hero-showcase" aria-label={`${imageLabel} product photo`}>
          <div className="showcase-frame has-photo">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className="toy-photo toy-photo-hero"
              src={imageSrc}
              alt={imageLabel}
            />
            <div className="showcase-badge">
              <span className="material-symbols-outlined">image</span>
              <strong>Product Photo</strong>
              <small>{imageLabel}</small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
