import type { Metadata } from "next";
import LegacyPageRenderer from "@/components/legacy/LegacyPageRenderer";

export const metadata: Metadata = {
  title: "Custom Molded Toy Packs Manufacturer India",
  description: "Toy sub-category page migrated to Next.js.",
};

export default function CustomMoldedPage() {
  return (
    <LegacyPageRenderer filename="Trizen_Toy_CustomMolded_Clean_Sidebar.html" />
  );
}

