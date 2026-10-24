import { CONTACT_EMAIL } from "@/content/site";
import { faq } from "@/content/faq";

// Native <details>/<summary>: keyboard and screen-reader support built in,
// works without JavaScript. Answers fade in (globals.css). Type-led: large
// questions on hairlines, a quiet plus that turns into a minus.
export function Faq() {
  return (
    <section id="faq" aria-labelledby="faq-title" className="section-y bg-paper">
      <div className="container-page grid gap-12 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-32">
            <h2 id="faq-title" className="max-w-[12ch] font-display text-display text-ink">
              {faq.title}
            </h2>
            <p className="mt-6 text-body">
              Something else?{" "}
              <a href={`mailto:${CONTACT_EMAIL}`} className="link-inline font-medium text-ink">
                {CONTACT_EMAIL}
              </a>
            </p>
          </div>
        </div>

        <div className="lg:col-span-7 lg:col-start-6">
          <div className="border-t border-line-strong">
            {faq.items.map((item, i) => (
              <details key={item.q} name="faq" className="faq group border-b border-line-strong" open={i === 0}>
                <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-6 py-7 text-left font-display text-[clamp(1.25rem,1.1rem+0.6vw,1.5rem)] font-semibold tracking-[-0.016em] text-ink [&::-webkit-details-marker]:hidden">
                  {item.q}
                  <span aria-hidden="true" className="relative grid size-6 shrink-0 place-items-center text-berry">
                    <span className="absolute h-[2px] w-4 rounded bg-current" />
                    <span className="absolute h-4 w-[2px] rounded bg-current transition-transform duration-300 ease-(--ease-brand) group-open:scale-y-0" />
                  </span>
                </summary>
                <p className="max-w-2xl pb-8 pr-10 text-lead text-body">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
