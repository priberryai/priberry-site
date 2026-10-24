import { principles } from "@/content/principles";

/*
 * Principles on ink, as a statement list: large names, plain sentences,
 * generous hairlines. No numbering, no boxes, no glow.
 */
export function Principles() {
  return (
    <section id="principles" aria-labelledby="principles-title" className="on-ink section-y bg-ink">
      <div className="container-page">
        <h2 id="principles-title" className="max-w-[18ch] font-display text-display text-on-ink">
          {principles.title}
        </h2>
        <dl className="mt-14 border-t border-line-on-ink md:mt-20">
          {principles.items.map((p) => (
            <div key={p.name} className="grid gap-3 border-b border-line-on-ink py-9 md:py-11 lg:grid-cols-12 lg:items-baseline lg:gap-8">
              <dt className="font-display text-[clamp(1.75rem,1.35rem+1.6vw,2.5rem)] font-semibold leading-[1.06] tracking-[-0.024em] text-on-ink lg:col-span-5">
                {p.name}
              </dt>
              <dd className="max-w-xl text-lead text-on-ink-muted lg:col-span-6 lg:col-start-7">{p.body}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
