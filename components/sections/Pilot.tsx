import { pilot } from "@/content/pilot";
import { CONTACT_EMAIL } from "@/content/site";
import { PilotForm } from "./PilotForm";

/*
 * The close: one statement, what happens next (a small dotted path, the same
 * dot language as the mark), and the form.
 */
export function Pilot() {
  return (
    <section id="pilot" aria-labelledby="pilot-title" className="section-y bg-paper-deep">
      <div className="container-page grid gap-14 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-5">
          <h2
            id="pilot-title"
            className="max-w-[12ch] font-display text-[clamp(2.75rem,1.9rem+3.6vw,4.75rem)] font-semibold leading-[1] tracking-[-0.03em] text-ink"
          >
            {pilot.title}
          </h2>
          <p className="mt-7 max-w-md text-lead text-body">{pilot.intro}</p>

          <h3 className="mt-12 text-[0.9375rem] font-medium text-muted">{pilot.nextTitle}</h3>
          <ol className="relative mt-5 space-y-6">
            <span aria-hidden="true" className="absolute bottom-3 left-[6px] top-3 w-px bg-line-strong" />
            {pilot.next.map((s, i) => (
              <li key={s.title} className="relative grid grid-cols-[13px_1fr] gap-5">
                <span
                  aria-hidden="true"
                  className={`relative mt-[7px] size-[13px] rounded-full ${
                    i === pilot.next.length - 1 ? "bg-berry" : "bg-paper-deep ring-2 ring-inset ring-berry"
                  }`}
                />
                <div>
                  <p className="font-medium text-ink">{s.title}</p>
                  <p className="mt-1 text-[0.9375rem] text-body">{s.body}</p>
                </div>
              </li>
            ))}
          </ol>

          <p className="mt-12 text-body">
            Prefer email?{" "}
            <a href={`mailto:${CONTACT_EMAIL}`} className="link-inline font-medium text-ink">
              {CONTACT_EMAIL}
            </a>
          </p>
        </div>

        <div className="lg:col-span-7">
          <div className="relative rounded-(--radius-panel) bg-surface p-6 shadow-(--shadow-panel) ring-1 ring-line sm:p-9 lg:p-11">
            <PilotForm />
          </div>
        </div>
      </div>
    </section>
  );
}
