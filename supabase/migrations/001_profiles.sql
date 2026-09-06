begin;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null default '',
  account_type text not null default 'personal'
    check (account_type in ('personal', 'restaurant')),
  created_at timestamptz not null default now()
);

create table if not exists public.restrictions (
  user_id uuid not null references auth.users(id) on delete cascade,
  tag text not null check (tag in
    ('gluten', 'dairy', 'peanuts', 'high-fiber', 'high-sodium', 'hard-texture')),
  severity text not null check (severity in ('low', 'medium', 'high')),
  primary key (user_id, tag)
);

alter table public.profiles enable row level security;
alter table public.restrictions enable row level security;

create policy "manage own profile" on public.profiles
  for all to authenticated using (id = (select auth.uid()))
  with check (id = (select auth.uid()));
create policy "manage own restrictions" on public.restrictions
  for all to authenticated using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));

grant select, insert, update, delete on public.profiles to authenticated;
grant select, insert, update, delete on public.restrictions to authenticated;
revoke all on public.profiles, public.restrictions from anon;

create or replace function public.save_restrictions(items jsonb)
returns void language plpgsql security invoker set search_path = '' as $$
begin
  if auth.uid() is null then
    raise exception 'Authentication required';
  end if;
  if items is null or jsonb_typeof(items) <> 'array' then
    raise exception 'Expected an array of restrictions';
  end if;
  delete from public.restrictions where user_id = auth.uid();
  insert into public.restrictions (user_id, tag, severity)
  select auth.uid(), item->>'tag', item->>'severity'
  from jsonb_array_elements(items) as item;
end;
$$;

revoke all on function public.save_restrictions(jsonb) from public, anon;
grant execute on function public.save_restrictions(jsonb) to authenticated;

commit;
