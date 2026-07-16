import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Trizen Packaging - Toy Category",
    template: "%s | Trizen Packaging",
  },
  description: "Toy thermoforming packaging pages migrated to Next.js.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
