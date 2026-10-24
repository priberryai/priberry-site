import { whatWeBuild } from "@/content/what-we-build";

// Small drawings of the three real artefacts, built from the same illustrative
// corporate-finance example as the grade story. Decorative: the product name
// and description next to each carry the meaning.

const frame = "w-full max-w-[360px] rounded-[20px] bg-surface p-5 shadow-[0_1px_0_rgb(30_21_48/0.04),0_18px_40px_-26px_rgb(30_21_48/0.35)] ring-1 ring-line";

function Tick({ pass }: { pass: boolean }) {
  return pass ? (
    <svg viewBox="0 0 16 16" className="size-4 shrink-0">
      <circle cx="8" cy="8" r="8" fill="#2F7D5B" />
      <path d="m4.8 8.3 2 2 4.2-4.4" fill="none" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ) : (
    <svg viewBox="0 0 16 16" className="size-4 shrink-0">
      <circle cx="8" cy="8" r="7.25" fill="#FBEFF4" stroke="#B3265F" strokeWidth="1.5" />
      <path d="m5.8 5.8 4.4 4.4m0-4.4-4.4 4.4" fill="none" stroke="#B3265F" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function RubricVisual() {
  const v = whatWeBuild.visuals;
  return (
    <div className={frame}>
      <div className="flex items-baseline justify-between text-[0.8125rem] text-muted">
        <span>Expert rubric</span>
        <span className="font-display text-[1.125rem] font-semibold text-ink tabular-nums">{v.rubricScore}</span>
      </div>
      <ul className="mt-3 divide-y divide-line">
        {v.rubric.map((r) => (
          <li key={r.text} className="flex items-center gap-3 py-2.5 text-[0.875rem] text-ink">
            <Tick pass={r.pass} />
            {r.text}
          </li>
        ))}
      </ul>
    </div>
  );
}

function TraceVisual() {
  const steps = whatWeBuild.visuals.trace;
  return (
    <div className={frame}>
      <p className="text-[0.8125rem] text-muted">Expert reasoning trace</p>
      <ol className="relative mt-4 space-y-3.5">
        <span className="absolute bottom-2 left-[5px] top-2 w-px bg-line-strong" />
        {steps.map((s, i) => (
          <li key={s} className="relative flex items-center gap-3.5 text-[0.875rem] text-ink">
            <span
              className={`relative size-[11px] shrink-0 rounded-full ${
                i === steps.length - 1 ? "bg-berry" : "bg-surface ring-2 ring-inset ring-berry"
              }`}
            />
            <span className={i === steps.length - 1 ? "font-medium" : ""}>{s}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}

function PreferenceVisual() {
  const p = whatWeBuild.visuals.preference;
  const Option = ({ tag, text, chosen }: { tag: string; text: string; chosen?: boolean }) => (
    <div className={`rounded-[14px] p-3.5 ring-1 ring-inset ${chosen ? "bg-[#FBEFF4] ring-berry" : "bg-paper ring-line"}`}>
      <div className="flex items-center justify-between text-[0.75rem] font-medium">
        <span className={chosen ? "text-berry-deep" : "text-muted"}>Answer {tag}</span>
        {chosen && (
          <span className="rounded-full bg-berry px-2 py-0.5 text-[0.6875rem] text-white">{p.chosen}</span>
        )}
      </div>
      <p className="mt-2 text-[0.84375rem] leading-snug text-ink">{text}</p>
      <div className="mt-2.5 space-y-1.5" aria-hidden="true">
        <span className="block h-1.5 w-full rounded-full bg-line" />
        <span className="block h-1.5 w-3/4 rounded-full bg-line" />
      </div>
    </div>
  );
  return (
    <div className={frame}>
      <p className="text-[0.8125rem] text-muted">Expert preference</p>
      <div className="mt-3 grid grid-cols-2 gap-2.5">
        <Option tag="A" text={p.a} />
        <Option tag="B" text={p.b} chosen />
      </div>
    </div>
  );
}

export function ProductVisual({ kind }: { kind: "evaluate" | "train" | "align" }) {
  return (
    <div aria-hidden="true" className="w-full">
      {kind === "evaluate" ? <RubricVisual /> : kind === "train" ? <TraceVisual /> : <PreferenceVisual />}
    </div>
  );
}
