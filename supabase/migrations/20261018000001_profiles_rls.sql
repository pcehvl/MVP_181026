-- US-007 (optional save across phones) — the profiles table and its
-- row-level security. Spec:
-- product/stories/US-007-optional-save-across-phones/spec.md (status: ready).
--
-- AC4 (minimal profile): exactly the resident's identifier, their intake
-- answers and timestamps. The skills map and the 3-sentence introduction
-- are recomputed in the frontend from `answers` — never stored here.
-- AC5 (own data only): RLS enforces read/write of the own row only; there
-- is deliberately no policy for anonymous or other-user access.

create table public.profiles (
  user_id    uuid primary key references auth.users (id) on delete cascade,
  answers    jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on column public.profiles.answers is
  'US-007 AC4: the resident''s intake answers (qualification, area, selectedWork) exactly as saved on the device.';

alter table public.profiles enable row level security;

create policy "Read own profile"
  on public.profiles for select
  using (auth.uid() = user_id);

create policy "Insert own profile"
  on public.profiles for insert
  with check (auth.uid() = user_id);

create policy "Update own profile"
  on public.profiles for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Delete own profile"
  on public.profiles for delete
  using (auth.uid() = user_id);
