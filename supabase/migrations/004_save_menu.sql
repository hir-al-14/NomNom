begin;
create or replace function public.save_restaurant_menu(payload jsonb, expected_version integer)
returns integer language plpgsql security invoker set search_path = '' as $$
declare rid text := payload->'profile'->>'id'; next_version integer; item jsonb;
begin
  if auth.uid() is null then raise exception 'Sign in required'; end if;
  if jsonb_typeof(payload->'dishes') is distinct from 'array' or jsonb_array_length(payload->'dishes') > 200
    then raise exception 'Invalid menu'; end if;
  if expected_version = 0 then
    insert into public.restaurants(id, owner_id, name, cuisine, address, hours)
    values(rid, auth.uid(), payload->'profile'->>'name', coalesce(payload->'profile'->>'cuisine',''),
      coalesce(payload->'profile'->>'address',''), coalesce(payload->'profile'->>'hours',''));
    next_version := 1;
  else
    update public.restaurants set name = payload->'profile'->>'name', cuisine = payload->'profile'->>'cuisine',
      address = payload->'profile'->>'address', hours = payload->'profile'->>'hours', version = version + 1
    where id = rid and owner_id = auth.uid() and version = expected_version returning version into next_version;
    if next_version is null then raise exception 'Menu changed on another device. Reload before saving.'; end if;
  end if;
  for item in select value from jsonb_array_elements(payload->'dishes') loop
    if item->>'restaurantId' is distinct from rid then raise exception 'Wrong restaurant'; end if;
    if jsonb_typeof(item->'portions') is distinct from 'array' then raise exception 'Invalid ingredients'; end if;
    if exists(select 1 from jsonb_array_elements(item->'portions') p where length(btrim(p->>'name')) not between 1 and 80
      or p->>'name' is null or (p->>'quantity')::numeric not between 1 and 99
      or (p->>'quantity')::numeric <> trunc((p->>'quantity')::numeric) or p->>'quantity' is null)
      then raise exception 'Invalid ingredient quantity'; end if;
    insert into public.dishes(id, restaurant_id, name, description, price_cents, ingredients, flags, flag_notes, nutrition, photo, complete)
    values(item->>'id', rid, item->>'name', coalesce(item->>'description',''), (item->>'priceCents')::integer,
      item->'portions', array(select jsonb_array_elements_text(item->'flags')), item->'flagNotes', item->'nutrition', item->>'photo', (item->>'complete')::boolean)
    on conflict(id) do update set name = excluded.name, description = excluded.description, price_cents = excluded.price_cents,
      ingredients = excluded.ingredients, flags = excluded.flags, flag_notes = excluded.flag_notes,
      nutrition = excluded.nutrition, photo = excluded.photo, complete = excluded.complete, available = true
    where public.dishes.restaurant_id = rid;
    if not found then raise exception 'Dish belongs to a different restaurant'; end if;
  end loop;
  update public.dishes set available = false where restaurant_id = rid
    and id not in (select value->>'id' from jsonb_array_elements(payload->'dishes'));
  return next_version;
end; $$;
revoke all on function public.save_restaurant_menu(jsonb, integer) from public, anon;
grant execute on function public.save_restaurant_menu(jsonb, integer) to authenticated;
commit;
