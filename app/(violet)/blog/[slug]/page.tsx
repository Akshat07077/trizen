import type { Metadata } from "next";
import { notFound } from "next/navigation";
import BlogPost from "@/components/trizen/BlogPost";
import {
  getAllBlogSlugs,
  getBlogIndex,
  getBlogPost,
} from "@/lib/blog/get-page";
import "@/styles/blog.css";

type BlogSlugPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getAllBlogSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: BlogSlugPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.description,
  };
}

export default async function BlogSlugPage({ params }: BlogSlugPageProps) {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) notFound();

  const related = getBlogIndex()
    .posts.filter((p) => p.slug !== slug)
    .slice(0, 3)
    .map((p) => ({
      slug: p.slug,
      title: p.title,
      category: p.category,
    }));

  return <BlogPost post={post} related={related} />;
}
