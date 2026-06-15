# Design System — ArtDex

> Read this before any visual or UI change. Don't deviate without explicit approval.
> 2026-06-13: re-synced to the **shipped** system (globals.css + layout.tsx + lib/rarity.ts).
> The previous "dark vault / Fraunces / amber" spec was stale — the app ships a
> **light, warm-gallery, museum-catalogue** look. The live UI is `app/page.tsx → ArtDexApp`
> (the `components/screens/*` SPA). See "Drift note" at the bottom.

## Product Context
- **What this is:** "Pokémon GO for the world's masterpieces" — photograph real artworks at museums, AI identifies them, collect them into a personal Dex.
- **Who it's for:** consumer art lovers / museum-goers who like collecting and completion.
- **Space:** B2C consumer collection game at the museum/art-tech intersection.
- **Project type:** mobile-first web app (PWA), single column, fixed bottom tab nav.

## Aesthetic Direction
- **Direction:** "Museum catalogue × collectible game." **Warm cream gallery walls**, ink-on-paper text, **cobalt** for action, **brass** reserved for prestige.
- **Voice:** editorial / museum-catalogue — small-caps labels, hairline rules instead of drop-shadow cards, serif display, monospaced numerals (an acquisition *ledger*, not a dashboard).
- **Decoration level:** minimal. The artwork IS the decoration. No blobs, no filler gradients, no decorative icons.
- **The one rule that defines it:** **color is reserved for *meaning* (rarity / action), never decoration.**

## Typography
- **Display (wordmark, screen titles, artwork & artist names):** **Playfair Display** (`--font-playfair`), via `.font-heading`. Italic available. The museum-catalogue face.
- **UI / Body / Labels:** **Geist Sans** (`--font-geist-sans`) — the default `font-sans` on `<html>`.
- **Data / Numbers:** **Geist Mono** (`font-mono`) with `tabular-nums` for counts and ledgers ("3 / 12", index numbers).
- **Catalogue label:** `.label-caps` — uppercase, `0.18em` tracking, `0.6875rem`, weight 600.
- **Loading:** `next/font/google` (self-hosted, `display: swap`). Loaded in `app/layout.tsx`.

## Color  (light, OKLCH — defined in `app/globals.css`)
- **Approach:** restrained, near-monochrome warm neutrals + one action color + a rarity palette.
- **Surfaces:** background `oklch(0.968 0.008 78)` (warm cream) · card `oklch(0.995 0.004 80)` · border `oklch(0.23 0.01 68 / 11%)` (hairline).
- **Text:** foreground ink `oklch(0.23 0.013 68)` · muted `oklch(0.52 0.012 68)`.
- **Primary / action:** **ultramarine/cobalt** `oklch(0.45 0.168 264)` (`--primary`). CTAs, active states, progress.
- **Prestige:** **brass** `--brass oklch(0.62 0.092 80)` / `--brass-bright oklch(0.72 0.1 84)` — gilded frames, premium, legendary accents. Earned, not sprayed.
- **Rarity system** (the heart of the palette — muted *museum-label* tones, NOT neon glow; be consistent everywhere: dots, badges, borders, rings, map pins, celebration). Source of truth: `src/lib/rarity.ts` `rarityStyles`.
  - common → warm gray `oklch(0.56 0.015 68)`
  - rare → cobalt `oklch(0.5 0.16 256)`
  - epic → terracotta/amber `oklch(0.55 0.145 38)`
  - legendary → brass/gold `oklch(0.6 0.094 80)` (+ soft lift `shadow-[0_10px_30px_-10px_…]`, never a neon halo)
- **Semantic:** destructive `oklch(0.57 0.2 25)`.
- **Light only:** forced via `color-scheme: light` (globals.css) + `viewport.colorScheme: "light"` + `themeColor #f6f1e7`. Never relies on `prefers-color-scheme`.

## Spacing & Layout
- **Base unit:** 4px (Tailwind scale). Density: comfortable, editorial whitespace.
- **Container:** mobile-first, `max-w-md` (~440px), centered (`mx-auto`).
- **Nav:** fixed bottom tab bar, `z-40`, `border-t border-border bg-card/95 backdrop-blur-xl`, `pb-[env(safe-area-inset-bottom)]`. Active tab = top border + `text-foreground`.
- **Overlay ladder:** bottom sheets render **above** the nav; capture celebration sits **above** sheets.
- **Bottom clearance:** scrolling screens pad the bottom (e.g. `pb-28`) so content never hides under the fixed nav.
- **Editorial surfaces:** prefer **hairline rules** (`.rule-t` / `.rule-b`, `border-border`) over drop-shadow cards. `.shadow-soft` for the rare lifted element.
- **Radius:** base `--radius: 0.3rem`; scale `--radius-sm…3xl` as multipliers. Restrained corners — this is paper, not bubbles.

## Motion
- **Approach:** intentional, framer-motion. Motion communicates state, never decorates.
- **Signature moment:** capture celebration = reveal scaled by rarity via `fxIntensity()` (+ brass flash for legendary); bottom-sheet spring; rarity-scaled haptics (`navigator.vibrate`).
- **Easing/Duration:** spring for sheets; ~0.9–1.3s for the celebration (scales with rarity).

## SAFE vs RISK (where the product gets its face)
- **SAFE (category baseline):** mobile-first single column; fixed bottom tab nav; sans UI.
- **RISK 1:** color reserved for rarity/action only — near-monochrome warm discipline.
- **RISK 2:** museum-catalogue editorial system — small-caps labels, hairline rules, mono ledgers, serif display (instead of generic tech-sans cards).
- **RISK 3:** brass prestige treatment for premium/legendary (precious because rare).

## Reusable patterns (the ArtDex "house style")
- `.label-caps` small-caps section labels · `.rule-t` / `.rule-b` hairline dividers · `font-mono` + `tabular-nums` counters.
- Underlined editorial tab switch (bottom-border, not a pill).
- "Acquisition ledger" header: count / total + a 1px progress rule in `--primary`.
- Rarity dot (`rarityStyles[r].dot`) + serif rarity heading (`rarityStyles[r].text`).

## Decisions Log
| Date | Decision | Rationale |
|------|----------|-----------|
| 2026-06-13 | **Re-synced DESIGN.md to the shipped light-gallery system** | The doc described a dead dark-amber/Fraunces version (Family-A components at `/dex`,`/capture`,`/map`). The live app (`/` → ArtDexApp) is light cream + cobalt + brass + Playfair. See drift note. |
| 2026-06-13 | Editorial museum-catalogue treatment (rules + small-caps + mono ledgers) | Gives ArtDex an art-institution face; restraint lets the artwork carry the color. |
| 2026-06-13 | Rarity = muted museum-label tones, not neon glow | Fits the warm gallery; neon read as generic game UI. |

## Drift note (resolved)
The old dark **Family-A** UI (App-Router pages `app/dex|capture|map|premium` +
PascalCase components `RarityBadge`/`BottomNav`/`DexGrid`/`CaptureCelebration`/
`CollectSheet`/`DexDetailSheet`/`WorldMap`, which hardcoded a dark zinc/amber
palette) has been **removed**, and `app/manifest.ts` `start_url` fixed `/dex → /`
(theme color → `#f6f1e7`). Done in commit `370a0c4`.

The single live UI is now `app/page.tsx → components/artdex-app.tsx →
components/screens/*` (kebab-case, `lib/rarity.ts` OKLCH tokens). Note
`lib/domain/rarity.ts` is **not** dead — the API/data layer (`/api/collect`,
`lib/db`, `lib/types`) still uses its `Rarity` type + `isOnSiteRequired`.
