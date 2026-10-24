"use client";

import { useReducedMotion } from "@/lib/useReducedMotion";
import { useEffect, useRef, useState } from "react";
import { MAX_SCORE, gradingExample as ex, inFavour, points, type Criterion } from "@/content/grading-example";
import { BerryMark } from "./BerryMark";
import { StatusIcon, type Status } from "./StatusIcon";
import { useCountUp } from "./useCountUp";

/*
 * The grading panel: the product in one card.
 *
 * Timeline (one step at a time, then loop):
 *   0            reset, while the body is invisible
 *   1            body fades in; model answer is on the page
 *   2 .. N+1     rubric row (step - 2) resolves; score and mark update
 *   N+2          verdict, then hold
 *   N+3          body fades out on the finished grade, then loop to 0
 *
 * It pauses on hover, when off screen, when the tab is hidden, or with the
 * Pause button (WCAG 2.2.2). Under reduced motion it shows the final state.
 */

const ROWS: readonly Criterion[] = ex.criteria;
const N = ROWS.length;
const VERDICT = N + 2;
const FADE_OUT = N + 3;
const FLAG_ROW = ROWS.findIndex((c) => c.weight > 0 && !c.hit);

function delayAfter(step: number): number {
  if (step === 0) return 650;
  if (step === 1) return 1500;
  if (step === VERDICT) return 5200;
  if (step === FADE_OUT) return 600;
  if (step === N + 1) return 800;
  return 950;
}

function rowStatus(c: Criterion, resolved: boolean): Status {
  if (!resolved) return "pending";
  if (c.weight < 0) return c.hit ? "penalty" : "pass";
  return c.hit ? "pass" : "miss";
}

const fade = "transition-[opacity,transform] duration-700 ease-(--ease-brand)";

