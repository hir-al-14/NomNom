# Set up NomNom data

Signed-in screens load restaurants and dishes from Supabase. The existing sample catalog is imported once using `seed.sql`; later edits come from the database. External food APIs are removed. Guest mode remains an offline preview.

## Database setup

Run migrations `001` through `010` in order in the Supabase SQL Editor, skipping ones already applied. Migration `010` allows one account to manage several restaurants and removes the unused lookup counters. Keep earlier migration files for existing project history.

Sign up for the owner account in NomNom first. In the same SQL Editor query, put this line before the contents of `seed.sql`, substituting the owner email:

```sql
select set_config('nomnom.seed_owner_email', 'YOUR_OWNER_EMAIL', false);
```

The import adds four restaurants and seven dishes from the previous frontend. Existing records are not overwritten. Luigino’s and Sokyo have no dishes yet, matching the previous catalog. All imported restaurants belong to the selected account. Restaurant mode opens Window Coffee Bar first and offers a selector for the other menus.

Only owners can edit their menus. Customers can browse published menus. Chat and orders are private to their participants. Orders use server prices and deduplicate retries. There are no payments or external restaurant integrations: these are sample businesses for the project.

## Check

```sh
node supabase/tests/access.mjs
```

Use two accounts: edit a dish as owner, find it as customer, send a message, place an order, then reply and mark the order ready as owner. Menus refresh every 15 seconds; messages and orders refresh every 5 seconds while active. Restart the app to verify saved profiles, restrictions, favorites, and cart.

Show the customer Food-note QR on a second device and scan in restaurant mode. The result shows the customer name, custom restrictions, and severity. Test search, cuisine, price, and dietary filters. There are no top recommendations.

Camera scanning requires a physical phone. Care-buddy invitations/push alerts and cross-device read markers are not implemented.
