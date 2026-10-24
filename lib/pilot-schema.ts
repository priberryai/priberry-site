// Pilot request schema, shared by the browser form (components/sections/PilotForm.tsx)
// and the server (functions/api/pilot.ts), so both apply exactly the same rules.
// Uses zod/mini to keep the browser bundle small. Keep imports relative: the
// Cloudflare Pages Function bundler does not know the "@/" alias.
import * as z from "zod/mini";

export const pilotSchema = z.object({
  name: z.string().check(z.trim(), z.minLength(1, { error: "Enter your name" }), z.maxLength(120, { error: "Keep this under 120 characters" })),
  email: z.string().check(
    z.trim(),
    z.minLength(1, { error: "Enter your work email" }),
    z.maxLength(254, { error: "That email is too long" }),
    z.email({ error: "Enter a valid email address" }),
  ),
  company: z.string().check(z.trim(), z.minLength(1, { error: "Enter your company" }), z.maxLength(160, { error: "Keep this under 160 characters" })),
  field: z.string().check(z.trim(), z.minLength(2, { error: "Tell us the field and workflow" }), z.maxLength(600, { error: "Keep this under 600 characters" })),
  goal: z.string().check(z.trim(), z.minLength(2, { error: "Tell us what you want to fix" }), z.maxLength(2000, { error: "Keep this under 2,000 characters" })),
  link: z.optional(
    z.union([
      z.literal(""),
      z.string().check(z.trim(), z.maxLength(500, { error: "That link is too long" }), z.url({ protocol: /^https?$/, error: "Enter a full link starting with https://" })),
    ]),
  ),
});

export type PilotRequest = z.infer<typeof pilotSchema>;
export type PilotField = keyof PilotRequest;

export { HONEYPOT_FIELD, TURNSTILE_FIELD } from "./pilot-fields";

/** Validates input; returns either clean data or a map of field -> first message. */
export function validatePilot(input: unknown):
  | { ok: true; data: PilotRequest }
  | { ok: false; errors: Partial<Record<PilotField, string>> } {
  const r = pilotSchema.safeParse(input);
  if (r.success) return { ok: true, data: r.data };
  const errors: Partial<Record<PilotField, string>> = {};
  for (const issue of r.error.issues) {
    const key = issue.path[0] as PilotField | undefined;
    if (key && !errors[key]) errors[key] = issue.message;
  }
  return { ok: false, errors };
}
