import { SectionHeader } from "@/components/SectionHeader";
import { howItWorks } from "@/content/how-it-works";
import { StepsProgress } from "./StepsProgress";

export function HowItWorks() {
  return (
    <section id="how-it-works" aria-labelledby="how-title" className="section-y bg-lilac">
      <div className="container-page grid gap-14 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-32">
            <SectionHeader id="how-title" label={howItWorks.label} title={howItWorks.title} intro={howItWorks.intro} />
          </div>
        </div>

        <div className="lg:col-span-6 lg:col-start-7">
          <StepsProgress>
            {/* Rail: a quiet track with a berry fill scaled by --progress */}
            <div aria-hidden="true" className="absolute bottom-6 left-[19px] top-6 w-px bg-line-strong">
              <div className="steps-fill absolute inset-0 origin-top bg-berry" />
            </div>
            <ol className="relative space-y-6 md:space-y-8">
              {howItWorks.steps.map((s, i) => (
                <li key={s.name} data-step data-reveal className="step grid grid-cols-[40px_1fr] gap-3.5 sm:gap-5 md:gap-7">
                  <span
                    aria-hidden="true"
                    className="step-dot relative z-10 grid size-10 place-items-center rounded-full bg-lilac font-mono text-[0.8125rem] ring-1 ring-inset ring-line-strong"
                  >
                    <span className="step-dot-fill absolute inset-0 rounded-full bg-berry" />
                    <span className="relative">{String(i + 1).padStart(2, "0")}</span>
                  </span>
                  <div className="rounded-(--radius-card) bg-surface p-5 shadow-[0_1px_0_rgb(30_21_48/0.04)] ring-1 ring-line sm:p-6 md:p-8">
                    <h3 className="font-display text-[2rem] leading-none text-ink">
                      <span className="sr-only">Step {i + 1}: </span>
                      {s.name}
                    </h3>
                    <p className="mt-4 text-body">{s.body}</p>
                    <p className="mt-6 flex flex-col gap-1.5 border-t border-line pt-4 sm:flex-row sm:items-baseline sm:gap-3">
                      <span className="label shrink-0 text-berry">Deliverable</span>
                      <span className="text-[0.9375rem] font-medium text-ink">{s.deliverable}</span>
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </StepsProgress>
        </div>
      </div>
    </section>
  );
}
