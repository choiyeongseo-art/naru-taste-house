-- Server-only storage behind the site's authenticated /api/home route.
-- ChatGPT/Sites identity IDs are opaque text, not Supabase Auth UUIDs.
create table if not exists public.taste_homes (
  user_id text primary key,
  nickname text not null check (char_length(nickname) between 1 and 20),
  state jsonb not null check (jsonb_typeof(state) = 'object'),
  updated_at bigint not null
);

alter table public.taste_homes enable row level security;
revoke all on public.taste_homes from public, anon, authenticated;
grant select, insert, update on public.taste_homes to service_role;
comment on table public.taste_homes is 'Private per-user NARU taste room state. Access through the authenticated server API only.';
