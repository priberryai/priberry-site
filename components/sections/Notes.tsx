import { displayTitle, formatDate, notes, notesSection, readingMinutes } from "@/content/notes";

/* Notes as a journal index: date, title, summary. Grows as posts are added. */
export function Notes() {
  return (
    <section id="notes" aria-labelledby="notes-title" className="section-y bg-paper-deep">
      <div className="container-page grid gap-10 lg:grid-cols-12 lg:gap-8">
        <h2 id="notes-title" className="max-w-[14ch] font-display text-display text-ink lg:col-span-4">
          {notesSection.title}
        </h2>
        <div className="lg:col-span-7 lg:col-start-6">
          <ul className="border-t border-line-strong">
            {notes.map((n) => (
              <li key={n.slug} className="border-b border-line-strong">
                <a href={`/notes/${n.slug}/`} className="group grid grid-cols-[1fr_auto] items-start gap-6 py-8 md:py-10">
                  <div>
                    <p className="text-[0.9375rem] text-muted">
                      <time dateTime={n.date}>{formatDate(n.date)}</time> · {readingMinutes(n)} min read
                    </p>
                    <h3 className="mt-3 font-display text-[clamp(1.75rem,1.35rem+1.6vw,2.5rem)] leading-[1.06] tracking-[-0.024em] text-ink transition-colors duration-300 group-hover:text-berry">
                      {displayTitle(n.title)}
                    </h3>
                    <p className="mt-4 max-w-xl text-body">{n.summary}</p>
                  </div>
                  <span
                    aria-hidden="true"
                    className="mt-1 grid size-11 shrink-0 place-items-center rounded-full ring-1 ring-inset ring-line-strong transition-[background-color,color,transform] duration-300 ease-(--ease-brand) group-hover:translate-x-1 group-hover:bg-ink group-hover:text-paper"
                  >
                    <svg viewBox="0 0 16 16" className="size-4">
                      <path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                </a>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-[0.9375rem] text-muted">{notesSection.more}</p>
        </div>
      </div>
    </section>
  );
}
