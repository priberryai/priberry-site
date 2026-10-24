// "What we build": three products, each shown with a small drawing of the
// real artefact, using the same illustrative corporate-finance example as
// the grade story (see content/grading-example.ts).
export const whatWeBuild = {
  title: "Three kinds of data. One standard: an expert would sign it.",
  products: [
    {
      kind: "evaluate",
      name: "Expert evaluation sets",
      body: "Tasks taken from real professional workflows, each with a weighted rubric written by a practitioner. Re-runnable, so you can hold every release to the same bar.",
    },
    {
      kind: "train",
      name: "Reasoning-trace training data",
      body: "Worked solutions that show how an expert reaches the answer: the checks they run, the shortcuts they refuse, the calls they make and why.",
    },
    {
      kind: "align",
      name: "Rubric and preference data",
      body: "Weighted rubrics, penalty criteria and expert judgements between model answers, ready for reward models and reinforcement learning.",
    },
  ],
  /** Text inside the small product drawings (illustrative). */
  visuals: {
    rubric: [
      { text: "States the implied multiple", pass: true },
      { text: "Strips the one-off gain", pass: false },
      { text: "Gives a clear recommendation", pass: true },
    ],
    rubricScore: "7 / 10",
    trace: ["Reads the notes to the accounts", "Finds a one-off $4M gain", "Adjusts EBITDA to $34M", "12.1x: above the peer range"],
    preference: {
      a: "Treats reported EBITDA as recurring",
      b: "Adjusts for the one-off gain first",
      chosen: "Expert prefers B",
    },
  },
} as const;
