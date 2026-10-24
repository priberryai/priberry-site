import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ButtonLink } from "@/components/Button";
import { displayTitle, formatDate, getNote, notes, readingMinutes } from "@/content/notes";
import { site } from "@/content/site";

type Params = { slug: string };

export const dynamicParams = false;

export function generateStaticParams(): Params[] {
  return notes.map((n) => ({ slug: n.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const note = getNote((await params).slug);
  if (!note) return {};
  const url = `/notes/${note.slug}/`;
  return {
    title: note.title,
    description: note.summary,
    alternates: { canonical: url },
    openGraph: { type: "article", url, title: note.title, description: note.summary, publishedTime: note.date },
    twitter: { card: "summary_large_image", title: note.title, description: note.summary },
  };
}

export default async function NotePage({ params }: { params: Promise<Params> }) {
  const note = getNote((await params).slug);
  if (!note) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: note.title,
    description: note.summary,
    datePublished: note.date,
    author: { "@type": "Organization", name: note.author },
    publisher: { "@type": "Organization", name: site.name, url: site.url },
    mainEntityOfPage: `${site.url}/notes/${note.slug}/`,
  };

  return (
    <article className="pb-28 pt-36 md:pb-40 md:pt-48">
      <div className="container-page">
        <div className="mx-auto max-w-[44rem]">
          <a href="/#notes" className="label text-berry">
            <span className="link-underline">Notes</span>
          </a>
          <h1 className="mt-6 font-display text-[clamp(2.5rem,1.8rem+3vw,4.25rem)] leading-[1.02] tracking-[-0.02em] text-ink">
            {displayTitle(note.title)}
          </h1>
          <p className="label mt-8 text-muted">
            <time dateTime={note.date}>{formatDate(note.date)}</time> · {readingMinutes(note)} min read · {note.author}
          </p>
          <p className="mt-10 border-t border-line-strong pt-10 text-lead text-ink">{note.summary}</p>

          <div className="mt-10 space-y-6 text-[1.125rem] leading-[1.75] text-body">
            {note.body.map((b, i) => {
              if (b.type === "h2")
                return (
                  <h2 key={i} className="!mt-14 font-display text-[2rem] leading-tight text-ink">
                    {b.text}
                  </h2>
                );
              if (b.type === "ol")
                return (
                  <ol key={i} className="list-decimal space-y-2 pl-6">
                    {b.items.map((it) => (
                      <li key={it}>{it}</li>
                    ))}
                  </ol>
                );
              return <p key={i}>{b.text}</p>;
            })}
          </div>

          <div className="mt-16 flex flex-col gap-6 rounded-(--radius-card) bg-lilac p-8 sm:flex-row sm:items-center sm:justify-between">
            <p className="max-w-sm font-display text-[1.625rem] leading-tight text-ink">
              See where your model breaks on your own workflows.
            </p>
            <ButtonLink href="/#pilot" arrow>
              Request a pilot
            </ButtonLink>
          </div>
        </div>
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </article>
  );
}
