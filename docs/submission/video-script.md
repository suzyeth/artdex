# Demo video script ( < 3 minutes )

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

## Tips
- Keep it under **3:00** hard.
- Say "**Amazon DynamoDB**" / "**Amazon Bedrock**" / "**Amazon S3**" out loud — judges score database usage.
- Show **one full capture end-to-end without cuts** (proves it's real).
- Upload unlisted to YouTube/Vimeo and paste the link into Devpost.
