import { SectionHeader } from "@/components/SectionHeader";
import { whatWeBuild } from "@/content/what-we-build";
import { keepHyphenated } from "@/lib/text";

// Seven-circle mark geometry (public/brand/priberry-icon.svg), scaled down.
const DOTS = [
  [-40, -69],
  [40, -69],
  [-80, 0],
  [0, 0],
  [80, 0],
  [-40, 69],
  [40, 69],
] as const;
// Which circles each card lights on hover: a different pattern per product.
const PATTERNS = [
  [0, 2, 3, 5],
  [0, 1, 3, 4, 6],
  [0, 1, 2, 3, 4, 5, 6],
];

export function WhatWeBuild() {
  return (
    <section id="what-we-build" aria-labelledby="build-title" className="section-y">
      <div className="container-page">
        <SectionHeader id="build-title" label={whatWeBuild.label} title={whatWeBuild.title} />

        <ul className="mt-14 grid gap-5 md:mt-20 lg:grid-cols-3 lg:gap-6">
          {whatWeBuild.products.map((p, i) => (
            <li
              key={p.name}
              data-reveal
              style={{ "--i": i } as React.CSSProperties}
              className="group relative flex flex-col rounded-(--radius-card) bg-surface p-7 ring-1 ring-line transition-[transform,box-shadow] duration-500 ease-(--ease-brand) hover:-translate-y-1 hover:shadow-(--shadow-panel) md:p-8"
            >
              <div className="flex items-start justify-between">
                <p className="label text-muted">
                  {String(i + 1).padStart(2, "0")} · {p.tag}
                </p>
                <svg viewBox="-120 -109 240 218" aria-hidden="true" className="w-11 shrink-0">
                  {DOTS.map(([cx, cy], d) => {
                    const lit = PATTERNS[i]?.includes(d);
                    return (
                      <g key={d}>
                        <circle cx={cx} cy={cy} r={34} fill="none" stroke="rgb(30 21 48 / 0.16)" strokeWidth="4" />
                        {lit && (
                          <circle
                            cx={cx}
                            cy={cy}
                            r={38}
                            fill={d === 1 ? "#F29AB9" : d === 3 || d === 5 ? "#8A1B49" : "#B3265F"}
                            className="origin-center scale-50 opacity-0 transition-[opacity,transform] duration-500 ease-(--ease-brand) [transform-box:fill-box] group-hover:scale-100 group-hover:opacity-100"
                            style={{ transitionDelay: `${d * 40}ms` }}
                          />
                        )}
                      </g>
                    );
                  })}
                </svg>
              </div>
              <h3 className="mt-10 font-display text-[2rem] leading-[1.05] text-ink lg:mt-20">{keepHyphenated(p.name)}</h3>
              <p className="mt-4 max-w-xl text-body">{keepHyphenated(p.body)}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
