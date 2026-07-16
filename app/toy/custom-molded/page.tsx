import type { Metadata } from "next";
import ToyPage from "@/components/trizen/ToyPage";
import { getToyPage } from "@/lib/toy/get-page";

const content = getToyPage("custom-molded");

export const metadata: Metadata = {
  title: "Custom Molded Toy Packs Manufacturer India",
  description: content.hero.desc,
};

export default function CustomMoldedPage() {
  return <ToyPage content={content} />;
}
