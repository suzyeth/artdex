# Bonus — #H0Hackathon post

Post on X and/or LinkedIn for the bonus. **Attach `docs/video-assets/social-card.png`**
(or the demo video / a screen capture). Tag @vercel and @awscloud.

---

## X — single post (attach social-card.png)

You can't buy the Mona Lisa. But you *can* keep the moment you stood in front of it.

**ArtDex** — catch real masterpieces and build your art Dex 🎨

📷 Snap real art → **Amazon Bedrock** (Claude vision) IDs it
🗺️ **Amazon DynamoDB** logs where & when you caught it
🏛️ Legendaries unlock only on-site (150 m)

Built for #H0Hackathon on @vercel + @awscloud
artdex-fawn.vercel.app

---

## X — thread (more depth)

**1/** You can't buy the Mona Lisa — but you can keep the moment you met it.

ArtDex is a real-world collecting game for the world's masterpieces: snap a real painting,
AI catches it into your personal art Dex. Built for #H0Hackathon on @vercel + @awscloud 🎨
artdex-fawn.vercel.app

**2/** The hard part isn't the camera — it's making recognition *reliable*.

ArtDex uses GPS to narrow to the works on the wall right where you stand, then matches
your photo with **Claude vision on Amazon Bedrock** against tens of candidates, not millions.

**3/** The database is the real star.

Masterpieces travel between exhibitions, so a work's location is *temporal*. **Amazon
DynamoDB** models exhibitions over time + a 150 m geofence — so a legendary can only be
caught on-site, and your Dex records exactly where a work was when you met it.

**4/** Snap → Bedrock IDs it → DynamoDB logs the encounter → it lands on your world map,
and the same masterpiece, met again in another city, strings into one memory timeline.

Solo, vibe-coded with Claude Code. Live: artdex-fawn.vercel.app #H0Hackathon

---

## LinkedIn

**ArtDex — catch real masterpieces and build your art Dex.** 🎨

Built for #H0Hackathon (Hack the Zero Stack) on Vercel + AWS.

You can't buy a masterpiece at auction — but you can keep the moment you stood in front of
one. ArtDex turns a museum visit into a collection: photograph a real artwork, and AI catches
it into your personal art "Dex."

What I'm most proud of is the data model:

• **Recognition is reliable because location narrows it.** GPS finds the nearest museum, the
  app loads only the works currently exhibited there, and Claude vision on **Amazon Bedrock**
  matches the photo against tens of candidates — not millions.

• **The database tells a story over time.** Masterpieces tour between exhibitions, so location
  is temporal. **Amazon DynamoDB** models the exhibition history and a 150 m geofence, so
  "legendary" originals can only be collected on-site — and your collection snapshots exactly
  where and when you met each work.

Stack: Next.js on Vercel · Amazon DynamoDB · Amazon Bedrock · Amazon S3.
Live demo: https://artdex-fawn.vercel.app

#H0Hackathon #Vercel #AWS #DynamoDB #Bedrock

---

## Assets to attach
- `docs/video-assets/social-card.png` — branded card (1200×675)
- or the < 3 min demo video
- or a screen capture of the world map / a legendary catch
