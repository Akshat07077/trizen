import type { Metadata } from "next";
import PageEffects from "@/components/trizen/PageEffects";
import SiteNav from "@/components/trizen/SiteNav";
import SiteFooter from "@/components/trizen/SiteFooter";
import "@/styles/trizen-violet.css";
import "@/styles/toy-violet.css";
import "@/styles/toy-editorial.css";
import "@/styles/toy-images.css";
import "@/styles/site-chrome.css";
import "@/styles/image-preview.css";

export const metadata: Metadata = {
  title: {
    default: "Trizen Packaging",
    template: "%s | Trizen Packaging",
  },
  description:
    "Thermoforming packaging manufacturer from Vapi, Gujarat — ISO 9001:2015.",
};

export default function VioletLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <PageEffects />
      <SiteNav />
      {children}
      <SiteFooter />
    </>
  );
}
