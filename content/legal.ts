import { CONTACT_EMAIL, site } from "./site";

/**
 * Set to true once a lawyer has reviewed both pages. While false, each page
 * shows a short notice that the text is being finalised.
 */
export const LEGAL_REVIEWED = false;
export const LEGAL_UPDATED = "2026-10-24";

export type LegalSection = { heading: string; paragraphs: string[] };

export const privacy: { title: string; intro: string; sections: LegalSection[] } = {
  title: "Privacy",
  intro: `${site.name} is operated by ${site.operator}, ${site.operatorCountry}. This page explains what we collect through this website, why, and what you can ask us to do with it.`,
  sections: [
    {
      heading: "What we collect",
      paragraphs: [
        "When you request a pilot, we collect what you type into the form: your name, work email, company, the field and workflow you describe, what you want to fix and, if you add one, a link.",
        "We do not use advertising or tracking cookies. To count visits we use Cloudflare Web Analytics, which does not set cookies or build a profile of you.",
        "To keep automated spam out, the form uses Cloudflare Turnstile, which checks signals from your browser. Cloudflare processes that data under its own privacy policy.",
      ],
    },
    {
      heading: "How we use it",
      paragraphs: [
        "We use your request only to reply to you and to discuss a possible pilot. We do not sell it, rent it or share it for marketing.",
      ],
    },
    {
      heading: "Where it is stored",
      paragraphs: [
        "Form submissions are stored in a database hosted by Supabase. The website is served by Cloudflare. Both act as our service providers and may process data outside India.",
      ],
    },
    {
      heading: "How long we keep it",
      paragraphs: [
        "We keep a request for as long as we are in conversation with you, and delete it within 24 months of our last contact unless we start working together.",
      ],
    },
    {
      heading: "Your rights",
      paragraphs: [
        `You can ask to see, correct or delete what we hold about you, and withdraw your consent at any time, including under India’s Digital Personal Data Protection Act, 2023. Write to ${CONTACT_EMAIL} and we will respond promptly.`,
      ],
    },
    {
      heading: "Contact",
      paragraphs: [`Questions about this policy: ${CONTACT_EMAIL}.`],
    },
  ],
};

export const terms: { title: string; intro: string; sections: LegalSection[] } = {
  title: "Terms",
  intro: `These terms cover your use of this website, operated by ${site.operator}, ${site.operatorCountry}. Any work we do for you is governed by a separate written agreement.`,
  sections: [
    {
      heading: "Using this site",
      paragraphs: [
        "You may read and share this site for any lawful purpose. Please do not try to disrupt it, probe it for vulnerabilities without permission, or submit the form automatically.",
      ],
    },
    {
      heading: "Content",
      paragraphs: [
        `The text, design and graphics on this site belong to ${site.operator}. Examples on this site, including the grading panel, are illustrative and invented. They do not describe any client or real transaction.`,
        "Research we cite belongs to its authors. We link to the original source wherever we cite it.",
      ],
    },
    {
      heading: "No offer or advice",
      paragraphs: [
        "Nothing on this site is an offer to contract or professional advice. Pricing and scope are agreed in writing after scoping.",
      ],
    },
    {
      heading: "Liability",
      paragraphs: [
        "We work to keep this site accurate and available, but provide it as it is. To the extent the law allows, we are not liable for losses arising from its use.",
      ],
    },
    {
      heading: "Governing law",
      paragraphs: ["These terms are governed by the laws of India."],
    },
    {
      heading: "Contact",
      paragraphs: [`Questions about these terms: ${CONTACT_EMAIL}.`],
    },
  ],
};
