"use client";

import { useEffect, useRef, useState } from "react";
import { gradeStory as story } from "@/content/grade-story";
import { MAX_SCORE, gradingExample as ex, inFavour, points, type Criterion } from "@/content/grading-example";
import { BerryMark } from "./BerryMark";
import { StatusIcon, type Status } from "./StatusIcon";
import { useCountUp } from "./useCountUp";

/*
 * The grade, told by scrolling. A sticky stage holds still for about five
 * screens while the visitor's scroll drives the story (and rewinds it):
 *
 *   0.00-0.14  chapter 1  the task arrives
 *   0.14-0.32  chapter 2  the model's answer writes in, word by word
 *   0.32-0.46  chapter 3  a second expert's rubric arrives, row by row
 *   0.46-0.80  chapter 4  each criterion resolves; score and mark update
 *   0.80-1.00  chapter 5  the stage turns to ink for the verdict
 *
 * Discrete changes go through React state (only when a value changes);
 * continuous values (progress bars, ink) are CSS variables set directly.
 * Without JavaScript, or with reduced motion, the section is a static,
 * fully graded card with every chapter's text in order.
 */

const BOUNDS = [0, 0.14, 0.32, 0.46, 0.8, 1] as const;
const RANGE = {
  answer: [0.15, 0.3],
  rubric: [0.33, 0.44],
  grade: [0.48, 0.77],
  ink: [0.8, 0.87],
} as const;

const ROWS: readonly Criterion[] = ex.criteria;
const N = ROWS.length;
const FLAG_ROW = ROWS.findIndex((c) => c.weight > 0 && !c.hit);

// The answer as tokens; the flagged phrase stays one unit.
type Token = { text: string; flagged?: boolean };
const TOKENS: Token[] = [
  ...ex.answer.before.trim().split(" ").map((text) => ({ text })),
  { text: ex.answer.flagged, flagged: true },
  // "after" starts with a comma; the renderer omits the space before it.
  ...ex.answer.after.trim().split(" ").map((text) => ({ text })),
];

type View = { chapter: number; words: number; rowsIn: number; resolved: number };
const FINAL: View = { chapter: 4, words: TOKENS.length, rowsIn: N, resolved: N };

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const sub = (p: number, [a, b]: readonly [number, number]) => clamp01((p - a) / (b - a));

function viewAt(p: number): View {
  let chapter = 0;
  for (let i = 0; i < 5; i++) if (p >= BOUNDS[i]!) chapter = i;
  return {
    chapter,
    words: Math.round(sub(p, RANGE.answer) * TOKENS.length),
    rowsIn: Math.min(N, Math.ceil(sub(p, RANGE.rubric) * N - 1e-6)),
    resolved: Math.min(N, Math.floor(sub(p, RANGE.grade) * N + 1e-6)),
  };
}

function rowStatus(c: Criterion, resolved: boolean): Status {
  if (!resolved) return "pending";
  if (c.weight < 0) return c.hit ? "penalty" : "pass";
  return c.hit ? "pass" : "miss";
}

const ease = "transition-[opacity,transform] duration-500 ease-(--ease-brand)";

