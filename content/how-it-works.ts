export const howItWorks = {
  label: "How it works",
  title: "From first call to a measured result, in four steps.",
  intro: "You see real work before you commit to anything, and every step ends with something you can use.",
  steps: [
    {
      name: "Scope",
      body: "We agree the workflows, the failure modes and the fields that matter for your model, and what a good answer looks like.",
      deliverable: "A written scope and a sample rubric",
    },
    {
      name: "Sample",
      body: "Practising experts write a small set of tasks and rubrics for you, free, so you can judge the quality first-hand.",
      deliverable: "A free sample of graded tasks",
    },
    {
      name: "Pilot",
      body: "We build the pilot at the size you need. Every task is reviewed by a second expert before it reaches you.",
      deliverable: "A pilot evaluation set or training batch",
    },
    {
      name: "Measure",
      body: "We run the set against the models you name and show where each one fails, criterion by criterion.",
      deliverable: "A failure report you can re-run",
    },
  ],
} as const;
