import { CONTACT_EMAIL } from "@/content/site";
import { faq } from "@/content/faq";

// Native <details>/<summary>: keyboard and screen-reader support built in,
// works without JavaScript. The open animation is CSS (see globals.css).
export function Faq() {
  return (
    <section id="faq" aria-labelledby="faq-title" className="section-y bg-lilac">
      <div className="container-page grid gap-12 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-4">
          <p data-reveal className="label-mono text-berry">
            {faq.label}
          </p>
          <h2
            id="faq-title"
            data-reveal
            style={{ "--i": 1 } as React.CSSProperties}
            className="mt-5 font-serif text-display text-ink"
          >
            {faq.title}
          </h2>
          <p data-reveal style={{ "--i": 2 } as React.CSSProperties} className="mt-6 text-body">
            Something else?{" "}
            <a href={`mailto:${CONTACT_EMAIL}`} className="link-inline font-medium text-ink">
              {CONTACT_EMAIL}
            </a>
          </p>
        </div>

        <div className="lg:col-span-7 lg:col-start-6">
          <div className="border-t border-line-strong">
            {faq.items.map((item, i) => (
              <details key={item.q} name="faq" className="faq group border-b border-line-strong" open={i === 0}>
                <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-6 py-6 text-left text-[1.1875rem] font-medium tracking-[-0.01em] text-ink [&::-webkit-details-marker]:hidden">
                  {item.q}
                  <span
                    aria-hidden="true"
                    className="relative grid size-8 shrink-0 place-items-center rounded-full ring-1 ring-inset ring-line-strong transition-colors group-open:bg-ink group-open:text-paper"
                  >
                    <span className="absolute h-[1.5px] w-3 rounded bg-current" />
                    <span className="absolute h-3 w-[1.5px] rounded bg-current transition-transform duration-300 ease-(--ease-brand) group-open:scale-y-0" />
                  </span>
                </summary>
                <p className="max-w-2xl pb-7 pr-12 text-body">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
