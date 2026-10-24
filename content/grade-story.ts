// Copy for the scroll-driven grade story (components/grade-story).
// Each chapter is one statement and one supporting line, Apple-style.
// The worked example itself lives in content/grading-example.ts.

export const gradeStory = {
  /** Section title for assistive tech and the outline; the first chapter is the visible heading. */
  title: "How a task is graded",
  memo: {
    from: "Managing director",
    to: "Analyst",
    subject: "Offer for the business",
  },
  chapters: [
    {
      title: "It starts with real work.",
      body: "A practising professional writes the task the way a managing director would actually ask for it.",
    },
    {
      title: "The model answers.",
      body: "Fluent, confident and plausible. On a first read, it looks finished.",
    },
    {
      title: "A second expert sets the bar.",
      body: "They check the task, then write the rubric: what earns credit, and the shortcut that loses it.",
    },
    {
      title: "Every point has to be earned.",
      body: "Each criterion is checked against the answer. It misses the one-off gain, and the shortcut costs it.",
    },
    {
      title: "Not sendable.",
      body: "That gap, written down criterion by criterion, is what we measure, and what our data teaches a model to close.",
    },
  ],
  verdict: { score: "4", of: "10", line: "Not sendable as-is." },
} as const;
