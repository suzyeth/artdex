# 🖼️ ArtDex

> **Pokémon GO, but you collect the world's masterpieces.**
> Visit a museum, photograph the artwork in front of you, let AI identify it, and collect it into your personal art Pokédex.

Built solo (vibe-coded with Claude Code) for **[H0 — Hack the Zero Stack](https://h01.devpost.com/)** (Vercel v0 + AWS Databases).

## How it works

1. **GPS finds your museum** — the app detects which museum you're standing in and loads only the works currently on display there.
2. **Snap the artwork** — Claude vision (AWS Bedrock) matches your photo against that small on-site candidate set, which makes recognition reliable. Manual search is the fallback.
3. **Collect it** — rarity reveal (Common → Legendary) with a celebration that scales to the tier. **Legendary works can only be collected on-site** — GPS-verified within 150 m, enforced server-side.
4. **Watch your Dex fill up** — by-artist sets ("Van Gogh 3/9"), by-rarity tiers, and a world map of everywhere your collection has taken you.

### The database is the point

Masterpieces travel between exhibitions, so an artwork's location is **time-bounded** (`exhibitions`), and your collection records **where a work was when you captured it**. Aurora PostgreSQL + PostGIS models this natively: geospatial museum lookups (`ST_Distance`), the location gate (`ST_DWithin` semantics), and temporal candidate filtering — all over the serverless RDS Data API.

## Stack

| Layer | Choice |
|---|---|
| App | Next.js 15 (App Router) + React 19 + Tailwind 4, deployed on Vercel |
| Database | Aurora PostgreSQL Serverless v2 + PostGIS via RDS Data API |
| Recognition | Claude vision on AWS Bedrock (candidate-set narrowed) |
| Images | S3 presigned uploads |
| Auth | Clerk |
| Map | react-leaflet + OSM |
| Tests | Vitest |

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
npm test           # vitest
```

Set `NEXT_PUBLIC_MOCK_LOCATION="40.7614,-73.9776"` (MoMA) in `.env.local` to demo the capture flow from a desk. All env keys are documented in `.env.example`.

> **Current status:** the full capture → collect → dex → map loop runs on a clearly-marked mock layer (`src/lib/mock/`) while the AWS infrastructure is provisioned. Each mock function maps 1:1 to a real API route. See [TODO.md](TODO.md) for the live checklist and `docs/superpowers/` for the design spec + implementation plan.

## Project layout

```
src/lib/domain/      pure, unit-tested logic (rarity, location gate, candidates, progress, recognition)
src/lib/db/          schema.sql (PostGIS DDL), curated seed catalog (44 works / 18 artists / 10 museums)
src/lib/mock/        temporary client-side stand-ins for the Phase 5 APIs
src/app/             capture / dex / map pages + (upcoming) API routes
src/components/      CaptureCelebration, CollectSheet, DexGrid, WorldMap, …
test/                vitest suites mirroring src/
```
