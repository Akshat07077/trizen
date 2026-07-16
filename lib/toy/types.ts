export type ToyFaq = { q: string; a: string };
export type ToyStrip = { title: string; desc: string };
export type ToyProduct = { name: string; desc: string; link?: string; href?: string };

export type ToySection = {
  ey: string;
  st: string;
  leads?: string[];
  strips?: ToyStrip[];
  products?: ToyProduct[];
};

export type ToyPageContent = {
  slug: string;
  title: string;
  hero: {
    ey: string;
    titleMain: string;
    titleTail: string;
    desc: string;
    chips: string[];
  };
  band: {
    mainTitle: string;
    mainText: string;
    detailTitle: string;
    detailText: string;
    processTitle: string;
    processText: string;
  };
  sections: ToySection[];
  midCtas: { title: string; text: string; button: string }[];
  bottomCta: { title: string; text: string } | null;
  faqs: ToyFaq[];
  imageLabels?: string[];
};
