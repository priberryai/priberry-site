// "Anatomy of a task": our method, described as process only. No numbers.
export const anatomy = {
  label: "Our method",
  title: "Anatomy of a task.",
  intro: "Every task passes through two experts and real models before it reaches you.",
  stages: [
    { name: "Written", body: "A practising expert writes the task from real work in their field." },
    { name: "Reviewed", body: "A second expert checks it independently. If they disagree, it goes back." },
    { name: "Rubric", body: "Weighted criteria, with penalties for the shortcuts an expert would never take." },
    { name: "Tested", body: "We run it on current models. If a model games the rubric, the rubric is tightened." },
    { name: "Delivered", body: "You receive the task, rubric, reviewer notes and model results in one package." },
  ],
  loops: [
    { from: 1, to: 0, label: "Sent back if review fails" },
    { from: 3, to: 2, label: "Tightened if a model finds a gap" },
  ],
} as const;
