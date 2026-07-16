type MidCTAProps = {
  title: string;
  text: string;
  button: string;
};

export function MidCTA({ title, text, button }: MidCTAProps) {
  return (
    <div className="mid-cta">
      <div className="mid-cta-txt">
        <h4>{title}</h4>
        <p>{text}</p>
      </div>
      <a href="mailto:contact@trizenpackaging.com" className="mid-cta-btn">
        {button}
      </a>
    </div>
  );
}

type BottomCTAProps = {
  title: string;
  text: string;
};

export function BottomCTA({ title, text }: BottomCTAProps) {
  return (
    <div className="bottom-cta">
      <h3>{title}</h3>
      <p>{text}</p>
      <div className="bctns">
        <a href="mailto:contact@trizenpackaging.com" className="btn-gold">
          ✉ contact@trizenpackaging.com
        </a>
        <a href="#" className="btn-wht">
          WhatsApp Enquiry
        </a>
      </div>
    </div>
  );
}
