import type { Metadata } from "next";
import LegacyPageRenderer from "@/components/legacy/LegacyPageRenderer";

export const metadata: Metadata = {
  title: "Toy Packaging Trays Manufacturer India",
  description: "Toy sub-category page migrated to Next.js.",
};

export default function PackagingTraysPage() {
  return (
    <LegacyPageRenderer filename="Trizen_Toy_PackagingTrays_Clean_Sidebar.html" />
  );
}

