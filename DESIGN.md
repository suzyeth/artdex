# Design System — ArtDex

> Read this before any visual or UI change. Don't deviate without explicit approval.
> Created by /design-consultation, 2026-06-13, codifying the shipped system + a typography upgrade.

## Product Context
- **What this is:** "Pokémon GO for the world's masterpieces" — photograph real artworks at museums, AI identifies them, collect them into a personal Dex.
- **Who it's for:** consumer art lovers / museum-goers who like collecting and completion.
- **Space:** B2C consumer collection game, at the museum/art-tech intersection.
- **Project type:** mobile-first web app (PWA), single column, bottom tab nav.

## Aesthetic Direction
- **Direction:** "Museum vault × collectible-card game." Near-black gallery walls; gold leaf reserved for the rare and precious.
- **Decoration level:** minimal. The artwork IS the decoration. No blobs, no filler gradients, no decorative icons.
- **Mood:** serious about art, playful about collecting. Premium, tactile, a little gilded.
- **The one rule that defines it:** color is reserved for *meaning* (rarity), never decoration.

## Typography
- **Display (wordmark + artwork titles):** **Fraunces** (variable serif). Light weights read elegant, heavier weights read warm. Applied via `.font-display`. Use ONLY for the ArtDex wordmark and artwork titles — gives the brand an art-institution face.
- **UI / Body / Labels:** **Geist Sans** (`--font-geist-sans`). Everything that isn't a wordmark or artwork title.
- **Data / Numbers:** **Geist** with `tabular-nums` for progress counts ("3/12", "23/44").
- **Code:** Geist Mono (`--font-geist-mono`).
- **Loading:** `next/font/google` (self-hosted, `display: swap`).
- **Never:** the previous `font-family: Arial` fallback (it silently overrode the loaded face — fixed in globals.css).

## Color
- **Approach:** restrained. Near-monochrome dark, with one brand accent and a rarity-driven palette.
- **Surfaces:** background `#09090b` (zinc-950) · card `#18181b` (zinc-900) · border `#27272a` (zinc-800)
- **Text:** primary `#ededed` (off-white, not pure white) · muted `#a1a1aa` (zinc-400)
- **Brand accent:** amber gradient `#f59e0b → #fde047` (amber-500 → yellow-300). Used sparingly: primary CTAs and legendary treatment only.
- **Rarity system (the heart of the palette — be consistent everywhere: badges, borders, map pins, celebration):**
  - common → zinc / slate gray
  - rare → blue
  - epic → purple
  - legendary → amber/gold **+ glow** (`shadow-[0_0_60px_rgba(251,191,36,0.7)]`)
- **Semantic:** success → emerald-400 · error → red-300/950 · warning → amber-300/950
- **Dark only:** forced via `color-scheme: dark`; never relies on `prefers-color-scheme`.

## Spacing & Layout
- **Base unit:** 4px (Tailwind scale). Density: comfortable.
- **Container:** mobile-first, `max-w-md` (~420px), centered.
- **Nav:** fixed bottom tab bar (Dex / Capture / Map), `z-50`.
- **Overlays:** bottom sheets at `z-[55]` (above nav), celebration at `z-[60]`.
- **Bottom clearance:** scrolling pages use `pb-[calc(6rem+env(safe-area-inset-bottom))]` so content never hides under the nav on notched phones.
- **Radius hierarchy:** cards `rounded-xl` (12px) · bottom sheets `rounded-t-3xl` (24px) · pills/badges `rounded-full`.

## Motion
- **Approach:** intentional, framer-motion. Motion communicates state, never decorates.
- **Signature moments:** capture celebration = card flip + rarity-scaled particle burst (+ gold flash for legendary); bottom-sheet spring; rarity-scaled haptics (`navigator.vibrate`).
- **Easing/Duration:** spring for sheets; ~0.9–1.3s for the celebration (scales with rarity).

## SAFE vs RISK (where the product gets its face)
- **SAFE (category baseline):** dark theme + zinc neutrals; bottom tab nav; Geist for UI.
- **RISK 1:** color reserved for rarity only — near-monochrome discipline.
- **RISK 2:** gold-leaf legendary treatment (precious because rare).
- **RISK 3:** Fraunces display serif for the wordmark + artwork titles — art-institution face instead of generic tech-sans.

## Decisions Log
| Date | Decision | Rationale |
|------|----------|-----------|
| 2026-06-13 | Force dark theme + use Geist (was defaulting white + Arial) | Half the screens rendered white in light-mode browsers; the loaded font wasn't being used |
| 2026-06-13 | Teasing locked silhouettes (brightness 0.32 + blur) | Pure-black boxes killed the collecting hook |
| 2026-06-13 | Fraunces for wordmark + artwork titles | Gives ArtDex a museum/art-institution face; UI stays Geist |
