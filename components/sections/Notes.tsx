import { SectionHeader } from "@/components/SectionHeader";
import { displayTitle, formatDate, notes, notesSection, readingMinutes } from "@/content/notes";

export function Notes() {
  return (
    <section id="notes" aria-labelledby="notes-title" className="section-y border-t border-line">
      <div className="container-page">
        <SectionHeader id="notes-title" label={notesSection.label} title={notesSection.title} />
        <ul className="mt-14 grid gap-6 md:mt-20 md:grid-cols-2">
          {notes.map((n, i) => (
            <li key={n.slug} data-reveal style={{ "--i": i } as React.CSSProperties}>
              <a
                href={`/notes/${n.slug}/`}
                className="group flex h-full flex-col rounded-(--radius-card) bg-surface p-7 ring-1 ring-line transition-[transform,box-shadow] duration-500 ease-(--ease-brand) hover:-translate-y-1 hover:shadow-(--shadow-panel) md:p-9"
              >
                <p className="label-mono text-muted">
                  <time dateTime={n.date}>{formatDate(n.date)}</time> · {readingMinutes(n)} min read
                </p>
                <h3 className="mt-8 font-serif text-[2rem] leading-[1.08] text-ink md:text-[2.375rem]">{displayTitle(n.title)}</h3>
                <p className="mt-4 text-body">{n.summary}</p>
                <p className="mt-auto flex items-center gap-2 pt-8 text-[0.9375rem] font-medium text-berry">
                  <span className="link-underline">{notesSection.readMore}</span>
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 16 16"
                    className="size-3.5 transition-transform duration-300 group-hover:translate-x-0.5"
                  >
                    <path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </p>
              </a>
            </li>
          ))}
          {/* Placeholder for the next note, clearly labelled */}
          <li
            data-reveal
            style={{ "--i": notes.length } as React.CSSProperties}
            className="flex min-h-56 flex-col justify-between rounded-(--radius-card) border border-dashed border-line-strong p-7 md:p-9"
          >
            <p className="label-mono text-muted">Next note</p>
            <p className="max-w-sm text-body">
              More on rubric design and failure analysis is in progress. New notes will appear here.
            </p>
          </li>
        </ul>
      </div>
    </section>
  );
}