export function GradingPanel() {
  const reduce = useReducedMotion();
  const root = useRef<HTMLElement>(null);
  const [step, setStep] = useState(1);
  const [userPaused, setUserPaused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [inView, setInView] = useState(false);
  const [pageVisible, setPageVisible] = useState(true);

  const running = !reduce && !userPaused && !hovered && inView && pageVisible;

  // Reduced motion: land on the finished grade and stay there.
  useEffect(() => {
    if (reduce) setStep(VERDICT);
  }, [reduce]);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(Boolean(e?.isIntersecting)), { threshold: 0.3 });
    io.observe(el);
    const onVis = () => setPageVisible(document.visibilityState === "visible");
    document.addEventListener("visibilitychange", onVis);
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  useEffect(() => {
    if (!running) return;
    const t = window.setTimeout(() => setStep((s) => (s >= FADE_OUT ? 0 : s + 1)), delayAfter(step));
    return () => window.clearTimeout(t);
  }, [step, running]);

  const resolvedCount = Math.max(0, Math.min(N, step - 1));
  const activeRow = step >= 2 && step <= N + 1 ? step - 2 : -1;
  // A paused panel is never left blank mid-loop.
  const bodyVisible = !running || (step !== 0 && step !== FADE_OUT);
  const answerShown = step >= 1 || !running;
  const verdictShown = step >= VERDICT;
  const flagShown = FLAG_ROW >= 0 && resolvedCount > FLAG_ROW;
  const target = ROWS.slice(0, resolvedCount).reduce((s, c) => s + points(c), 0);
  const score = useCountUp(target, { instant: reduce });
  const finalScore = ROWS.reduce((s, c) => s + points(c), 0);

  const toggleLabel = userPaused ? "Play" : "Pause";

  return (
    <figure
      ref={root}
      onPointerEnter={(e) => e.pointerType === "mouse" && setHovered(true)}
      onPointerLeave={() => setHovered(false)}
      className="relative overflow-hidden rounded-(--radius-panel) bg-surface shadow-(--shadow-panel) ring-1 ring-line"
    >
      <figcaption className="sr-only">
        {`${ex.label}. Task: ${ex.task} Model answer: ${ex.answer.before}${ex.answer.flagged}${ex.answer.after} ` +
          `Expert rubric: ${ROWS.map((c) => `${c.text}, ${c.weight > 0 ? "+" : ""}${c.weight}, ${c.weight < 0 ? (c.hit ? "applied" : "not applied") : c.hit ? "met" : "missed"}`).join("; ")}. ` +
          `Score ${finalScore} out of ${MAX_SCORE}. ${ex.verdictLabel}: ${ex.verdict}.`}
      </figcaption>

      {/* Header */}
      <div className="flex items-center justify-between gap-4 border-b border-line px-5 py-3.5 sm:px-7">
        <div className="flex min-w-0 items-center gap-2.5">
          <span aria-hidden="true" className="size-2 shrink-0 rounded-full bg-blush" />
          <span className="label truncate text-ink">{ex.label}</span>
          <span aria-hidden="true" className="label hidden text-muted sm:inline">
            · {ex.field}
          </span>
        </div>
        {!reduce && (
          <button
            type="button"
            onClick={() => setUserPaused((p) => !p)}
            aria-pressed={userPaused}
            className="label inline-flex min-h-11 shrink-0 items-center gap-2 rounded-full px-3 text-muted transition-colors hover:text-ink -my-2 -mr-3"
          >
            <svg aria-hidden="true" viewBox="0 0 12 12" className="size-3">
              {userPaused ? (
                <path d="M3 1.8v8.4L10 6z" fill="currentColor" />
              ) : (
                <path d="M3.2 2v8M8.8 2v8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              )}
            </svg>
            <span>{toggleLabel}</span>
            <span className="sr-only"> the grading animation</span>
          </button>
        )}
      </div>

      {/* Body: decorative for assistive tech; the figcaption carries the content */}
      <div
        aria-hidden="true"
        className={`grid transition-opacity duration-500 ease-(--ease-brand) lg:grid-cols-[1.06fr_1fr] ${
          bodyVisible ? "opacity-100" : "opacity-0"
        }`}
      >
        {/* Task and answer */}
        <div className="border-b border-line p-5 sm:p-7 lg:border-b-0 lg:border-r lg:p-9">
          <p className="label text-muted">Task</p>
          <p className="mt-3 text-[0.96875rem] leading-[1.65] text-ink">{ex.task}</p>

          <p className="label mt-7 text-muted">Model answer</p>
          <div
            className={`mt-3 rounded-(--radius-inner) bg-lilac p-5 ${fade} ${
              answerShown ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
            }`}
          >
            <p className="font-display text-[1.3125rem] leading-[1.42] text-ink">
              {ex.answer.before}
              <span className="relative whitespace-nowrap">
                {ex.answer.flagged}
                <span
                  className={`absolute inset-x-0 -bottom-0.5 h-[2px] origin-left rounded bg-berry transition-transform duration-700 ease-(--ease-brand) ${
                    flagShown ? "scale-x-100" : "scale-x-0"
                  }`}
                />
              </span>
              {ex.answer.after}
            </p>
            <div
              className={`mt-4 flex flex-col gap-1 border-t border-line-strong pt-3.5 sm:flex-row sm:gap-2.5 ${fade} ${
                flagShown ? "translate-y-0 opacity-100" : "translate-y-1 opacity-0"
              }`}
            >
              <span className="label shrink-0 pt-[3px] text-berry">Expert note</span>
              <span className="text-[0.875rem] leading-snug text-body">{ex.answer.flagNote}</span>
            </div>
          </div>
        </div>

        {/* Rubric and score */}
        <div className="flex flex-col p-5 sm:p-7 lg:p-9">
          <div className="flex items-baseline justify-between">
            <p className="label text-muted">Expert rubric</p>
            <p className="label text-muted">Weight</p>
          </div>

          <ol className="mt-3">
            {ROWS.map((c, i) => {
              const resolved = i < resolvedCount;
              const status = rowStatus(c, resolved);
              const against = resolved && !inFavour(c);
              return (
                <li key={c.text} className="relative grid grid-cols-[24px_1fr_auto] items-center gap-3.5 py-[11px]">
                  <span
                    className={`absolute -inset-x-3 inset-y-0.5 -z-0 rounded-xl bg-lilac transition-opacity duration-500 ${
                      i === activeRow ? "opacity-100" : "opacity-0"
                    }`}
                  />
                  <span className="relative">
                    <StatusIcon status={status} />
                  </span>
                  <span className="relative text-[0.9375rem] leading-snug text-ink">
                    {c.text}
                    {c.note && (
                      <span
                        className={`label ml-2 inline-block text-[0.6875rem] text-berry transition-opacity duration-500 ${
                          against ? "opacity-100" : "opacity-0"
                        }`}
                      >
                        {c.note}
                      </span>
                    )}
                  </span>
                  <span
                    className={`relative min-w-9 rounded-full px-2 py-0.5 text-center font-mono text-[0.8125rem] tabular-nums transition-[opacity,background-color,color] duration-500 ${
                      c.weight < 0
                        ? status === "penalty"
                          ? "bg-berry-deep text-white"
                          : "bg-[#FBEFF4] text-berry-deep"
                        : status === "miss"
                          ? "bg-transparent text-muted line-through ring-1 ring-inset ring-line-strong"
                          : "bg-lilac text-purple"
                    }`}
                  >
                    {c.weight > 0 ? `+${c.weight}` : `−${Math.abs(c.weight)}`}
                  </span>
                </li>
              );
            })}
          </ol>

          <div className="mt-auto flex items-end justify-between gap-4 border-t border-line pt-5">
            <div>
              <p className="label text-muted">Score</p>
              <p className="mt-1 flex items-baseline gap-2 font-display text-ink">
                <span className="inline-block min-w-[1.1ch] text-right text-[3.5rem] leading-none tabular-nums">
                  {score}
                </span>
                <span className="text-2xl text-muted">/ {MAX_SCORE}</span>
              </p>
              <p
                className={`mt-3 flex items-center gap-2 ${fade} ${
                  verdictShown ? "translate-y-0 opacity-100" : "translate-y-1 opacity-0"
                }`}
              >
                <span className="label text-muted">{ex.verdictLabel}</span>
                <span className="label rounded-full bg-[#FBEFF4] px-2 py-0.5 text-berry-deep">{ex.verdict}</span>
              </p>
            </div>
            <BerryMark
              className="w-[72px] shrink-0 sm:w-[84px]"
              filled={ROWS.map((c, i) => i < resolvedCount && inFavour(c))}
              verdictFilled={verdictShown && ex.sendable}
            />
          </div>
        </div>
      </div>
    </figure>
  );
}
