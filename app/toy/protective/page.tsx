import type { Metadata } from "next";
import LegacyPageRenderer from "@/components/legacy/LegacyPageRenderer";

export const metadata: Metadata = {
  title: "Protective Toy Packaging Manufacturer India",
  description: "Toy sub-category page migrated to Next.js.",
};

export default function ProtectiveToyPage() {
  return (
    <LegacyPageRenderer filename="Trizen_Toy_Protective_Clean_Sidebar.html" />
  );
}

