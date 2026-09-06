begin;
create table public.user_preferences (
  user_id uuid primary key references auth.users(id) on delete cascade,
  favorites text[] not null default '{}', cart jsonb not null default '[]' check (jsonb_typeof(cart) = 'array'),
  buddy jsonb, color_blind boolean not null default false, voice boolean not null default false
);
alter table public.user_preferences enable row level security;
revoke all on public.user_preferences from anon, authenticated;
grant select, insert, update on public.user_preferences to authenticated;
create policy "own preferences" on public.user_preferences for all to authenticated
  using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));
commit;
