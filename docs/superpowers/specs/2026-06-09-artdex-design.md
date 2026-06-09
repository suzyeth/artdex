# ArtDex — Design Spec

> **One-line pitch:** *Pokémon GO, but you collect the world's masterpieces.*
> Visit a museum, photograph a real artwork, let AI identify it, and collect it into your
> personal art "Pokédex." Collect by artist, rank by rarity, and unlock legendary works that
> can only be claimed when you are physically on-site.

- **Hackathon:** H0 — Hack the Zero Stack (Vercel/v0 + AWS Databases)
- **Target track:** Monetizable B2C App (fallback: Open Innovation)
- **Deadline:** 2026-06-29, 5:00 PM PDT
- **Team:** Solo, vibe-coded with Claude Code
- **Date:** 2026-06-09

---

## 1. Product Concept

A real-world collection game for art lovers who visit museums and "check in" famous artworks.
The core emotional loop is the same drive that makes Pokémon and stamp passports addictive:
**see something rare in person → capture it → watch your collection fill up → chase the ones
you're missing.**

What makes it original (and judge-friendly):

1. **Art instead of animals/plants.** The "photo-to-collect" genre is crowded for nature
   (iNaturalist, Seek, PictureThis) but essentially empty for art. High originality score.
2. **Location-gated legendaries.** The truly famous originals (the *Mona Lisa*, *Starry Night*)
   can only be collected when GPS confirms you are at the museum that currently holds them.
   This is the "special Pokémon only appear in specific places" mechanic — it drives real
   travel and prevents cheating by photographing a poster or screen.
3. **Artworks travel.** Masterpieces rotate between exhibitions, so a piece's location is
   *dynamic* (Tokyo this year, Paris next). We model exhibitions as a time-bounded
   relationship, and we record *where a work was when you collected it.* This temporal +
   geospatial model is exactly the kind of "intentional database architecture" the judges
   reward.
4. **You + the artwork.** Users upload a selfie with the piece, turning a "check-in" into a
   personal memory — emotional and social value.
5. **A living world map.** Little icons across a world map show your art footprint (and,
   stretch goal, your friends').

---

## 2. Core Loop

```
Visit museum
   → app detects location (GPS) and loads that museum's currently-exhibited works
   → user photographs the artwork in front of them
   → AI matches the photo against the small on-site candidate set
   → artwork is added to the user's Dex (with: timestamp, exhibition/city snapshot, optional selfie)
   → progress updates ("Van Gogh 3/12"), rarity reveal (Common → Legendary)
   → the piece appears as an icon on the user's world map
```

- **Primary capture:** photo recognition (the "magic moment").
- **Fallback capture:** manual search by artist/title when recognition fails.
- **Rarity gate:** *Legendary* works require on-site GPS verification; lower tiers can be
  added more freely.

---

## 3. Collection / Gamification Model

Two collection dimensions, both visible:

- **By artist (primary set line):** each artist is a set — "Van Gogh 3/12 unlocked." Completing
  an artist's signature works triggers an achievement/badge.
- **By rarity (visual payoff):** Common / Rare / Epic / Legendary. Legendary = on-site-only
  world-famous originals.

Secondary (nice-to-have): **museum passport** ("Louvre highlights 5/10") as a second axis.

---

## 4. Architecture

### 4.1 Stack

| Layer | Choice | Why |
|---|---|---|
| Frontend + API | **Next.js (App Router) on Vercel** | Required by hackathon; user already knows it |
| Database | **Aurora PostgreSQL Serverless v2 + PostGIS** | Strong relational graph + geospatial queries |
| DB access | **RDS Data API (HTTP)** | Serverless-friendly from Vercel; no connection-pool pain |
| Image storage | **Amazon S3** (+ CloudFront) | Stores user photos / selfies |
| AI recognition | **Claude vision on AWS Bedrock** | Full AWS-stack narrative; candidate-set matching |
| Map | **Mapbox GL** (or react-leaflet) | World map with collected-work icons |
| Auth | **Clerk** (or NextAuth) | Fast, low-effort auth |

> **Why Aurora PostgreSQL over DSQL/DynamoDB:** the data is a strongly-relational graph
> (artist → artworks → exhibitions → museums → user collections) with first-class geospatial
> needs (location gating, map bounds queries). PostgreSQL + PostGIS fits the data natively and
> best demonstrates intentional architecture. DSQL/DynamoDB would force awkward modeling of the
> relational + geo aspects.

### 4.2 Why recognition is reliable here

Location narrows the candidate set. When the backend knows the user is at MoMA, it only needs
to match the photo against MoMA's currently-exhibited works (tens of items, not millions). A
small candidate set makes Claude-vision matching accurate and demo-safe. Failures fall back to
manual search.

### 4.3 Data model (initial)

- `artists` — id, name, era, movement, bio
- `museums` — id, name, location (PostGIS `geography(Point)`), city, country
- `artworks` — id, artist_id, title, year, image_url, rarity_tier, is_legendary
- `exhibitions` — id, artwork_id, museum_id, start_date, end_date  *(temporal location of a work)*
- `users` — id, handle, avatar
- `collections` — id, user_id, artwork_id, collected_at, museum_id_at_capture,
  exhibition_snapshot, selfie_url, photo_url
- `friendships` (stretch) — user_id, friend_id, status

Key queries:
- **On-site candidate set:** works whose current `exhibitions` row covers `now()` at the
  museum nearest the user's GPS.
- **Location gate:** is the user within N meters of the museum holding a Legendary work
  (PostGIS `ST_DWithin`).
- **Map:** collected works within current map bounds (PostGIS bounding-box query).
- **Artist progress:** count of collected vs total signature works per artist.

---

## 5. MVP Scope

### Must-have (demo spine)
1. Seeded catalog: ~50 famous works / ~15 artists / ~8 museums, with exhibition records.
2. Capture flow: photo → Bedrock recognition → add to Dex (+ manual-search fallback).
3. Location gate: GPS verification; Legendary works require on-site.
4. Personal Dex: by-artist sets ("Van Gogh 3/12") + rarity tiers.
5. Selfie upload (S3) + record of where the work was when collected.
6. World map with the user's collected-work icons.

### Stretch (only if time allows)
7. Friends + see friends' footprints on the map / leaderboard.
8. Monetization surface (ticket tie-ins, paid rare badges/skins) — mock in demo.

---

## 6. Submission Checklist (hackathon requirements)

- [ ] Text description naming the AWS Database used (Aurora PostgreSQL).
- [ ] Demo video < 3 min: problem, solution, database implementation.
- [ ] Published Vercel project link + team ID.
- [ ] Architecture diagram (frontend → Vercel API → RDS Data API → Aurora; S3; Bedrock).
- [ ] Screenshots proving data is stored in the AWS Database.
- [ ] (Bonus) Published content with `#H0Hackathon`.

### Demo video wow-moments
Snap a painting → it's identified → confetti + rarity reveal → it lands on your world map with
your selfie → "Van Gogh 3/12" progress ticks up.

---

## 7. Open Questions / Risks

- **AWS account + Bedrock access:** need an AWS account with Aurora Serverless v2, RDS Data API,
  S3, and Bedrock (Claude) enabled — confirm availability early; this is the critical path.
- **GPS in demo:** real on-site GPS can't be shown in a video from a desk — need a dev override
  / mock-location toggle for the demo.
- **Seed data quality:** artwork images + accurate current-exhibition data must be curated up
  front; the recognition demo depends on it.
- **Recognition accuracy:** mitigated by candidate-set narrowing + manual fallback, but should
  be validated early with real photos.
