export const whatWeBuild = {
  label: "What we build",
  title: "Three kinds of data, one standard: an expert would sign it.",
  products: [
    {
      tag: "Evaluate",
      name: "Expert evaluation sets",
      body: "Tasks taken from real professional workflows, each with a weighted rubric written by a practitioner. Re-runnable, so you can track every release against the same bar.",
    },
    {
      tag: "Train",
      name: "Reasoning-trace training data",
      body: "Worked solutions that show how an expert reaches the answer: the checks they run, the shortcuts they refuse, the calls they make and why.",
    },
    {
      tag: "Align",
      name: "Rubric and preference data",
      body: "Weighted rubrics, penalty criteria and expert judgements between model answers, ready for reward models and reinforcement learning.",
    },
  ],
} as const;
