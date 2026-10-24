-- Pilot requests from priberry.com.
-- The website's Pages Function inserts with the anon key. Row Level Security
-- lets anon INSERT and nothing else: no select, update or delete. Read the
-- table from the Supabase dashboard (or with the service role, never in the site).

create table if not exists public.pilot_requests (
  id             uuid primary key default gen_random_uuid(),
  created_at     timestamptz not null default now(),
  name           text not null check (char_length(name) between 1 and 120),
  email          text not null check (char_length(email) between 3 and 254),
  company        text not null check (char_length(company) between 1 and 160),
  field_workflow text not null check (char_length(field_workflow) between 2 and 600),
  goal           text not null check (char_length(goal) between 2 and 2000),
  link           text check (link is null or (char_length(link) <= 500 and link ~* '^https?://')),
  status         text not null default 'new' check (status in ('new', 'contacted', 'closed'))
);

comment on table public.pilot_requests is 'Pilot requests submitted through the website form.';

alter table public.pilot_requests enable row level security;

-- Start from nothing, then grant only what the form needs.
revoke all on table public.pilot_requests from anon, authenticated;
grant insert (name, email, company, field_workflow, goal, link) on table public.pilot_requests to anon;

drop policy if exists "website can insert pilot requests" on public.pilot_requests;
create policy "website can insert pilot requests"
  on public.pilot_requests
  for insert
  to anon
  with check (status = 'new');
