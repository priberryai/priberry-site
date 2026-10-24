// Site-wide facts. Edit here; layout reads from this file.

/** Confirm the domain spelling before launch. Used by footer, form copy and metadata. */
export const CONTACT_EMAIL = "hello@priberry.com";

export const site = {
  name: "Priberry",
  url: "https://priberry.com",
  title: "Priberry: expert-graded evaluation and training data for professional AI",
  description:
    "Priberry builds evaluation sets and training data written and graded by practising professionals, so AI teams can see exactly where their model fails and fix it.",
  operator: "AURIST Private Limited",
  operatorCountry: "India",
} as const;

export const nav = {
  links: [
    { label: "How it works", href: "#how-it-works" },
    { label: "What we build", href: "#what-we-build" },
    { label: "Principles", href: "#principles" },
    { label: "FAQ", href: "#faq" },
  ],
  cta: { label: "Request a pilot", href: "#pilot" },
} as const;

export const footer = {
  blurb:
    "Expert-graded evaluation sets and training data for teams building AI that does professional work.",
  groups: [
    {
      title: "Company",
      links: [
        { label: "How it works", href: "/#how-it-works" },
        { label: "What we build", href: "/#what-we-build" },
        { label: "Principles", href: "/#principles" },
        { label: "Notes", href: "/#notes" },
      ],
    },
    {
      title: "Contact",
      links: [
        { label: "Request a pilot", href: "/#pilot" },
        { label: CONTACT_EMAIL, href: `mailto:${CONTACT_EMAIL}` },
      ],
    },
    {
      title: "Legal",
      links: [
        { label: "Privacy", href: "/privacy/" },
        { label: "Terms", href: "/terms/" },
      ],
    },
  ],
  operatorLine: "Priberry is operated by AURIST Private Limited, India.",
} as const;
