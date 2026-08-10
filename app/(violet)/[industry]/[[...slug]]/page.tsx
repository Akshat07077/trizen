import type { Metadata } from "next";
import { notFound } from "next/navigation";
import IndustryPage from "@/components/trizen/IndustryPage";
import { getIndustryPage, getAllStaticIndustryParams } from "@/lib/industries/get-page";
import { getIndustryMeta, listIndustryIds } from "@/lib/industries/registry";

type PageProps = {
  params: Promise<{ industry: string; slug?: string[] }>;
};

export async function generateStaticParams() {
  return getAllStaticIndustryParams();
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { industry, slug } = await params;

  if (!listIndustryIds().includes(industry)) {
    return { title: "Not Found" };
  }

  try {
    const content = getIndustryPage(industry, slug);
    return {
      title: content.hero.titleMain,
      description: content.hero.desc,
    };
  } catch {
    return { title: "Not Found" };
  }
}

export default async function IndustryRoutePage({ params }: PageProps) {
  const { industry, slug } = await params;

  if (!listIndustryIds().includes(industry)) {
    notFound();
  }

  let content;
  try {
    content = getIndustryPage(industry, slug);
  } catch {
    notFound();
  }

  const meta = getIndustryMeta(industry);

  return (
    <IndustryPage industryId={industry} meta={meta} content={content} />
  );
}
