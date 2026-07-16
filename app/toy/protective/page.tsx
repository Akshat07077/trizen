import type { Metadata } from "next";
import ToyPage from "@/components/trizen/ToyPage";
import { getToyPage } from "@/lib/toy/get-page";

const content = getToyPage("protective");

export const metadata: Metadata = {
  title: "Protective Toy Packaging Boxes Manufacturer India",
  description: content.hero.desc,
};

export default function ProtectivePage() {
  return <ToyPage content={content} />;
}
