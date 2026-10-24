// Field names shared by the form and the Pages Function. Kept separate from
// pilot-schema.ts so the browser can use them without loading zod up front.
export const HONEYPOT_FIELD = "website";
export const TURNSTILE_FIELD = "turnstileToken";
export const PILOT_FIELDS = ["name", "email", "company", "field", "goal", "link"] as const;
