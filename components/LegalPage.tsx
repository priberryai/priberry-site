import { LEGAL_REVIEWED, LEGAL_UPDATED, type LegalSection } from "@/content/legal";
import { formatDate } from "@/content/notes";

type LegalPageProps = { title: string; intro: string; sections: LegalSection[] };

export function LegalPage({ title, intro, sections }: LegalPageProps) {
  return (
    <article className="pb-28 pt-36 md:pb-40 md:pt-48">
      <div className="container-page">
        <div className="mx-auto max-w-[44rem]">
          <p className="label text-berry">Legal</p>
          <h1 className="mt-6 font-display text-[clamp(2.75rem,2rem+3vw,4.5rem)] leading-none tracking-[-0.02em] text-ink">
            {title}
          </h1>
          <p className="label mt-6 text-muted">
            Last updated <time dateTime={LEGAL_UPDATED}>{formatDate(LEGAL_UPDATED)}</time>
          </p>
          {!LEGAL_REVIEWED && (
            <p className="mt-8 rounded-(--radius-inner) bg-lilac p-5 text-[0.9375rem] text-ink">
              This page is being finalised and may change before launch.
            </p>
          )}
          <p className="mt-10 text-lead text-ink">{intro}</p>
          <div className="mt-12 space-y-12">
            {sections.map((s) => (
              <section key={s.heading}>
                <h2 className="font-display text-[1.875rem] leading-tight text-ink">{s.heading}</h2>
                <div className="mt-4 space-y-4 text-[1.0625rem] leading-[1.7] text-body">
                  {s.paragraphs.map((p) => (
                    <p key={p}>{p}</p>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>
      </div>
    </article>
  );
}