export function GradeStory() {
  const root = useRef<HTMLElement>(null);
  const [mode, setMode] = useState<"static" | "scroll">("static");
  const [view, setView] = useState<View>(FINAL);
  const last = useRef<View>(FINAL);

  useEffect(() => {
    const el = root.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setMode("scroll");

    let raf = 0;
    const update = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const span = r.height - window.innerHeight;
      const p = span > 0 ? clamp01(-r.top / span) : 0;
      // Continuous values: no React render needed.
      const ink = sub(p, RANGE.ink);
      el.style.setProperty("--ink", ink.toFixed(3));
      // Dark nav while the ink verdict sits under it (see globals.css).
      const underNav = ink > 0.5 && r.top <= 0 && r.bottom > 72;
      document.documentElement.toggleAttribute("data-nav-ink", underNav);
      for (let i = 0; i < 4; i++) {
        el.style.setProperty(`--c${i}`, clamp01((p - BOUNDS[i]!) / (BOUNDS[i + 1]! - BOUNDS[i]!)).toFixed(3));
      }
      const v = viewAt(p);
      const l = last.current;
      if (v.chapter !== l.chapter || v.words !== l.words || v.rowsIn !== l.rowsIn || v.resolved !== l.resolved) {
        last.current = v;
        setView(v);
      }
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    // Measure after the layout switches to the tall, pinned mode.
    requestAnimationFrame(update);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
      document.documentElement.removeAttribute("data-nav-ink");
    };
  }, []);

  const scrolling = mode === "scroll";
  const target = ROWS.slice(0, view.resolved).reduce((s, c) => s + points(c), 0);
  const score = useCountUp(target, { duration: 380, instant: !scrolling });
  const flagShown = FLAG_ROW >= 0 && view.resolved > FLAG_ROW;
  const pane = view.chapter >= 2 ? "b" : "a";
  const finalScore = ROWS.reduce((s, c) => s + points(c), 0);

  return (
    <section
      ref={root}
      id="grade"
      aria-labelledby="grade-title"
      data-mode={mode}
      className="story relative bg-paper"
    >
      <h2 id="grade-title" className="sr-only">
        {story.title}
      </h2>

      <div className="story-stage">
        <div className="container-page story-grid">
          {/* Chapter captions: stacked in one cell while scrolling, a list when static. */}
          <div className="story-copy">
            <div aria-hidden="true" className="story-progress mb-8 hidden gap-1.5 lg:flex">
              {[0, 1, 2, 3].map((i) => (
                <span key={i} className="relative h-[3px] flex-1 overflow-hidden rounded-full bg-line-strong">
                  <span
                    className="absolute inset-0 origin-left rounded-full bg-berry"
                    style={{ transform: `scaleX(var(--c${i}, 1))` }}
                  />
                </span>
              ))}
            </div>
            <ol className="story-captions">
              {story.chapters.slice(0, 4).map((c, i) => (
                <li key={c.title} data-active={view.chapter === i || undefined} className="story-caption">
                  <h3 className="font-display text-[clamp(1.75rem,1.3rem+1.9vw,2.75rem)] leading-[1.06] tracking-[-0.024em] text-ink">
                    {c.title}
                  </h3>
                  <p className="mt-4 max-w-[26rem] text-[clamp(1.0625rem,1rem+0.3vw,1.25rem)] leading-[1.5] text-body">{c.body}</p>
                </li>
              ))}
            </ol>
          </div>

          {/* The document. Decorative for assistive tech: the figcaption carries it. */}
          <figure className="story-figure">
            <figcaption className="sr-only">
              {`${ex.label}. Task from the ${story.memo.from.toLowerCase()}: ${ex.task} Model answer: ${ex.answer.before}${ex.answer.flagged}${ex.answer.after} ` +
                `Expert rubric: ${ROWS.map((c) => `${c.text}, ${c.weight > 0 ? "+" : ""}${c.weight}, ${c.weight < 0 ? (c.hit ? "applied" : "not applied") : c.hit ? "met" : "missed"}`).join("; ")}. ` +
                `Score ${finalScore} out of ${MAX_SCORE}. ${story.verdict.line}`}
            </figcaption>
            <div aria-hidden="true" className="story-card" data-pane={pane}>
              <div className="flex items-center justify-between gap-4 border-b border-line px-5 py-3 sm:px-7">
                <span className="flex items-center gap-2.5 text-[0.875rem] font-medium text-ink">
                  <span className="size-2 rounded-full bg-blush" />
                  {ex.label}
                  <span className="hidden text-muted sm:inline">· {ex.field}</span>
                </span>
                <span className="text-[0.8125rem] text-muted tabular-nums">
                  Rubric {view.resolved}/{N}
                </span>
              </div>

              <div className="story-panes">
                {/* Pane A: the task and the answer */}
                <div className="story-pane story-pane-a p-5 sm:p-7 lg:border-r lg:border-line">
                  <dl className="story-memo mb-4 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-[0.875rem]">
                    <dt className="text-muted">From</dt>
                    <dd className="text-ink">{story.memo.from}</dd>
                    <dt className="text-muted">Re</dt>
                    <dd className="text-ink">{story.memo.subject}</dd>
                  </dl>
                  <p className="story-task text-[0.96875rem] leading-[1.6] text-ink">{ex.task}</p>

                  <p className="label mt-6 text-muted">Model answer</p>
                  <div className="mt-2.5 rounded-(--radius-inner) bg-paper p-4 ring-1 ring-inset ring-line sm:p-5">
                    <p className="story-answer text-[1.0625rem] leading-[1.55] text-ink">
                      {TOKENS.map((t, i) => (
                        <span key={i}>
                          <span
                            className={`transition-opacity duration-300 ${i < view.words ? "opacity-100" : "opacity-0"} ${
                              t.flagged ? "relative whitespace-nowrap" : ""
                            }`}
                          >
                            {t.text}
                            {t.flagged && (
                              <span
                                className={`absolute inset-x-0 -bottom-0.5 h-[2px] origin-left rounded bg-berry transition-transform duration-700 ease-(--ease-brand) ${
                                  flagShown ? "scale-x-100" : "scale-x-0"
                                }`}
                              />
                            )}
                          </span>
                          {i < TOKENS.length - 1 && !/^[,.]/.test(TOKENS[i + 1]!.text) ? " " : ""}
                        </span>
                      ))}
                    </p>
                    <p
                      className={`mt-3 flex flex-col gap-0.5 border-t border-line pt-3 text-[0.875rem] leading-snug sm:flex-row sm:gap-2.5 ${ease} ${
                        flagShown ? "translate-y-0 opacity-100" : "translate-y-1 opacity-0"
                      }`}
                    >
                      <span className="shrink-0 font-medium text-berry">Expert note</span>
                      <span className="text-body">{ex.answer.flagNote}</span>
                    </p>
                  </div>
                </div>

                {/* Pane B: the rubric and the score */}
                <div className="story-pane story-pane-b flex flex-col p-5 sm:p-7">
                  <div className="flex items-baseline justify-between">
                    <p className="label text-muted">Expert rubric</p>
                    <p className="label text-muted">Weight</p>
                  </div>
                  <div className="relative mt-2">
                    <p
                      className={`absolute left-0 top-3 text-[0.9375rem] text-muted transition-opacity duration-500 ${
                        view.rowsIn === 0 ? "opacity-100" : "opacity-0"
                      }`}
                    >
                      Awaiting a second expert.
                    </p>
                    <ol>
                      {ROWS.map((c, i) => {
                        const shown = i < view.rowsIn;
                        const resolved = i < view.resolved;
                        const status = rowStatus(c, resolved);
                        const against = resolved && !inFavour(c);
                        return (
                          <li
                            key={c.text}
                            className={`story-row grid grid-cols-[22px_1fr_auto] items-center gap-3 border-b border-line py-[9px] last:border-0 ${ease} ${
                              shown ? "translate-x-0 opacity-100" : "translate-x-3 opacity-0"
                            }`}
                          >
                            <StatusIcon status={status} />
                            <span className="text-[0.90625rem] leading-snug text-ink">
                              {c.text}
                              {c.note && (
                                <span
                                  className={`ml-2 inline-block text-[0.75rem] font-medium text-berry transition-opacity duration-500 ${
                                    against ? "opacity-100" : "opacity-0"
                                  }`}
                                >
                                  {c.note}
                                </span>
                              )}
                            </span>
                            <span
                              className={`min-w-9 rounded-full px-2 py-0.5 text-center text-[0.8125rem] font-medium tabular-nums transition-colors duration-500 ${
                                c.weight < 0
                                  ? status === "penalty"
                                    ? "bg-berry-deep text-white"
                                    : "bg-[#FBEFF4] text-berry-deep"
                                  : status === "miss"
                                    ? "text-muted line-through ring-1 ring-inset ring-line-strong"
                                    : "bg-lilac text-purple"
                              }`}
                            >
                              {c.weight > 0 ? `+${c.weight}` : `−${Math.abs(c.weight)}`}
                            </span>
                          </li>
                        );
                      })}
                    </ol>
                  </div>

                  <div className="mt-auto flex items-end justify-between gap-4 pt-5">
                    <p className="flex items-baseline gap-2 font-display text-ink">
                      <span className="story-score inline-block min-w-[1.1ch] text-right text-[3.25rem] font-semibold leading-none tabular-nums">
                        {score}
                      </span>
                      <span className="text-xl text-muted">/ {MAX_SCORE}</span>
                    </p>
                    <BerryMark
                      className="w-[64px] shrink-0 sm:w-[76px]"
                      filled={ROWS.map((c, i) => i < view.resolved && inFavour(c))}
                      verdictFilled={false}
                    />
                  </div>
                </div>
              </div>
            </div>
          </figure>
        </div>

        {/* Chapter 5: the verdict, on ink. An overlay while scrolling, a block when static. */}
        <div className="story-verdict on-ink">
          <div className="container-page grid h-full content-center items-center gap-10 lg:grid-cols-12">
            <div className="lg:col-span-7">
            <p className="font-display font-semibold leading-[0.9] tracking-[-0.04em] text-on-ink">
              <span className="text-[clamp(6rem,3rem+14vw,13rem)] tabular-nums">{story.verdict.score}</span>
              <span className="text-[clamp(2.5rem,1.5rem+4vw,5rem)] text-on-ink-muted"> / {story.verdict.of}</span>
            </p>
            <p className="mt-6 font-display text-[clamp(2rem,1.4rem+2.6vw,3.5rem)] font-semibold leading-[1.05] tracking-[-0.026em] text-blush">
              {story.verdict.line}
            </p>
            <p className="mt-6 max-w-[34rem] text-[clamp(1.0625rem,1rem+0.3vw,1.25rem)] leading-[1.55] text-on-ink-muted">
              {story.chapters[4].body}
            </p>
            </div>
            {/* The mark as the grade left it: four of seven lit, the "sendable" circle dark. */}
            <BerryMark
              onInk
              className="w-[min(46vw,200px)] lg:col-span-5 lg:w-[min(30vw,380px)] lg:justify-self-end"
              filled={ROWS.map((c) => inFavour(c))}
              verdictFilled={false}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
