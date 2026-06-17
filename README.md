# 🖼️ ArtDex

> **Pokémon GO, but you collect the world's masterpieces.**
> Visit a museum, photograph the artwork in front of you, let AI identify it, and collect it into your personal art Pokédex.

Built solo (vibe-coded with Claude Code) for **[H0 — Hack the Zero Stack](https://h01.devpost.com/)** (Vercel v0 + AWS Databases).

## How it works

1. **GPS finds your museum** — the app detects which museum you're standing in and loads only the works currently on display there.
2. **Snap the artwork** — Claude vision (AWS Bedrock) matches your photo against that small on-site candidate set, which makes recognition reliable. Manual search is the fallback.
3. **Collect it** — rarity reveal (Common → Legendary) with a celebration that scales to the tier. **Legendary works can only be collected on-site** — GPS-verified within 150 m, enforced server-side.
4. **Keep the moment** — every capture develops into a Polaroid keepsake (fog-clears, then gets postmarked). A collected work holds a swipeable filmstrip of every moment you captured it in — tap to relive and add a memory.
5. **Watch your Dex fill up** — by-artist sets ("Van Gogh 3/9"), by-rarity tiers, and a world map of everywhere your collection has taken you.

### The database is the point

Masterpieces travel between exhibitions, so an artwork's location is **time-bounded**, and your collection records **where a work was when you captured it**. That's a temporal + geospatial relationship, not a static `artwork.museum_id`:

- **`exhibitions`** is a time-bounded artwork ↔ museum link — recognition only considers works whose exhibition window covers *today* at *your* museum.
- **`collections`** snapshots the museum and exhibition label at capture time, so your Dex remembers the moment even after the work moves on.
- **Nearest-museum lookup** and the **150 m legendary gate** are computed with a haversine in the pure domain layer (`locationGate.ts`) — exact, dependency-free, and trivial for the small museum catalog, so it stays on the DynamoDB free tier with zero idle cost.

## Stack

| Layer | Choice |
|---|---|
| App | Next.js 15 (App Router) + React 19 + Tailwind 4, deployed on Vercel |
| Database | **Amazon DynamoDB** (PAY_PER_REQUEST, serverless, zero idle cost) |
| Recognition | Claude vision on **AWS Bedrock** (`claude-haiku-4-5`), candidate-set narrowed |
| Images | **Amazon S3** presigned uploads |
| Auth | Cookie-based anonymous id (per-browser collection; no signup to demo) |
| Map | react-leaflet + OSM |
| Tests | Vitest |

> Originally specced on Aurora PostgreSQL + PostGIS over the RDS Data API. The current free AWS plan gates Aurora's Data API behind a paid upgrade, so the data layer moved to DynamoDB — one of the three eligible AWS database tracks — and the geospatial work moved into the app's pure domain layer. The temporal/geospatial *model* is unchanged; only the engine is.

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
npm test           # vitest
```

Set `NEXT_PUBLIC_MOCK_LOCATION="40.7614,-73.9776"` (MoMA) in `.env.local` to demo the capture flow from a desk. All env keys are documented in `.env.example`.

> **Status:** the full capture → recognize → collect → dex → map loop runs end-to-end against real AWS (DynamoDB + Bedrock + S3). Recognition, the location gate (remote → 403, on-site → success), and the S3 selfie round-trip are all verified against live services. See [TODO.md](TODO.md) for the live checklist and `docs/superpowers/` for the design spec + implementation plan.

## Project layout

```
src/lib/domain/      pure, unit-tested logic (rarity, location gate, candidates, progress, recognition, moments)
src/lib/aws/         thin AWS client wrappers (dynamo.ts, bedrock.ts, s3.ts)
src/lib/db/          queries.ts (typed DynamoDB access) + curated seed catalog (55 works / 22 artists / 13 museums / 57 exhibitions)
src/app/api/         museums · candidates · recognize · collect · collection · moment · search · upload-url · achievements · leaderboard
src/components/      CaptureCelebration, PolaroidDevelop, MomentStrip, MomentRelive, CollectSheet, DexGrid, WorldMap, …
test/                vitest suites mirroring src/
```
