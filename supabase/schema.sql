-- Run once in the Supabase SQL editor to store clinic data in Supabase.
create table if not exists public.clinic_records (
  collection text not null,
  id text not null,
  data jsonb not null default '{}'::jsonb,
  primary key (collection, id)
);

alter table public.clinic_records enable row level security;

-- DEMO ONLY. This lets anyone with the anon key read and write every record.
-- Before storing real patient data, replace this with a server-side login (for
-- example Supabase Auth) and policies that only let signed-in staff access rows.
create policy "demo anon full access"
  on public.clinic_records
  for all
  to anon
  using (true)
  with check (true);
