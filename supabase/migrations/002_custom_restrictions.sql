begin;

alter table public.restrictions drop constraint if exists restrictions_tag_check;
alter table public.restrictions add constraint restrictions_tag_check check (
  tag in ('gluten', 'dairy', 'peanuts', 'high-fiber', 'high-sodium', 'hard-texture')
  or (left(tag, 7) = 'custom:' and char_length(tag) <= 87
    and char_length(btrim(substr(tag, 8))) > 0)
);

commit;
