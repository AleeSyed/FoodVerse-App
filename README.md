# FoodVerse

A food ordering app where food categories are **worlds** (Pizza World, Burger World, Coffee & Chai World…) and restaurants are **branded shops** inside them. Built with Expo (React Native) for iOS, Android and web.

## Run it on your phone

You need [Node.js](https://nodejs.org) (LTS) and Git on your computer, and the **Expo Go** app on your phone.

```bash
git clone https://github.com/AleeSyed/FoodVerse-App.git
cd FoodVerse-App
npm install
npm run setup     # installs the Expo packages at versions that match this Expo SDK
npm start
```

Scan the QR code with your phone's camera (iPhone) or the Expo Go app (Android). Your phone and computer must be on the same Wi-Fi.

Run `npm run typecheck` to check the code for type errors.

## Project layout

```
app/                 Screens (Expo Router: each file is a route)
  (tabs)/            Home, Map, Orders, Profile + custom tab bar with the cart button
  world/[id].tsx     A food world: themed hero, challenge, popular dishes, shopfronts
  shop/[id].tsx      A restaurant: branded page, stamp card, menu, add to cart
  cart.tsx           Cart, delivery/pickup, address, cash on delivery
  order/[id].tsx     Order tracking
src/
  data/              Worlds, sample restaurants, types
  components/        Animated emoji, cards, logo, shopfront
  store.tsx          App state (cart, orders, stamps), saved on the device
  theme.ts           Brand colors and helpers
supabase/schema.sql  Database tables and security rules for milestone 2
```

## Roadmap

- [x] **Milestone 1: Customer app (local data).** Worlds, shops, menus, cart, ordering, tracking, XP, badges, stamp cards.
- [ ] **Milestone 2: Backend.** Supabase project, phone sign-in, restaurants and menus from the database, real orders, live status updates.
- [ ] **Milestone 3: Maps.** Google Maps (styled to the FoodVerse look) with logo pins, address search and rider routes.
- [ ] **Milestone 4: Restaurant dashboard.** Web dashboard for owners: brand, menu, orders, worlds, offers.
- [ ] **Milestone 5: Extras.** Spin the wheel, push notifications, online payments (JazzCash/Easypaisa), 3D dishes, custom animated world scenes.
- [ ] **Milestone 6: Store release.** App icons, splash screen, EAS builds, App Store and Google Play submission.

## Accounts you'll need (later milestones)

- Supabase (database and sign-in)
- Google Cloud with Maps APIs enabled (maps, places, routes)
- Apple Developer Program and Google Play Console (store release)
- Expo account (cloud builds)
