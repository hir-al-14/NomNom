begin;
-- One owner can manage the existing sample restaurants from the same login.
alter table public.restaurants drop constraint if exists restaurants_owner_id_key;
create index if not exists restaurants_owner_idx on public.restaurants(owner_id);
alter table public.dishes drop constraint if exists dishes_photo_check;
alter table public.dishes add constraint dishes_photo_check check
  (photo in ('toast','cupcake','latte','cafe','rice-bowl','tomato-soup','avocado-toast','seasonal-special'));
-- The removed external lookup no longer needs request counters.
drop function if exists public.allow_food_lookup();
drop table if exists public.food_lookup_limits;
commit;
