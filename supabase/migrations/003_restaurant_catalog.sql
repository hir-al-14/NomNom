begin;
create table public.restaurants (
  id text primary key default gen_random_uuid()::text,
  owner_id uuid not null unique references auth.users(id) on delete cascade,
  name text not null check (length(btrim(name)) between 1 and 200),
  cuisine text not null default '', address text not null default '', hours text not null default '',
  published boolean not null default true,
  version integer not null default 1,
  created_at timestamptz not null default now()
);
create table public.dishes (
  id text primary key,
  restaurant_id text not null references public.restaurants(id) on delete cascade,
  name text not null check (length(btrim(name)) between 1 and 80),
  description text not null default '', price_cents integer not null check (price_cents between 0 and 999999),
  ingredients jsonb not null default '[]' check (jsonb_typeof(ingredients) = 'array'),
  flags text[] not null default '{}', flag_notes jsonb not null default '{}' check (jsonb_typeof(flag_notes) = 'object'),
  nutrition jsonb not null default '{}' check (jsonb_typeof(nutrition) = 'object'),
  photo text not null default 'toast' check (photo in ('toast', 'cupcake', 'latte', 'cafe')),
  complete boolean not null default false, available boolean not null default true,
  created_at timestamptz not null default now()
);
create index dishes_restaurant_idx on public.dishes(restaurant_id);
create index dishes_flags_idx on public.dishes using gin(flags);
create index dishes_search_idx on public.dishes using gin(to_tsvector('english', name || ' ' || description));
alter table public.restaurants enable row level security;
alter table public.dishes enable row level security;
revoke all on public.restaurants, public.dishes from anon, authenticated;
grant select, insert, update, delete on public.restaurants, public.dishes to authenticated;
create policy "read published restaurants" on public.restaurants for select to authenticated
  using (published or owner_id = (select auth.uid()));
create policy "create own restaurant" on public.restaurants for insert to authenticated
  with check (owner_id = (select auth.uid()));
create policy "edit own restaurant" on public.restaurants for update to authenticated
  using (owner_id = (select auth.uid())) with check (owner_id = (select auth.uid()));
create policy "delete own restaurant" on public.restaurants for delete to authenticated using (owner_id = (select auth.uid()));
create policy "read restaurant dishes" on public.dishes for select to authenticated using (exists (
  select 1 from public.restaurants r where r.id = restaurant_id and ((r.published and available) or r.owner_id = (select auth.uid()))
));
create policy "manage own dishes" on public.dishes for all to authenticated using (exists (
  select 1 from public.restaurants r where r.id = restaurant_id and r.owner_id = (select auth.uid())
)) with check (exists (
  select 1 from public.restaurants r where r.id = restaurant_id and r.owner_id = (select auth.uid())
));
commit;
