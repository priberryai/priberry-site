# Priberry website

The public site for Priberry (operated by AURIST Private Limited, India): a static Next.js export served by Cloudflare Pages, with one Pages Function for the pilot request form.

- **Stack:** Next.js 16 (App Router, `output: 'export'`), TypeScript strict, Tailwind CSS v4, Lenis (smooth scroll, loaded lazily), zod/mini (form rules, loaded on first use)
- **Fonts:** Funnel Display and Funnel Sans via `next/font` (self-hosted at build time)
- **Form:** Cloudflare Turnstile + Pages Function + Supabase (`pilot_requests`, insert-only RLS)
- **Analytics:** Cloudflare Web Analytics (cookie-free, no consent banner)

## Run locally

Requires Node.js 24 LTS.

```bash
npm install
npm run dev        # http://localhost:3000
```

In development the form uses Cloudflare's always-pass Turnstile test key. `next dev` does not run the Pages Function, so a real submit shows the error state. To run the site and the function together:

```bash
npm run build
npm run preview    # wrangler pages dev; reads secrets from .dev.vars (copy .env.example)
```

On Windows, `npm run preview` needs the current Microsoft Visual C++ Redistributable (x64), because the local Workers runtime loads `vcruntime140_1.dll`. Without it, wrangler stops with `write EOF`.

## Build

```bash
npm run typecheck
npm run build      # writes the static site to /out
```

## Edit copy without touching layout

All words on the site live in `/content`:

| File | Section |
| --- | --- |
| `content/site.ts` | Contact email (`CONTACT_EMAIL`), nav, footer, site title and description |
| `content/hero.ts` | Hero headline, subhead, buttons, caption under the motion graphic |
| `content/grading-example.ts` | The illustrative worked example (task, answer, rubric, weights) |
| `content/grade-story.ts` | The scroll-driven grade story: chapter titles, memo header, verdict |
| `content/problem.ts` | The 16% figure, caption and source note |
| `content/how-it-works.ts` | The four steps and their deliverables |
| `content/what-we-build.ts` | The three product cards |
| `content/principles.ts` | The four principles |
| `content/who.ts` | Who we work with |
| `content/notes.ts` | Notes posts (the article body is structured content) |
| `content/faq.ts` | FAQ questions and answers |
| `content/pilot.ts` | Form labels, hints, privacy line, success and error text |
| `content/legal.ts` | Privacy and Terms text; set `LEGAL_REVIEWED = true` after legal review |

Design tokens (colour, type scale, radius, easing) are in `styles/tokens.css` only.

**Adding a note:** add an entry to `notes` in `content/notes.ts`. The home page card, the `/notes/<slug>/` page and the sitemap update automatically. To move to MDX later, add `@next/mdx` and point each entry at an `.mdx` file.

## Supabase

1. Create a project at supabase.com.
2. Open **SQL Editor** and run `supabase/migrations/0001_pilot_requests.sql`. It creates `pilot_requests`, enables Row Level Security and lets the `anon` role **insert only** (no select, update or delete).
3. From **Project Settings > API Keys**, copy the **Project URL** and the **publishable** key (`sb_publishable_...`; older projects show an **anon public** key instead, which also works).
4. Never put the `service_role` key anywhere in this project. The site does not need it.
5. Read requests in the Supabase dashboard (Table Editor > `pilot_requests`). Update `status` to `contacted` or `closed` as you go.

## Cloudflare Turnstile

1. Cloudflare dashboard > **Turnstile** > Add widget. Hostnames: `priberry.com`, `www.priberry.com` and your `*.pages.dev` preview domain. Mode: Managed.
2. Copy the **site key** into `NEXT_PUBLIC_TURNSTILE_SITE_KEY` (build variable) and the **secret key** into `TURNSTILE_SECRET_KEY` (encrypted secret).

## Deploy to Cloudflare Pages

The full launch order, including email for hello@priberry.com (the domain has no MX records yet), is in [docs/go-live.md](docs/go-live.md).

1. Push this repo to GitHub (private is fine).
2. Cloudflare dashboard > **Workers & Pages** > Create > Pages > Connect to Git, and pick the repo.
3. Build settings: Framework preset **None**, build command `npm run build`, output directory `out`. Under Variables set `NODE_VERSION` = `24`.
4. **Variables and secrets** (both Production and Preview):
   - `NEXT_PUBLIC_TURNSTILE_SITE_KEY` (plain text)
   - `NEXT_PUBLIC_CF_BEACON_TOKEN` (plain text, from Web Analytics; optional)
   - `TURNSTILE_SECRET_KEY`, `SUPABASE_URL`, `SUPABASE_ANON_KEY` (encrypt)
5. Optional per-IP limit inside the function: create a KV namespace and bind it to the Pages project as `RATE_LIMIT` (Settings > Bindings).
6. Recommended edge limit: Security > WAF > Rate limiting rules. Match `URI Path equals /api/pilot` and `Method equals POST`, 5 requests per 10 minutes per IP, action Block. The free plan includes one rule.
7. Deploy. `functions/api/pilot.ts` is picked up automatically; security and cache headers come from `public/_headers`.

## Domain: moving priberry.com from Hostinger to Cloudflare

1. Cloudflare dashboard > **Add a site** > `priberry.com` (Free plan). Cloudflare scans and imports existing DNS records; check them against Hostinger's DNS zone, especially **MX and TXT records for email**, before going further.
2. Cloudflare shows two nameservers. In Hostinger: Domains > `priberry.com` > DNS / Nameservers > Change nameservers, and enter the two Cloudflare nameservers.
3. Wait for Cloudflare to show the zone as **Active** (minutes to 24 hours).
4. In the Pages project: **Custom domains** > add `priberry.com` and `www.priberry.com`. Cloudflare creates the records and certificates.
5. Redirect `www` to the apex: Rules > Redirect Rules, `www.priberry.com/*` to `https://priberry.com/${1}`, status 301.
6. SSL/TLS > Overview: **Full (strict)**. Edge Certificates: turn on Always Use HTTPS.

## Quality checks

- Lighthouse (mobile): `npx lighthouse https://priberry.com --preset=perf --form-factor=mobile` or Chrome DevTools > Lighthouse.
- Scripts referenced by the home page total about 185 KB gzipped (measured 26 Oct 2026; React and Next.js are most of it).
- Everything respects `prefers-reduced-motion`: the hero field and the grade story fall back to static versions.
