import type { MetadataRoute } from "next";
import { LEGAL_UPDATED } from "@/content/legal";
import { notes } from "@/content/notes";
import { site } from "@/content/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const latestNote = notes.map((n) => n.date).sort().at(-1) ?? LEGAL_UPDATED;
  return [
    { url: `${site.url}/`, lastModified: latestNote, changeFrequency: "monthly", priority: 1 },
    ...notes.map((n) => ({
      url: `${site.url}/notes/${n.slug}/`,
      lastModified: n.date,
      changeFrequency: "yearly" as const,
      priority: 0.7,
    })),
    { url: `${site.url}/privacy/`, lastModified: LEGAL_UPDATED, changeFrequency: "yearly", priority: 0.2 },
    { url: `${site.url}/terms/`, lastModified: LEGAL_UPDATED, changeFrequency: "yearly", priority: 0.2 },
  ];
}
