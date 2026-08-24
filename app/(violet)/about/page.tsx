import type { Metadata } from "next";
import AboutPage from "@/components/trizen/AboutPage";
import "@/styles/about.css";

export const metadata: Metadata = {
  title: "About Trizen Packaging | Thermoforming Manufacturer India | 20+ Years",
  description:
    "Trizen Packaging — 20+ years thermoforming expertise since 2005. ISO 9001:2015 certified. Cleanroom Class 100,000. Medical, pharma & industrial packaging manufacturer. Vapi/Daman, India.",
};

export default function AboutRoutePage() {
  return <AboutPage />;
}
