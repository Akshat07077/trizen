import indexData from "@/lib/blog/content/index.json";
import rpet from "@/lib/blog/content/rpet-revolution-thermoforming-packaging.json";
import vacuum from "@/lib/blog/content/vacuum-vs-pressure-forming.json";
import medical from "@/lib/blog/content/medical-pharma-thermoforming-packaging.json";
import industry40 from "@/lib/blog/content/industry-4-0-thermoforming.json";
import type { BlogIndex, BlogPost } from "@/lib/blog/types";

const posts: Record<string, BlogPost> = {
  "rpet-revolution-thermoforming-packaging": rpet as BlogPost,
  "vacuum-vs-pressure-forming": vacuum as BlogPost,
  "medical-pharma-thermoforming-packaging": medical as BlogPost,
  "industry-4-0-thermoforming": industry40 as BlogPost,
};

export function getBlogIndex(): BlogIndex {
  return indexData as BlogIndex;
}

export function getBlogPost(slug: string): BlogPost | null {
  return posts[slug] ?? null;
}

export function getAllBlogSlugs(): string[] {
  return Object.keys(posts);
}

export function slugifyHeading(text: string): string {
  return text
    .toLowerCase()
    .replace(/^\d+\.\s*/, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);
}
