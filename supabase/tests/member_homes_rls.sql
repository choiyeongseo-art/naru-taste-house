-- Run as postgres in the SQL editor. All test records are rolled back.
begin;
insert into auth.users (id) values ('f9999999-9999-4999-8999-999999999991'), ('f9999999-9999-4999-8999-999999999992');
set local role authenticated;
select set_config('request.jwt.claim.sub', 'f9999999-9999-4999-8999-999999999991', true);
insert into public.member_homes values ('f9999999-9999-4999-8999-999999999991', 'RLS test A', '{"test":true}', 1);
do $$ begin
 if (select count(*) from public.member_homes) <> 1 then raise exception 'A cannot read own row'; end if;
end $$;
select set_config('request.jwt.claim.sub', 'f9999999-9999-4999-8999-999999999992', true);
do $$ begin
 if (select count(*) from public.member_homes) <> 0 then raise exception 'B can read A row'; end if;
 update public.member_homes set nickname='forbidden' where user_id='f9999999-9999-4999-8999-999999999991';
 if found then raise exception 'B can update A row'; end if;
 begin
  insert into public.member_homes values ('f9999999-9999-4999-8999-999999999991','forbidden','{}',1);
  raise exception 'B can write using A identity';
 exception when insufficient_privilege then null;
 end;
end $$;
insert into public.member_homes values ('f9999999-9999-4999-8999-999999999992', 'RLS test B', '{"test":true}', 1);
update public.member_homes set nickname='RLS test B updated' where user_id='f9999999-9999-4999-8999-999999999992';
do $$ begin
 if (select count(*) from public.member_homes where nickname='RLS test B updated') <> 1 then raise exception 'B cannot update own row'; end if;
end $$;
select 'PASS: own read/insert/update; cross-account read/update/insert blocked' as rls_test;
rollback;
