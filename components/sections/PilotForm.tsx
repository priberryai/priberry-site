"use client";

import { useRef, useState, type FormEvent } from "react";
import { pilot } from "@/content/pilot";
import { CONTACT_EMAIL } from "@/content/site";
import { HONEYPOT_FIELD, PILOT_FIELDS, TURNSTILE_FIELD } from "@/lib/pilot-fields";
import type { PilotField } from "@/lib/pilot-schema";
import { keepHyphenated } from "@/lib/text";
import { Turnstile } from "./Turnstile";

// The validation rules (zod) load on first focus or submit, not with the page.
let schemaModule: Promise<typeof import("@/lib/pilot-schema")> | undefined;
const loadSchema = () => (schemaModule ??= import("@/lib/pilot-schema"));

// Cloudflare's published always-pass test key, used only in local development.
const DEV_TEST_SITE_KEY = "1x00000000000000000000AA";
const SITE_KEY =
  process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ||
  (process.env.NODE_ENV === "development" ? DEV_TEST_SITE_KEY : "");

type Status = "idle" | "submitting" | "success" | "error";
type Errors = Partial<Record<PilotField | "turnstile", string>>;


export function PilotForm() {
  const form = useRef<HTMLFormElement>(null);
  const successHeading = useRef<HTMLHeadingElement>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Errors>({});
  const [attempted, setAttempted] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [turnstileFailed, setTurnstileFailed] = useState(false);
  const [resetKey, setResetKey] = useState(0);

  function values() {
    const fd = new FormData(form.current ?? undefined);
    const get = (k: string) => String(fd.get(k) ?? "");
    return {
      name: get("name"),
      email: get("email"),
      company: get("company"),
      field: get("field"),
      goal: get("goal"),
      link: get("link"),
      [HONEYPOT_FIELD]: get(HONEYPOT_FIELD),
    };
  }

  // After the first submit attempt, re-check a field when the visitor leaves it.
  async function revalidate(name: PilotField) {
    if (!attempted) return;
    const { validatePilot } = await loadSchema();
    const r = validatePilot(values());
    setErrors((prev) => ({ ...prev, [name]: r.ok ? undefined : r.errors[name] }));
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "submitting") return;
    setAttempted(true);

    const v = values();
    let validatePilot;
    try {
      ({ validatePilot } = await loadSchema());
    } catch {
      setStatus("error"); // e.g. offline: the chunk could not load
      return;
    }
    const r = validatePilot(v);
    const next: Errors = r.ok ? {} : { ...r.errors };
    if (!token) next.turnstile = SITE_KEY ? "Please wait a moment while we check this is a person." : undefined;
    setErrors(next);

    const firstBad = PILOT_FIELDS.find((f) => next[f]);
    if (firstBad) {
      form.current?.querySelector<HTMLElement>(`[name="${firstBad}"]`)?.focus();
      return;
    }
    if (!r.ok || !token) return;

    setStatus("submitting");
    try {
      const res = await fetch("/api/pilot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...r.data, [HONEYPOT_FIELD]: v[HONEYPOT_FIELD], [TURNSTILE_FIELD]: token }),
      });
      const body = (await res.json().catch(() => null)) as { ok?: boolean; errors?: Errors } | null;
      if (res.ok && body?.ok) {
        setStatus("success");
        requestAnimationFrame(() => successHeading.current?.focus());
        return;
      }
      if (res.status === 422 && body?.errors) setErrors(body.errors);
      throw new Error(`HTTP ${res.status}`);
    } catch {
      setStatus("error");
      setResetKey((k) => k + 1); // Turnstile tokens are single use
    }
  }

  if (status === "success") {
    return (
      <div role="status" className="flex min-h-[420px] flex-col justify-center">
        <svg aria-hidden="true" viewBox="0 0 48 48" className="size-12">
          <circle cx="24" cy="24" r="23" fill="#2F7D5B" />
          <path d="m15 24.5 6 6 12-13" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <h3 ref={successHeading} tabIndex={-1} className="mt-8 font-display text-[2.25rem] leading-tight text-ink outline-none">
          {pilot.success.title}
        </h3>
        <p className="mt-4 max-w-md text-body">{pilot.success.body}</p>
      </div>
    );
  }

  const f = pilot.fields;
  const unavailable = !SITE_KEY || turnstileFailed;

  return (
    <form ref={form} onSubmit={onSubmit} onFocus={() => void loadSchema()} noValidate aria-describedby="pilot-privacy">
      <div className="grid gap-x-5 gap-y-6 md:grid-cols-2">
        <Field name="name" label={f.name.label} autoComplete={f.name.autoComplete} error={errors.name} onBlur={revalidate} />
        <Field name="email" type="email" label={f.email.label} autoComplete={f.email.autoComplete} error={errors.email} onBlur={revalidate} />
        <Field name="company" label={f.company.label} autoComplete={f.company.autoComplete} error={errors.company} onBlur={revalidate} />
        <Field name="field" label={f.field.label} hint={f.field.hint} error={errors.field} onBlur={revalidate} />
        <Field name="goal" label={f.goal.label} hint={f.goal.hint} error={errors.goal} onBlur={revalidate} multiline className="md:col-span-2" />
        <Field name="link" type="url" label={f.link.label} optional={f.link.optional} hint={f.link.hint} error={errors.link} onBlur={revalidate} className="md:col-span-2" />
      </div>

      {/* Honeypot: hidden from people and assistive tech; bots tend to fill it. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label>
          Website
          <input type="text" name={HONEYPOT_FIELD} tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div className="mt-8">
        {SITE_KEY && (
          <Turnstile
            siteKey={SITE_KEY}
            resetKey={resetKey}
            onToken={(t) => {
              setToken(t);
              if (t) setErrors((p) => ({ ...p, turnstile: undefined }));
            }}
            onError={() => setTurnstileFailed(true)}
          />
        )}
        {errors.turnstile && !unavailable && <p className="mt-2 text-sm text-berry-deep">{errors.turnstile}</p>}
      </div>

      {(status === "error" || unavailable) && (
        <div
          role={status === "error" ? "alert" : "status"}
          className="mt-6 rounded-(--radius-inner) bg-[#FBEFF4] p-5 text-[0.9375rem] text-ink"
        >
          <p className="font-semibold">{unavailable ? "The form is unavailable right now." : pilot.error.title}</p>
          <p className="mt-1 text-body">
            {unavailable ? "Its spam check could not load." : "Please try again in a moment."} You can also write to us
            at{" "}
            <a href={`mailto:${CONTACT_EMAIL}`} className="font-medium text-berry-deep underline underline-offset-2">
              {CONTACT_EMAIL}
            </a>
            .
          </p>
        </div>
      )}

      <div className="mt-8 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="submit"
          disabled={status === "submitting" || unavailable}
          aria-busy={status === "submitting"}
          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-berry px-7 font-medium text-white transition-[transform,background-color,box-shadow] duration-300 ease-(--ease-brand) hover:-translate-y-px hover:bg-berry-deep hover:shadow-(--shadow-lift) disabled:translate-y-0 disabled:opacity-70"
        >
          {status === "submitting" ? pilot.submitting : pilot.submit}
          {status === "submitting" && (
            <span aria-hidden="true" className="size-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
          )}
        </button>
        <p id="pilot-privacy" className="max-w-xs text-sm leading-snug text-muted">
          {pilot.privacy}{" "}
          <a href="/privacy/" className="text-ink underline underline-offset-2">
            Privacy
          </a>
        </p>
      </div>
    </form>
  );
}

type FieldProps = {
  name: PilotField;
  label: string;
  type?: "text" | "email" | "url";
  autoComplete?: string;
  hint?: string;
  optional?: string;
  error?: string;
  multiline?: boolean;
  className?: string;
  onBlur: (name: PilotField) => void;
};

function Field({ name, label, type = "text", autoComplete, hint, optional, error, multiline, className = "", onBlur }: FieldProps) {
  const id = `pilot-${name}`;
  const describedBy = [hint && `${id}-hint`, error && `${id}-error`].filter(Boolean).join(" ") || undefined;
  const control =
    "block w-full rounded-2xl bg-surface px-4 text-[1rem] text-ink ring-1 ring-inset placeholder:text-muted " +
    "transition-shadow duration-200 focus:outline-none focus:ring-2 focus:ring-berry " +
    (error ? "ring-berry-deep" : "ring-line-strong hover:ring-[rgb(30_21_48/0.3)]");

  return (
    // Column flex so inputs side by side line up even when only one has a hint.
    <div className={`flex flex-col ${className}`}>
      <label htmlFor={id} className="flex items-baseline justify-between gap-3 text-[0.9375rem] font-medium text-ink">
        {label}
        {optional && <span className="text-sm font-normal text-muted">{optional}</span>}
      </label>
      {hint && (
        <p id={`${id}-hint`} className="mt-1 text-sm text-muted">
          {keepHyphenated(hint)}
        </p>
      )}
      <div className="mt-auto pt-2.5">
        {multiline ? (
          <textarea
            id={id}
            name={name}
            rows={4}
            required
            aria-invalid={Boolean(error)}
            aria-describedby={describedBy}
            onBlur={() => onBlur(name)}
            className={`${control} min-h-32 resize-y py-3.5`}
          />
        ) : (
          <input
            id={id}
            name={name}
            type={type}
            autoComplete={autoComplete}
            required={!optional}
            aria-invalid={Boolean(error)}
            aria-describedby={describedBy}
            onBlur={() => onBlur(name)}
            inputMode={type === "email" ? "email" : type === "url" ? "url" : undefined}
            className={`${control} h-[52px]`}
          />
        )}
      </div>
      {error && (
        <p id={`${id}-error`} className="mt-2 flex items-center gap-1.5 text-sm text-berry-deep">
          <svg aria-hidden="true" viewBox="0 0 16 16" className="size-3.5 shrink-0">
            <circle cx="8" cy="8" r="7" fill="none" stroke="currentColor" strokeWidth="1.5" />
            <path d="M8 4.5v4M8 11v.01" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
          {error}
        </p>
      )}
    </div>
  );
}
