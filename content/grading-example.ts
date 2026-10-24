// The invented example used by the scroll-driven grade story. It is labelled
// "Illustrative example" on the page. Every figure here is made up and
// internally consistent: 410 / 38 = 10.8x reported; 410 / 34 = 12.1x adjusted.

export type Criterion = {
  text: string;
  /** Points: positive for credit, negative for a penalty. */
  weight: number;
  /** For credit rows: did the answer earn it. For penalties: was it triggered. */
  hit: boolean;
  /** Short note shown when the row resolves against the answer. */
  note?: string;
};

export const gradingExample = {
  label: "Illustrative example",
  field: "Corporate finance",
  task:
    "A buyer offers $410M for our client’s business. Reported EBITDA is $38M, which includes a one-off $4M gain from an asset sale. Listed peers trade at 9.5–11.0x EBITDA. In two sentences for the managing director: is the offer fair?",
  answer: {
    before: "The offer values the business at ",
    flagged: "10.8x EBITDA",
    after:
      ", near the top of the 9.5–11.0x peer range, so it looks full. I would recommend the board engage on price.",
    flagNote: "Uses reported EBITDA. Without the one-off gain the bid is 12.1x, above the peer range.",
  },
  criteria: [
    { text: "States the implied multiple", weight: 2, hit: true },
    { text: "Compares it with the peer range", weight: 2, hit: true },
    { text: "Strips the one-off gain: 12.1x on $34M", weight: 3, hit: false, note: "Missed" },
    { text: "Gives a clear recommendation", weight: 2, hit: true },
    { text: "Keeps to two sentences", weight: 1, hit: true },
    { text: "Shortcut: treats reported EBITDA as recurring", weight: -3, hit: true, note: "Penalty" },
  ] satisfies Criterion[],
  verdictLabel: "Sendable as-is",
  verdict: "No",
  /** Lights the blush circle of the mark when true. */
  sendable: false as boolean,
} as const;

/** Maximum available score: the sum of the positive weights. */
export const MAX_SCORE = gradingExample.criteria.reduce((s, c) => s + Math.max(c.weight, 0), 0);

/** Points a criterion contributes once resolved (penalties subtract when hit). */
export function points(c: Criterion): number {
  return c.hit ? c.weight : 0;
}

/** Whether a resolved criterion went the answer's way (fills a dot). */
export function inFavour(c: Criterion): boolean {
  return c.weight > 0 ? c.hit : !c.hit;
}
