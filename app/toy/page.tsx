import type { Metadata } from "next";
import LegacyPageRenderer from "@/components/legacy/LegacyPageRenderer";

export const metadata: Metadata = {
  title: "Toy Thermoforming Packaging Manufacturer India",
  description:
    "Toy thermoforming packaging category page from Trizen Packaging.",
};

export default function ToyCategoryPage() {
  return <LegacyPageRenderer filename="Trizen_Toy_Category_Clean_Sidebar.html" />;
}
