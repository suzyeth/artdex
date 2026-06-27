# ArtDex — H0 Hackathon submission kit

Everything to paste into Devpost + the demo-video script + the AWS proof checklist.
Deadline: **2026-06-29 5:00 PM PDT**. Live demo: **https://artdex-fawn.vercel.app** ·
Repo: **https://github.com/suzyeth/artdex**

> The judged criterion for "Hack the Zero Stack" is **how you use the AWS database**.
> Every field below leads with **Amazon DynamoDB** and the temporal + geospatial model.

---

## 1. Devpost text fields

### Project name
**ArtDex — Pokédex for the world's masterpieces**

### Tagline (one line)
Photograph real art at museums, AI identifies it, collect each piece into a personal art Pokédex — powered by Amazon DynamoDB.

### Elevator pitch (the "name the database" sentence — required)
ArtDex is a Pokémon-GO-style collecting game for fine art. The whole loop runs on **Amazon DynamoDB** (serverless, PAY_PER_REQUEST): a time-bounded `exhibitions` table because real artworks travel between museums, and a haversine "location gate" so legendary works can only be collected within 150 m of the museum that currently holds them. **Amazon Bedrock** (Claude Haiku vision) does the recognition; **Amazon S3** stores selfie keepsakes.

### Inspiration
Most people walk past masterpieces and forget them. Pokémon GO made people walk miles to "catch" digital creatures. We asked: what if the rarest thing you could collect was *being there* — standing in front of the real Starry Night — and the proof was a record that can't be faked? The interesting part isn't the photo; it's the **data model** that makes "where and when" meaningful.

### What it does
- **Snap → identify → collect.** Point your camera at an artwork; AI matches it and adds it to your Dex with a rarity reveal.
- **The database is the game.** GPS finds your nearest museum → DynamoDB returns the works *currently exhibited there today* → the photo is matched against only those few candidates, which makes recognition reliable.
- **Artworks travel.** The `exhibitions` table is a time-bounded artwork↔museum relationship; your collection snapshots *where a piece was when you caught it*.
- **Location-gated legendaries.** The rarest works can only be sealed when you're physically within 150 m of the holding museum — enforced server-side with a haversine check against DynamoDB.
- **Keepsakes.** Each capture saves a selfie-with-the-art to S3 and a "moment" (with GPS coordinates) to DynamoDB; revisit a work and it becomes a "reunion."
- **World map + progress.** Collected pieces pin to a world map; per-artist progress ("Van Gogh 3 / 9") ticks up.

### How we built it
- **Frontend:** Next.js 15 (App Router) + React 19 + Tailwind 4 + TypeScript, deployed on **Vercel**. In-app live camera via `getUserMedia`; world map via react-leaflet + OpenStreetMap.
- **Database — Amazon DynamoDB** (`@aws-sdk/client-dynamodb` + `lib-dynamodb`), PAY_PER_REQUEST, region `us-east-1`. Five tables: `artworks`, `museums`, `artists`, `exhibitions`, `collections` (per-user append-only "moments"). Catalog: **60 artworks · 14 museums · 26 artists · 62 exhibition rows**.
- **Recognition — Amazon Bedrock**, `claude-haiku-4-5` vision. We send the photo plus the GPS-narrowed candidate list and ask for an id or "none."
- **Images — Amazon S3** presigned PUT/GET for selfie keepsakes (bucket `artdex-images-…`).
- **Auth:** cookie-based anonymous id (one Dex per browser) — zero-friction for a demo.
- **Pure domain layer:** rarity, the 150 m location gate (haversine), candidate filtering, recognition parsing, and progress math are pure, fully unit-tested functions (56 tests).

