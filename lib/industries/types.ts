export type IndustryFaq = { q: string; a: string };
export type IndustryStrip = { title: string; desc: string };
export type IndustryProduct = {
  name: string;
  desc: string;
  link?: string;
  href?: string;
};
export type IndustryTable = { headers: string[]; rows: string[][] };

export type IndustrySection = {
  ey: string;
  st: string;
  eyClass?: "gold" | "green";
  leads?: string[];
  strips?: IndustryStrip[];
  products?: IndustryProduct[];
  table?: IndustryTable;
  callout?: string;
};

export type IndustryPageContent = {
  slug: string;
  industryId?: string;
  title: string;
  hero: {
    ey: string;
    titleMain: string;
    titleTail: string;
    desc: string;
    chips: string[];
  };
  sections: IndustrySection[];
  midCtas: { title: string; text: string; button: string }[];
  bottomCta: { title: string; text: string } | null;
  faqs: IndustryFaq[];
  imageLabels?: string[];
};

export type IndustryNavItem = { href: string; label: string };

export type IndustryMeta = {
  prefix: string;
  route: string;
  label: string;
  sidebarTitle: string;
  ctaTitle: string;
  ctaText: string;
  footerLabel: string;
  faqSub: string;
  pages: string[];
  nav: IndustryNavItem[];
};

export type IndustryRegistry = {
  industries: Record<string, IndustryMeta>;
  allIndustriesNav: { id: string; href: string; label: string }[];
};
