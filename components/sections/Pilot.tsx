import { pilot } from "@/content/pilot";
import { CONTACT_EMAIL } from "@/content/site";
import { PilotForm } from "./PilotForm";

export function Pilot() {
  return (
    <section id="pilot" aria-labelledby="pilot-title" className="section-y relative overflow-hidden border-t border-line">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-40 top-20 -z-10 size-[620px] rounded-full opacity-60"
        style={{ background: "radial-gradient(circle, rgb(242 154 185 / 0.35), transparent 65%)" }}
      />
      <div className="container-page grid gap-14 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-5">
          <p data-reveal className="label text-berry">
            {pilot.label}
          </p>
          <h2
            id="pilot-title"
            data-reveal
            style={{ "--i": 1 } as React.CSSProperties}
            className="mt-5 font-display text-[clamp(2.75rem,1.9rem+3.6vw,4.75rem)] leading-[1] tracking-[-0.02em] text-ink"
          >
            {pilot.title}
          </h2>
          <p data-reveal style={{ "--i": 2 } as React.CSSProperties} className="mt-7 max-w-md text-lead text-body">
            {pilot.intro}
          </p>
          <p data-reveal style={{ "--i": 3 } as React.CSSProperties} className="mt-10 text-body">
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
