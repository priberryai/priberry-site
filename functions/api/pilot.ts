/**
 * POST /api/pilot: Cloudflare Pages Function for the pilot request form.
 *
 * Order of checks, cheapest first:
 *   1. Same-origin request, JSON, under 16 KB
 *   2. Honeypot field empty (bots get a quiet 200 and nothing is stored)
 *   3. Rate limit per IP (optional KV binding RATE_LIMIT; plus a WAF rule, see README)
 *   4. Schema validation (same zod rules as the browser form)
 *   5. Turnstile token verified with Cloudflare
 *   6. Insert into Supabase `pilot_requests` with the ANON key. Row Level
 *      Security allows anon INSERT only, so the key cannot read anything.
 *      The service-role key is never used.
 *
 * Environment (Pages project > Settings > Variables and secrets):
 *   TURNSTILE_SECRET_KEY  secret
 *   SUPABASE_URL          e.g. https://abcd1234.supabase.co
 *   SUPABASE_ANON_KEY     the project's publishable key (sb_publishable_...) or legacy
 *                         anon key; public by design, but kept server-side here
 *   RATE_LIMIT            optional KV namespace binding
 */
import { HONEYPOT_FIELD, TURNSTILE_FIELD, validatePilot } from "../../lib/pilot-schema";

type KV = {
  get(key: string): Promise<string | null>;
  put(key: string, value: string, opts?: { expirationTtl?: number }): Promise<void>;
};

export type Env = {
  TURNSTILE_SECRET_KEY?: string;
  SUPABASE_URL?: string;
  SUPABASE_ANON_KEY?: string;
  RATE_LIMIT?: KV;
};

type Context = { request: Request; env: Env };

const MAX_BYTES = 16 * 1024;
const RATE_WINDOW_SECONDS = 600;
const RATE_MAX = 5;

function json(status: number, body: unknown): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" },
  });
}

async function sha256(text: string): Promise<string> {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return Array.from(new Uint8Array(buf), (b) => b.toString(16).padStart(2, "0")).join("");
}

/** Returns true when this IP has used up its allowance. Stores only a hash of the IP. */
async function rateLimited(kv: KV | undefined, ip: string): Promise<boolean> {
  if (!kv || !ip) return false;
  const key = `pilot:${(await sha256(ip)).slice(0, 32)}`;
  const count = Number((await kv.get(key)) ?? "0");
  if (count >= RATE_MAX) return true;
  await kv.put(key, String(count + 1), { expirationTtl: RATE_WINDOW_SECONDS });
  return false;
}

async function verifyTurnstile(secret: string, token: string, ip: string): Promise<boolean> {
  const form = new FormData();
  form.append("secret", secret);
  form.append("response", token);
  if (ip) form.append("remoteip", ip);
  try {
    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", { method: "POST", body: form });
    if (!res.ok) return false;
    const data = (await res.json()) as { success?: boolean };
    return data.success === true;
  } catch (err) {
    console.error("pilot: turnstile siteverify unreachable", err);
    return false;
  }
}

export async function onRequestPost({ request, env }: Context): Promise<Response> {
  // 1. Shape of the request
  const origin = request.headers.get("Origin");
  if (origin && origin !== new URL(request.url).origin) return json(403, { ok: false, error: "forbidden" });
  if (!(request.headers.get("Content-Type") ?? "").includes("application/json"))
    return json(415, { ok: false, error: "unsupported_media_type" });
  const raw = await request.text();
  if (raw.length > MAX_BYTES) return json(413, { ok: false, error: "too_large" });

  let body: Record<string, unknown>;
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) throw new Error("not an object");
    body = parsed as Record<string, unknown>;
  } catch {
    return json(400, { ok: false, error: "bad_json" });
  }

  // 2. Honeypot: pretend success so bots learn nothing.
  if (typeof body[HONEYPOT_FIELD] === "string" && body[HONEYPOT_FIELD] !== "") return json(200, { ok: true });

  // 3. Rate limit
  const ip = request.headers.get("CF-Connecting-IP") ?? "";
  if (await rateLimited(env.RATE_LIMIT, ip)) return json(429, { ok: false, error: "rate_limited" });

  // 4. Validation
  const result = validatePilot(body);
  if (!result.ok) return json(422, { ok: false, errors: result.errors });

  // 5. Turnstile
  if (!env.TURNSTILE_SECRET_KEY || !env.SUPABASE_URL || !env.SUPABASE_ANON_KEY) {
    console.error("pilot: missing environment configuration");
    return json(500, { ok: false, error: "not_configured" });
  }
  const token = body[TURNSTILE_FIELD];
  if (typeof token !== "string" || token.length === 0 || token.length > 2048)
    return json(400, { ok: false, error: "turnstile_missing" });
  if (!(await verifyTurnstile(env.TURNSTILE_SECRET_KEY, token, ip)))
    return json(403, { ok: false, error: "turnstile_failed" });

  // 6. Store
  const d = result.data;
  // New Supabase projects issue a publishable key (sb_publishable_...), sent only
  // as `apikey`. Legacy anon keys are JWTs and also go in Authorization.
  const key = env.SUPABASE_ANON_KEY;
  const headers: Record<string, string> = {
    apikey: key,
    "Content-Type": "application/json",
    // anon has no SELECT permission, so ask PostgREST not to return the row.
    Prefer: "return=minimal",
  };
  if (key.startsWith("eyJ")) headers.Authorization = `Bearer ${key}`;
  let res: Response;
  try {
    res = await fetch(`${env.SUPABASE_URL.replace(/\/$/, "")}/rest/v1/pilot_requests`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        name: d.name,
        email: d.email,
        company: d.company,
        field_workflow: d.field,
        goal: d.goal,
        link: d.link ? d.link : null,
      }),
    });
  } catch (err) {
    console.error("pilot: supabase unreachable", err);
    return json(502, { ok: false, error: "store_failed" });
  }
  if (!res.ok) {
    console.error("pilot: supabase insert failed", res.status, await res.text().catch(() => ""));
    return json(502, { ok: false, error: "store_failed" });
  }
  return json(200, { ok: true });
}
