begin;
-- Only request counts are stored, never queries or external food data.
create table public.food_lookup_limits (
  user_id uuid not null references auth.users(id) on delete cascade,
  minute timestamptz not null, requests integer not null, primary key(user_id, minute)
);
alter table public.food_lookup_limits enable row level security;
revoke all on public.food_lookup_limits from anon, authenticated;
create function public.allow_food_lookup() returns boolean language plpgsql security definer set search_path = '' as $$
declare count integer;
begin
  if auth.uid() is null then return false; end if;
  delete from public.food_lookup_limits where user_id = auth.uid() and minute < now() - interval '1 day';
  insert into public.food_lookup_limits values(auth.uid(), date_trunc('minute', now()), 1)
  on conflict(user_id, minute) do update set requests = public.food_lookup_limits.requests + 1
  returning requests into count;
  return count <= 20;
end; $$;
revoke all on function public.allow_food_lookup() from public, anon;
grant execute on function public.allow_food_lookup() to authenticated;
commit;
