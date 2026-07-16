import type { Metadata } from "next";
import ToyPage from "@/components/trizen/ToyPage";
import { getToyPage } from "@/lib/toy/get-page";

const content = getToyPage("action-figure");

export const metadata: Metadata = {
  title: "Action Figure Packs Manufacturer India",
  description: content.hero.desc,
};

export default function ActionFigurePage() {
  return <ToyPage content={content} />;
}
