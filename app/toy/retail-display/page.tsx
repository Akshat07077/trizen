import type { Metadata } from "next";
import LegacyPageRenderer from "@/components/legacy/LegacyPageRenderer";

export const metadata: Metadata = {
  title: "Retail Display Packaging for Toys Manufacturer India",
  description: "Toy retail display packaging page migrated to Next.js.",
};

export default function RetailDisplayPage() {
  return (
    <LegacyPageRenderer filename="Trizen_Toy_RetailDisplay_Clean_Sidebar.html" />
  );
}
