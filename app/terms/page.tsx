import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";
import { terms } from "@/content/legal";

export const metadata: Metadata = {
  title: "Terms",
  description: "Terms of use for the Priberry website.",
  alternates: { canonical: "/terms/" },
};

export default function TermsPage() {
  return <LegalPage {...terms} />;
}
