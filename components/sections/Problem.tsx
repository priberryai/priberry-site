import { CountUp } from "@/components/CountUp";
import { problem } from "@/content/problem";

/** A fixed, natural-looking scatter of `lit` positions out of `total` (same on every render). */
function scatter(total: number, lit: number): Set<number> {
  let seed = 16;
  const rand = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296);
  const order = Array.from({ length: total }, (_, i) => i);
  for (let i = total - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [order[i], order[j]] = [order[j]!, order[i]!];
  }
  return new Set(order.slice(0, lit));
}

/*
 * The problem, as one measured fact. The figure is drawn as well as written:
 * a strip of 100 dots in the mark's dot language, one per task, with the
 * passing 16 lit. They light in sequence once, when the strip comes into view.
 */
export function Problem() {
  const { total, lit, label } = problem.strip;
  const passed = scatter(total, lit);
  return (
    <section aria-labelledby="problem-title" className="section-y bg-paper">
      <div className="container-page">
        <h2 id="problem-title" className="max-w-[20ch] font-display text-display text-ink">
          <span className="block">{problem.title[0]}</span>
          <span className="block text-muted">{problem.title[1]}</span>
        </h2>

        <div className="mt-16 grid gap-12 md:mt-24 lg:grid-cols-12 lg:gap-8">
          <figure className="lg:col-span-7">
            <p className="font-display font-semibold leading-[0.85] tracking-[-0.045em] text-berry">
              <CountUp
                value={problem.stat.value}
                suffix={problem.stat.suffix}
                className="text-[clamp(6rem,2.5rem+12vw,11.5rem)]"
              />
            </p>
            {/* 100 tasks, 16 passed */}
            <div
              role="img"
              aria-label={label}
              data-reveal
              className="dot-strip mt-10 grid w-full max-w-[560px] grid-cols-[repeat(25,minmax(0,1fr))] gap-[clamp(4px,0.9vw,9px)]"
            >
              {Array.from({ length: total }, (_, i) => {
                const on = passed.has(i);
                return (
                  <span
                    key={i}
                    className={`dot-strip-dot aspect-square rounded-full ${on ? "is-on" : ""}`}
                    style={{ "--i": i } as React.CSSProperties}
                  />
                );
              })}
            </div>
            <figcaption className="mt-8 max-w-xl text-lead text-ink">
              {problem.statCaption}
              <sup className="ml-0.5">
                <a
                  href="#fn-btb"
                  id="fnref-btb"
                  aria-label="Source note 1"
                  className="rounded px-0.5 text-[0.75em] font-medium text-berry hover:underline"
                >
                  1
                </a>
              </sup>
            </figcaption>
          </figure>

          <div className="lg:col-span-4 lg:col-start-9 lg:pt-4">
            <p className="text-lead text-body">{problem.followUp}</p>
            <aside aria-label="Source" className="mt-10 border-t border-line-strong pt-6">
              <p id="fn-btb" className="flex gap-3 text-sm leading-relaxed text-muted">
                <span className="font-medium text-berry">1</span>
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
                      <path
                        d="M10 2v3.5a2 2 0 0 1-2 2H2.5M5 5 2.5 7.5 5 10"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    Back to figure
                  </a>
                </span>
              </p>
            </aside>
          </div>
        </div>
      </div>
    </section>
  );
}
