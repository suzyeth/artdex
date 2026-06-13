# ArtDex

"Pokémon GO for the world's masterpieces" — photograph artworks at museums, AI identifies
them against a GPS-narrowed candidate set, collect them into a personal Dex.

## Stack
Next.js (App Router) on Vercel · Amazon DynamoDB · Amazon Bedrock (Claude vision) · Amazon S3 ·
cookie-based anon auth · react-leaflet. See `TODO.md` for live status.

## Design System
Always read `DESIGN.md` before making any visual or UI decision. Font choices, colors, spacing,
rarity palette, and aesthetic direction are defined there. Do not deviate without explicit approval.
Key invariants: dark-only theme (never `prefers-color-scheme`), Fraunces (`.font-display`) for the
wordmark + artwork titles only, Geist for everything else, color reserved for rarity meaning.
