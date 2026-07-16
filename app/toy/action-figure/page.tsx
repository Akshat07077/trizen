import type { Metadata } from "next";
import LegacyPageRenderer from "@/components/legacy/LegacyPageRenderer";

export const metadata: Metadata = {
  title: "Action Figure Packs Manufacturer India",
  description: "Toy sub-category page migrated to Next.js.",
};

export default function ActionFigurePage() {
  return (
    <LegacyPageRenderer filename="Trizen_Toy_ActionFigure_Clean_Sidebar.html" />
  );
}

