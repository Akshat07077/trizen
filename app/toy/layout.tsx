import type { Metadata } from "next";
import PageEffects from "@/components/trizen/PageEffects";
import "@/styles/trizen-violet.css";
import "@/styles/toy-violet.css";

export const metadata: Metadata = {
  title: {
    default: "Toy Thermoforming Packaging | Trizen",
    template: "%s | Trizen Packaging",
  },
  description:
    "Toy thermoforming packaging from Trizen — APET crystal-clear, bulk from Vapi.",
};

export default function ToyLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <PageEffects />
      {children}
    </>
  );
}
