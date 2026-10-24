import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";
import { privacy } from "@/content/legal";

export const metadata: Metadata = {
  title: "Privacy",
  description: "What Priberry collects through this website, why, and your rights.",
  alternates: { canonical: "/privacy/" },
};

export default function PrivacyPage() {
  return <LegalPage {...privacy} />;
}
