import { whatWeBuild } from "@/content/what-we-build";
import { keepHyphenated } from "@/lib/text";
import { ProductVisual } from "./ProductVisuals";

/*
 * Three products as wide editorial rows, not a grid of icon cards. Each row
 * pairs the claim with a small drawing of the real artefact.
 */
export function WhatWeBuild() {
  return (
    <section id="what-we-build" aria-labelledby="build-title" className="section-y bg-paper">
      <div className="container-page">
        <h2 id="build-title" className="max-w-[22ch] font-display text-display text-ink">
          {whatWeBuild.title}
        </h2>

        <ul className="mt-14 border-t border-line-strong md:mt-20">
          {whatWeBuild.products.map((p) => (
            <li
              key={p.name}
              className="grid gap-8 border-b border-line-strong py-12 md:py-16 lg:grid-cols-12 lg:items-center lg:gap-8"
            >
              <h3 className="max-w-[14ch] font-display text-[clamp(1.875rem,1.4rem+1.8vw,2.75rem)] leading-[1.04] tracking-[-0.026em] text-ink lg:col-span-4">
                {keepHyphenated(p.name)}
              </h3>
              <p className="max-w-md text-lead text-body lg:col-span-4">{keepHyphenated(p.body)}</p>
              <div className="lg:col-span-4 lg:flex lg:justify-end">
                <ProductVisual kind={p.kind} />
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
