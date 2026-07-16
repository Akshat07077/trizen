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
  detailSrc,
  detailTitle,
  processSrc,
  processTitle,
}: VisualBandProps) {
  return (
    <section className="visual-band fmcg-image-band">
      <div className="visual-placeholder tall has-photo">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="toy-photo" src={mainSrc} alt={mainTitle} />
      </div>
      <div className="visual-stack">
        <div className="visual-placeholder small has-photo">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="toy-photo" src={detailSrc} alt={detailTitle} />
        </div>
        <div className="visual-placeholder small has-photo">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="toy-photo" src={processSrc} alt={processTitle} />
        </div>
      </div>
    </section>
  );
}
