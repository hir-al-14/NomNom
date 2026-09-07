# NomNom

NomNom is an iOS-first food discovery app that helps people communicate their dietary needs and explore restaurant menus. Customers can compare listed ingredients with their restrictions, share a Food-note QR card, and ask restaurant staff about preparation before ordering.

The same account can use customer and restaurant modes. Restaurant owners manage their menus, respond to customers, and update orders. Built with Expo, React Native, TypeScript, and Supabase.

## Features

### Customer

- Browse restaurants in horizontal cards and explore categorized menus.
- Search restaurants and dishes; combine cuisine, price, and dietary filters.
- Save dietary restrictions with severity levels, including custom restrictions.
- Review ingredients, dietary conflicts, and available nutrition information.
- Generate a Food-note QR containing the customer's name and dietary restrictions.
- Save favorite restaurants, manage a cart, and place orders without in-app payment.
- Chat privately with restaurants and check order activity.
- Use optional voice readouts and distinct dietary indicators.

### Restaurant

- Choose a restaurant from the account's **Your restaurants** screen.
- Edit restaurant details, cuisine, and photo choices.
- Add, edit, and remove dishes with categories, prices, ingredients, dietary flags, and nutrition fields.
- Scan a customer's Food-note to display their dietary card and compare it with the menu.
- Browse customer conversations, reply to messages, and open chats from orders.
- Mark orders ready for pickup.

### Shared data

Signed-in accounts use Supabase for profiles, restrictions, menus, messages, orders, and preferences. Customer and owner screens read the same menu records. Database access rules restrict menu editing to owners and conversations/orders to their participants.

The expanded sample catalog contains **six restaurants and 25 dishes**. Sample recipes and photos illustrate the app; they are not verified menus of the named businesses. External food APIs are not used. Guest mode provides a local preview.

## Run locally

Requires Node.js 22.13 or newer and npm. For a native iPhone build, install Xcode with iOS platform support and CocoaPods.

```sh
npm ci
```

Create `.env.local` in the project root:

```dotenv
EXPO_PUBLIC_SUPABASE_URL=your_project_url
EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_publishable_key
```

Use only the public/publishable key in the app. Configure the database and sample catalog using the [Supabase setup guide](supabase/README.md).

Start Expo Go:

```sh
npx expo start --go
```

For a tunnel connection, use `npx expo start --go --tunnel`. To install a release build on a connected iPhone with Xcode signing configured:

```sh
npx expo run:ios --device --configuration Release
```

## Check the app

Run TypeScript validation with `npx tsc --noEmit`, app tests with `node --experimental-strip-types --test tests/*.test.mjs`, and database tests with `node supabase/tests/access.mjs`. Database tests use a local, temporary PostgreSQL-compatible runtime and do not modify Supabase.

For a full walkthrough, use separate customer and owner accounts: edit a menu, send a message, place an order, reply, and mark it ready. Menus refresh every 15 seconds; messages and orders refresh every 5 seconds while active. Test the QR scanner on a physical phone with the customer's QR displayed on another screen.

## Current scope

A Food-note is a snapshot: saved QR images keep the details encoded when generated. Scan it inside NomNom to open the card. Unknown dietary information and custom restrictions require review rather than a positive match. Confirm preparation and cross-contact details with restaurant staff.

Payments, care-buddy invitations/push alerts, and cross-device read/unread markers are not implemented. Care-buddy contact details can be saved privately. Android configuration is included, but current device testing focuses on iOS.
