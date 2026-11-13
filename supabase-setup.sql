-- Run in your own Supabase project's SQL Editor.
create table if not exists public.yawmi_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  payload jsonb not null,
  updated_at timestamptz not null default now()
);
alter table public.yawmi_profiles enable row level security;
revoke all on public.yawmi_profiles from anon;
grant select, insert, update, delete on public.yawmi_profiles to authenticated;
drop policy if exists "read own yawmi profile" on public.yawmi_profiles;
create policy "read own yawmi profile" on public.yawmi_profiles for select to authenticated using (auth.uid() = user_id);
drop policy if exists "insert own yawmi profile" on public.yawmi_profiles;
create policy "insert own yawmi profile" on public.yawmi_profiles for insert to authenticated with check (auth.uid() = user_id);
drop policy if exists "update own yawmi profile" on public.yawmi_profiles;
create policy "update own yawmi profile" on public.yawmi_profiles for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
drop policy if exists "delete own yawmi profile" on public.yawmi_profiles;
create policy "delete own yawmi profile" on public.yawmi_profiles for delete to authenticated using (auth.uid() = user_id);
