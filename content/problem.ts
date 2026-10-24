// "The problem" section. The figure is quoted from the paper's own wording:
// the best of 9 frontier models "only manages to pass 16% of tasks", and
// "bankers rate 0% of its outputs as client-ready" (abstract).
export const problem = {
  label: "The problem",
  /** Two sentences; the second is set in italic berry. */
  title: ["On general benchmarks, models look ready.", "On professional work, they are not."],
  stat: { value: 16, suffix: "%" },
  statCaption:
    "of tasks passed by the best of nine frontier models on BankerToolBench, a benchmark of end-to-end investment banking work. Bankers rated none of its outputs client-ready.",
  followUp:
    "The gap is rarely knowledge. It is judgement: the check an expert always runs, the shortcut they never take. That is what general data does not capture, and what we write down.",
  source: {
    text: "Lau et al., “BankerToolBench: Evaluating AI Agents in End-to-End Investment Banking Workflows”, arXiv:2604.11304, 2026. A task passes when its rubric score clears a threshold matched to bankers’ “needs light edits” rating or better.",
    href: "https://arxiv.org/abs/2604.11304",
    linkLabel: "Read the paper",
  },
} as const;
