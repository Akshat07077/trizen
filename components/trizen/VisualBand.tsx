type VisualBandProps = {
  mainSrc: string;
  mainTitle: string;
  mainText: string;
  detailSrc: string;
  detailTitle: string;
  detailText: string;
  processSrc: string;
  processTitle: string;
  processText: string;
};

export default function VisualBand({
  mainSrc,
  mainTitle,
  mainText,
  detailSrc,
  detailTitle,
  detailText,
  processSrc,
  processTitle,
  processText,
}: VisualBandProps) {
  return (
    <section className="visual-band fmcg-image-band reveal-on-scroll">
      <div className="visual-placeholder tall has-photo">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="toy-photo" src={mainSrc} alt={mainTitle} />
        <div className="visual-photo-caption">
          <span>PRODUCT IMAGE</span>
          <strong>{mainTitle}</strong>
        </div>
      </div>
      <div className="visual-stack">
        <div className="visual-placeholder small has-photo">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="toy-photo" src={detailSrc} alt={detailTitle} />
          <div className="visual-photo-caption">
            <span>DETAIL IMAGE</span>
            <strong>{detailTitle}</strong>
          </div>
        </div>
        <div className="visual-placeholder small has-photo">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="toy-photo" src={processSrc} alt={processTitle} />
          <div className="visual-photo-caption">
            <span>PROCESS IMAGE</span>
            <strong>{processTitle}</strong>
          </div>
        </div>
      </div>
      <span className="sr-only">
        {mainText} {detailText} {processText}
      </span>
    </section>
  );
}
