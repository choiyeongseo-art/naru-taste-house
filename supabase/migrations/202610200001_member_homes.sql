-- Public web app: each Supabase Auth account can only access its own room.
-- Preserve the old Sites/D1 identity table; UUID accounts are deliberately separate.
create table if not exists public.member_homes (
  user_id uuid primary key references auth.users(id) on delete cascade,
  nickname text not null check (char_length(nickname) between 1 and 20),
  state jsonb not null check (jsonb_typeof(state) = 'object' and octet_length(state::text) <= 50000),
  updated_at bigint not null check (updated_at > 0)
);
alter table public.member_homes enable row level security;
revoke all on public.member_homes from public, anon, authenticated;
grant select, insert, update on public.member_homes to authenticated;
create policy member_read_own_home on public.member_homes for select to authenticated using ((select auth.uid()) = user_id);
create policy member_insert_own_home on public.member_homes for insert to authenticated with check ((select auth.uid()) = user_id);
create policy member_update_own_home on public.member_homes for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
comment on table public.member_homes is 'Private rooms owned by Supabase Auth accounts. No anonymous access.';
