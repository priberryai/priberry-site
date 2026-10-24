export const pilot = {
  label: "Request a pilot",
  title: "Show us where your model breaks.",
  intro:
    "Tell us the field and the workflow. We will reply within two working days with a short scoping call, and a free sample after that.",
  fields: {
    name: { label: "Name", autoComplete: "name" },
    email: { label: "Work email", autoComplete: "email" },
    company: { label: "Company", autoComplete: "organization" },
    field: {
      label: "Field and workflow",
      hint: "For example: tax advisory, reviewing cross-border structures",
    },
    goal: { label: "What you want to fix", hint: "Where does your model fall short today?" },
    link: { label: "Link", optional: "Optional", hint: "Your product, a paper or a public eval" },
  },
  submit: "Request a pilot",
  submitting: "Sending",
  privacy:
    "We use these details only to reply to your request. They are never sold or shared for marketing.",
  success: {
    title: "Thank you. Your request is in.",
    body: "We read every request ourselves and will reply from our team address within two working days.",
  },
  error: {
    title: "That did not go through.",
  },
} as const;
