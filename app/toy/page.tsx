import type { Metadata } from "next";
import ToyPage from "@/components/trizen/ToyPage";
import { getToyPage } from "@/lib/toy/get-page";

const content = getToyPage("category");

export const metadata: Metadata = {
  title: "Toy Thermoforming Packaging Manufacturer India",
  description: content.hero.desc,
};

export default function ToyCategoryPage() {
  return <ToyPage content={content} />;
}
