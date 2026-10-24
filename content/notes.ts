// Notes: Priberry's research and method writing.
// Each post is plain structured content for now. To move to MDX later, keep
// this list as the index and point `slug` at an .mdx file instead of `body`.

export type NoteBlock = { type: "p"; text: string } | { type: "h2"; text: string } | { type: "ol"; items: string[] };

export type Note = {
  slug: string;
  title: string;
  summary: string;
  date: string; // ISO yyyy-mm-dd
  author: string;
  body: NoteBlock[];
};

export const notesSection = {
  label: "Notes",
  title: "What we are learning, written down.",
  readMore: "Read the note",
} as const;

export const notes: Note[] = [
  {
    slug: "how-an-expert-graded-task-is-made",
    title: "How an expert-graded task is made",
    summary:
      "Five stages, two experts and a round of real models. What happens to a task before it reaches a client, and why each step exists.",
    date: "2026-10-24",
    author: "Priberry",
    body: [
      {
        type: "p",
        text: "An evaluation set is only as good as its hardest task. A model that scores well on easy questions tells you very little about whether it can do the job a professional is paid to do. So the unit we care about is the single task: one realistic piece of work, one clear standard for doing it well. This note describes how we make one.",
      },
      { type: "h2", text: "1. An expert writes it from real work" },
      {
        type: "p",
        text: "Every task starts with a practising professional, not a template. They write a request of the kind they handle in a normal week, with the context a colleague would have: the documents, the numbers, the constraint that makes it awkward. The best tasks contain the detail a hurried reader would miss, because that is where real work goes wrong.",
      },
      { type: "h2", text: "2. A second expert reviews it" },
      {
        type: "p",
        text: "A different expert in the same field then works the task independently. Is the request clear? Is there one defensible answer, or a defensible range? Would a senior person in their firm accept it as realistic? If the reviewer disagrees with the author on any of these, the task goes back. It is not delivered until both agree.",
      },
      { type: "h2", text: "3. The rubric is written" },
      {
        type: "p",
        text: "Next comes the rubric: the criteria a good answer must meet, each with a weight that reflects how much it matters. Getting a figure right may be worth more than formatting; missing a regulatory point may matter most of all. We also write penalty criteria for shortcuts, the moves an expert would never make even when they produce a plausible answer. A model that takes a reported number at face value when the notes say otherwise should lose points, even if its conclusion happens to be right.",
      },
      { type: "h2", text: "4. It is tested on real models" },
      {
        type: "p",
        text: "Before delivery we run the task against current models and grade the outputs with the rubric. This does two jobs. It shows whether the task actually separates good work from weak work. And it catches rubric gaps: if a model earns credit without doing the work, the criteria were too loose, and we tighten them and test again.",
      },
      { type: "h2", text: "5. It is delivered whole" },
      {
        type: "p",
        text: "A client receives more than a prompt and an answer key. Each task arrives with its rubric and weights, the reviewer's notes, and the model results we observed, so your team can see why a criterion exists and re-run the same task on every release.",
      },
      { type: "h2", text: "Why the process is the product" },
      {
        type: "p",
        text: "None of these stages is novel on its own. What matters is that none is skipped. A task written by one expert carries that expert's blind spots. A rubric never tested on a model is a guess. A score with no reasoning behind it cannot be trusted or improved. The process exists so that when a task says a model failed, you can see exactly where, and believe it.",
      },
    ],
  },
];

export function getNote(slug: string): Note | undefined {
  return notes.find((n) => n.slug === slug);
}

/** Rough reading time at 230 words a minute. */
export function readingMinutes(note: Note): number {
  const words = note.body
    .map((b) => (b.type === "ol" ? b.items.join(" ") : b.text))
    .join(" ")
    .split(/\s+/).length;
  return Math.max(1, Math.round(words / 230));
}

/** Title for display: keeps hyphenated words like "expert-graded" on one line. */
export function displayTitle(title: string): string {
  return title.replace(/(\w)-(\w)/g, "$1‑$2");
}

export function formatDate(iso: string): string {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}
