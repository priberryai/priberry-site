import { SectionHeader } from "@/components/SectionHeader";
import { anatomy } from "@/content/anatomy";

/*
 * The pipeline as a diagram: five stages left to right on desktop, top to
 * bottom on small screens. The two feedback loops (review fails, model finds
 * a gap) are drawn as return arcs above the line on desktop and listed as
 * notes under their stage on small screens.
 */
export function Anatomy() {
  const { stages, loops } = anatomy;
  const loopFor = (i: number) => loops.find((l) => l.from === i);

  return (
    <section aria-labelledby="anatomy-title" className="section-y border-t border-line">
      <div className="container-page">
        <SectionHeader id="anatomy-title" label={anatomy.label} title={anatomy.title} intro={anatomy.intro} />

        <figure className="mt-14 md:mt-20">
          <figcaption className="sr-only">
            {`Pipeline: ${stages.map((s) => s.name).join(", then ")}. ${loops
              .map((l) => `${l.label}: from ${stages[l.from]?.name} back to ${stages[l.to]?.name}.`)
              .join(" ")}`}
          </figcaption>

          {/* Desktop return arcs. Each spans from the centre of one stage's
              circle (column start + 30px) back to an earlier one. */}
          <div aria-hidden="true" className="relative hidden h-[76px] lg:block">
            {loops.map((l) => (
              <div
                key={l.label}
                className="absolute bottom-0 top-0"
                style={{ left: `calc(${l.to * 20}% + 30px)`, width: `${(l.from - l.to) * 20}%` }}
              >
                <svg viewBox="0 0 100 60" preserveAspectRatio="none" className="absolute inset-x-0 bottom-0 h-[60px] w-full">
                  <path
                    d="M 100 60 C 100 4, 0 4, 0 56"
                    fill="none"
                    stroke="#B3265F"
                    strokeWidth="1.25"
                    strokeDasharray="4 5"
                    vectorEffect="non-scaling-stroke"
                  />
                </svg>
                {/* Arrowhead into the earlier stage */}
                <svg viewBox="0 0 10 8" className="absolute -bottom-0.5 -left-[5px] w-2.5">
                  <path d="M1 1 5 7 9 1" fill="none" stroke="#B3265F" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span className="label-mono absolute left-1/2 top-0 -translate-x-1/2 whitespace-nowrap bg-paper px-2 text-[0.6875rem] text-berry">
                  {l.label}
                </span>
              </div>
            ))}
          </div>

          <ol className="relative grid gap-0 lg:grid-cols-5">
            {stages.map((s, i) => {
              const loop = loopFor(i);
              const last = i === stages.length - 1;
              return (
                <li
                  key={s.name}
                  data-reveal
                  style={{ "--i": i } as React.CSSProperties}
                  className="relative grid grid-cols-[60px_1fr] gap-4 pb-10 lg:block lg:pb-0 lg:pr-6"
                >
                  {/* Connector: vertical on mobile, horizontal on desktop */}
                  {!last && (
                    <span
                      aria-hidden="true"
                      className="absolute left-[29.5px] top-[60px] bottom-0 w-px bg-line-strong lg:left-[60px] lg:right-0 lg:top-[29.5px] lg:bottom-auto lg:h-px lg:w-auto"
                    />
                  )}
                  <span
                    aria-hidden="true"
                    className={`relative grid size-[60px] place-items-center rounded-full font-serif text-[1.75rem] ${
                      last ? "bg-berry text-white" : "bg-surface text-ink ring-1 ring-inset ring-line-strong"
                    }`}
                  >
                    {i + 1}
                  </span>
                  <div className="pt-2.5 lg:pt-6">
                    <h3 className="text-[1.0625rem] font-semibold tracking-[-0.01em] text-ink">{s.name}</h3>
                    <p className="mt-2 max-w-[19rem] text-[0.9375rem] leading-relaxed text-body">{s.body}</p>
                    {loop && (
                      <p className="label-mono mt-3 flex items-center gap-2 text-[0.6875rem] text-berry lg:hidden">
                        <span aria-hidden="true">↺</span>
                        {loop.label}
                      </p>
                    )}
                  </div>
                </li>
              );
            })}
          </ol>
        </figure>
      </div>
    </section>
  );
}
