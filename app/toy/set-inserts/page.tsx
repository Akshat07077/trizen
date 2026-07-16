import type { Metadata } from "next";
import ToyPage from "@/components/trizen/ToyPage";
import { getToyPage } from "@/lib/toy/get-page";

const content = getToyPage("set-inserts");

export const metadata: Metadata = {
  title: "Toy Set Insert Trays Manufacturer India",
  description: content.hero.desc,
};

export default function SetInsertsPage() {
  return <ToyPage content={content} />;
}
