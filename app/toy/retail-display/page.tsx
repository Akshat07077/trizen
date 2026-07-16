import type { Metadata } from "next";
import ToyPage from "@/components/trizen/ToyPage";
import { getToyPage } from "@/lib/toy/get-page";

const content = getToyPage("retail-display");

export const metadata: Metadata = {
  title: "Retail Display Packaging for Toys Manufacturer India",
  description: content.hero.desc,
};

export default function RetailDisplayPage() {
  return <ToyPage content={content} />;
}
