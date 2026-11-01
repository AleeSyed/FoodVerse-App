# FoodVerse: notes for Claude

- Expo SDK 57 app using Expo Router (file-based routes in `app/`). TypeScript, strict.
- Install packages with `npx expo install <pkg>` (not plain npm) so versions match the SDK.
- Product concept: food categories are **worlds**; restaurants are **shops** inside one or more worlds. Each world has its own theme (colors, deco emojis); each shop uses the restaurant's own colors.
- Brand: purple `#6B2FE0` on lavender `#F5F2FB`; ink `#1B1530`. See `src/theme.ts`.
- Animated food emojis (`Emo` in `src/components/ui.tsx`) are placeholders for custom 3D animated icons the founder (a motion designer) will make.
- Market: Pakistan. Prices in rupees (`fmt`), cash on delivery first, JazzCash/Easypaisa later.
- State lives in `src/store.tsx` for now; milestone 2 moves restaurants, menus and orders to Supabase (`supabase/schema.sql`).
- Keep touch targets at least 44pt and add accessibility labels to icon-only buttons.
