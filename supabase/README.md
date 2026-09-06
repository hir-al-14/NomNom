# Connect the live backend

The phone reads restaurant-entered menus from Supabase. Nutritionix and Spoonacular results are fetched through `food-lookup` and held only in memory; they are never inserted into menu tables. API items cannot be ordered without a restaurant supplying its own menu and price.

## Database

Run migrations `001` through `009` in order in the Supabase SQL Editor, skipping migrations you have already applied. `001` and `002` are the earlier profile setup; `003` onward adds restaurant menus, private chat, orders, preferences, and API rate limits.

Alternatively, use the Supabase CLI after linking this project. Do not apply the same migrations again through a second method without reconciling migration history.

Restaurant owners can edit only their own menus. Customers can read published menus. Messages and orders are visible only to the customer and the restaurant owner. Checkout calculates prices on the server and deduplicates retries. Menu saves reject stale versions to prevent another device's edits being overwritten.

## API keys

In Supabase → Edge Functions → Secrets, add:

- `NUTRITIONIX_APP_ID`
- `NUTRITIONIX_APP_KEY`
- `SPOONACULAR_API_KEY`

Do not put these in Expo's `EXPO_PUBLIC_*` environment variables. Obtain credentials from [Nutritionix](https://developer.nutritionix.com/) and [Spoonacular](https://spoonacular.com/food-api/console).

Deploy the `food-lookup` function from this folder using the Supabase CLI:

```sh
npx supabase login
```

```sh
npx supabase functions deploy food-lookup --project-ref zalyrluedlvhgovsrscz
```

`verify_jwt = false` disables gateway verification for compatibility with current keys; the function itself validates the bearer token using `auth.getUser()` before any lookup. Rate limits store counts only. API errors and missing keys appear as messages in the app.

## Check

```sh
node supabase/tests/access.mjs
```

Use two different accounts on two devices: create a restaurant and menu, browse from the customer account, send a message, place an order, and mark it ready as the owner. Menus refresh every 15 seconds; chat and order activity refresh every 5 seconds while the app is active.

Guest mode stays a local demo. Signed-in mode uses the database and does not automatically publish demo menus. Create a restaurant name with the edit button before adding dishes. Camera scanning requires testing on a physical phone.

Payments, care-buddy invitations/push alerts, and cross-device read/unread markers are not implemented. Buddy contacts are private saved preferences.
