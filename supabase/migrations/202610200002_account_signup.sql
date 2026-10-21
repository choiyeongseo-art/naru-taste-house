-- Registration is server-only. No passwords or plaintext IP addresses are stored here.
create schema if not exists private;
create table if not exists private.naru_signup_limits (
  bucket text primary key,
  attempts integer not null,
  expires_at timestamptz not null
);
alter table private.naru_signup_limits enable row level security;
revoke all on private.naru_signup_limits from public, anon, authenticated;

create or replace function public.claim_naru_signup(p_bucket text)
returns boolean language plpgsql security definer set search_path = '' as $$
declare n integer;
begin
  if length(p_bucket) <> 64 then return false; end if;
  insert into private.naru_signup_limits as limits (bucket, attempts, expires_at)
  values (p_bucket, 1, now() + interval '1 hour')
  on conflict (bucket) do update set
    attempts = case when limits.expires_at < now() then 1 else limits.attempts + 1 end,
    expires_at = case when limits.expires_at < now() then now() + interval '1 hour' else limits.expires_at end
  returning attempts into n;
  return n <= 5;
end;
$$;
revoke all on function public.claim_naru_signup(text) from public, anon, authenticated;
grant execute on function public.claim_naru_signup(text) to service_role;
