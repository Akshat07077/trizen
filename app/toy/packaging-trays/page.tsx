import type { Metadata } from "next";
import ToyPage from "@/components/trizen/ToyPage";
import { getToyPage } from "@/lib/toy/get-page";

const content = getToyPage("packaging-trays");

export const metadata: Metadata = {
  title: "Toy Packaging Trays Manufacturer India",
  description: content.hero.desc,
};

export default function PackagingTraysPage() {
  return <ToyPage content={content} />;
}
