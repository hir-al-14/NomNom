begin;
-- Owners may open a private conversation with a customer who ordered from them.
create or replace function public.open_order_chat(order_id uuid)
returns uuid language plpgsql security definer set search_path = '' as $$
declare purchase public.orders; thread_id uuid;
begin
  select o.* into purchase from public.orders o join public.restaurants r on r.id=o.restaurant_id
    where o.id=order_id and r.owner_id=auth.uid();
  if not found then raise exception 'Order not available'; end if;
  insert into public.chat_threads(customer_id,restaurant_id,customer_name)
    values(purchase.customer_id,purchase.restaurant_id,purchase.customer_name)
    on conflict(customer_id,restaurant_id) do nothing;
  select id into thread_id from public.chat_threads
    where customer_id=purchase.customer_id and restaurant_id=purchase.restaurant_id;
  return thread_id;
end; $$;
revoke all on function public.open_order_chat(uuid) from public,anon;
grant execute on function public.open_order_chat(uuid) to authenticated;
grant update(customer_name) on public.chat_threads to authenticated;
drop policy if exists "customer updates conversation name" on public.chat_threads;
create policy "customer updates conversation name" on public.chat_threads for update to authenticated
  using(customer_id=auth.uid()) with check(customer_id=auth.uid());
commit;
