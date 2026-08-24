export type BlogBlock =
  | { type: "h2"; text: string }
  | { type: "h3"; text: string }
  | { type: "p"; text: string; html?: string }
  | { type: "bullet"; text: string; html?: string }
  | { type: "callout"; text: string; html?: string }
  | { type: "stats"; items: { value: string; label: string }[] }
  | { type: "checklist"; items: string[] }
  | { type: "table"; headers: string[]; rows: string[][] }
  | { type: "image"; label: string }
  | { type: "midCta"; title: string; text: string; button: string };

export type BlogFaq = { q: string; a: string };

export type BlogTocItem = { n: string; label: string; href?: string };

export type BlogPost = {
  slug: string;
  title: string;
  description: string;
  category: string;
  date: string;
  dateLabel: string;
  readMins: number;
  readLabel: string;
  heroTitle: string;
  intro: string;
  toc: BlogTocItem[];
  blocks: BlogBlock[];
  faqs: BlogFaq[];
};

export type BlogIndexPost = {
  slug: string;
  title: string;
  description: string;
  category: string;
  date: string;
  dateLabel: string;
  readMins: number;
  readLabel: string;
  excerpt: string;
};

export type BlogIndex = {
  title: string;
  description: string;
  heroEy: string;
  heroTitle: string;
  heroDesc: string;
  posts: BlogIndexPost[];
};
