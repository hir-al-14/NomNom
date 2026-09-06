begin;
create table public.orders (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references auth.users(id),
  restaurant_id text not null references public.restaurants(id),
  customer_name text not null, request_key text not null,
  status text not null default 'new' check (status in ('new', 'ready')),
  total_cents integer not null check (total_cents >= 0),
  created_at timestamptz not null default now(), unique(customer_id, restaurant_id, request_key)
);
create table public.order_items (
  order_id uuid not null references public.orders(id) on delete cascade,
  dish_id text not null references public.dishes(id),
  name text not null, quantity integer not null check (quantity between 1 and 99),
  price_cents integer not null check (price_cents >= 0), primary key(order_id, dish_id)
);
create index order_restaurant_idx on public.orders(restaurant_id, created_at);
create index order_customer_idx on public.orders(customer_id, created_at);
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
revoke all on public.orders, public.order_items from anon, authenticated;
grant select on public.orders, public.order_items to authenticated;
grant update(status) on public.orders to authenticated;
create policy "participants read orders" on public.orders for select to authenticated using (
  customer_id = (select auth.uid()) or exists(select 1 from public.restaurants r where r.id = restaurant_id and r.owner_id = (select auth.uid()))
);
create policy "owner updates order status" on public.orders for update to authenticated using (
  exists(select 1 from public.restaurants r where r.id = restaurant_id and r.owner_id = (select auth.uid()))
) with check (exists(select 1 from public.restaurants r where r.id = restaurant_id and r.owner_id = (select auth.uid())));
create policy "participants read order items" on public.order_items for select to authenticated using (
  exists(select 1 from public.orders o where o.id = order_id)
);
commit;
