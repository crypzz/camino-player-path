alter table public.waitlist
  add column if not exists full_name text,
  add column if not exists role text,
  add column if not exists club_name text;

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'waitlist_role_check'
  ) then
    alter table public.waitlist
      add constraint waitlist_role_check
      check (role is null or role in ('player','coach','parent','director'));
  end if;
end $$;

create or replace function public.count_waitlist_this_week()
returns integer language sql stable security definer
set search_path = public as $$
  select count(*)::int from public.waitlist
  where created_at > now() - interval '7 days';
$$;

revoke all on function public.count_waitlist_this_week() from public;
grant execute on function public.count_waitlist_this_week() to anon, authenticated;