begin;
create table public.chat_threads (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references auth.users(id) on delete cascade,
  restaurant_id text not null references public.restaurants(id) on delete cascade,
  customer_name text not null default 'Customer',
  created_at timestamptz not null default now(), unique(customer_id, restaurant_id)
);
create table public.chat_messages (
  id uuid primary key default gen_random_uuid(),
  thread_id uuid not null references public.chat_threads(id) on delete cascade,
  sender_id uuid not null references auth.users(id) on delete cascade,
  body text not null check (length(btrim(body)) between 1 and 2000),
  created_at timestamptz not null default now()
);
create index chat_thread_restaurant_idx on public.chat_threads(restaurant_id);
create index chat_message_thread_idx on public.chat_messages(thread_id, created_at);
alter table public.chat_threads enable row level security;
alter table public.chat_messages enable row level security;
revoke all on public.chat_threads, public.chat_messages from anon, authenticated;
grant select, insert on public.chat_threads, public.chat_messages to authenticated;
create policy "participants read threads" on public.chat_threads for select to authenticated using (
  customer_id = (select auth.uid()) or exists(select 1 from public.restaurants r where r.id = restaurant_id and r.owner_id = (select auth.uid()))
);
create policy "customers start threads" on public.chat_threads for insert to authenticated with check (
  customer_id = (select auth.uid()) and exists(select 1 from public.restaurants r where r.id = restaurant_id and r.published)
);
create policy "participants read messages" on public.chat_messages for select to authenticated using (
  exists(select 1 from public.chat_threads t where t.id = thread_id)
);
create policy "participants send messages" on public.chat_messages for insert to authenticated with check (
  sender_id = (select auth.uid()) and exists(select 1 from public.chat_threads t where t.id = thread_id)
);
commit;
