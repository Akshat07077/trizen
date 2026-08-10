import type { ToyPageContent } from "@/lib/toy/types";
import { getIndustryMeta } from "@/lib/industries/registry";
import IndustryPage from "@/components/trizen/IndustryPage";

type ToyPageProps = {
  content: ToyPageContent;
};

/** @deprecated Use IndustryPage with industryId="toy" */
export default function ToyPage({ content }: ToyPageProps) {
  return (
    <IndustryPage
      industryId="toy"
      meta={getIndustryMeta("toy")}
      content={content}
    />
  );
}
