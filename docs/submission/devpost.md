# Devpost — text fields

Paste these straight into the Devpost form. Every field leads with **Amazon DynamoDB**
(the judged criterion for "Hack the Zero Stack").

## Project name
**ArtDex — Pokédex for the world's masterpieces**

## Tagline (one line)
Photograph real art at museums, AI identifies it, collect each piece into a personal art Pokédex — powered by Amazon DynamoDB.

## Elevator pitch (the "name the database" sentence — required)
ArtDex is a Pokémon-GO-style collecting game for fine art. The whole loop runs on **Amazon DynamoDB** (serverless, PAY_PER_REQUEST): a time-bounded `exhibitions` table because real artworks travel between museums, and a haversine "location gate" so legendary works can only be collected within 150 m of the museum that currently holds them. **Amazon Bedrock** (Claude Haiku vision) does the recognition; **Amazon S3** stores selfie keepsakes.

## Inspiration
Most people walk past masterpieces and forget them. Pokémon GO made people walk miles to "catch" digital creatures. We asked: what if the rarest thing you could collect was *being there* — standing in front of the real Starry Night — and the proof was a record that can't be faked? The interesting part isn't the photo; it's the **data model** that makes "where and when" meaningful.

## What it does
- **Snap → identify → collect.** Point your camera at an artwork; AI matches it and adds it to your Dex with a rarity reveal.
- **The database is the game.** GPS finds your nearest museum → DynamoDB returns the works *currently exhibited there today* → the photo is matched against only those few candidates, which makes recognition reliable.
- **Artworks travel — and the app shows it.** The `exhibitions` table is a time-bounded artwork↔museum relationship, so a piece's location is *dynamic* (The Starry Night: London → Paris → New York). Each artwork's detail view surfaces this exhibition history straight from DynamoDB, and your collection snapshots *where a piece was when you caught it* — meet the same work again in a new city and your encounters string into one memory timeline.
- **Location-gated legendaries.** The rarest works can only be sealed when you're physically within 150 m of the holding museum — enforced server-side with a haversine check against DynamoDB.
- **Keepsakes.** Each capture saves a selfie-with-the-art to S3 and a "moment" (with GPS coordinates) to DynamoDB; revisit a work and it becomes a "reunion."
- **World map + progress.** Collected pieces pin to a world map; per-artist progress ("Van Gogh 3 / 9") ticks up.

## How we built it
- **Frontend:** Next.js 15 (App Router) + React 19 + Tailwind 4 + TypeScript, deployed on **Vercel**. In-app live camera via `getUserMedia`; world map via react-leaflet + OpenStreetMap.
- **Database — Amazon DynamoDB** (`@aws-sdk/client-dynamodb` + `lib-dynamodb`), PAY_PER_REQUEST, region `us-east-1`. Five tables: `artdex_artworks`, `artdex_museums`, `artdex_artists`, `artdex_exhibitions`, `artdex_collections` (per-user append-only "moments"). Catalog: **60 artworks · 14 museums · 26 artists · 66 exhibition rows** (several masterpieces tour three cities to exercise the temporal model).
- **Recognition — Amazon Bedrock**, `claude-haiku-4-5` vision. We send the photo plus the GPS-narrowed candidate list and ask for an id or "none."
- **Images — Amazon S3** presigned PUT/GET for selfie keepsakes (bucket `artdex-images-…`).
- **Auth:** cookie-based anonymous id (one Dex per browser) — zero-friction for a demo.
- **Pure domain layer:** rarity, the 150 m location gate (haversine), candidate filtering, recognition parsing, and progress math are pure, fully unit-tested functions (56 tests).

## Challenges we ran into
- **Aurora → DynamoDB pivot.** We specced on Aurora PostgreSQL + PostGIS, but the free AWS plan gates Aurora's Data API behind a paid tier. We moved the data layer to DynamoDB and pushed the geospatial work (nearest-museum, 150 m gate) into a pure haversine in the app layer — the temporal/geospatial *model* stayed intact.
- **Reliable recognition.** Open-ended "what painting is this?" is unreliable; **candidate-set narrowing** (museum → today's exhibits → match against only those) is what makes it work.
- **Demoing GPS from a desk.** A `NEXT_PUBLIC_MOCK_LOCATION` override lets us demo the on-site legendary gate without traveling.

## Accomplishments that we're proud of
A database schema that *is* the gameplay: time-bounded exhibitions and a 150 m geofence turn a CRUD app into a place-and-time game. End-to-end on real AWS, deployed and working.

## What we learned
DynamoDB's single-table, append-only "moments" shape fits an event-sourced collection log cleanly; and that narrowing the problem (candidate sets) beats a bigger model for reliability.

## What's next for ArtDex
Friends and shared world-map footprints (aggregated in DynamoDB), a museum "passport" sub-goal, and museum B2B partnerships. (Achievements and a global collectors' leaderboard already ship.)

## Built with (tags)
`amazon-dynamodb` `amazon-bedrock` `amazon-s3` `aws` `vercel` `next.js` `react` `typescript` `tailwindcss` `claude` `react-leaflet`

## Links
- **Try it:** https://artdex-fawn.vercel.app
- **Code:** https://github.com/suzyeth/artdex
