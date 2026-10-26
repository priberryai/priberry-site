# Going live: checklist

Status on 26 October 2026: the code is ready. Build, typecheck and the form function's tests all pass. Nothing is hosted yet: priberry.com still serves the old Hostinger WordPress site.

Use Priberry's own accounts only: GitHub `priberryai`, a Supabase project and a Cloudflare account that belong to Priberry.

**Owner** marks a step that needs you: an account sign-in, an OAuth grant, a DNS change or making something public.

## What the domain looks like today

Checked on 26 October 2026, over public DNS:

| Record | Value |
| --- | --- |
| Nameservers | `orbit.dns-parking.com`, `horizon.dns-parking.com` (Hostinger) |
| `priberry.com` A / AAAA | `147.93.101.204` / `2a02:4780:11:1186:0:f73:447e:f` (Hostinger web hosting) |
| `www.priberry.com` | CNAME to `priberry.com` |
| MX, TXT, SPF, DMARC, DKIM | **none** |

**hello@priberry.com cannot receive mail today.** The site shows that address in the footer, the FAQ, the pilot form and the privacy policy. Step 5 fixes it.

Moving DNS is low risk: no email or verification records need to be carried over. The old A and AAAA records must be replaced, not kept.

## 1. Supabase (owner, about 5 minutes)

1. **Owner:** sign in to supabase.com with Priberry's account and create a project. Pick a region near your users, for example Mumbai (`ap-south-1`).
2. In **SQL Editor**, run `supabase/migrations/0001_pilot_requests.sql`.
3. From **Project Settings > API Keys**, copy:
   - the Project URL (`https://<ref>.supabase.co`)
   - the publishable key (`sb_publishable_...`)

   Never copy the secret or service_role key; the site does not need it.

## 2. Cloudflare account and Turnstile (owner, about 5 minutes)

1. **Owner:** sign in to (or create) Priberry's own Cloudflare account.
2. Go to **Turnstile > Add widget**, name it `priberry.com` and choose the mode **Managed**.
3. Add the hostnames `priberry.com` and `www.priberry.com`, plus the `<project>.pages.dev` hostname once step 3 has created it.
4. Copy the site key and the secret key.
5. Optional: under **Web Analytics**, add the site and copy the beacon token.

## 3. Pages project (owner approves the GitHub grant and the first public deploy)

1. Go to **Workers & Pages > Create > Pages > Connect to Git**.
2. **Owner:** approve the Cloudflare GitHub app for the `priberryai` account. Limit it to the `priberry-site` repository only.
3. Build settings:
   - Framework preset: None
   - Build command: `npm run build`
   - Output directory: `out`
   - Production branch: `main`
4. Under **Variables and secrets**, set these for both Production and Preview:

   | Name | Type | Value |
   | --- | --- | --- |
   | `NODE_VERSION` | text | `24` |
   | `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | text | Turnstile site key |
   | `NEXT_PUBLIC_CF_BEACON_TOKEN` | text | Web Analytics token (optional) |
   | `TURNSTILE_SECRET_KEY` | secret | Turnstile secret key |
   | `SUPABASE_URL` | secret | Project URL |
   | `SUPABASE_ANON_KEY` | secret | Publishable key |

   The `NEXT_PUBLIC_*` values are baked in at build time. If you add or change one, redeploy. Without the Turnstile site key, the form deliberately shows "unavailable" and points visitors to email.
5. **Owner:** run the first deploy. The site then goes public at `<project>.pages.dev`. Add that hostname to the Turnstile widget.
6. Test on `pages.dev`:
   - Submit the pilot form and confirm the row in Supabase **Table Editor > pilot_requests**.
   - Open `/privacy/`, `/terms/`, the note page and a missing URL (it should show the 404 page).
7. Optional: create a KV namespace and bind it to the project as `RATE_LIMIT`.

The alternative to Git integration is direct upload: `npx wrangler pages deploy out`, after `wrangler login`, which is also an OAuth grant. Git integration is recommended because every push to `main` then deploys itself.

## 4. Move the domain to Cloudflare (owner: DNS change)

1. Go to **Add a site > `priberry.com`** and choose the Free plan.
2. Delete the imported A and AAAA records that point at Hostinger (`147.93.101.204` and `2a02:4780:...`). Leave nothing else.
3. **Owner:** in Hostinger, go to **Domains > priberry.com > Nameservers** and enter the two Cloudflare nameservers. Keep the domain registration at Hostinger. Only the nameservers change.
4. Wait until Cloudflare shows the zone as **Active**. This usually takes minutes and can take up to 24 hours.
5. In the Pages project, go to **Custom domains** and add `priberry.com` and `www.priberry.com`.
6. Go to **Rules > Redirect Rules** and redirect `www.priberry.com/*` to `https://priberry.com/${1}` with status 301.
7. Go to **SSL/TLS** and set the mode to **Full (strict)**. Turn on **Always Use HTTPS**.
8. Go to **Security > WAF > Rate limiting rules** and add one rule:
   - Match: URI Path `/api/pilot`, Method `POST`
   - Limit: 5 requests per 10 minutes per IP
   - Action: Block

## 5. Email for hello@priberry.com (owner)

The domain has no MX records today, so set up mail as soon as the zone is active:

1. Go to **Email > Email Routing** and enable it. Cloudflare adds the MX and SPF records.
2. Add a route from `hello@priberry.com` to the inbox you read. Cloudflare sends a verification email to that inbox.
3. Send a test email to hello@priberry.com.

Email Routing only forwards incoming mail. To send *as* hello@priberry.com, you need a mailbox provider (for example Google Workspace or Zoho Mail). Add its DKIM and DMARC records when you choose one.

## 6. After launch

- Submit one real pilot request on `https://priberry.com` and check that it arrives in Supabase.
- Check the old WordPress URLs: `/privacy-policy-2/`, `/contact-us/` and `/faqs/` should redirect (see `public/_redirects`). The template demo pages should return 404.
- Google Search Console: verify the domain with a DNS TXT record (**Owner**: DNS change), then submit `https://priberry.com/sitemap.xml`. Use the Removals tool if old demo pages linger in results.
- Once a lawyer has reviewed the privacy and terms text, set `LEGAL_REVIEWED = true` in `content/legal.ts`. Until then those pages show a draft notice.
- **Owner:** after a week or so of the new site running, cancel the Hostinger *web hosting* plan. Never cancel the *domain* plan.

## Not blocking launch, but open

These are from `docs/design-direction.md`, section 6:

- Final typeface decision. Funnel is provisional.
- Team names, roles and photos.
- AURIST's CIN or registered address for the footer.
