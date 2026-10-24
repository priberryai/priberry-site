import { CountUp } from "@/components/CountUp";
import { problem } from "@/content/problem";

export function Problem() {
  return (
    <section aria-labelledby="problem-title" className="section-y border-t border-line">
      <div className="container-page grid gap-14 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-6">
          <p data-reveal className="label-mono text-berry">
            {problem.label}
          </p>
          <h2
            id="problem-title"
            data-reveal
            style={{ "--i": 1 } as React.CSSProperties}
            className="mt-5 font-serif text-display text-ink"
          >
            <span className="block">{problem.title[0]}</span>
            <span className="block italic text-berry">{problem.title[1]}</span>
          </h2>
          <p data-reveal style={{ "--i": 2 } as React.CSSProperties} className="mt-8 max-w-xl text-lead text-body">
            {problem.followUp}
          </p>
        </div>

        <figure className="lg:col-span-5 lg:col-start-8 lg:pt-6">
          <p data-reveal className="font-serif leading-[0.85] tracking-[-0.04em] text-berry">
            <CountUp
              value={problem.stat.value}
              suffix={problem.stat.suffix}
              className="text-[clamp(7rem,4rem+14vw,13.5rem)]"
            />
          </p>
          <figcaption
            data-reveal
            style={{ "--i": 1 } as React.CSSProperties}
            className="mt-6 max-w-md border-t border-line-strong pt-5 text-[1.0625rem] leading-relaxed text-ink"
          >
            {problem.statCaption}
            <sup className="ml-0.5">
              <a
                href="#fn-btb"
                id="fnref-btb"
                aria-label="Source note 1"
                className="rounded px-0.5 font-mono text-[0.75em] text-berry hover:underline"
              >
                1
              </a>
            </sup>
          </figcaption>
        </figure>

        <aside aria-label="Source" className="lg:col-span-12">
          <ol className="max-w-3xl border-t border-line pt-5 text-sm leading-relaxed text-muted">
            <li id="fn-btb" className="flex gap-3">
              <span className="font-mono text-berry">1</span>
              <span>
                {problem.source.text}{" "}
                <a
                  href={problem.source.href}
                  className="link-inline font-medium text-ink"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {problem.source.linkLabel}
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>{" "}
                <a href="#fnref-btb" className="link-inline inline-flex items-center gap-1 text-berry">
                  {/* SVG rather than an arrow glyph, which the subset fonts lack */}
                  <svg aria-hidden="true" viewBox="0 0 12 12" className="size-3">
                    <path d="M10 2v3.5a2 2 0 0 1-2 2H2.5M5 5 2.5 7.5 5 10" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  Back to figure
                </a>
              </span>
            </li>
          </ol>
        </aside>
      </div>
    </section>
  );
}
