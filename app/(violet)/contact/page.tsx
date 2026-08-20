import type { Metadata } from "next";
import ContactPage from "@/components/trizen/ContactPage";
import "@/styles/contact.css";

export const metadata: Metadata = {
  title: "Contact Trizen Packaging | Thermoforming Manufacturer Vapi Daman",
  description:
    "Contact Trizen Packaging — ISO 9001:2015 thermoforming manufacturer in Vapi/Daman. Get a free consultation for medical, pharma, automotive and custom packaging. 24-hour response.",
};

export default function ContactRoutePage() {
  return <ContactPage />;
}
