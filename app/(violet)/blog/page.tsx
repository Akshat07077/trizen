import type { Metadata } from "next";
import BlogIndexPage from "@/components/trizen/BlogIndex";
import { getBlogIndex } from "@/lib/blog/get-page";
import "@/styles/blog.css";

const index = getBlogIndex();

export const metadata: Metadata = {
  title: index.title,
  description: index.description,
};

export default function BlogRoutePage() {
  return <BlogIndexPage content={index} />;
}
