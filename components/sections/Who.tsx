import { who } from "@/content/who";
import { keepHyphenated } from "@/lib/text";

/*
 * Who we work with, as one confident sentence rather than three boxes. The
 * groups are set in ink; the connecting words recede.
 */
export function Who() {
  return (
    <section aria-labelledby="who-title" className="section-y bg-paper">
      <div className="container-page">
        <h2 id="who-title" className="sr-only">
          {who.title}
        </h2>
        <p className="max-w-[26ch] font-display text-[clamp(2rem,1.3rem+2.9vw,3.75rem)] font-semibold leading-[1.1] tracking-[-0.026em] text-muted">
          {who.sentence.map((part, i) =>
            "strong" in part && part.strong ? (
              <span key={i} className="text-ink">
                {keepHyphenated(part.text)}
              </span>
            ) : (
              <span key={i}>{keepHyphenated(part.text)}</span>
            ),
          )}
        </p>
      </div>
    </section>
  );
}
