import { howItWorks } from "@/content/how-it-works";

/*
 * The engagement as a journey: four stages side by side on one hairline that
 * fills as the section scrolls into view (CSS scroll timeline, no JavaScript;
 * browsers without it simply show the line full). No numbering: the order is
 * the line itself.
 */
export function HowItWorks() {
  return (
    <section id="how-it-works" aria-labelledby="how-title" className="section-y bg-paper-deep">
      <div className="container-page">
        <div className="grid gap-6 lg:grid-cols-12 lg:items-end lg:gap-8">
          <h2 id="how-title" className="max-w-[18ch] font-display text-display text-ink lg:col-span-7">
            {howItWorks.title}
          </h2>
          <p className="max-w-md text-lead text-body lg:col-span-4 lg:col-start-9">{howItWorks.intro}</p>
        </div>

        <div className="relative mt-16 md:mt-24">
          {/* The rail (tablet and up) */}
          <div aria-hidden="true" className="absolute left-0 right-0 top-[6px] hidden h-px bg-line-strong md:block">
            <div className="journey-fill absolute inset-0 bg-berry" />
          </div>
          <ol className="grid gap-12 md:grid-cols-4 md:gap-8">
            {howItWorks.steps.map((s, i) => (
              <li key={s.name} className="relative md:pr-4">
                <span
                  aria-hidden="true"
                  className={`relative block size-[13px] rounded-full ${
                    i === howItWorks.steps.length - 1 ? "bg-berry" : "bg-paper-deep ring-2 ring-inset ring-berry"
                  }`}
                />
                <h3 className="mt-6 font-display text-[1.75rem] leading-none tracking-[-0.022em] text-ink md:mt-8">
                  {s.name}
                </h3>
                <p className="mt-4 text-body">{s.body}</p>
                <p className="mt-6 border-t border-line-strong pt-4 text-[0.9375rem]">
                  <span className="text-muted">{howItWorks.deliverableLabel} </span>
                  <span className="font-medium text-ink">{s.deliverable}</span>
                </p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
