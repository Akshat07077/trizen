import type { Metadata } from "next";
import LegacyPageRenderer from "@/components/legacy/LegacyPageRenderer";

export const metadata: Metadata = {
  title: "Toy Set Inserts Manufacturer India",
  description: "Toy sub-category page migrated to Next.js.",
};

export default function ToySetInsertsPage() {
  return (
    <LegacyPageRenderer filename="Trizen_Toy_SetInserts_Clean_Sidebar.html" />
  );
}

