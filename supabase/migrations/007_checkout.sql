begin;
create or replace function public.place_orders(items jsonb, request_key text)
returns uuid[] language plpgsql security definer set search_path = '' as $$
declare rid text; oid uuid; ids uuid[] := '{}'; total integer; customer text;
begin
  if auth.uid() is null then raise exception 'Sign in required'; end if;
  if length(request_key) not between 1 and 100 or request_key is null then raise exception 'Invalid request key'; end if;
  if items is null or jsonb_typeof(items) <> 'array' or jsonb_array_length(items) not between 1 and 100 then raise exception 'Invalid cart'; end if;
  -- Serialize retries before reading prices or inserting orders.
  perform pg_advisory_xact_lock(hashtextextended(auth.uid()::text || request_key, 0));
  select array_agg(id) into ids from public.orders o where o.customer_id = auth.uid() and o.request_key = place_orders.request_key;
  if ids is not null then return ids; end if;
  ids := '{}';
  if exists(select 1 from jsonb_array_elements(items) i left join public.dishes d on d.id = i->>'dishId'
    left join public.restaurants r on r.id = d.restaurant_id where d.id is null or not d.available or not r.published
      or (i->>'quantity')::numeric not between 1 and 99 or (i->>'quantity')::numeric <> trunc((i->>'quantity')::numeric)
      or i->>'quantity' is null or (i->>'priceCents')::numeric is distinct from d.price_cents)
    then raise exception 'A dish changed or is unavailable. Refresh your cart.'; end if;
  if (select count(*) from jsonb_array_elements(items)) <> (select count(distinct i->>'dishId') from jsonb_array_elements(items) i)
    then raise exception 'Duplicate cart item'; end if;
  select coalesce(nullif(name,''), 'Customer') into customer from public.profiles where id = auth.uid();
  for rid in select distinct d.restaurant_id from jsonb_array_elements(items) i join public.dishes d on d.id = i->>'dishId' loop
    select sum(d.price_cents * (i->>'quantity')::integer) into total from jsonb_array_elements(items) i
      join public.dishes d on d.id = i->>'dishId' where d.restaurant_id = rid;
    insert into public.orders(customer_id, restaurant_id, customer_name, request_key, total_cents)
      values(auth.uid(), rid, coalesce(customer,'Customer'), request_key, total) returning id into oid;
    insert into public.order_items(order_id, dish_id, name, quantity, price_cents)
      select oid, d.id, d.name, (i->>'quantity')::integer, d.price_cents from jsonb_array_elements(items) i
      join public.dishes d on d.id = i->>'dishId' where d.restaurant_id = rid;
    ids := array_append(ids, oid);
  end loop;
  return ids;
end; $$;
revoke all on function public.place_orders(jsonb, text) from public, anon;
grant execute on function public.place_orders(jsonb, text) to authenticated;
commit;