### Challenges we ran into
- **Aurora → DynamoDB pivot.** We specced on Aurora PostgreSQL + PostGIS, but the free AWS plan gates Aurora's Data API behind a paid tier. We moved the data layer to DynamoDB and pushed the geospatial work (nearest-museum, 150 m gate) into a pure haversine in the app layer — the temporal/geospatial *model* stayed intact.
- **Reliable recognition.** Open-ended "what painting is this?" is unreliable; **candidate-set narrowing** (museum → today's exhibits → match against only those) is what makes it work.
- **Demoing GPS from a desk.** A `NEXT_PUBLIC_MOCK_LOCATION` override lets us demo the on-site legendary gate without traveling.

### Accomplishments we're proud of
A database schema that *is* the gameplay: time-bounded exhibitions and a 150 m geofence turn a CRUD app into a place-and-time game. End-to-end on real AWS, deployed and working.

### What we learned
DynamoDB's single-table, append-only "moments" shape fits an event-sourced collection log cleanly; and that narrowing the problem (candidate sets) beats a bigger model for reliability.

### What's next
Friends + leaderboards (aggregated in DynamoDB), a museum "passport" sub-goal, and museum B2B partnerships.

### Built with (tags)
`amazon-dynamodb` `amazon-bedrock` `amazon-s3` `aws` `vercel` `next.js` `react` `typescript` `tailwindcss` `claude` `react-leaflet`

### Links
- **Try it:** https://artdex-fawn.vercel.app
- **Code:** https://github.com/suzyeth/artdex

---

## 2. Demo video script ( < 3 minutes )

Record on a phone over the live Vercel URL **or** on desktop. For the legendary gate on a
desk, set `NEXT_PUBLIC_MOCK_LOCATION="40.7614,-73.9776"` (MoMA) and frame a printout/screen
of *The Starry Night* (or use the gallery button).

| Time | Screen | Voiceover (names the DB!) |
|---|---|---|
| 0:00–0:20 | App landing / Dex grid | "ArtDex is Pokémon GO for fine art. You photograph real masterpieces at museums and collect them. The interesting part is the data model — it all runs on **Amazon DynamoDB**." |
| 0:20–0:50 | Capture tab → live camera → frame Starry Night → shutter → scan animation | "GPS finds my nearest museum. DynamoDB returns the works **on display there today** — so the AI on **Amazon Bedrock** only matches against those few candidates." |
| 0:50–1:15 | MATCH: "The Starry Night" → rarity (legendary) celebration | "Matched. It's legendary — and DynamoDB enforces that I'm physically within 150 metres of MoMA before I can collect it." |
| 1:15–1:40 | Seal → polaroid develops → lands in Dex; selfie keepsake | "I seal the moment — a selfie goes to **Amazon S3**, and the capture, with its GPS coordinates, is written to DynamoDB." |
| 1:40–2:10 | Dex progress ("Van Gogh 3/9") → World map pin with selfie | "It ticks up my Van Gogh progress and pins to my world map — because the collection records *where the piece was when I caught it*." |
| 2:10–2:45 | (Optional) AWS console: DynamoDB table rows + S3 objects | "Here's the live data in **Amazon DynamoDB** and the keepsakes in **Amazon S3**. Real artworks travel between museums, and the `exhibitions` table models that over time." |
| 2:45–3:00 | Logo / URL | "ArtDex — collect the world's masterpieces. Built on Vercel and Amazon databases." |

Tips: keep it under 3:00 hard; say "Amazon DynamoDB" / "Amazon Bedrock" / "Amazon S3" out loud; show one full capture end-to-end without cuts (proves it's real).

---

## 3. AWS "data is stored" proof (screenshots to grab)

Take these in the **AWS Console** (us-east-1), and/or paste the CLI output as a caption.

1. **DynamoDB → Tables** — show the 5 tables (`artdex_artworks`, `artdex_museums`, `artdex_artists`, `artdex_exhibitions`, `artdex_collections`).
2. **DynamoDB → `artdex_artworks` → Explore items** — show real rows (id, title, `image_url` now `/artworks/...`, rarity).
3. **DynamoDB → `artdex_collections` → Explore items** — show a real user collection row with a `moments` list (capturedAt, museumId, **lat/lon**) — proves the geospatial write.
4. **S3 → `artdex-images-…` → Objects** — show uploaded selfie keepsakes.

CLI proof (paste as caption or screenshot the terminal):
```bash
aws dynamodb scan --table-name artdex_artworks --select COUNT --region us-east-1
aws dynamodb scan --table-name artdex_collections --max-items 1 --region us-east-1
aws s3 ls s3://artdex-images-525033346195/ --recursive | head
```

---

## 4. Bonus — #H0Hackathon post (X / LinkedIn)

> Built **ArtDex** for #H0Hackathon — Pokémon GO, but you collect the world's masterpieces 🎨
> Snap real art at a museum → AI identifies it on **Amazon Bedrock** → it lands in your Dex.
> The twist is the database: **Amazon DynamoDB** models exhibitions over *time* and a 150 m
> geofence so legendary works can only be caught *on site*.
> Live: https://artdex-fawn.vercel.app  · @ Vercel @ AWS

---

## 5. Final submission checklist

- [ ] Devpost: project name, tagline, all text fields (§1) — **DynamoDB named**
- [ ] Devpost: "Built with" tags (§1)
- [ ] Live URL + GitHub link added
- [ ] Architecture diagram image attached (`docs/architecture` — export the diagram)
- [ ] Demo video < 3 min uploaded (YouTube/Vimeo unlisted) and linked (§2)
- [ ] AWS data screenshots attached (§3)
- [ ] Team / team ID set on Devpost
- [ ] (Bonus) #H0Hackathon post published (§4)
- [ ] Submit before **2026-06-29 5:00 PM PDT**
