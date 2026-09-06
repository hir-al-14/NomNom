-- Run after migrations 001 through 010. Existing menu edits are preserved.
-- First set nomnom.seed_owner_email to the existing owner account email (see README).
begin;
do $$
declare owner_uuid uuid;
begin
  select id into owner_uuid from auth.users where lower(email) = lower(current_setting('nomnom.seed_owner_email', true));
  if owner_uuid is null then raise exception 'Create the owner account in NomNom before importing the catalog.'; end if;
  insert into public.restaurants(id, owner_id, name, cuisine, address, hours)
  values ('demo-kitchen', owner_uuid, 'Cava', 'Mediterranean · Greek inspired', 'Sacramento, CA · Sample listing', '') on conflict (id) do nothing;
  insert into public.restaurants(id, owner_id, name, cuisine, address, hours)
  values ('luigino', owner_uuid, 'Luigino’s Parmigiana', 'Italian', 'Sample listing', '') on conflict (id) do nothing;
  insert into public.restaurants(id, owner_id, name, cuisine, address, hours)
  values ('sokyo', owner_uuid, 'Shimogamosaryo (Sokyo)', 'Japanese', 'Sample listing', '') on conflict (id) do nothing;
  insert into public.restaurants(id, owner_id, name, cuisine, address, hours)
  values ('window', owner_uuid, 'Window Coffee Bar', 'Cafe · Coffee · Deli-style', '903 W Camelback Rd, Phoenix, AZ 85013', '9am – 5pm') on conflict (id) do nothing;
  insert into public.dishes(id, restaurant_id, name, description, price_cents, ingredients, flags, flag_notes, nutrition, photo, complete)
  values ('rice-bowl', 'demo-kitchen', 'Chicken Bowl', 'Chicken served with rice and roasted vegetables.', 1300,
    '[{"name":"Chicken","quantity":1},{"name":"White rice","quantity":1},{"name":"Carrot","quantity":1},{"name":"Ginger","quantity":1},{"name":"Olive oil","quantity":1}]'::jsonb, ARRAY[]::text[], '{}'::jsonb, '{}'::jsonb, 'rice-bowl', true) on conflict (id) do nothing;
  insert into public.dishes(id, restaurant_id, name, description, price_cents, ingredients, flags, flag_notes, nutrition, photo, complete)
  values ('tomato-soup', 'demo-kitchen', 'Greek Salad Bowl', 'A fresh bowl of greens, tomatoes, cucumber, and feta.', 1150,
    '[{"name":"Lettuce","quantity":1},{"name":"Tomato","quantity":1},{"name":"Cucumber","quantity":1},{"name":"Feta","quantity":1},{"name":"Olive oil","quantity":1}]'::jsonb, ARRAY['dairy','high-fiber','hard-texture']::text[], '{}'::jsonb, '{}'::jsonb, 'tomato-soup', true) on conflict (id) do nothing;
  insert into public.dishes(id, restaurant_id, name, description, price_cents, ingredients, flags, flag_notes, nutrition, photo, complete)
  values ('avocado-toast', 'demo-kitchen', 'Falafel Pita', 'Falafel, hummus, and tomatoes tucked into a warm pita.', 975,
    '[{"name":"Wheat pita","quantity":1},{"name":"Chickpeas","quantity":1},{"name":"Hummus","quantity":1},{"name":"Tomato","quantity":1}]'::jsonb, ARRAY['gluten','high-fiber']::text[], '{}'::jsonb, '{}'::jsonb, 'avocado-toast', true) on conflict (id) do nothing;
  insert into public.dishes(id, restaurant_id, name, description, price_cents, ingredients, flags, flag_notes, nutrition, photo, complete)
  values ('seasonal-special', 'demo-kitchen', 'Pita Bread', 'Warm flatbread. Ask staff for complete dietary details.', 350,
    '[{"name":"Full ingredient list not supplied","quantity":1}]'::jsonb, ARRAY['gluten']::text[], '{}'::jsonb, '{}'::jsonb, 'seasonal-special', false) on conflict (id) do nothing;
  insert into public.dishes(id, restaurant_id, name, description, price_cents, ingredients, flags, flag_notes, nutrition, photo, complete)
  values ('window-cupcake', 'window', 'Peanut Butter Cupcake', 'Sample dish. Edit the ingredients and dietary details before publishing.', 600,
    '[{"name":"Peanut butter","quantity":1},{"name":"Flour","quantity":1},{"name":"Milk","quantity":1}]'::jsonb, ARRAY['peanuts','gluten','dairy']::text[], '{}'::jsonb, '{"carbs":"","protein":"","calories":"","fat":""}'::jsonb, 'cupcake', false) on conflict (id) do nothing;
  insert into public.dishes(id, restaurant_id, name, description, price_cents, ingredients, flags, flag_notes, nutrition, photo, complete)
  values ('window-latte', 'window', 'Iced Latte', 'Sample dish. Edit the ingredients and dietary details before publishing.', 600,
    '[{"name":"Espresso","quantity":1},{"name":"Milk","quantity":1},{"name":"Ice","quantity":1}]'::jsonb, ARRAY['dairy']::text[], '{}'::jsonb, '{"carbs":"","protein":"","calories":"","fat":""}'::jsonb, 'latte', false) on conflict (id) do nothing;
  insert into public.dishes(id, restaurant_id, name, description, price_cents, ingredients, flags, flag_notes, nutrition, photo, complete)
  values ('window-toast', 'window', 'Avocado tomato toast', 'Sample dish. Edit the ingredients and dietary details before publishing.', 600,
    '[{"name":"Bread","quantity":1},{"name":"Avocado","quantity":1},{"name":"Tomato","quantity":1},{"name":"Red onions","quantity":1}]'::jsonb, ARRAY['gluten','high-fiber']::text[], '{}'::jsonb, '{"carbs":"","protein":"","calories":"","fat":""}'::jsonb, 'toast', false) on conflict (id) do nothing;
end $$;
commit;
